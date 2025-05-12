const { Pool } = require("pg");
const { faker } = require("@faker-js/faker");

// Configuração do pool de conexão com tratamento de erro
const pool = new Pool({
  user: process.env.DB_USER || "postgres",
  host: process.env.DB_HOST || "escola-db",
  database: process.env.DB_NAME || "escola",
  password: process.env.DB_PASSWORD || "admin",
  port: parseInt(process.env.DB_PORT) || 5432,
  // Configurações adicionais para melhor desempenho
  max: 20, // Número máximo de clientes no pool
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 2000
});

// Dados fixos otimizados
const materias = [
  { nome: "Matemática", modulo: "Fundamental", categoria: "Exatas" },
  { nome: "Português", modulo: "Fundamental", categoria: "Linguagens" },
  { nome: "História", modulo: "Fundamental", categoria: "Humanas" },
  { nome: "Física", modulo: "Médio", categoria: "Exatas" },
  { nome: "Química", modulo: "Médio", categoria: "Exatas" },
  { nome: "Biologia", modulo: "Médio", categoria: "Ciências da Natureza" },
  { nome: "Geografia", modulo: "Médio", categoria: "Humanas" },
  { nome: "Inglês", modulo: "Fundamental", categoria: "Linguagens" }
];

const professores = [
  { nome: "Carlos Silva", nivel_academico: "Doutorado" },
  { nome: "Ana Souza", nivel_academico: "Mestrado" },
  { nome: "Roberto Lima", nivel_academico: "Doutorado" },
  { nome: "Fernanda Alves", nivel_academico: "Mestrado" },
  { nome: "João Mendes", nivel_academico: "Graduação" },
  { nome: "Mariana Costa", nivel_academico: "Graduação" },
  { nome: "Ricardo Pereira", nivel_academico: "Pós-Graduação" },
  { nome: "Patrícia Santos", nivel_academico: "Pós-Graduação" }
];

// Função para gerar alunos com melhoria de performance
function gerarAlunos(qtd) {
  return Array.from({ length: qtd }, () => {
    const genero = ["H", "M", "O"][Math.floor(Math.random() * 3)];
    const primeiroNome = faker.person.firstName(genero === "M" ? "female" : genero === "H" ? "male" : undefined);
    const sobreNome = faker.person.lastName();

    return {
      nome: `${primeiroNome} ${sobreNome}`,
      email: `${primeiroNome.toLowerCase()}.${sobreNome.toLowerCase()}@escola.com.br`,
      nascimento: faker.date.birthdate({ min: 12, max: 17, mode: "age" }),
      genero
    };
  });
}

// Função para inserir dados fixos com transação
async function inserirDadosFixos() {
  const client = await pool.connect();
  try {
    await client.query("BEGIN"); // Inicia transação

    console.log("Inserindo matérias...");
    for (const materia of materias) {
      await client.query(
        "INSERT INTO materia (nome, modulo, categoria) VALUES ($1, $2, $3) ON CONFLICT DO NOTHING",
        [materia.nome, materia.modulo, materia.categoria]
      );
      console.log(`Matéria ${materia.nome} inserida`);
    }

    console.log("Inserindo professores...");
    for (const professor of professores) {
      await client.query(
        "INSERT INTO professor (nome, nivel_academico) VALUES ($1, $2) ON CONFLICT DO NOTHING",
        [professor.nome, professor.nivel_academico]
      );
      console.log(`Professor ${professor.nome} inserido`);
    }

    console.log("Inserindo alunos...");
    const alunos = gerarAlunos(20);
    for (const aluno of alunos) {
      await client.query(
        `INSERT INTO aluno (nome, email, nascimento, genero) 
         VALUES ($1, $2, $3, $4) 
         ON CONFLICT (email) DO NOTHING`,
        [aluno.nome, aluno.email, aluno.nascimento, aluno.genero]
      );
      console.log(`Aluno ${aluno.nome} inserido`);
    }

    await client.query("COMMIT"); // Confirma transação
  } catch (err) {
    await client.query("ROLLBACK"); // Reverte em caso de erro
    console.error("Erro ao inserir dados:", err);
    throw err; // Propaga o erro para ser tratado no nível superior
  } finally {
    client.release();
  }
}

// Função para gerar avaliação com lote de alunos
async function gerarAvaliacao() {
  const client = await pool.connect();
  try {
    await client.query("BEGIN");

    // Seleciona aleatoriamente professor e matéria
    const [professor, materia] = await Promise.all([
      client.query("SELECT id FROM professor ORDER BY RANDOM() LIMIT 1"),
      client.query("SELECT id FROM materia ORDER BY RANDOM() LIMIT 1")
    ]);

    const dificuldade = ["Fácil", "Médio", "Difícil"][Math.floor(Math.random() * 3)];

    // Insere avaliação e obtém o ID
    const avaliacao = await client.query(
      `INSERT INTO avaliacao (fk_professor, fk_materia, dificuldade) 
       VALUES ($1, $2, $3) RETURNING id`,
      [professor.rows[0].id, materia.rows[0].id, dificuldade]
    );

    // Obtém todos os alunos de uma só vez
    const alunos = await client.query("SELECT id FROM aluno");

    // Prepara valores para inserção em lote
    const valores = alunos.rows.map(aluno => [
      aluno.id,
      avaliacao.rows[0].id,
      parseFloat((Math.random() * 100).toFixed(2))
    ]);

    // Insere em lote usando UNNEST para melhor performance
    await client.query(
      `INSERT INTO resultado_avaliacao (fk_aluno, fk_avaliacao, nota)
       SELECT * FROM UNNEST($1::int[], $2::int[], $3::decimal[])`,
      [
        valores.map(v => v[0]),
        valores.map(v => v[1]),
        valores.map(v => v[2])
      ]
    );

    await client.query("COMMIT");
    console.log(`📊 Nova avaliação gerada (${dificuldade}) para a matéria ID ${materia.rows[0].id}`);
  } catch (error) {
    await client.query("ROLLBACK");
    console.error("Erro ao gerar avaliação:", error);
  } finally {
    client.release();
  }
}

// Função principal com tratamento de erro melhorado
async function main() {
  try {
    // Verifica conexão com o banco antes de começar
    await pool.query("SELECT 1");
    console.log("✅ Conexão com o banco de dados estabelecida");

    await inserirDadosFixos();

    // Configura intervalo com tratamento de erro
    const intervalo = setInterval(async () => {
      try {
        await gerarAvaliacao();
      } catch (error) {
        console.error("Erro durante geração de avaliação:", error);
      }
    }, 2000);

    console.log("⏳ Gerador de avaliações iniciado (1 minuto/avaliação)");

    // Tratamento para encerramento correto
    process.on("SIGINT", async () => {
      clearInterval(intervalo);
      await pool.end();
      console.log("🛑 Gerador de avaliações encerrado");
      process.exit(0);
    });

  } catch (error) {
    console.error("❌ Erro crítico:", error);
    process.exit(1);
  }
}

// Inicia a aplicação
main();