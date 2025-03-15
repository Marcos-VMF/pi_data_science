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
  { nome: "Ricardo Pereira", nivel_academico: "Mestrado" },
  { nome: "Patrícia Santos", nivel_academico: "Doutorado" },
];
const TOTAL_ALUNOS = 20; //Define a quantidade de alunos

function gerarAlunos(qtd) {
  const alunos = [];
  const generos = ["H", "M", "O"];

  for (let i = 0; i < qtd; i++) {
    const primeiroNome = faker.person.firstName();
    const sobreNome = faker.person.lastName();
    const email = `${primeiroNome.toLowerCase()}.${sobrenome}@escola.com.br`;
    const nascimento = faker.date
      .birthdate({ min: 12, max: 17, mode: "age" })
      .toISOString()
      .split("T")[0];
    const genero = faker.helpers.arrayElement(generos);

    alunos.push({ nome: nomeCompleto, email, nascimento, genero });
  }

  return alunos;
}

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
  } catch (err) {
    console.error("Erro ao dados fixos", err);
  }
}

(async () => {
  await inserirDadosFixos();
})();
