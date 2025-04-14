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
    alu.incricao,
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
JOIN materia mat ON ava.fk_materia = mat.id;
