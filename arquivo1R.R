# dashboard_interativo.R
# Dashboard Shiny para Análise Educacional

# Instalação de pacotes (descomente se necessário)
#install.packages(c("shiny", "ggplot2", "dplyr"))

library(shiny)
library(ggplot2)
library(dplyr)

# Interface do usuário
ui <- fluidPage(
  titlePanel("📊 Dashboard de Análise Educacional"),
  
  sidebarLayout(
    sidebarPanel(
      width = 3,
      selectInput("variavel", "Selecione a Variável para Análise:",
                  choices = c("Gênero" = "genero",
                              "Dificuldade" = "dificuldade",
                              "Módulo" = "modulo",
                              "Categoria" = "categoria",
                              "Professor" = "pro_nome"),
                  selected = "dificuldade"),
      
      radioButtons("tipo_grafico", "Tipo de Visualização:",
                   choices = c("Boxplot" = "boxplot",
                               "Barras" = "bar",
                               "Violino" = "violin"),
                   selected = "boxplot"),
      
      dateRangeInput("datas", "Filtrar por Período:",
                     start = min(as.Date(df$res_data)),
                     end = max(as.Date(df$res_data))),
      
      sliderInput("nota_range", "Filtrar por Intervalo de Notas:",
                  min = 0, max = 100, value = c(0, 100)),
      
      downloadButton("download_data", "Baixar Dados Filtrados")
    ),
    
    mainPanel(
      width = 9,
      tabsetPanel(
        tabPanel("Gráfico Principal", plotOutput("plot", height = "600px")),
        tabPanel("Resumo Estatístico", verbatimTextOutput("resumo")),
        tabPanel("Tabela de Dados", dataTableOutput("tabela"))
      )
    )
  )
)

# Lógica do servidor
server <- function(input, output) {
  
  # Dados filtrados reativos
  dados_filtrados <- reactive({
    df %>%
      filter(as.Date(res_data) >= input$datas[1],
             as.Date(res_data) <= input$datas[2],
             nota >= input$nota_range[1],
             nota <= input$nota_range[2])
  })
  
  # Gráfico principal
  output$plot <- renderPlot({
    dados <- dados_filtrados()
    
    if (input$tipo_grafico == "boxplot") {
      ggplot(dados, aes_string(x = input$variavel, y = "nota", fill = input$variavel)) +
        geom_boxplot() +
        labs(title = paste("Distribuição de Notas por", names(choices)[choices == input$variavel]),
             y = "Nota") +
        theme_minimal() +
        theme(axis.text.x = element_text(angle = 45, hjust = 1))
      
    } else if (input$tipo_grafico == "bar") {
      dados %>%
        group_by_at(input$variavel) %>%
        summarise(media = mean(nota, na.rm = TRUE)) %>%
        ggplot(aes_string(x = input$variavel, y = "media", fill = input$variavel)) +
        geom_col() +
        labs(title = paste("Média de Notas por", names(choices)[choices == input$variavel]),
             y = "Média de Notas") +
        theme_minimal() +
        theme(axis.text.x = element_text(angle = 45, hjust = 1))
      
    } else if (input$tipo_grafico == "violin") {
      ggplot(dados, aes_string(x = input$variavel, y = "nota", fill = input$variavel)) +
        geom_violin(trim = FALSE) +
        geom_boxplot(width = 0.1, fill = "white") +
        labs(title = paste("Distribuição de Notas por", names(choices)[choices == input$variavel]),
             y = "Nota") +
        theme_minimal() +
        theme(axis.text.x = element_text(angle = 45, hjust = 1))
    }
  })
  
  # Resumo estatístico
  output$resumo <- renderPrint({
    dados <- dados_filtrados()
    cat("Resumo Estatístico para", names(choices)[choices == input$variavel], "\n\n")
    print(summary(dados$nota))
    cat("\n\nContagem por categoria:\n")
    print(table(dados[[input$variavel]]))
  })
  
  # Tabela de dados
  output$tabela <- renderDataTable({
    dados_filtrados() %>%
      select(alu_nome, mat_nome, nota, aprovacao, dificuldade, res_data)
  }, options = list(pageLength = 10))
  
  # Download de dados
  output$download_data <- downloadHandler(
    filename = function() {
      paste("dados_educacionais-", Sys.Date(), ".csv", sep = "")
    },
    content = function(file) {
      write.csv(dados_filtrados(), file, row.names = FALSE)
    }
  )
}

# Configurações auxiliares
choices <- c("Gênero" = "genero",
             "Dificuldade" = "dificuldade",
             "Módulo" = "modulo",
             "Categoria" = "categoria",
             "Professor" = "pro_nome")

# Carregar dados (substitua pela sua fonte real)
# df <- ... seu código para carregar dados ...

# Executar aplicação
shinyApp(ui = ui, server = server)