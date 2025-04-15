'use client';

import { Bar } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';
import { useMemo } from 'react';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

interface Resultado {
  mat_nome: string;
  nota: number;
}

interface Props {
  resultados: Resultado[];
}

export default function NotasPorMateriaChart({ resultados }: Props) {
  const { labels, data } = useMemo(() => {
    const agrupado: Record<string, number[]> = {};

    resultados.forEach(({ mat_nome, nota }) => {
      if (!agrupado[mat_nome]) agrupado[mat_nome] = [];
      agrupado[mat_nome].push(nota);
    });

    const labels = Object.keys(agrupado);
    const data = labels.map((mat) => {
      const notas = agrupado[mat];
      const media = notas.reduce((a, b) => a + b, 0) / notas.length;
      return Number(media.toFixed(2));
    });

    return { labels, data };
  }, [resultados]);

  return (
    <div className="card bg-base-100 shadow p-6">
      <h2 className="text-xl font-bold mb-4">📚 Média de Notas por Matéria</h2>
      <Bar
        data={{
          labels,
          datasets: [
            {
              label: 'Média das Notas',
              data,
              backgroundColor: 'rgba(59,130,246,0.7)',
            },
          ],
        }}
        options={{
          responsive: true,
          plugins: {
            legend: { position: 'top' as const },
            title: { display: true, text: 'Desempenho por Matéria' },
          },
        }}
      />
    </div>
  );
}
