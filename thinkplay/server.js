import express from 'express';
import sqlite3 from 'sqlite3';
import cors from 'cors';
import bodyParser from 'body-parser';

const app = express();
const port = 4000;

app.use(cors());
app.use(bodyParser.json());

// Conexão com o banco de dados SQLite
const db = new sqlite3.Database('./database.db', (err) => {
    if (err) {
        console.error('Erro ao conectar ao banco de dados:', err.message);
    } else {
        console.log('Conectado ao banco de dados SQLite');
    }
});

// Rota para obter todos os usuários
app.get('/usuarios', (req, res) => {
    db.all('SELECT * FROM usuarios', (err, rows) => {
        if (err) {
            console.error('Erro ao consultar os usuários:', err.message);
            res.status(500).json({ error: 'Erro ao consultar os usuários' });
        } else {
            res.json(rows);
        }
    });
});

// Rota para obter um usuário pelo ID
app.get('/usuarios/:id', (req, res) => {
    const userId = req.params.id;
    const query = 'SELECT * FROM usuarios WHERE id = ?';

    db.get(query, [userId], (err, row) => {
        if (err) {
            console.error('Erro ao consultar o usuário:', err.message);
            res.status(500).json({ error: 'Erro ao consultar o usuário' });
        } else {
            if (row) {
                // Se o usuário existir, retornar suas informações
                res.json(row);
            } else {
                // Se o usuário não for encontrado, retornar um status 404
                res.status(404).json({ error: 'Usuário não encontrado' });
            }
        }
    });
});


// Rota para adicionar um novo usuário
app.post('/usuarios', (req, res) => {
    const { nome, email, senha, ocupacao, data_nascimento, experiencia_gla, dica } = req.body;

    // Verificar se os campos obrigatórios foram fornecidos
    if (!nome || !email || !senha) {
        return res.status(400).json({ error: 'Nome, email e senha são obrigatórios' });
    }

    // Consulta SQL para verificar se o e-mail já existe
    const sqlVerificaEmail = 'SELECT COUNT(*) AS count FROM usuarios WHERE email = ?';

    db.get(sqlVerificaEmail, [email], (err, row) => {
        if (err) {
            console.error('Erro ao verificar o e-mail:', err.message);
            return res.status(500).json({ error: 'Erro ao verificar o e-mail' });
        }

        if (row.count > 0) {
            return res.status(400).json({ error: 'O e-mail já está em uso' });
        }

        // Consulta SQL para adicionar um novo usuário
        const sql = 'INSERT INTO usuarios (nome, email, senha, ocupacao, data_nascimento, experiencia_gla, dica) VALUES (?, ?, ?, ?, ?, ?, ?)';

        // Executar a consulta SQL para adicionar um novo usuário
        db.run(sql, [nome, email, senha, ocupacao, data_nascimento, experiencia_gla, dica], function(err) {
            if (err) {
                console.error('Erro ao adicionar o usuário:', err.message);
                return res.status(500).json({ error: 'Erro ao adicionar o usuário' });
            }

            // Obter o ID do novo usuário inserido
            const novoUsuarioId = this.lastID;

            // Retornar o novo usuário adicionado
            res.status(201).json({ id: novoUsuarioId, nome, email, senha, ocupacao, data_nascimento, experiencia_gla });
        });
    });
});



// Rota para atualizar um usuário pelo ID
app.put('/usuarios/:id', (req, res) => {
    const userId = req.params.id;
    const { nome, email, senha, ocupacao, data_nascimento, experiencia_gla } = req.body;

    // Verificar se os campos obrigatórios foram fornecidos
    if (!nome || !email || !senha) {
        return res.status(400).json({ error: 'Nome, email e senha são obrigatórios' });
    }

    // Consulta SQL para atualizar um usuário existente
    const sql = 'UPDATE usuarios SET nome = ?, email = ?, senha = ?, ocupacao = ?, data_nascimento = ?, experiencia_gla = ? WHERE id = ?';

    // Executar a consulta SQL para atualizar o usuário
    db.run(sql, [nome, email, senha, ocupacao, data_nascimento, experiencia_gla, userId], function(err) {
        if (err) {
            console.error('Erro ao atualizar o usuário:', err.message);
            return res.status(500).json({ error: 'Erro ao atualizar o usuário' });
        }

        // Verificar se algum usuário foi afetado pela atualização
        if (this.changes === 0) {
            // Se nenhum usuário foi afetado, significa que o usuário com o ID fornecido não foi encontrado
            return res.status(404).json({ error: 'Usuário não encontrado' });
        }

        // Se a atualização for bem-sucedida, retornar os detalhes do usuário atualizado
        res.json({
            id: userId,
            nome,
            email,
            senha,
            ocupacao,
            data_nascimento,
            experiencia_gla
        });
    });
});


