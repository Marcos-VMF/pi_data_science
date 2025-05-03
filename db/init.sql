-- Remove tabelas existentes (se houver)
DROP TABLE IF EXISTS resultado_avaliacao;
DROP TABLE IF EXISTS avaliacao;
DROP TABLE IF EXISTS aluno;
DROP TABLE IF EXISTS professor;
DROP TABLE IF EXISTS materia;

-- Criação das tabelas
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
    inscricao DATE NOT NULL DEFAULT CURRENT_DATE,
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

-- Dados iniciais para teste
INSERT INTO materia (nome, modulo, categoria) VALUES 
('Matemática Avançada', 'Módulo 1', 'Exatas'),
('Literatura Brasileira', 'Módulo 2', 'Humanas'),
('Programação Python', 'Módulo 3', 'Tecnologia'),
('Física Quântica', 'Módulo 4', 'Exatas'),
('História da Arte', 'Módulo 5', 'Humanas');

INSERT INTO professor (nome, nivel_academico) VALUES 
('Carlos Silva', 'Doutorado'),
('Ana Souza', 'Mestrado'),
('Roberto Lima', 'Doutorado'),
('Fernanda Oliveira', 'Mestrado'),
('João Santos', 'Doutorado');

INSERT INTO aluno (nome, email, nascimento, genero) VALUES
('João da Silva', 'joao.silva@email.com', '2000-05-15', 'H'),
('Maria Oliveira', 'maria.oliveira@email.com', '1999-08-22', 'M'),
('Pedro Souza', 'pedro.souza@email.com', '2001-03-10', 'H'),
('Ana Costa', 'ana.costa@email.com', '2000-11-30', 'M'),
('Lucas Pereira', 'lucas.pereira@email.com', '1998-07-05', 'H');

-- Inserir algumas avaliações e resultados
DO $$
DECLARE
    avaliacao_id INT;
BEGIN
    -- Avaliação 1
    INSERT INTO avaliacao (fk_professor, fk_materia, dificuldade) 
    VALUES (1, 1, 'Médio') RETURNING id INTO avaliacao_id;
    
    INSERT INTO resultado_avaliacao (fk_aluno, fk_avaliacao, nota) VALUES
    (1, avaliacao_id, 85.5),
    (2, avaliacao_id, 72.0),
    (3, avaliacao_id, 68.5);

    -- Avaliação 2
    INSERT INTO avaliacao (fk_professor, fk_materia, dificuldade) 
    VALUES (2, 2, 'Fácil') RETURNING id INTO avaliacao_id;
    
    INSERT INTO resultado_avaliacao (fk_aluno, fk_avaliacao, nota) VALUES
    (1, avaliacao_id, 92.0),
    (4, avaliacao_id, 88.5),
    (5, avaliacao_id, 76.0);

    -- Avaliação 3
    INSERT INTO avaliacao (fk_professor, fk_materia, dificuldade) 
    VALUES (3, 3, 'Difícil') RETURNING id INTO avaliacao_id;
    
    INSERT INTO resultado_avaliacao (fk_aluno, fk_avaliacao, nota) VALUES
    (2, avaliacao_id, 65.0),
    (3, avaliacao_id, 71.5),
    (5, avaliacao_id, 82.0);
END $$;