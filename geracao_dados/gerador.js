const { Pool } = require("pg");
const { faker } = require("@faker-js/faker");

const pool = new Pool({
  user: process.env.DB_USER || "postgres",
  host: process.env.DB_HOST || "escola-db",
  database: process.env.DB_NAME || "escola",
  password: process.env.DB_PASSWORD || "admin",
  port: parseInt(process.env.DB_PORT) || 5432,
  max: 20,
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 2000
});

const niveisAcademicos = ["Graduação", "Pós-Graduação", "Mestrado", "Doutorado"];

function gerarProfessores(qtd) {
  return Array.from({ length: qtd }, () => {
    const nome = `${faker.person.firstName()} ${faker.person.lastName()}`;
    const nivel_academico = niveisAcademicos[Math.floor(Math.random() * niveisAcademicos.length)];
    return { nome, nivel_academico };
  });
}

function gerarAlunos(qtd) {
  return Array.from({ length: qtd }, () => {
    const r = Math.random();
    const genero = r < 0.485 ? "H" : r < 0.97 ? "M" : "O";
    const primeiroNome = faker.person.firstName(genero === "M" ? "female" : genero === "H" ? "male" : undefined);
    const sobreNome = faker.person.lastName();

    return {
      nome: `${primeiroNome} ${sobreNome}`,
      nascimento: faker.date.birthdate({ min: 18, max: 42, mode: "age" }),
      genero
    };
  });
}

async function gerarAvaliacao() {
  const client = await pool.connect();
  try {
    await client.query("BEGIN");

    const [profResult, materia] = await Promise.all([
      client.query("SELECT id, nivel_academico FROM professor ORDER BY RANDOM() LIMIT 1"),
      client.query("SELECT id FROM materia ORDER BY RANDOM() LIMIT 1")
    ]);

    const professor = profResult.rows[0];
    const dificuldade = ["Fácil", "Médio", "Difícil"][Math.floor(Math.random() * 3)];

    const avaliacao = await client.query(
      `INSERT INTO avaliacao (fk_professor, fk_materia, dificuldade) VALUES ($1, $2, $3) RETURNING id`,
      [professor.id, materia.rows[0].id, dificuldade]
    );

    const alunos = await client.query("SELECT id FROM aluno");

    const mapaNivelAcademico = {
      'Doutorado': 1.44,
      'Mestrado': 1.29,
      'Pós-Graduação': 1.2,
      'Graduação': 1.05
    };
    const bonusAcademico = mapaNivelAcademico[professor.nivel_academico] || 1;

    const mapaDificuldade = {
      'Fácil': 1.21,
      'Médio': 1,
      'Difícil': 0.83,
    };
    const perdaDificuldade = mapaDificuldade[dificuldade] || 1;

    const valores = alunos.rows.map(aluno => {
      let notaBase = Math.random() * 75 + 25;
      let notaFinal = Math.min((notaBase * bonusAcademico * perdaDificuldade), 100);
      return [
        aluno.id,
        avaliacao.rows[0].id,
        parseFloat(notaFinal.toFixed(2))
      ];
    });

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

// Nova função para inserir professores
async function geraProfessores() {
  const client = await pool.connect();
  try {
    const professoresGerados = gerarProfessores(1);
    await client.query("BEGIN");

    for (const professor of professoresGerados) {
      await client.query(
        "INSERT INTO professor (nome, nivel_academico) VALUES ($1, $2) ON CONFLICT DO NOTHING",
        [professor.nome, professor.nivel_academico]
      );
      console.log(`Professor ${professor.nome} inserido`);
    }

    await client.query("COMMIT");
  } catch (err) {
    await client.query("ROLLBACK");
    console.error("Erro ao inserir professores:", err);
    throw err;
  } finally {
    client.release();
  }
}

// Nova função para inserir alunos
async function geraAlunos() {
  const client = await pool.connect();
  try {
    const alunos = gerarAlunos(21);
    await client.query("BEGIN");

    for (const aluno of alunos) {
      await client.query(
        `INSERT INTO aluno (nome, nascimento, genero) VALUES ($1, $2, $3)`,
        [aluno.nome, aluno.nascimento, aluno.genero]
      );
      console.log(`Aluno ${aluno.nome} inserido`);
    }

    await client.query("COMMIT");
  } catch (err) {
    await client.query("ROLLBACK");
    console.error("Erro ao inserir alunos:", err);
    throw err;
  } finally {
    client.release();
  }
}


// Função principal atualizada para chamar as novas funções
async function main() {
  try {
    await pool.query("SELECT 1");
    console.log("✅ Conexão com o banco de dados estabelecida");



    const intervalo = setInterval(async () => {
      try {
        await geraProfessores();
        await geraAlunos();
        await gerarAvaliacao();
      } catch (error) {
        console.error("Erro durante geração de avaliação:", error);
      }
    }, 10000);

    console.log("⏳ Gerador de avaliações iniciado (1 avaliação a cada 2 segundos)");

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
main();
