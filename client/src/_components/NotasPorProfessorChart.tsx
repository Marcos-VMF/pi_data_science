'use client';
import { Bar } from 'react-chartjs-2';
import { useMemo } from 'react';
import {
  Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend
} from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

interface Resultado {
  pro_nome: string;
  nota: number;
}

interface Props {
  resultados: Resultado[];
}

export default function NotasPorProfessorChart({ resultados }: Props) {
  const { labels, data } = useMemo(() => {
    const agrupado: Record<string, number[]> = {};

    resultados.forEach(({ pro_nome, nota }) => {
      if (!agrupado[pro_nome]) agrupado[pro_nome] = [];
      agrupado[pro_nome].push(nota);
    });

    const labels = Object.keys(agrupado);
    const data = labels.map((pro) => {
      const notas = agrupado[pro];
      const media = notas.reduce((a, b) => a + b, 0) / notas.length;
      return Number(media.toFixed(2));
    });

    return { labels, data };
  }, [resultados]);

  return (
    <div className="card bg-base-100 shadow p-6">
      <h2 className="text-xl font-bold mb-4">🎓 Média de Notas por Professor</h2>
      <Bar
        data={{
          labels,
          datasets: [{ label: 'Nota Média', data, backgroundColor: 'rgba(236,72,153,0.7)' }]
        }}
        options={{
          responsive: true,
          plugins: {
            title: { display: true, text: 'Desempenho por Professor' }
          }
        }}
      />
    </div>
  );
}