app.get('/projetos/:usuario_id', (req, res) => {
    // Extrair o ID do usuário dos parâmetros da requisição
    const { usuario_id } = req.params;

    // Consulta SQL para obter todos os projetos do usuário específico
    const sql = 'SELECT * FROM projetos WHERE usuario_id = ?';

    // Executar a consulta SQL para obter os projetos do usuário específico
    db.all(sql, [usuario_id], (err, rows) => {
        if (err) {
            console.error('Erro ao consultar os projetos do usuário:', err.message);
            res.status(500).json({ error: 'Erro ao consultar os projetos do usuário' });
        } else {
            res.json(rows);
        }
    });
});

app.get('/projetos/nome/:projeto_id', (req, res) => {
    // Extrair o ID do usuário dos parâmetros da requisição
    const { projeto_id } = req.params;

    // Consulta SQL para obter todos os projetos do usuário específico
    const sql = 'SELECT * FROM projetos WHERE id = ?';

    // Executar a consulta SQL para obter os projetos do usuário específico
    db.all(sql, [projeto_id], (err, rows) => {
        if (err) {
            console.error('Erro ao consultar os projetos do usuário:', err.message);
            res.status(500).json({ error: 'Erro ao consultar os projetos do usuário' });
        } else {
            res.json(rows);
        }
    });
});

app.get('/indicadores/:codigo_categoria', (req, res) => {
    let { codigo_categoria } = req.params;

    const sql = `SELECT * FROM indicadores WHERE codigo_categoria = ?`;

    db.all(sql, [codigo_categoria], (err, rows) => {
        if (err) {
            console.error('Erro ao buscar os indicadores:', err);
            res.status(500).json({ error: 'Erro ao buscar os indicadores' });
            return;
        }

        // Retorna os resultados da consulta
        res.json(rows);
    });
});

app.get('/indicadores/detalhe/:id', (req, res) => {
    const indicadorId = req.params.id;
    const sql = 'SELECT * FROM indicadores WHERE id = ?';

    db.all(sql, [indicadorId], (err, rows) => {
        if (err) {
            console.error('Erro ao buscar os indicadores:', err);
            res.status(500).json({ error: 'Erro ao buscar os indicadores' });
            return;
        }

        // Retorna os resultados da consulta
        res.json(rows);
    });
});



// Rota para adicionar um novo projeto
app.post('/projetos', (req, res) => {
    const { nome, objetivo, publico_alvo, usuario_id, indicadores, data_criacao } = req.body;

    // Verificar se todos os campos necessários foram fornecidos
    if (!nome || !objetivo || !publico_alvo || !usuario_id || !data_criacao) {
        return res.status(400).json({ error: 'Todos os campos são obrigatórios' });
    }

    // Consulta SQL para adicionar um novo projeto
    const sql = 'INSERT INTO projetos (nome, objetivo, publico_alvo, usuario_id, indicadores, data_criacao) VALUES (?, ?, ?, ?, ?, ?)';

    // Executar a consulta SQL para adicionar um novo projeto
    db.run(sql, [nome, objetivo, publico_alvo, usuario_id, indicadores, data_criacao], function(err) {
        if (err) {
            console.error('Erro ao adicionar o projeto:', err.message);
            return res.status(500).json({ error: 'Erro ao adicionar o projeto' });
        }

        // Obter o ID do novo projeto inserido
        const novoProjetoId = this.lastID;

        // Retornar o novo projeto adicionado
        res.status(201).json({ id: novoProjetoId, nome, objetivo, publico_alvo, usuario_id, indicadores, data_criacao });
    });
});


// Rota para excluir um projeto pelo ID
app.delete('/projetos/:id', (req, res) => {
    const projetoId = req.params.id;

    // Consulta SQL para excluir o projeto com o ID fornecido
    const sql = 'DELETE FROM projetos WHERE id = ?';

    // Executar a consulta SQL com o ID do projeto como parâmetro
    db.run(sql, [projetoId], function(err) {
        if (err) {
            console.error('Erro ao excluir o projeto:', err.message);
            res.status(500).json({ error: 'Erro ao excluir o projeto' });
        } else {
            // Verificar se alguma linha foi afetada (se o projeto foi excluído com sucesso)
            if (this.changes > 0) {
                res.status(200).json({ message: 'Projeto excluído com sucesso' });
            } else {
                console.error(`Projeto com ID ${projetoId} não encontrado`);
                res.status(404).json({ error: 'Projeto não encontrado' });
            }
        }
    });
});


