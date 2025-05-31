import React, { useState } from 'react'
import VisualizacaoGrafo from '@/components/visualizacao-grafo'

export default function MetodosBasicos() {
  const [tamanhoProblema, setTamanhoProblema] = useState<number>(5)
  const [tamanhoProblemaAtual, setTamanhoProblemaAtual] = useState<number | null>(null)
  const [resultados, setResultados] = useState<string | null>(null)
  const [grafoGerado, setGrafoGerado] = useState<boolean>(false)

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = Math.min(20, Math.max(2, Number(e.target.value)))
    setTamanhoProblema(value)
    // Resetar o grafo quando o input muda
    if (grafoGerado) {
      setGrafoGerado(false)
      setTamanhoProblemaAtual(null)
    }
  }

  const handleGerarProblema = () => {
    setTamanhoProblemaAtual(tamanhoProblema)
    setResultados(`Problema gerado com ${tamanhoProblema} nós`)
    setGrafoGerado(true)
  }

  return (
    <div className="min-h-screen flex flex-col py-4">
      <main className="flex-grow">
        <div className="flex flex-col md:flex-row gap-8">
          {/* Painel */}
          <div className="flex flex-col gap-6 pl-6 min-w-1/3">
            <h3 className="text-center">Métodos Básicos</h3>
            
            <div className="flex flex-row gap-2">
              <label htmlFor="tamanhoProblema" className="font-medium">
                Tamanho do Problema (número de nós):
              </label>
              <div className="flex gap-2">
                <input
                  id="tamanhoProblema"
                  type="number"
                  min="2"
                  max="20"
                  value={tamanhoProblema}
                  onChange={handleInputChange}
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
                <VisualizacaoGrafo nodeCount={tamanhoProblemaAtual} />
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