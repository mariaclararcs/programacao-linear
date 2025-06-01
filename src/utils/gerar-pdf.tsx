import { jsPDF } from 'jspdf'

type ResultadoMetodo = {
  metodo: string
  solucao: number[]
  custo: number
  iteracoes: number
  tempoExecucao: number
}

export const gerarRelatorioPDF = (resultados: ResultadoMetodo[], tamanhoProblema: number | null) => {
  const doc = new jsPDF()
  
  // Configurações do documento
  const margem = 15
  let posicaoVertical = 20
  const espacamento = 10

  // Cabeçalho
  doc.setFontSize(18)
  doc.setTextColor(40)
  doc.text('Relatório de Métodos de Otimização', margem, posicaoVertical)
  posicaoVertical += espacamento * 2

  doc.setFontSize(12)
  doc.text(`Problema com ${tamanhoProblema} nós`, margem, posicaoVertical)
  posicaoVertical += espacamento * 2

  // Resultados de cada método
  doc.setFontSize(14)
  doc.setTextColor(60, 60, 60)

  resultados.forEach((resultado) => {
    if (posicaoVertical > 250) {
      doc.addPage()
      posicaoVertical = 20
    }

    doc.text(`Método: ${resultado.metodo}`, margem, posicaoVertical)
    posicaoVertical += espacamento

    doc.setFontSize(12)
    doc.text(`Solução: ${resultado.solucao.join(' , ')} , ${resultado.solucao[0]}`, margem + 5, posicaoVertical)
    posicaoVertical += espacamento

    doc.text(`Custo total: ${resultado.custo.toFixed(2)}`, margem + 5, posicaoVertical)
    posicaoVertical += espacamento

    doc.text(`Iterações: ${resultado.iteracoes}`, margem + 5, posicaoVertical)
    posicaoVertical += espacamento

    doc.text(`Tempo de execução: ${resultado.tempoExecucao.toFixed(2)} ms`, margem + 5, posicaoVertical)
    posicaoVertical += espacamento * 2

    // Linha divisória
    doc.setDrawColor(200)
    doc.line(margem, posicaoVertical, 200 - margem, posicaoVertical)
    posicaoVertical += espacamento * 1.5
  })

  // Data e hora no rodapé
  const dataAtual = new Date().toLocaleString()
  doc.setFontSize(10)
  doc.setTextColor(150)
  doc.text(`Relatório gerado em: ${dataAtual}`, margem, 290)

  // Salvar o PDF
  doc.save(`relatorio-otimizacao-${Date.now()}.pdf`)
}