# Instalar pacotes se necessário
# install.packages(c("httr", "jsonlite", "ggplot2", "dplyr", "tidyr"))

library(httr)
library(jsonlite)
library(ggplot2)
library(dplyr)
library(tidyr)

# 1. Obter dados da API com tratamento completo
url <- "http://localhost:8000/api/dados-completos"

# Configurar a requisição com timeout e headers explícitos
response <- GET(url, 
                timeout(30),
                add_headers("Accept" = "application/json; charset=utf-8"))

# Verificar se a requisição foi bem-sucedida
if (http_status(response)$category == "Success") {
  # Extrair o conteúdo com encoding explícito
  conteudo <- content(response, as = "text", encoding = "UTF-8")
  
  # Converter JSON para dataframe
  tryCatch({
    dados <- fromJSON(conteudo, flatten = TRUE)$dados
    
    # Converter para dataframe com tratamento de tipos
    df <- as.data.frame(dados) %>%
      mutate(
        across(c(nota, tentativa), as.numeric),
        across(c(aprovacao), as.logical),
        across(ends_with("_data"), ~ as.POSIXct(.x)),
        across(c(inscricao, nascimento), as.Date)
      )
    
    # 2. Análise Básica
    cat("\n=== Resumo Estatístico ===\n")
    print(summary(df$nota))
    
    cat("\nTaxa de Aprovação Geral:", mean(df$aprovacao) * 100, "%\n")
    
    # 3. Gráficos
    
    # Correção aplicada aqui - removidos parênteses extras
    # Distribuição de notas
    p1 <- ggplot(df, aes(x = nota)) +
      geom_histogram(binwidth = 5, fill = "steelblue", alpha = 0.8) +
      labs(title = "Distribuição de Notas", 
           subtitle = paste("Total de avaliações:", nrow(df)),
           x = "Nota", y = "Quantidade") +
      theme_minimal()
    
    print(p1)
    
    # Taxa de aprovação por matéria
    p2 <- df %>%
      group_by(mat_nome) %>%
      summarise(
        taxa_aprovacao = mean(aprovacao) * 100,
        .groups = 'drop'
      ) %>%
      ggplot(aes(x = reorder(mat_nome, taxa_aprovacao), y = taxa_aprovacao)) +
      geom_col(fill = "darkgreen") +
      coord_flip() +
      labs(title = "Taxa de Aprovação por Matéria", 
           x = "", y = "Taxa de Aprovação (%)") +
      theme_minimal()
    
    print(p2)
    
    # Notas por dificuldade
    p3 <- ggplot(df, aes(x = dificuldade, y = nota, fill = dificuldade)) +
      geom_boxplot() +
      labs(title = "Desempenho por Nível de Dificuldade",
           x = "Dificuldade", y = "Nota") +
      theme_minimal() +
      scale_fill_brewer(palette = "Set2")
    
    print(p3)
    
    # Salvar gráficos (opcional)
    ggsave("distribuicao_notas.png", p1, width = 8, height = 6)
    ggsave("aprovacao_materia.png", p2, width = 8, height = 6)
    ggsave("desempenho_dificuldade.png", p3, width = 8, height = 6)
    
  }, error = function(e) {
    cat("Erro ao processar os dados:", e$message, "\n")
  })
  
} else {
  cat("Erro na requisição:", http_status(response)$message, "\n")
  cat("Código:", status_code(response), "\n")
}

