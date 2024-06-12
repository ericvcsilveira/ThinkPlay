import express from 'express';
import sqlite3 from 'sqlite3';
import cors from 'cors';
import bodyParser from 'body-parser';

const app = express();
const port = 4000;

app.use(cors());
app.use(bodyParser.json());

const db = new sqlite3.Database('./database.db', (err) => {
    if (err) {
        console.error('Erro ao conectar ao banco de dados:', err.message);
    } else {
        console.log('Conectado ao banco de dados SQLite');
    }
});

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

app.get('/usuarios/:id', (req, res) => {
    const userId = req.params.id;
    const query = 'SELECT * FROM usuarios WHERE id = ?';

    db.get(query, [userId], (err, row) => {
        if (err) {
            console.error('Erro ao consultar o usuário:', err.message);
            res.status(500).json({ error: 'Erro ao consultar o usuário' });
        } else {
            if (row) {
                res.json(row);
            } else {
                res.status(404).json({ error: 'Usuário não encontrado' });
            }
        }
    });
});


app.post('/usuarios', (req, res) => {
    const { nome, email, senha, ocupacao, data_nascimento, experiencia_gla, dica } = req.body;

    if (!nome || !email || !senha) {
        return res.status(400).json({ error: 'Nome, email e senha são obrigatórios' });
    }

    const sqlVerificaEmail = 'SELECT COUNT(*) AS count FROM usuarios WHERE email = ?';

    db.get(sqlVerificaEmail, [email], (err, row) => {
        if (err) {
            console.error('Erro ao verificar o e-mail:', err.message);
            return res.status(500).json({ error: 'Erro ao verificar o e-mail' });
        }

        if (row.count > 0) {
            return res.status(400).json({ error: 'O e-mail já está em uso' });
        }

        const sql = 'INSERT INTO usuarios (nome, email, senha, ocupacao, data_nascimento, experiencia_gla, dica) VALUES (?, ?, ?, ?, ?, ?, ?)';

        db.run(sql, [nome, email, senha, ocupacao, data_nascimento, experiencia_gla, dica], function(err) {
            if (err) {
                console.error('Erro ao adicionar o usuário:', err.message);
                return res.status(500).json({ error: 'Erro ao adicionar o usuário' });
            }

            const novoUsuarioId = this.lastID;

            res.status(201).json({ id: novoUsuarioId, nome, email, senha, ocupacao, data_nascimento, experiencia_gla });
        });
    });
});



app.put('/usuarios/:id', (req, res) => {
    const userId = req.params.id;
    const { nome, email, senha, ocupacao, data_nascimento, experiencia_gla } = req.body;

    if (!nome || !email || !senha) {
        return res.status(400).json({ error: 'Nome, email e senha são obrigatórios' });
    }

    const sql = 'UPDATE usuarios SET nome = ?, email = ?, senha = ?, ocupacao = ?, data_nascimento = ?, experiencia_gla = ? WHERE id = ?';

    db.run(sql, [nome, email, senha, ocupacao, data_nascimento, experiencia_gla, userId], function(err) {
        if (err) {
            console.error('Erro ao atualizar o usuário:', err.message);
            return res.status(500).json({ error: 'Erro ao atualizar o usuário' });
        }

        if (this.changes === 0) {
            return res.status(404).json({ error: 'Usuário não encontrado' });
        }

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
    const { usuario_id } = req.params;

    const sql = 'SELECT * FROM projetos WHERE usuario_id = ?';

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
    const { projeto_id } = req.params;

    const sql = 'SELECT * FROM projetos WHERE id = ?';

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

        res.json(rows);
    });
});



app.post('/projetos', (req, res) => {
    const { nome, objetivo, publico_alvo, usuario_id, indicadores, data_criacao } = req.body;

    if (!nome || !objetivo || !publico_alvo || !usuario_id || !data_criacao) {
        return res.status(400).json({ error: 'Todos os campos são obrigatórios' });
    }

    const sql = 'INSERT INTO projetos (nome, objetivo, publico_alvo, usuario_id, indicadores, data_criacao) VALUES (?, ?, ?, ?, ?, ?)';

    db.run(sql, [nome, objetivo, publico_alvo, usuario_id, indicadores, data_criacao], function(err) {
        if (err) {
            console.error('Erro ao adicionar o projeto:', err.message);
            return res.status(500).json({ error: 'Erro ao adicionar o projeto' });
        }

        const novoProjetoId = this.lastID;

        res.status(201).json({ id: novoProjetoId, nome, objetivo, publico_alvo, usuario_id, indicadores, data_criacao });
    });
});


app.delete('/projetos/:id', (req, res) => {
    const projetoId = req.params.id;

    const sql = 'DELETE FROM projetos WHERE id = ?';

    db.run(sql, [projetoId], function(err) {
        if (err) {
            console.error('Erro ao excluir o projeto:', err.message);
            res.status(500).json({ error: 'Erro ao excluir o projeto' });
        } else {
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


app.get('/indicadores/:userId/:projectId', (req, res) => {
    const { userId, projectId } = req.params;

    const sql = `
        SELECT i.id, i.nome AS indicador, i.categoria
        FROM indicadores i
        JOIN projeto_indicadores pi ON i.id = pi.indicador_id
        JOIN projetos p ON pi.projeto_id = p.id
        WHERE p.usuario_id = ? AND p.id = ?
    `;

    db.all(sql, [userId, projectId], (err, rows) => {
        if (err) {
            console.error('Erro ao consultar os indicadores:', err.message);
            res.status(500).json({ error: 'Erro ao consultar os indicadores' });
        } else {
            const result = rows.map(row => ({
                id: row.id,
                indicador: row.indicador,
                categoria: row.categoria
            }));
            res.json(result);
        }
    });
});

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
            res.json(rows[0]);
        } else {
            res.status(404).json({ error: 'Indicador não encontrado' });
        }
    });
});


app.put('/usuarios/dica/:id', (req, res) => {
    const userId = req.params.id;

    const sql = 'UPDATE usuarios SET dica = 0 WHERE id = ?';

    db.run(sql, [userId], function(err) {
        if (err) {
            console.error('Erro ao atualizar o atributo dica do usuário:', err.message);
            return res.status(500).json({ error: 'Erro ao atualizar o atributo dica do usuário' });
        }

        if (this.changes === 0) {
            return res.status(404).json({ error: 'Usuário não encontrado' });
        }

        res.json({ message: 'Atributo dica do usuário atualizado com sucesso' });
    });
});



app.listen(port, () => {
    console.log(`Servidor backend está ouvindo em http://localhost:${port}`);
});
