import sqlite3
import pandas as pd

# Caminho do arquivo CSV
csv_file = 'thinkplay/tabela_banco.csv'

# Nome do banco de dados SQLite
sqlite_db = 'thinkplay/meu_banco_de_dados.db'

# Nome da tabela no banco de dados
table_name = 'indicadores'

# Leia o CSV usando pandas
df = pd.read_csv(csv_file, sep=",")

# Conecte-se ao banco de dados SQLite (ele será criado se não existir)
conn = sqlite3.connect(sqlite_db)
cursor = conn.cursor()

# Crie a tabela com uma coluna 'id' auto incremento
create_table_query = f"""
CREATE TABLE IF NOT EXISTS {table_name} (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    {', '.join([f'{col} {dtype}' for col, dtype in zip(df.columns, ['TEXT' for _ in df.columns])])}
);
"""

# Execute a query de criação da tabela
cursor.execute(create_table_query)

# Insira os dados do DataFrame na tabela criada
for row in df.itertuples(index=False, name=None):
    placeholders = ', '.join(['?' for _ in row])
    insert_query = f"INSERT INTO {table_name} ({', '.join(df.columns)}) VALUES ({placeholders})"
    cursor.execute(insert_query, row)

# Commit das mudanças e fechar a conexão
conn.commit()
conn.close()

print(f"Dados importados para a tabela {table_name} no banco de dados {sqlite_db}.")
