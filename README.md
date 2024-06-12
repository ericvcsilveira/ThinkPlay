# Configuração do Ambiente ThinkPlay

## Pré-requisitos

Antes de começar, certifique-se de ter o Node.js instalado em sua máquina. A versão utilizada é v20.10.0.

## Passos para Configuração

1. **Clone o repositório e entre na pasta `thinkplay`**

```bash
git clone https://github.com/ericvcsilveira/ThinkPlay
cd thinkplay
```

2. **Instale as dependências do Nuxt**

```bash
npm install
```

3. **Inicie o servidor de desenvolvimento**

Para iniciar o servidor de desenvolvimento em localhost:3000, use um dos seguintes comandos:

```bash
npm run dev
```

4. **Inicialize o banco de dados local**

Para iniciar o banco de dados local em localhost:4000, abra outro terminal, entre na pasta `thinkplay` e execute o comando:

```bash
node server.js
```