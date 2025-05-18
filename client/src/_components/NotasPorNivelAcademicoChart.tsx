'use client';
import { Bar } from 'react-chartjs-2';
import { useMemo } from 'react';
import {
  Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend
} from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

interface Resultado {
  nivel_academico: string;
  nota: number;
}

interface Props {
  resultados: Resultado[];
}

export default function NotasPorNivelAcademicoChart({ resultados }: Props) {
  const { labels, data } = useMemo(() => {
    const agrupado: Record<string, number[]> = {};

    resultados.forEach(({ nivel_academico, nota }) => {
      if (!agrupado[nivel_academico]) agrupado[nivel_academico] = [];
      agrupado[nivel_academico].push(nota);
    });

    const entries = Object.entries(agrupado).map(([nivel, notas]) => {
      const media = notas.reduce((a, b) => a + b, 0) / notas.length;
      return { nivel, media: Number(media.toFixed(2)) };
    });

    // Sort descending by average (media)
    entries.sort((a, b) => b.media - a.media);

    return {
      labels: entries.map(e => e.nivel),
      data: entries.map(e => e.media)
    };
  }, [resultados]);

  return (
    <div className="card bg-base-100 shadow-lg p-4">
      <h2 className="text-xl font-bold mb-4">🎓 Média de Notas por Nível Acadêmico do Professor</h2>
      <Bar
        data={{
          labels,
          datasets: [{ label: 'Nota Média', data, backgroundColor: 'rgba(236,72,153,0.7)' }]
        }}
        options={{
          responsive: true,
          plugins: {
            title: { display: true, }
          }
        }}
      />
    </div>
  );
}
