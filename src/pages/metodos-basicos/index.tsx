import React, { useState } from 'react'
import VisualizacaoGrafo from '@/components/visualizacao-grafo'
import { subidaEncosta } from '@/components/metodos-otimizacao/subida-encosta'
import { subidaEncostaAlterada } from '@/components/metodos-otimizacao/subida-encosta-alterada'
import { temperaSimulada } from '@/components/metodos-otimizacao/tempera-simulada'

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
  const [deveSalvarGrafo, setDeveSalvarGrafo] = useState(false)
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
    const finalValue = Math.min(20, Math.max(2, Number(valorInput) || 5))
    setTamanhoProblemaAtual(finalValue)
    setResultados(`Problema gerado com ${finalValue} nós`)
    setGrafoGerado(true)
    setDeveSalvarGrafo(true)
    setResultadosMetodos([])
  };

  const handleGrafoGerado = (connections: number[][]) => {
    setConexoes(connections)
    if (deveSalvarGrafo) {
      salvarGrafoArquivo(connections)
      setDeveSalvarGrafo(false)
    }
  }

  const salvarGrafoArquivo = async (connections: number[][]) => {
    if (!tamanhoProblemaAtual) return
    
    try {
      const response = await fetch('/api/save-graph', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          nodeCount: tamanhoProblemaAtual,
          connections
        })
      })
      
      const data = await response.json()
      if (response.ok) {
        console.log('Arquivo salvo com sucesso em:', data.path)
      }
    } catch (error) {
      console.error('Erro ao salvar arquivo:', error)
      setResultados(prev => `${prev}\nErro ao salvar arquivo`)
    }
  }

  // Funções auxiliares
  const embaralharArray = (array: any[]) => {
    for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]]
    }
    return array
  }

  const handleExecutarMetodo = async () => {
    if (!metodoSelecionado || !grafoGerado || !tamanhoProblemaAtual || conexoes.length === 0) return;
    
    setExecutando(true);
    setResultados(`Executando ${metodoSelecionado}...`);
    
    let resultado: ResultadoMetodo;
    
    try {
      // Gera estado inicial aleatório
      const estadoInicial = Array(tamanhoProblemaAtual).fill(0).map((_, i) => i);
      const estadoEmbaralhado = embaralharArray([...estadoInicial]);

    switch (metodoSelecionado) {
        case 'Subida de Encosta':
          const resultadoSE = await subidaEncosta(conexoes, estadoInicial)
          resultado = {
            metodo: 'Subida de Encosta',
            ...resultadoSE
          }
          break
        case 'Subida de Encosta Alterada':
          const resultadoSEA = await subidaEncostaAlterada(
            conexoes, 
            estadoEmbaralhado
          )
          
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
      const errorMessage = error instanceof Error ? error.message : 'Ocorreu um erro desconhecido'
      setResultados(`Erro ao executar ${metodoSelecionado}: ${errorMessage}`)
    } finally {
      setExecutando(false)
    }
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
                    let correctedValue = Number(valorInput);
                    if (isNaN(correctedValue) || correctedValue < 2) correctedValue = 2;
                    if (correctedValue > 20) correctedValue = 20;
                    setValorInput(correctedValue.toString());
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
            
            {/* Área de Resultados */}
            {resultados && (
              <div>
                <label className="text-blue-600">{resultados}</label>
              </div>
            )}
            
            <div className="flex flex-col gap-4">
              <select
                value={metodoSelecionado}
                onChange={(e) => setMetodoSelecionado(e.target.value)}
                className="px-3 py-2 cursor-pointer border rounded"
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
            </div>

            {/* Resultados dos Métodos */}
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
                      <p>Tempo de execução: {resultado.tempoExecucao.toFixed(2)} ms</p>
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