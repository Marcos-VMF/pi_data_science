'use client';
import { useEffect, useState } from 'react';
import NotasPorMateriaChart from '@/_components/NotasPorMateria';
import NotasPorNivelAcademicoChart from '@/_components/NotasPorNivelAcademicoChart';
import DistribuicaoPorGeneroChart from '@/_components/DistribuicaoPorGeneroChart';
import NotasPorDificuldadeChart from '@/_components/NotasPorDificuldadeChart';
import KpiCard from '@/_components/Kpi';
import dynamic from 'next/dynamic';

const OLAP3DScatterPlot = dynamic(() => import('@/_components/teste'), {
  ssr: false,
}); import { FaCheckCircle, FaTimesCircle, FaChartBar } from 'react-icons/fa';

interface Resultado {
  res_id: number;
  nota: number;
  aprovacao: boolean;
  res_data: string;
  tentativa: number;
  ava_id: number;
  ava_data: string;
  dificuldade: string;
  alu_id: number;
  alu_nome: string;
  email: string;
  inscricao: string;
  nascimento: string;
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
    const passedStudents = (resultados.filter((r) => r.aprovacao === true).length * 100) / resultados.length;
    const averageScore = resultados.reduce((sum, r) => sum + r.nota, 0) / resultados.length;

    return (
      <main className="max-width-screen">
        <label className="swap swap-rotate">
          <input type="checkbox" className="theme-controller" value="dracula" />
          <svg
            className="swap-off h-10 w-10 fill-current"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24">
            <path
              d="M5.64,17l-.71.71a1,1,0,0,0,0,1.41,1,1,0,0,0,1.41,0l.71-.71A1,1,0,0,0,5.64,17ZM5,12a1,1,0,0,0-1-1H3a1,1,0,0,0,0,2H4A1,1,0,0,0,5,12Zm7-7a1,1,0,0,0,1-1V3a1,1,0,0,0-2,0V4A1,1,0,0,0,12,5ZM5.64,7.05a1,1,0,0,0,.7.29,1,1,0,0,0,.71-.29,1,1,0,0,0,0-1.41l-.71-.71A1,1,0,0,0,4.93,6.34Zm12,.29a1,1,0,0,0,.7-.29l.71-.71a1,1,0,1,0-1.41-1.41L17,5.64a1,1,0,0,0,0,1.41A1,1,0,0,0,17.66,7.34ZM21,11H20a1,1,0,0,0,0,2h1a1,1,0,0,0,0-2Zm-9,8a1,1,0,0,0-1,1v1a1,1,0,0,0,2,0V20A1,1,0,0,0,12,19ZM18.36,17A1,1,0,0,0,17,18.36l.71.71a1,1,0,0,0,1.41,0,1,1,0,0,0,0-1.41ZM12,6.5A5.5,5.5,0,1,0,17.5,12,5.51,5.51,0,0,0,12,6.5Zm0,9A3.5,3.5,0,1,1,15.5,12,3.5,3.5,0,0,1,12,15.5Z" />
          </svg>
          <svg
            className="swap-on h-10 w-10 fill-current"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24">
            <path
              d="M21.64,13a1,1,0,0,0-1.05-.14,8.05,8.05,0,0,1-3.37.73A8.15,8.15,0,0,1,9.08,5.49a8.59,8.59,0,0,1,.25-2A1,1,0,0,0,8,2.36,10.14,10.14,0,1,0,22,14.05,1,1,0,0,0,21.64,13Zm-9.5,6.69A8.14,8.14,0,0,1,7.08,5.22v.27A10.15,10.15,0,0,0,17.22,15.63a9.79,9.79,0,0,0,2.1-.22A8.11,8.11,0,0,1,12.14,19.73Z" />
          </svg>
        </label>
        <section className="text-center">
          <div className="stats">
            <KpiCard
              title="Total de Professores"
              value={totalProfessores}
              icon={<FaChartBar />}
            />
            <KpiCard
              title="Total de Alunos"
              value={totalStudents}
              icon={<FaChartBar />}
            />
            <KpiCard
              title="Avaliações"
              value={totalAvaliacoes}
              icon={<FaChartBar />}
            />
            <KpiCard
              title="Nota Média"
              value={averageScore.toFixed(1)}
              icon={<FaChartBar />}
            />
            <KpiCard
              title="Avaliações com Resultado [Aprovado]"
              value={passedStudents.toFixed(1) + `%`}
              icon={<FaCheckCircle />}
            />

          </div>
        </section>

        <section className="grid gap-6 p-6 grid-cols-1 lg:grid-cols-2 xl:grid-cols-3">
          <div className="lg:col-span-2">
            <NotasPorMateriaChart resultados={resultados} />
          </div>
          <div>
            <DistribuicaoPorGeneroChart resultados={resultados} />
          </div>
          <div>
            <NotasPorNivelAcademicoChart resultados={resultados} />
          </div>

          <div>
            <NotasPorDificuldadeChart resultados={resultados} />
          </div>
        </section>

        <section className="p-6">
          <OLAP3DScatterPlot resultados={resultados} />
        </section>

      </main>
    );
  }



}
