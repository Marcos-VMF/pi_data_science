const { faker } = require('@faker-js/faker');

// Configurações fixas
const professores = [
  { id: 1, nome: 'Prof. Ana', disciplina: 'Matemática' },
  { id: 2, nome: 'Prof. Bruno', disciplina: 'Português' },
  { id: 3, nome: 'Prof. Carlos', disciplina: 'História' },
  { id: 4, nome: 'Prof. Daniela', disciplina: 'Geografia' },
  { id: 5, nome: 'Prof. Eduardo', disciplina: 'Ciências' },
  { id: 6, nome: 'Prof. Fernanda', disciplina: 'Inglês' },
  { id: 7, nome: 'Prof. Gustavo', disciplina: 'Física' },
  { id: 8, nome: 'Prof. Helena', disciplina: 'Química' }
];

const turmas = Array.from({ length: 6 }, (_, id) => ({
  id: id + 1,
  nome: `Turma ${id + 1}`,
  professorId: professores[id % professores.length].id
}));

const alunos = [];
turmas.forEach(turma => {
  for (let i = 0; i < 2; i++) {
    alunos.push({
      id: alunos.length + 1,
      nome: faker.person.fullName(),
      turmaId: turma.id
    });
  }
});

// Função para aplicação de provas
const provas = [];
function aplicarProva() {
  const novaProva = alunos.map(aluno => ({
    alunoId: aluno.id,
    turmaId: aluno.turmaId,
    nota: parseFloat((Math.random() * 10).toFixed(2)),
    data: new Date().toISOString()
  }));
  provas.push(...novaProva);
  console.log('Nova prova aplicada:', JSON.stringify(novaProva, null, 2));
}

// Aplicação de provas a cada 10 segundos
setInterval(aplicarProva, 10000);

// Exibir os dados iniciais
console.log(JSON.stringify({ professores, turmas, alunos }, null, 2));