async function updateProjetoIndicadores(projetoId, indicadores) {
    return new Promise((resolve, reject) => {
        db.serialize(() => {
            db.run(`DELETE FROM projeto_indicadores WHERE projeto_id = ?`, [projetoId], (err) => {
                if (err) {
                    return reject(err);
                }

                let stmt = db.prepare(`INSERT INTO projeto_indicadores (projeto_id, indicador_id) VALUES (?, ?)`);
                indicadores.forEach(indicador => {
                    stmt.run(projetoId, indicador.id, (err) => {
                        if (err) {
                            return reject(err);
                        }
                    });
                });
                stmt.finalize(async (err) => {
                    if (err) {
                        return reject(err);
                    }
                    try {
                        await updateProjetoIndicadoresJson(projetoId, indicadores);
                        resolve();
                    } catch (updateErr) {
                        reject(updateErr);
                    }
                });
            });
        });
    });
}

function updateProjetoIndicadoresJson(projetoId, indicadores) {
    return new Promise((resolve, reject) => {
        const indicadoresJson = JSON.stringify(indicadores);
        db.run(`UPDATE projetos SET indicadores_json = ? WHERE id = ?`, [indicadoresJson, projetoId], function(err) {
            if (err) {
                return reject(err);
            }
            resolve();
        });
    });
}

// Rota para atualizar os indicadores de um projeto
app.put('/projetos/:id/indicadores', async (req, res) => {
    const projetoId = req.params.id;
    const { indicadores } = req.body;

    if (!Array.isArray(indicadores) || indicadores.length === 0) {
        return res.status(400).json({ error: 'Indicadores são obrigatórios' });
    }

    try {
        await updateProjetoIndicadores(projetoId, indicadores);
        res.status(200).json({ success: true });
    } catch (err) {
        console.error('Erro ao atualizar os indicadores do projeto:', err.message);
        res.status(500).json({ error: 'Erro ao atualizar os indicadores do projeto' });
    }
});


// Rota para obter os indicadores de um projeto específico de um usuário específico
app.get('/indicadores/:userId/:projectId', (req, res) => {
    const { userId, projectId } = req.params;

    // Consulta SQL para obter os indicadores de um projeto específico de um usuário específico
    const sql = `
        SELECT i.id, i.nome AS indicador, i.categoria
        FROM indicadores i
        JOIN projeto_indicadores pi ON i.id = pi.indicador_id
        JOIN projetos p ON pi.projeto_id = p.id
        WHERE p.usuario_id = ? AND p.id = ?
    `;

    // Executar a consulta SQL
    db.all(sql, [userId, projectId], (err, rows) => {
        if (err) {
            console.error('Erro ao consultar os indicadores:', err.message);
            res.status(500).json({ error: 'Erro ao consultar os indicadores' });
        } else {
            // Mapear os resultados para o formato solicitado
            const result = rows.map(row => ({
                id: row.id,
                indicador: row.indicador,
                categoria: row.categoria
            }));
            res.json(result);
        }
    });
});

// Rota para obter um indicador pelo nome
app.get('/indicadores/nome/:nome', (req, res) => {
    const indicadorNome = req.params.nome;
    const sql = 'SELECT * FROM indicadores WHERE nome = ?';

    db.all(sql, [indicadorNome], (err, rows) => {
        if (err) {
            console.error('Erro ao buscar o indicador:', err);
            res.status(500).json({ error: 'Erro ao buscar o indicador' });
            return;
        }

        if (rows.length > 0) {
            // Retorna a primeira ocorrência encontrada do indicador com o nome fornecido
            res.json(rows[0]);
        } else {
            // Se nenhum indicador for encontrado com o nome fornecido, retorna um erro 404
            res.status(404).json({ error: 'Indicador não encontrado' });
        }
    });
});


// Rota para atualizar o atributo 'dica' de um usuário pelo ID
app.put('/usuarios/dica/:id', (req, res) => {
    const userId = req.params.id;

    // Consulta SQL para atualizar o atributo 'dica' do usuário para 0
    const sql = 'UPDATE usuarios SET dica = 0 WHERE id = ?';

    // Executar a consulta SQL para atualizar o atributo 'dica'
    db.run(sql, [userId], function(err) {
        if (err) {
            console.error('Erro ao atualizar o atributo dica do usuário:', err.message);
            return res.status(500).json({ error: 'Erro ao atualizar o atributo dica do usuário' });
        }

        // Verificar se algum usuário foi afetado pela atualização
        if (this.changes === 0) {
            // Se nenhum usuário foi afetado, significa que o usuário com o ID fornecido não foi encontrado
            return res.status(404).json({ error: 'Usuário não encontrado' });
        }

        // Se a atualização for bem-sucedida, retornar uma mensagem de sucesso
        res.json({ message: 'Atributo dica do usuário atualizado com sucesso' });
    });
});



// Iniciar o servidor
app.listen(port, () => {
    console.log(`Servidor backend está ouvindo em http://localhost:${port}`);
});
