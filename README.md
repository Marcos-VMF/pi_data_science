# Sistema de Geração e Análise de Dados em Tempo Real

## Objetivo do Projeto
Este projeto tem como objetivo criar um sistema que simula um ambiente escolar, onde professores e alunos interagem por meio de provas. O sistema gera dados em tempo real utilizando **Node.js** e os armazena em um banco de dados **PostgreSQL**, possibilitando análises detalhadas sobre o desempenho dos alunos.

A estrutura do sistema é baseada em **containers Docker**, contemplando a parte de DevOps. A API de análise de dados é desenvolvida em **R**, que serve endpoints que processam as informações armazenadas e geram estatísticas sobre desempenho acadêmico e tendências de notas. Esses dados são consumidos por uma interface frontend desenvolvida em **Next.js**, permitindo a visualização dos resultados.

## Tecnologias Utilizadas
- **Node.js**: Geração de dados aleatórios e inserção no banco de dados.
- **PostgreSQL**: Armazenamento de informações de professores, alunos, classes e notas.
- **R**: Processamento de dados e análise estatística.
- **Next.js**: Interface frontend para exibição das análises.
- **Docker**: Gerenciamento dos serviços em containers.

## Equipe
- **Luiz e Kamily**: Desenvolvimento do **frontend**,  **DevOps** e **banco de dados**.
- **Marcos**: Desenvolvimento da **geração de dados**.
- **Bruno**: Desenvolvimento da **API de análise de dados**.
