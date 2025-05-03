from fastapi import FastAPI, Request
from fastapi.templating import Jinja2Templates
from fastapi.staticfiles import StaticFiles
from sqlalchemy import create_engine, text
from sqlalchemy.orm import Session
import matplotlib.pyplot as plt
import numpy as np
import io
import base64
import os
from datetime import datetime
from typing import List, Dict, Any

app = FastAPI()

# Configura caminhos absolutos
base_dir = os.path.dirname(os.path.abspath(__file__))
templates = Jinja2Templates(directory=os.path.join(base_dir, "templates"))
app.mount("/static", StaticFiles(directory=os.path.join(base_dir, "static")), name="static")

# Configuração do banco de dados
DATABASE_URL = os.getenv("DATABASE_URL", "postgresql://postgres:admin@escola-db:5432/escola")
engine = create_engine(DATABASE_URL, pool_size=20, max_overflow=10)

@app.get("/")
async def dashboard(request: Request):
    try:
        with Session(engine) as session:
            # Consulta para o gráfico principal
            notas = [row[0] for row in session.execute(text("""
                SELECT nota FROM resultado_avaliacao ORDER BY data DESC LIMIT 1000
            """))]

            # KPIs principais
            kpis = session.execute(text("""
                SELECT 
                    COUNT(*) as total_avaliacoes,
                    AVG(nota) as media_geral,
                    MAX(nota) as max_nota,
                    MIN(nota) as min_nota,
                    COUNT(CASE WHEN aprovacao THEN 1 END) as aprovados
                FROM resultado_avaliacao
            """)).first()

            # Médias por matéria
            medias_materias = session.execute(text("""
                SELECT m.nome, AVG(r.nota) as media
                FROM resultado_avaliacao r
                JOIN avaliacao a ON r.fk_avaliacao = a.id
                JOIN materia m ON a.fk_materia = m.id
                GROUP BY m.nome
                ORDER BY media DESC
            """)).all()

            # Médias por professor
            medias_professores = session.execute(text("""
                SELECT p.nome, AVG(r.nota) as media
                FROM resultado_avaliacao r
                JOIN avaliacao a ON r.fk_avaliacao = a.id
                JOIN professor p ON a.fk_professor = p.id
                GROUP BY p.nome
                ORDER BY media DESC
            """)).all()

        # Geração do gráfico
        plt.switch_backend('Agg')
        plt.figure(figsize=(10, 6))
        plt.hist(notas, bins=10, edgecolor='black')
        plt.title('Distribuição de Notas')
        plt.xlabel('Nota')
        plt.ylabel('Quantidade')
        
        img_buf = io.BytesIO()
        plt.savefig(img_buf, format='png', dpi=80)
        img_buf.seek(0)
        img_data = base64.b64encode(img_buf.read()).decode('utf-8')
        plt.close()

        return templates.TemplateResponse("index.html", {
            "request": request,
            "img_data": img_data,
            "media_geral": round(kpis.media_geral, 2),
            "max_nota": round(kpis.max_nota, 2),
            "min_nota": round(kpis.min_nota, 2),
            "aprovados": kpis.aprovados,
            "total_avaliacoes": kpis.total_avaliacoes,
            "medias_materias": medias_materias,
            "medias_professores": medias_professores
        })

    except Exception as e:
        return {"error": str(e)}

@app.get("/api/notas")
async def get_notas():
    try:
        with Session(engine) as session:
            result = session.execute(text("""
                SELECT al.nome as aluno, m.nome as materia, p.nome as professor, 
                       r.nota, r.aprovacao, r.data, a.dificuldade
                FROM resultado_avaliacao r
                JOIN aluno al ON r.fk_aluno = al.id
                JOIN avaliacao a ON r.fk_avaliacao = a.id
                JOIN materia m ON a.fk_materia = m.id
                JOIN professor p ON a.fk_professor = p.id
                ORDER BY r.data DESC
                LIMIT 100
            """))
            
            notas = []
            for row in result:
                notas.append({
                    "aluno": row.aluno,
                    "materia": row.materia,
                    "professor": row.professor,
                    "nota": float(row.nota),
                    "aprovacao": bool(row.aprovacao),
                    "data": row.data.isoformat(),
                    "dificuldade": row.dificuldade
                })
        
        return {"notas": notas}
    except Exception as e:
        return {"error": str(e)}

@app.get("/api/dados-completos")
async def get_dados_completos():
    try:
        with Session(engine) as session:
            result = session.execute(text("""
                SELECT 
                    res.id AS res_id,
                    res.nota,
                    res.aprovacao,
                    res.data AS res_data,
                    res.tentativa,
                    ava.id AS ava_id,
                    ava.data AS ava_data,
                    ava.dificuldade,
                    alu.id AS alu_id,
                    alu.nome AS alu_nome,
                    alu.email,
                    alu.inscricao,
                    alu.nascimento,
                    alu.genero,
                    pro.id AS pro_id,
                    pro.nome AS pro_nome,
                    pro.nivel_academico,
                    mat.id AS mat_id,
                    mat.nome AS mat_nome,
                    mat.modulo,
                    mat.categoria
                FROM resultado_avaliacao res
                JOIN aluno alu ON res.fk_aluno = alu.id
                JOIN avaliacao ava ON res.fk_avaliacao = ava.id
                JOIN professor pro ON ava.fk_professor = pro.id
                JOIN materia mat ON ava.fk_materia = mat.id
                ORDER BY res.data DESC
            """))
            
            dados = []
            for row in result:
                dados.append({
                    "res_id": row.res_id,
                    "nota": float(row.nota) if row.nota else None,
                    "aprovacao": bool(row.aprovacao),
                    "res_data": row.res_data.isoformat() if row.res_data else None,
                    "tentativa": row.tentativa,
                    "ava_id": row.ava_id,
                    "ava_data": row.ava_data.isoformat() if row.ava_data else None,
                    "dificuldade": row.dificuldade,
                    "alu_id": row.alu_id,
                    "alu_nome": row.alu_nome,
                    "email": row.email,
                    "inscricao": row.inscricao.isoformat() if row.inscricao else None,
                    "nascimento": row.nascimento.isoformat() if row.nascimento else None,
                    "genero": row.genero,
                    "pro_id": row.pro_id,
                    "pro_nome": row.pro_nome,
                    "nivel_academico": row.nivel_academico,
                    "mat_id": row.mat_id,
                    "mat_nome": row.mat_nome,
                    "modulo": row.modulo,
                    "categoria": row.categoria
                })
            
            return {"dados": dados}
            
    except Exception as e:
        return {"error": str(e)}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)