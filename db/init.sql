CREATE TABLE materia (
    id SERIAL PRIMARY KEY,
    nome VARCHAR(255) NOT NULL,
    modulo VARCHAR(255) NOT NULL,
    categoria VARCHAR(255) NOT NULL
);

CREATE TABLE professor (
    id SERIAL PRIMARY KEY,
    nome VARCHAR(255) NOT NULL,
    nivel_academico VARCHAR(50) NOT NULL
);

CREATE TABLE aluno (
    id SERIAL PRIMARY KEY,
    nome VARCHAR(100) NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    incricao DATE NOT NULL DEFAULT CURRENT_DATE, 
    nascimento DATE NOT NULL,
    genero CHAR(1) CHECK (genero IN ('H', 'M', 'O'))
);

CREATE TABLE avaliacao (
    id SERIAL PRIMARY KEY,
    fk_professor INT NOT NULL,
    fk_materia INT NOT NULL,
    data TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    dificuldade VARCHAR(50) CHECK (dificuldade IN ('Fácil', 'Médio', 'Difícil')),
    FOREIGN KEY (fk_professor) REFERENCES professor(id) ON DELETE CASCADE,
    FOREIGN KEY (fk_materia) REFERENCES materia(id) ON DELETE CASCADE
);

CREATE TABLE resultado_avaliacao (
    id SERIAL PRIMARY KEY,
    fk_aluno INT NOT NULL,
    fk_avaliacao INT NOT NULL,
    nota DECIMAL(5,2) NOT NULL CHECK (nota BETWEEN 0 AND 100),
    aprovacao BOOLEAN GENERATED ALWAYS AS (nota >= 70) STORED,
    data TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    tentativa INT NOT NULL DEFAULT 1,
    FOREIGN KEY (fk_aluno) REFERENCES aluno(id) ON DELETE CASCADE,
    FOREIGN KEY (fk_avaliacao) REFERENCES avaliacao(id) ON DELETE CASCADE
);
