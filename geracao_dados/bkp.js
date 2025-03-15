const { Pool } = require("pg");
const { faker } = require("@faker-js/faker");

const pool = new Pool({
  user: "admin",
  host: "localhost",
  database: "escola",
  password: "admin",
  port: 5432,
});

const CATEGORIAS = ["Exatas", "Humanas", "Biológicas"];
const MODULOS = ["Básico", "Intermediário", "Avançado"];
const DIFICULDADES = ["Fácil", "Médio", "Difícil"];
const GENEROS = ["H", "M", "O"];

async function inserirDadosFixos() {
  try {
    const client = await pool.connect();

    // Criar matérias
    await client.query("TRUNCATE materia RESTART IDENTITY CASCADE");
    for (let i = 1; i <= 8; i++) {
      await client.query(
        "INSERT INTO materia (nome, modulo, categoria) VALUES ($1, $2, $3)",
        [
          faker.science.chemicalElement().name,
          faker.helpers.arrayElement(MODULOS),
          faker.helpers.arrayElement(CATEGORIAS),
        ]
      );
    }

    // Criar professores
    await client.query("TRUNCATE professor RESTART IDENTITY CASCADE");
    for (let i = 1; i <= 8; i++) {
      await client.query(
        "INSERT INTO professor (nome, nivel_academico) VALUES ($1, $2)",
        [faker.person.fullName(), "Doutorado"]
      );
    }

    // Criar alunos
    await client.query("TRUNCATE aluno RESTART IDENTITY CASCADE");
    for (let i = 1; i <= 90; i++) {
      await client.query(
        "INSERT INTO aluno (nome, email, nascimento, genero) VALUES ($1, $2, $3, $4)",
        [
          faker.person.fullName(),
          faker.internet.email(),
          faker.date.birthdate({ min: 18, max: 30, mode: "age" }),
          faker.helpers.arrayElement(GENEROS),
        ]
      );
    }

    client.release();
    console.log("Dados fixos inseridos com sucesso!");
  } catch (err) {
    console.error("Erro ao inserir dados fixos:", err);
  }
}

async function gerarAvaliacaoEResultados() {
  try {
    const client = await pool.connect();
    const { rows: professores } = await client.query(
      "SELECT id FROM professor"
    );
    const { rows: materias } = await client.query("SELECT id FROM materia");
    const { rows: alunos } = await client.query("SELECT id FROM aluno");

    if (!professores.length || !materias.length || !alunos.length) {
      console.log("Dados insuficientes para gerar avaliações.");
      return;
    }

    const fk_professor = faker.helpers.arrayElement(professores).id;
    const fk_materia = faker.helpers.arrayElement(materias).id;
    const dificuldade = faker.helpers.arrayElement(DIFICULDADES);

    const { rows } = await client.query(
      "INSERT INTO avaliacao (fk_professor, fk_materia, dificuldade) VALUES ($1, $2, $3) RETURNING id",
      [fk_professor, fk_materia, dificuldade]
    );
    const fk_avaliacao = rows[0].id;

    for (const aluno of alunos) {
      const nota = parseFloat((Math.random() * 100).toFixed(2));
      await client.query(
        "INSERT INTO resultado_avaliacao (fk_aluno, fk_avaliacao, nota) VALUES ($1, $2, $3)",
        [aluno.id, fk_avaliacao, nota]
      );
    }

    client.release();
    console.log(`Avaliação ${fk_avaliacao} gerada com sucesso!`);
  } catch (err) {
    console.error("Erro ao gerar avaliação e resultados:", err);
  }
}

(async () => {
  await inserirDadosFixos();
  setInterval(gerarAvaliacaoEResultados, 10000);
})();
