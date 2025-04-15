import NotasPorMateriaChart from '@/_components/NotasPorMateria';
import NotasPorProfessorChart from '@/_components/NotasPorProfessorChart';
import DistribuicaoPorGeneroChart from '@/_components/DistribuicaoPorGeneroChart';
import NotasPorDificuldadeChart from '@/_components/NotasPorDificuldadeChart';
import KpiCard from '@/_components/Kpi';
import { FaCheckCircle, FaTimesCircle, FaChartBar } from 'react-icons/fa';
const resultados = [
  {
    "res_id": 1,
    "nota": 8.5,
    "aprovacao": true,
    "res_data": "2024-03-10",
    "tentativa": 1,

    "ava_id": 100,
    "ava_data": "2024-03-01",
    "dificuldade": "Média",

    "alu_id": 501,
    "alu_nome": "Alice Fernandes",
    "email": "alice@example.com",
    "incricao": "2023-09-01",
    "nascimento": "2000-06-12",
    "genero": "Feminino",

    "pro_id": 3001,
    "pro_nome": "Dr. Ricardo Lemos",
    "nivel_academico": "Doutorado",

    "mat_id": 2001,
    "mat_nome": "Matemática I",
    "modulo": "Básico",
    "categoria": "Exatas"
  },
  {
    "res_id": 2,
    "nota": 7.2,
    "aprovacao": true,
    "res_data": "2024-03-11",
    "tentativa": 1,

    "ava_id": 101,
    "ava_data": "2024-03-02",
    "dificuldade": "Fácil",

    "alu_id": 502,
    "alu_nome": "Carlos Souza",
    "email": "carlos@example.com",
    "incricao": "2023-09-01",
    "nascimento": "1999-02-27",
    "genero": "Masculino",

    "pro_id": 3002,
    "pro_nome": "Profª. Marina Teixeira",
    "nivel_academico": "Mestrado",

    "mat_id": 2002,
    "mat_nome": "História do Brasil",
    "modulo": "Intermediário",
    "categoria": "Humanas"
  },
  {
    "res_id": 3,
    "nota": 5.9,
    "aprovacao": false,
    "res_data": "2024-03-12",
    "tentativa": 2,

    "ava_id": 102,
    "ava_data": "2024-03-03",
    "dificuldade": "Difícil",

    "alu_id": 503,
    "alu_nome": "Bruna Oliveira",
    "email": "bruna@example.com",
    "incricao": "2023-09-01",
    "nascimento": "2001-11-10",
    "genero": "Feminino",

    "pro_id": 3001,
    "pro_nome": "Dr. Ricardo Lemos",
    "nivel_academico": "Doutorado",

    "mat_id": 2001,
    "mat_nome": "Matemática I",
    "modulo": "Básico",
    "categoria": "Exatas"
  },
  {
    "res_id": 4,
    "nota": 9.1,
    "aprovacao": true,
    "res_data": "2024-03-13",
    "tentativa": 1,

    "ava_id": 103,
    "ava_data": "2024-03-04",
    "dificuldade": "Fácil",

    "alu_id": 504,
    "alu_nome": "Daniel Lima",
    "email": "daniel@example.com",
    "incricao": "2023-09-01",
    "nascimento": "1998-08-15",
    "genero": "Masculino",

    "pro_id": 3002,
    "pro_nome": "Profª. Marina Teixeira",
    "nivel_academico": "Mestrado",

    "mat_id": 2003,
    "mat_nome": "Química Orgânica",
    "modulo": "Avançado",
    "categoria": "Exatas"
  },
  {
    "res_id": 5,
    "nota": 6.3,
    "aprovacao": false,
    "res_data": "2024-03-14",
    "tentativa": 3,

    "ava_id": 104,
    "ava_data": "2024-03-05",
    "dificuldade": "Média",

    "alu_id": 505,
    "alu_nome": "Eduarda Gomes",
    "email": "eduarda@example.com",
    "incricao": "2023-09-01",
    "nascimento": "2000-01-20",
    "genero": "Feminino",

    "pro_id": 3003,
    "pro_nome": "Prof. Tiago Mendes",
    "nivel_academico": "Especialização",

    "mat_id": 2004,
    "mat_nome": "Sociologia Aplicada",
    "modulo": "Intermediário",
    "categoria": "Humanas"
  },
  {
    "res_id": 6,
    "nota": 7.8,
    "aprovacao": true,
    "res_data": "2024-03-15",
    "tentativa": 1,

    "ava_id": 105,
    "ava_data": "2024-03-06",
    "dificuldade": "Média",

    "alu_id": 506,
    "alu_nome": "Felipe Silva",
    "email": "felipe@example.com",
    "incricao": "2023-09-01",
    "nascimento": "1999-03-10",
    "genero": "Masculino",

    "pro_id": 3004,
    "pro_nome": "Prof. João Costa",
    "nivel_academico": "Mestrado",

    "mat_id": 2005,
    "mat_nome": "Física II",
    "modulo": "Intermediário",
    "categoria": "Exatas"
  },
  {
    "res_id": 7,
    "nota": 6.9,
    "aprovacao": false,
    "res_data": "2024-03-16",
    "tentativa": 2,

    "ava_id": 106,
    "ava_data": "2024-03-07",
    "dificuldade": "Difícil",

    "alu_id": 507,
    "alu_nome": "Gustavo Rocha",
    "email": "gustavo@example.com",
    "incricao": "2023-09-01",
    "nascimento": "1998-11-22",
    "genero": "Masculino",

    "pro_id": 3005,
    "pro_nome": "Prof. Ana Ribeiro",
    "nivel_academico": "Doutorado",

    "mat_id": 2006,
    "mat_nome": "Literatura Brasileira",
    "modulo": "Básico",
    "categoria": "Humanas"
  },
  {
    "res_id": 8,
    "nota": 9.4,
    "aprovacao": true,
    "res_data": "2024-03-17",
    "tentativa": 1,

    "ava_id": 107,
    "ava_data": "2024-03-08",
    "dificuldade": "Fácil",

    "alu_id": 508,
    "alu_nome": "Isabela Costa",
    "email": "isabela@example.com",
    "incricao": "2023-09-01",
    "nascimento": "2001-04-19",
    "genero": "Feminino",

    "pro_id": 3006,
    "pro_nome": "Prof. Marcos Oliveira",
    "nivel_academico": "Especialização",

    "mat_id": 2007,
    "mat_nome": "Geografia Aplicada",
    "modulo": "Avançado",
    "categoria": "Humanas"
  },
  {
    "res_id": 9,
    "nota": 7.5,
    "aprovacao": true,
    "res_data": "2024-03-18",
    "tentativa": 1,

    "ava_id": 108,
    "ava_data": "2024-03-09",
    "dificuldade": "Média",

    "alu_id": 509,
    "alu_nome": "Lucas Almeida",
    "email": "lucas@example.com",
    "incricao": "2023-09-01",
    "nascimento": "1997-05-05",
    "genero": "Masculino",

    "pro_id": 3007,
    "pro_nome": "Profª. Raquel Souza",
    "nivel_academico": "Mestrado",

    "mat_id": 2008,
    "mat_nome": "Anatomia Humana",
    "modulo": "Básico",
    "categoria": "Saúde"
  },
  {
    "res_id": 10,
    "nota": 6.7,
    "aprovacao": false,
    "res_data": "2024-03-19",
    "tentativa": 3,

    "ava_id": 109,
    "ava_data": "2024-03-10",
    "dificuldade": "Difícil",

    "alu_id": 510,
    "alu_nome": "Fernanda Pinto",
    "email": "fernanda@example.com",
    "incricao": "2023-09-01",
    "nascimento": "2002-07-30",
    "genero": "Feminino",

    "pro_id": 3008,
    "pro_nome": "Prof. João Costa",
    "nivel_academico": "Doutorado",

    "mat_id": 2009,
    "mat_nome": "Biologia Molecular",
    "modulo": "Avançado",
    "categoria": "Saúde"
  }
];

