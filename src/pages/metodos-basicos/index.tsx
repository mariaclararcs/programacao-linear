import React, { useState } from 'react'
import VisualizacaoGrafo from '@/components/visualizacao-grafo'
import { saveAs } from 'file-saver'

export default function MetodosBasicos() {
  const [inputValue, setInputValue] = useState<string>('5')
  const [tamanhoProblemaAtual, setTamanhoProblemaAtual] = useState<number | null>(null)
  const [resultados, setResultados] = useState<string | null>(null)
  const [grafoGerado, setGrafoGerado] = useState<boolean>(false)
  const [conexoes, setConexoes] = useState<number[][]>([])
  const [shouldSaveGraph, setShouldSaveGraph] = useState(false)

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    if (value === '' || /^[0-9\b]+$/.test(value)) {
      setInputValue(value)
      if (grafoGerado) {
        setGrafoGerado(false)
        setTamanhoProblemaAtual(null)
      }
    }
  }

  const handleGerarProblema = () => {
    const finalValue = Math.min(20, Math.max(2, Number(inputValue) || 5))
    setTamanhoProblemaAtual(finalValue)
    setResultados(`Problema gerado com ${finalValue} nós`)
    setGrafoGerado(true)
    setShouldSaveGraph(true) // Indica que queremos salvar o próximo grafo gerado
  }

  const handleGraphGenerated = (connections: number[][]) => {
    setConexoes(connections)
    if (shouldSaveGraph) {
      saveGraphToFile(connections)
      setShouldSaveGraph(false) // Reseta o flag após salvar
    }
  }

  const saveGraphToFile = async (connections: number[][]) => {
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
        }),
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
                  value={inputValue}
                  onChange={handleInputChange}
                  onBlur={() => {
                    // Corrige se o usuário sair com valor inválido
                    let correctedValue = Number(inputValue)
                    if (isNaN(correctedValue) || correctedValue < 2) correctedValue = 2
                    if (correctedValue > 20) correctedValue = 20
                    setInputValue(correctedValue.toString())
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
                disabled
                className="px-3 py-2 text-gray-700 cursor-not-allowed border rounded"
              >
                <option>Selecione um método (desabilitado)</option>
              </select>
              <button 
                disabled
                className="px-4 py-2 bg-gray-200 text-gray-500 rounded cursor-not-allowed"
              >
                Executar Método (desabilitado)
              </button>
            </div>
          </div>
          
          {/* Área de Visualização*/}
          <div className="hidden md:flex flex-col items-center justify-center p-6 bg-white rounded-md border border-gray-300 w-2/3 min-h-screen">
            {grafoGerado && tamanhoProblemaAtual ? (
              <div className="w-full h-full">
                <VisualizacaoGrafo 
                  nodeCount={tamanhoProblemaAtual} 
                  onGraphGenerated={handleGraphGenerated}
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