'use client';
import { useEffect, useState } from 'react';
import NotasPorMateriaChart from '@/_components/NotasPorMateria';
import NotasPorProfessorChart from '@/_components/NotasPorProfessorChart';
import DistribuicaoPorGeneroChart from '@/_components/DistribuicaoPorGeneroChart';
import NotasPorDificuldadeChart from '@/_components/NotasPorDificuldadeChart';
import KpiCard from '@/_components/Kpi';
import { FaCheckCircle, FaTimesCircle, FaChartBar } from 'react-icons/fa';

interface Resultado {
  res_id: number;
  nota: number;
  aprovacao: boolean;
  res_data: string; // ou Date, se você converter depois
  tentativa: number;
  ava_id: number;
  ava_data: string; // ou Date
  dificuldade: string;
  alu_id: number;
  alu_nome: string;
  email: string;
  inscricao: string; // ou Date
  nascimento: string; // ou Date
  genero: string;
  pro_id: number;
  pro_nome: string;
  nivel_academico: string;
  mat_id: number;
  mat_nome: string;
  modulo: string;
  categoria: string;
}


export default function Home() {
  const [resultados, setResultados] = useState<Resultado[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      const res = await fetch("http://localhost:8000/api/dados-completos");
      const data = await res.json();
      setResultados(data.dados);
    };

    fetchData(); // initial fetch
    const interval = setInterval(fetchData, 5000); // fetch every 5s
    return () => clearInterval(interval);
  }, []);

  if (resultados) {
    console.log(resultados);
    const totalStudents = [...new Set(resultados.map((r) => r.alu_id))].length;
    const totalAvaliacoes = [...new Set(resultados.map((r) => r.res_id))].length;
    const totalProfessores = [...new Set(resultados.map((r) => r.pro_id))].length;
    const passedStudents = resultados.filter((r) => r.aprovacao === true).length;
    const averageScore = resultados.reduce((sum, r) => sum + r.nota, 0) / resultados.length;

    return (
      <main className="max-width-screen">
        <section className="text-center">
          <div className="stats">
            <KpiCard
              title="Total de Alunos"
              value={totalProfessores}
              icon={<FaChartBar />}
              color="bg-blue-500"
            />
            <KpiCard
              title="Total de Alunos"
              value={totalStudents}
              icon={<FaChartBar />}
              color="bg-blue-500"
            />
            <KpiCard
              title="Avaliações"
              value={totalAvaliacoes}
              icon={<FaTimesCircle />}
              color="bg-yellow-500"
            />
            <KpiCard
              title="Alunos Aprovados"
              value={passedStudents}
              icon={<FaCheckCircle />}
              color="bg-green-500"
            />
            <KpiCard
              title="Nota Média"
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



}
