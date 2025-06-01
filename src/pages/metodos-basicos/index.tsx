import React, { useState } from 'react'
import VisualizacaoGrafo from '@/components/visualizacao-grafo'
import { subidaEncosta } from '@/components/metodos-otimizacao/subida-encosta'
import { subidaEncostaAlterada } from '@/components/metodos-otimizacao/subida-encosta-alterada'
import { temperaSimulada } from '@/components/metodos-otimizacao/tempera-simulada'
import { gerarRelatorioPDF } from '@/utils/gerar-pdf'

type ResultadoMetodo = {
  metodo: string
  solucao: number[]
  custo: number
  iteracoes: number
  tempoExecucao: number
}

export default function MetodosBasicos() {
  const [valorInput, setValorInput] = useState<string>('5')
  const [tamanhoProblemaAtual, setTamanhoProblemaAtual] = useState<number | null>(null)
  const [resultados, setResultados] = useState<string | null>(null)
  const [grafoGerado, setGrafoGerado] = useState<boolean>(false)
  const [conexoes, setConexoes] = useState<number[][]>([])
  const [metodoSelecionado, setMetodoSelecionado] = useState<string>('')
  const [resultadosMetodos, setResultadosMetodos] = useState<ResultadoMetodo[]>([])
  const [executando, setExecutando] = useState<boolean>(false)

  const handleMudancaInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    if (value === '' || /^[0-9\b]+$/.test(value)) {
      setValorInput(value)
      if (grafoGerado) {
        setGrafoGerado(false)
        setTamanhoProblemaAtual(null)
      }
    }
  }

  const handleGerarProblema = () => {
    const valorNumerico = Number(valorInput) || 5
    const valorFinal = Math.min(20, Math.max(2, valorNumerico))
    setTamanhoProblemaAtual(valorFinal)
    setResultados(`Problema gerado com ${valorFinal} nós`)
    setGrafoGerado(true)
    setResultadosMetodos([])
  }

  const handleGrafoGerado = (conexoesGeradas: number[][]) => {
    setConexoes(conexoesGeradas)
  }

  const embaralharArray = <T,>(array: T[]): T[] => {
    const novoArray = [...array]
    for (let i = novoArray.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1))
      ;[novoArray[i], novoArray[j]] = [novoArray[j], novoArray[i]]
    }
    return novoArray
  }

  const handleExecutarMetodo = async () => {
    if (!metodoSelecionado || !grafoGerado || !tamanhoProblemaAtual || conexoes.length === 0) return
    
    setExecutando(true)
    setResultados(`Executando ${metodoSelecionado}...`)
    
    let resultado: ResultadoMetodo
    
    try {
      const estadoInicial = Array(tamanhoProblemaAtual).fill(0).map((_, i) => i)
      const estadoEmbaralhado = embaralharArray([...estadoInicial])

      switch (metodoSelecionado) {
        case 'Subida de Encosta':
          const resultadoSE = await subidaEncosta(conexoes, estadoInicial)
          resultado = {
            metodo: 'Subida de Encosta',
            solucao: resultadoSE.solucao,
            custo: resultadoSE.custo,
            iteracoes: resultadoSE.iteracoes,
            tempoExecucao: resultadoSE.tempoExecucao
          }
          break
          
        case 'Subida de Encosta Alterada':
          const resultadoSEA = await subidaEncostaAlterada(conexoes, estadoEmbaralhado)
          resultado = {
            metodo: 'Subida de Encosta Alterada',
            solucao: resultadoSEA.solucao,
            custo: resultadoSEA.custo,
            iteracoes: resultadoSEA.iteracoes || 0,
            tempoExecucao: resultadoSEA.tempoExecucao || 0
          }
          break
          
        case 'Têmpera Simulada':
          const resultadoTS = await temperaSimulada(conexoes, estadoInicial)
          resultado = {
            metodo: 'Têmpera Simulada',
            solucao: resultadoTS.solucao,
            custo: resultadoTS.custo,
            iteracoes: resultadoTS.iteracoes,
            tempoExecucao: resultadoTS.tempoExecucao
          }
          break
          
        default:
          throw new Error('Método não implementado')
      }
      
      setResultadosMetodos(prev => [...prev, resultado])
      setResultados(`${metodoSelecionado} concluído com sucesso!`)
    } catch (error) {
      console.error(error)
      const mensagemErro = error instanceof Error ? error.message : 'Ocorreu um erro desconhecido'
      setResultados(`Erro ao executar ${metodoSelecionado}: ${mensagemErro}`)
    } finally {
      setExecutando(false)
    }
  }

  const handleGerarRelatorio = () => {
    if (resultadosMetodos.length === 0 || !tamanhoProblemaAtual) {
      setResultados('Nenhum resultado disponível para gerar relatório')
      return
    }
    gerarRelatorioPDF(resultadosMetodos, tamanhoProblemaAtual)
    setResultados('Relatório gerado com sucesso!')
  }

  return (
    <div className="min-h-screen flex flex-col py-4">
      <main className="flex-grow">
        <div className="flex flex-col md:flex-row gap-8">
          {/* Painel de Controle */}
          <div className="flex flex-col gap-6 pl-6 min-w-1/3">
            <h3 className="text-center">Métodos Básicos</h3>
            
            <div className="flex flex-row gap-2">
              <label htmlFor="tamanhoProblema" className="font-medium">
                Tamanho do Problema (número de nós):
              </label>
              <div className="flex gap-2">
                <input
                  id="tamanhoProblema"
                  type="text"
                  inputMode="numeric"
                  min="2"
                  max="20"
                  value={valorInput}
                  onChange={handleMudancaInput}
                  onBlur={() => {
                    const valorNumerico = Number(valorInput) || 5
                    const valorCorrigido = Math.min(20, Math.max(2, valorNumerico))
                    setValorInput(valorCorrigido.toString())
                  }}
                  className="px-3 py-2 w-20 border rounded"
                />
              </div>
            </div>
            
            <button 
              onClick={handleGerarProblema}
              className="px-4 py-2"
            >
              Gerar Problema
            </button>
            
            {resultados && (
              <div className="text-blue-600">
                {resultados}
              </div>
            )}
            
            <div className="flex flex-col gap-4">
              <select
                value={metodoSelecionado}
                onChange={(e) => setMetodoSelecionado(e.target.value)}
                className="px-3 py-2 border rounded cursor-pointer"
                disabled={!grafoGerado || executando}
              >
                <option value="">Selecione um método</option>
                <option value="Subida de Encosta">Subida de Encosta</option>
                <option value="Subida de Encosta Alterada">Subida de Encosta Alterada</option>
                <option value="Têmpera Simulada">Têmpera Simulada</option>
              </select>
              
              <button 
                onClick={handleExecutarMetodo}
                disabled={!metodoSelecionado || !grafoGerado || executando}
                className={`px-4 py-2 rounded ${
                  !metodoSelecionado || !grafoGerado || executando
                }`}
              >
                {executando ? 'Executando...' : 'Executar Método'}
              </button>

              <button 
                onClick={handleGerarRelatorio}
                disabled={resultadosMetodos.length === 0}
                className={`px-4 py-2 rounded ${
                  resultadosMetodos.length === 0
                }`}
              >
                Gerar Relatório PDF
              </button>
            </div>

            {resultadosMetodos.length > 0 && (
              <div>
                <h4 className="font-bold mb-2">Resultados dos Métodos:</h4>
                <div className="space-y-4">
                  {resultadosMetodos.map((resultado, index) => (
                    <div key={index} className="p-3 border rounded bg-gray-50">
                      <h5 className="font-semibold">{resultado.metodo}</h5>
                      <p>Solução: {resultado.solucao.join(' → ')} → {resultado.solucao[0]}</p>
                      <p>Custo total: {resultado.custo.toFixed(2)}</p>
                      <p>Iterações: {resultado.iteracoes}</p>
                      <p>Tempo: {resultado.tempoExecucao.toFixed(2)} ms</p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
          
          {/* Área de Visualização*/}
          <div className="hidden md:flex flex-col items-center justify-center p-6 bg-white rounded-md border border-gray-300 w-2/3 min-h-screen">
            {grafoGerado && tamanhoProblemaAtual ? (
              <div className="w-full h-full">
                <VisualizacaoGrafo 
                  nodeCount={tamanhoProblemaAtual} 
                  onGraphGenerated={handleGrafoGerado}
                />
              </div>
            ) : (
              <p className="text-gray-500">Clique em Gerar Problema para visualizar o grafo</p>
            )}
          </div>
        </div>
      </main>
    </div>
  )
}