const totalStudents = [...new Set(resultados.map((r) => r.alu_id))].length;
const passedStudents = resultados.filter((r) => r.aprovacao === true).length;
const averageScore =
  resultados.reduce((sum, r) => sum + r.nota, 0) / resultados.length;

export default function Home() {
  return (
    <main className="max-width-screen">
      <section className="text-center">
        <div className="stats">
          <KpiCard
            title="Total Students"
            value={totalStudents}
            icon={<FaChartBar />}
            color="bg-blue-500"
          />
          <KpiCard
            title="Passed Students"
            value={passedStudents}
            icon={<FaCheckCircle />}
            color="bg-green-500"
          />
          <KpiCard
            title="Average Score"
            value={averageScore.toFixed(2)}
            icon={<FaTimesCircle />}
            color="bg-yellow-500"
          />
        </div>
      </section>
      
      <section className="grid gap-6 p-6 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
        <div>
          <NotasPorMateriaChart resultados={resultados} />
        </div>
        <div>
          <NotasPorProfessorChart resultados={resultados} />
        </div>
        <div className='max-w-sm'>
          <DistribuicaoPorGeneroChart resultados={resultados} />
        </div>
        <div>
          <NotasPorDificuldadeChart resultados={resultados} />
        </div>
      </section>
      
    </main>
  );
}
