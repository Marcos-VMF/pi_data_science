'use client';
import { Line } from 'react-chartjs-2';
import { useMemo } from 'react';
import {
  Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend
} from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

interface Resultado {
  dificuldade: string;
  nota: number;
}

interface Props {
  resultados: Resultado[];
}

export default function NotasPorDificuldadeChart({ resultados }: Props) {
  const { labels, data } = useMemo(() => {
    const grupo: Record<string, number[]> = {};

    resultados.forEach(({ dificuldade, nota }) => {
      if (!grupo[dificuldade]) grupo[dificuldade] = [];
      grupo[dificuldade].push(nota);
    });

    // Create array of { dificuldade, media }
    const entries = Object.entries(grupo).map(([dificuldade, notas]) => {
      const media = notas.reduce((a, b) => a + b, 0) / notas.length;
      return { dificuldade, media: Number(media.toFixed(2)) };
    });

    // Sort descending by media
    entries.sort((a, b) => b.media - a.media);

    return {
      labels: entries.map(e => e.dificuldade),
      data: entries.map(e => e.media)
    };
  }, [resultados]);

  return (
    <div className="card bg-base-100 shadow-lg p-4">
      <h2 className="text-xl font-bold mb-4">📈 Média de Notas por Dificuldade</h2>
      <Line
        data={{
          labels,
          datasets: [
            {
              label: 'Média',
              data,
              borderColor: 'rgba(132,204,22,1)',
              backgroundColor: 'rgba(132,204,22,0.3)',
              tension: 0.3
            }
          ]
        }}
        options={{
          responsive: true,
          plugins: {
            title: {
              display: true,
            }
          }
        }}
      />
    </div>
  );
}
