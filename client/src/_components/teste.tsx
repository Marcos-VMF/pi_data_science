'use client';
import Plot from 'react-plotly.js';
import { useMemo, useState } from 'react';

interface NotaInput {
    res_id: number;
    nota: number | { source: string; parsedValue: number };
    tentativa: number;
    nascimento: string;
    alu_id: number;
    alu_nome: string;
    mat_id: number;
    mat_nome: string;
    pro_nome: string;
    nivel_academico: string;
    dificuldade: string;
}

interface Props {
    resultados: NotaInput[];
}

const eixoOpcoes = [
    { label: 'Idade', value: 'idade' },
    { label: 'Nível Acadêmico do Professor', value: 'nivel_academico' },
    { label: 'Dificuldade da Avaliação', value: 'dificuldade' },
];

export default function OLAP3DScatterPlot({ resultados }: Props) {
    const [eixoX, setEixoX] = useState<'idade' | 'nivel_academico' | 'dificuldade'>('idade');

    const processedData = useMemo(() => {
        type GroupKey = string; // `${alu_id}_${mat_id}`
        const grupos = new Map<GroupKey, {
            totalNota: number;
            count: number;
            nascimento: string;
            nome: string;
            mat_id: number;
            mat_nome: string;
            nivel_academico: string;
            dificuldade: string;
        }>();

        resultados.forEach(item => {
            const key = `${item.alu_id}_${item.mat_id}`;
            const parsedNota = typeof item.nota === 'number' ? item.nota : item.nota.parsedValue;

            if (!grupos.has(key)) {
                grupos.set(key, {
                    totalNota: 0,
                    count: 0,
                    nascimento: item.nascimento,
                    nome: item.alu_nome,
                    mat_id: item.mat_id,
                    mat_nome: item.mat_nome,
                    nivel_academico: item.nivel_academico,
                    dificuldade: item.dificuldade,
                });
            }

            const grupo = grupos.get(key)!;
            grupo.totalNota += parsedNota;
            grupo.count += 1;
        });

        const now = new Date();
        const x: (number | string)[] = [];
        const y: number[] = [];
        const z: number[] = [];
        const text: string[] = [];

        const eixoCategorias = new Map<string, number>();
        let categoriaIndex = 0;

        grupos.forEach((grupo) => {
            let xValue: number | string;

            if (eixoX === 'idade') {
                const nascimento = new Date(grupo.nascimento);
                const idade = now.getFullYear() - nascimento.getFullYear()
                    - (now < new Date(now.getFullYear(), nascimento.getMonth(), nascimento.getDate()) ? 1 : 0);
                xValue = idade;
            } else {
                const chave = eixoX === 'nivel_academico' ? grupo.nivel_academico : grupo.dificuldade;
                if (!eixoCategorias.has(chave)) {
                    eixoCategorias.set(chave, categoriaIndex++);
                }
                xValue = eixoCategorias.get(chave)!;
            }

            x.push(xValue);
            y.push(Number((grupo.totalNota / grupo.count).toFixed(2)));
            z.push(grupo.mat_id);
            text.push(`Aluno: ${grupo.nome}<br>Matéria: ${grupo.mat_nome}`);
        });

        return { x, y, z, text, categorias: eixoCategorias };
    }, [resultados, eixoX]);

    const getEixoXLabel = () => {
        switch (eixoX) {
            case 'idade': return 'Idade';
            case 'nivel_academico': return 'Nível Acadêmico do Professor';
            case 'dificuldade': return 'Dificuldade da Avaliação';
        }
    };

    return (
        <div className="card bg-base-100 shadow-lg p-4">
            <h2 className="text-xl font-bold mb-4">📊 OLAP 3D: {getEixoXLabel()} x Média Nota x Matéria (ID)</h2>

            <div className="form-control w-full max-w-xs mb-4">
                <label className="label">
                    <span className="label-text">Eixo X</span>
                </label>
                <select
                    className="select select-bordered"
                    value={eixoX}
                    onChange={(e) => setEixoX(e.target.value as any)}
                >
                    {eixoOpcoes.map(opt => (
                        <option key={opt.value} value={opt.value}>
                            {opt.label}
                        </option>
                    ))}
                </select>
            </div>

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
                            color: processedData.y,
                            colorscale: 'Viridis',
                            showscale: true,
                            colorbar: { title: { text: 'Média Nota' } },
                        },
                        hovertemplate:
                            '%{text}<br>' +
                            `${getEixoXLabel()}: %{x}<br>` +
                            'Média Nota: %{y}<br>' +
                            'Matéria (ID): %{z}<extra></extra>',
                    }
                ]}
                layout={{
                    scene: {
                        xaxis: {
                            title: { text: getEixoXLabel() },
                            tickmode: eixoX === 'idade' ? 'auto' : 'array',
                            tickvals: eixoX === 'idade' ? undefined : Array.from(processedData.categorias.values()),
                            ticktext: eixoX === 'idade' ? undefined : Array.from(processedData.categorias.keys()),
                        },
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
