const fs = require('fs');
const { Parser } = require('json2csv');

// Gerar nomes aleatórios para professores
const professores = Array.from({ length: 10 }, (_, i) => ({
    id: i + 1,
    nome: `Professor ${i + 1}`
}));

// Gerar matérias
const materias = Array.from({ length: 10 }, (_, i) => ({
    id: i + 1,
    nome: `Matéria ${i + 1}`
}));

// Gerar alunos
const alunos = Array.from({ length: 450 }, (_, i) => ({
    id: i + 1,
    nome: `Aluno ${i + 1}`
}));

// Gerar avaliações
const avaliacoes = [];
alunos.forEach(aluno => {
    for (let i = 0; i < 5; i++) { // Cada aluno faz 5 avaliações
        const nota = (Math.random() * 100).toFixed(2);
        avaliacoes.push({
            id: avaliacoes.length + 1,
            aluno: aluno.nome,
            materia: materias[Math.floor(Math.random() * materias.length)].nome,
            professor: professores[Math.floor(Math.random() * professores.length)].nome,
            data: new Date().toISOString().split('T')[0],
            dificuldade: ['Fácil', 'Médio', 'Difícil'][Math.floor(Math.random() * 3)],
            nota: nota,
            status: nota >= 70 ? 'Aprovado' : 'Reprovado'
        });
    }
});

// Gerar CSV único
const json2csvParser = new Parser();
const csvCompleto = json2csvParser.parse(avaliacoes);

fs.writeFileSync('avaliacoes_escola.csv', csvCompleto);

console.log('Arquivo CSV de avaliações gerado com sucesso!');
