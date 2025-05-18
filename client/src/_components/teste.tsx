'use client';
import Plot from 'react-plotly.js';
import { useMemo } from 'react';

interface NotaInput {
    res_id: number;
    nota: number | { source: string; parsedValue: number };
    tentativa: number;
    nascimento: string;
    alu_id: number;
    alu_nome: string;
    mat_id: number;
    mat_nome: string;
}

interface Props {
    resultados: NotaInput[];
}

export default function OLAP3DScatterPlot({ resultados }: Props) {
    const processedData = useMemo(() => {
        // Group by alu_id and mat_id (student and subject)
        type GroupKey = string; // `${alu_id}_${mat_id}`
        const grupos = new Map<GroupKey, {
            totalNota: number;
            count: number;
            nascimento: string;
            nome: string;
            mat_id: number;
            mat_nome: string;
        }>();

        resultados.forEach(item => {
            const id = item.alu_id;
            const matId = item.mat_id;
            const key = `${id}_${matId}`;
            const parsedNota =
                typeof item.nota === 'number' ? item.nota : item.nota.parsedValue;

            if (!grupos.has(key)) {
                grupos.set(key, {
                    totalNota: 0,
                    count: 0,
                    nascimento: item.nascimento,
                    nome: item.alu_nome,
                    mat_id: matId,
                    mat_nome: item.mat_nome,
                });
            }

            const grupo = grupos.get(key)!;
            grupo.totalNota += parsedNota;
            grupo.count += 1;
        });

        const now = new Date();
        const x: number[] = [];
        const y: number[] = [];
        const z: number[] = [];
        const text: string[] = [];

        grupos.forEach((grupo, key) => {
            const nascimento = new Date(grupo.nascimento);
            const idade = now.getFullYear() - nascimento.getFullYear()
                - (now < new Date(now.getFullYear(), nascimento.getMonth(), nascimento.getDate()) ? 1 : 0);

            x.push(idade);
            y.push(Number((grupo.totalNota / grupo.count).toFixed(2)));
            z.push(grupo.mat_id); // encode materia as number on z-axis
            text.push(`Aluno: ${grupo.nome}<br>Matéria: ${grupo.mat_nome}`);
        });

        return { x, y, z, text };
    }, [resultados]);

    return (
        <div className="card bg-base-100 shadow-lg p-4">
            <h2 className="text-xl font-bold mb-4">📊 OLAP 3D: Idade x Média Nota x Matéria (ID)</h2>
            <Plot
                data={[
                    {
                        x: processedData.x,
                        y: processedData.y,
                        z: processedData.z,
                        text: processedData.text,
                        mode: 'markers',
                        type: 'scatter3d',
                        marker: {
                            size: 6,
                            color: processedData.y, // color by average nota
                            colorscale: 'Viridis',
                            showscale: true,
                            colorbar: { title: { text: 'Média Nota' } },
                        },
                        hovertemplate:
                            '%{text}<br>' +
                            'Idade: %{x}<br>' +
                            'Média Nota: %{y}<br>' +
                            'Matéria (ID): %{z}<extra></extra>',
                    }
                ]}
                layout={{
                    scene: {
                        xaxis: { title: { text: 'Idade' } },
                        yaxis: { title: { text: 'Média Nota' } },
                        zaxis: { title: { text: 'Matéria (ID)' } },
                    },
                    margin: { l: 10, r: 10, t: 50, b: 0 },
                }}
                style={{ width: '100%', height: '600px' }}
            />
        </div>
    );
}
