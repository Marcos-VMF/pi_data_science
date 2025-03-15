const { Pool } = require("pg");
const { faker } = require("@faker-js/faker");

const pool = new Pool({
  user: "admin",
  host: "localhost",
  database: "escola",
  password: "admin",
  port: 5432,
});

//definindo as materias
const materias = [
  { nome: "Matemática", modulo: "Fundamental", categoria: "Exatas" },
  { nome: "Português", modulo: "Fundamental", categoria: "Linguagens" },
  { nome: "História", modulo: "Fundamental", categoria: "Humanas" },
  { nome: "Física", modulo: "Médio", categoria: "Exatas" },
  { nome: "Química", modulo: "Médio", categoria: "Exatas" },
  { nome: "Biologia", modulo: "Médio", categoria: "Ciências da Natureza" },
  { nome: "Geografia", modulo: "Médio", categoria: "Humanas" },
  { nome: "Inglês", modulo: "Fundamental", categoria: "Linguagens" },
];
const professores = [
  { nome: "Carlos Silva", nivel_academico: "Doutorado" },
  { nome: "Ana Souza", nivel_academico: "Mestrado" },
  { nome: "Roberto Lima", nivel_academico: "Doutorado" },
  { nome: "Fernanda Alves", nivel_academico: "Mestrado" },
  { nome: "João Mendes", nivel_academico: "Graduação" },
  { nome: "Mariana Costa", nivel_academico: "Graduação" },
  { nome: "Ricardo Pereira", nivel_academico: "Pós-Graduação" },
  { nome: "Patrícia Santos", nivel_academico: "Pós-Graduação" },
];
const TOTAL_ALUNOS = 20; //Define a quantidade de alunos

function gerarAlunos(qtd) {
  const alunos = [];
  const generos = ["H", "M", "O"];

  for (let i = 0; i < qtd; i++) {
    const primeiroNome = faker.person.firstName();
    const sobreNome = faker.person.lastName();
    const nomeCompleto = `${primeiroNome} ${sobreNome}`;
    const email = `${primeiroNome.toLowerCase()}.${sobreNome.toLowerCase()}@escola.com.br`;
    const nascimento = faker.date
      .birthdate({ min: 12, max: 17, mode: "age" })
      .toISOString()
      .split("T")[0];
    const genero = faker.helpers.arrayElement(generos);

    alunos.push({ nome: nomeCompleto, email, nascimento, genero });
  }

  return alunos;
}

const DIFICULDADES = ["Fácil", "Médio", "Difícil"];

async function inserirDadosFixos() {
  try {
    const client = await pool.connect();

    // Criar matérias
    await client.query("TRUNCATE materia RESTART IDENTITY CASCADE");
    for (const materia of materias) {
      await client.query(
        "INSERT INTO materia (nome, modulo, categoria) VALUES ($1, $2, $3)",
        [materia.nome, materia.modulo, materia.categoria]
      );
      console.log(`Matéria ${materia.nome} inserida.`);
    }

    //Criar professores
    for (const professor of professores) {
      await client.query(
        "INSERT INTO professor (nome, nivel_academico) VALUES ($1, $2)",
        [professor.nome, professor.nivel_academico]
      );
      console.log(`Professor ${professor.nome} inserido.`);
    }

    //Criar alunos
    const alunos = gerarAlunos(TOTAL_ALUNOS);

    for (const aluno of alunos) {
      await client.query(
        "INSERT INTO aluno (nome, email, nascimento, genero) VALUES ($1, $2, $3, $4)",
        [aluno.nome, aluno.email, aluno.nascimento, aluno.genero]
      );
      console.log(`Aluno ${aluno.nome} inserido.`);
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

    // Buscar professores, matérias e alunos
    const { rows: professores } = await client.query(
      "SELECT id, nivel_academico FROM professor"
    );
    const { rows: materias } = await client.query("SELECT id FROM materia");
    const { rows: alunos } = await client.query("SELECT id FROM aluno");

    if (!professores.length || !materias.length || !alunos.length) {
      console.log("Dados insuficientes para gerar avaliações.");
      return;
    }

    // Escolher professor aleatório
    const professor = faker.helpers.arrayElement(professores);
    const fk_professor = professor.id;
    const nivel_academico = professor.nivel_academico;

    // Definir multiplicador do professor
    const MULTIPLICADORES_PROFESSOR = {
      Graduação: 1.0,
      "Pós-Graduação": 1.1,
      Mestrado: 1.2,
      Doutorado: 1.3,
    };
    const multiplicador_professor =
      MULTIPLICADORES_PROFESSOR[nivel_academico] || 1.0;

    // Escolher matéria e dificuldade
    const fk_materia = faker.helpers.arrayElement(materias).id;
    const dificuldade = faker.helpers.arrayElement([
      "Fácil",
      "Médio",
      "Difícil",
    ]);

    // Definir multiplicador da dificuldade
    const MULTIPLICADORES_DIFICULDADE = {
      Fácil: 1.1,
      Médio: 1.0,
      Difícil: 0.9,
    };
    const multiplicador_dificuldade = MULTIPLICADORES_DIFICULDADE[dificuldade];

    // Criar avaliação no banco
    const { rows } = await client.query(
      "INSERT INTO avaliacao (fk_professor, fk_materia, dificuldade) VALUES ($1, $2, $3) RETURNING id",
      [fk_professor, fk_materia, dificuldade]
    );
    const fk_avaliacao = rows[0].id;

    // Gerar notas dos alunos
    for (const aluno of alunos) {
      let nota = parseFloat((Math.random() * 100).toFixed(2));

      // Aplicar multiplicadores
      nota = nota * multiplicador_professor * multiplicador_dificuldade;

      // Garantir que a nota não ultrapasse 100
      nota = Math.min(nota, 100);

      // Inserir no banco
      await client.query(
        "INSERT INTO resultado_avaliacao (fk_aluno, fk_avaliacao, nota) VALUES ($1, $2, $3)",
        [aluno.id, fk_avaliacao, nota]
      );
    }

    console.log("Avaliação e resultados gerados com sucesso.");
    client.release();
  } catch (error) {
    console.error("Erro ao gerar avaliação e resultados:", error);
  }
}

(async () => {
  await inserirDadosFixos();
  setInterval(gerarAvaliacaoEResultados, 1000);
})();
