'use client';
import { Pie } from 'react-chartjs-2';
import { useMemo } from 'react';
import {
  Chart as ChartJS, ArcElement, Tooltip, Legend
} from 'chart.js';

ChartJS.register(ArcElement, Tooltip, Legend);

interface Resultado {
  genero: string;
}

interface Props {
  resultados: Resultado[];
}

export default function DistribuicaoPorGeneroChart({ resultados }: Props) {
  const { labels, data } = useMemo(() => {
    const counts: Record<string, number> = {};

    resultados.forEach(({ genero }) => {
      counts[genero] = (counts[genero] || 0) + 1;
    });

    const labels = Object.keys(counts);
    const data = labels.map((key) => counts[key]);

    return { labels, data };
  }, [resultados]);

  return (
    <div className="card bg-base-100 shadow p-6">
      <h2 className="text-xl font-bold mb-4">🧍 Distribuição por Gênero</h2>
      <Pie
        data={{
          labels,
          datasets: [{
            label: 'Total',
            data,
            backgroundColor: ['#60a5fa', '#f472b6', '#34d399']
          }]
        }}
        options={{
          plugins: {
            title: {
              display: true,
              text: 'Alunos Avaliados por Gênero'
            }
          }
        }}
      />
    </div>
  );
}
