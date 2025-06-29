import React, { useState } from "react"
import VisualizacaoGrafo from "@/components/visualizacao-grafo"
import CaixeiroViajante from "@/components/algoritmo-genetico/caixeiro-viajante"
import { GeneticAlgorithmResult } from "@/types/algoritmo-genetico"

interface ProblemaConfig {
  tamanhoProblema: number
  tamanhoPopulacao: number
  taxaCruzamento: number
  taxaMutacao: number
  numeroGeracoes: number
  intervaloGeracao: number
  conexoes: number[][]
}

export default function AlgoritmosGeneticos() {
    const [valorInput, setValorInput] = useState<string>('5')
    const [tamanhoPopulacao, setTamanhoPopulacao] = useState<string>('30')    // TP = 30
    const [taxaCruzamento, setTaxaCruzamento] = useState<string>('0.9')       // TC = 0.9
    const [taxaMutacao, setTaxaMutacao] = useState<string>('0.1')             // TM = 0.1
    const [numeroGeracoes, setNumeroGeracoes] = useState<string>('100')       // NG = 100
    const [intervaloGeracao, setIntervaloGeracao] = useState<string>('20')    // IG = 0.2
    const [resultados, setResultados] = useState<string | null>(null)
    const [grafoGerado, setGrafoGerado] = useState<boolean>(false)
    const [conexoes, setConexoes] = useState<number[][]>([])
    const [problemaConfig, setProblemaConfig] = useState<ProblemaConfig | null>(null)
    const [executando, setExecutando] = useState<boolean>(false)
    const [resultado, setResultado] = useState<GeneticAlgorithmResult | null>(null)

    const MIN_DISTANCE = 10  // Valor mínimo para conexões
    const MAX_DISTANCE = 100 // Valor máximo para conexões

    const handleMudancaInput = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value
        if (value === '' || /^[0-9\b]+$/.test(value)) {
            setValorInput(value)
            if (grafoGerado) {
                setGrafoGerado(false)
            }
        }
    }

    const handleParametroNumerico = (value: string, setter: React.Dispatch<React.SetStateAction<string>>, isFloat = false) => {
        if (value === '' || (isFloat ? /^[0-9]*\.?[0-9]*$/.test(value) : /^[0-9\b]+$/.test(value))) {
            setter(value)
            if (grafoGerado) {
                setGrafoGerado(false)
            }
        }
    }

    const handleGerarProblema = () => {
        // Validação e conversão dos valores
        const tamanhoProblema = Math.min(20, Math.max(2, Number(valorInput) || 5))
        const popSize = Math.max(10, Number(tamanhoPopulacao) || 30)          // TP padrão 30
        const crossoverRate = Math.min(1, Math.max(0, Number(taxaCruzamento) || 0.9))  // TC padrão 0.9
        const mutationRate = Math.min(1, Math.max(0, Number(taxaMutacao) || 0.1))      // TM padrão 0.1
        const generations = Math.max(1, Number(numeroGeracoes) || 100)        // NG padrão 100
        const generationInterval = Math.max(1, Number(intervaloGeracao) || 20) // IG padrão 20

        // Atualiza os campos com os valores validados
        setValorInput(tamanhoProblema.toString())
        setTamanhoPopulacao(popSize.toString())
        setTaxaCruzamento(crossoverRate.toString())
        setTaxaMutacao(mutationRate.toString())
        setNumeroGeracoes(generations.toString())
        setIntervaloGeracao(generationInterval.toString())

        // Configura o problema completo
        const config: ProblemaConfig = {
            tamanhoProblema,
            tamanhoPopulacao: popSize,
            taxaCruzamento: crossoverRate,
            taxaMutacao: mutationRate,
            numeroGeracoes: generations,
            intervaloGeracao: generationInterval,
            conexoes: []
        }

        setProblemaConfig(config)
        setGrafoGerado(true)
        setResultados(`Problema gerado com:
        - ${tamanhoProblema} nós
        - População: ${popSize}
        - Cruzamento: ${(crossoverRate * 100).toFixed(0)}%
        - Mutação: ${(mutationRate * 100).toFixed(0)}%
        - Gerações: ${generations}
        - Intervalo: ${generationInterval}`)
    }

    const handleGrafoGerado = (conexoesGeradas: number[][]) => {
        const n = conexoesGeradas.length
        const matrizCustos = Array.from({ length: n }, (_, i) => 
            Array.from({ length: n }, (_, j) => {
                if (i === j) return 0 // Diagonal principal = 0
                // Gera valores aleatórios entre MIN_DISTANCE e MAX_DISTANCE
                return Math.floor(Math.random() * (MAX_DISTANCE - MIN_DISTANCE + 1)) + MIN_DISTANCE
            })
        )

        // Garante simetria (A→B = B→A)
        for (let i = 0; i < n; i++) {
            for (let j = i + 1; j < n; j++) {
                matrizCustos[j][i] = matrizCustos[i][j]
            }
        }

        setConexoes(matrizCustos)
        if (problemaConfig) {
            setProblemaConfig({
                ...problemaConfig,
                conexoes: matrizCustos
            })
        }
    }

    const handleExecutarAlgoritmo = async () => {
        if (!problemaConfig || !grafoGerado) return
        
        // Validação adicional
        if (problemaConfig.conexoes.some(row => row.some(val => typeof val !== 'number' || isNaN(val)))) {
            setResultados('Erro: Matriz de custos inválida')
            return
        }

        setExecutando(true)
        setResultados('Executando algoritmo genético...')
        
        try {
            const resultado = await CaixeiroViajante.executar(
                problemaConfig.conexoes,
                problemaConfig.tamanhoPopulacao,
                problemaConfig.numeroGeracoes,
                problemaConfig.taxaCruzamento,
                problemaConfig.taxaMutacao,
                problemaConfig.intervaloGeracao,
                (progress) => {
                    setResultados(`Executando... Geração ${progress.generation}, Melhor Custo: ${progress.bestCost.toFixed(2)}`)
                }
            )
            
            setResultado(resultado)
            setResultados(`Algoritmo concluído! Melhor custo encontrado: ${resultado.finalCost.toFixed(2)} (inicial: ${resultado.initialCost.toFixed(2)})`)
        } catch (error) {
            console.error(error)
            setResultados('Erro ao executar o algoritmo genético')
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
                        <h3 className="flex flex-col text-center">
                            Algoritmos Genéticos
                            <span className="font-light"> Problema Caixeiro Viajante</span>
                        </h3>
                        
                        {/* Configuração do Problema */}
                        <div className="space-y-4">
                            <h4 className="font-semibold">Configuração do Problema</h4>
                            <div className="flex flex-row gap-2 items-center">
                                <label htmlFor="tamanhoProblema" className="font-medium w-48">
                                    Tamanho do Problema (nós):
                                </label>
                                <input
                                    id="tamanhoProblema"
                                    type="text"
                                    inputMode="numeric"
                                    min="2"
                                    max="20"
                                    value={valorInput}
                                    onChange={handleMudancaInput}
                                    className="px-3 py-2 w-28 border rounded"
                                />
                            </div>
                        </div>

                        {/* Configuração do Algoritmo Genético */}
                        <div className="space-y-4">
                            <h4 className="font-semibold">Configuração do Algoritmo</h4>
                            
                            <div className="flex flex-row gap-2 items-center">
                                <label htmlFor="tamanhoPopulacao" className="font-medium w-48">
                                    Tamanho da População:
                                </label>
                                <input
                                    id="tamanhoPopulacao"
                                    type="text"
                                    inputMode="numeric"
                                    min="10"
                                    value={tamanhoPopulacao}
                                    onChange={(e) => handleParametroNumerico(e.target.value, setTamanhoPopulacao)}
                                    className="px-3 py-2 w-28 border rounded"
                                />
                            </div>
                            
                            <div className="flex flex-row gap-2 items-center">
                                <label htmlFor="taxaCruzamento" className="font-medium w-48">
                                    Taxa de Cruzamento (0-1):
                                </label>
                                <input
                                    id="taxaCruzamento"
                                    type="text"
                                    inputMode="decimal"
                                    min="0"
                                    max="1"
                                    step="0.1"
                                    value={taxaCruzamento}
                                    onChange={(e) => handleParametroNumerico(e.target.value, setTaxaCruzamento, true)}
                                    className="px-3 py-2 w-28 border rounded"
                                />
                            </div>
                            
                            <div className="flex flex-row gap-2 items-center">
                                <label htmlFor="taxaMutacao" className="font-medium w-48">
                                    Taxa de Mutação (0-1):
                                </label>
                                <input
                                    id="taxaMutacao"
                                    type="text"
                                    inputMode="decimal"
                                    min="0"
                                    max="1"
                                    step="0.01"
                                    value={taxaMutacao}
                                    onChange={(e) => handleParametroNumerico(e.target.value, setTaxaMutacao, true)}
                                    className="px-3 py-2 w-28 border rounded"
                                />
                            </div>
                            
                            <div className="flex flex-row gap-2 items-center">
                                <label htmlFor="numeroGeracoes" className="font-medium w-48">
                                    Número de Gerações:
                                </label>
                                <input
                                    id="numeroGeracoes"
                                    type="text"
                                    inputMode="numeric"
                                    min="1"
                                    value={numeroGeracoes}
                                    onChange={(e) => handleParametroNumerico(e.target.value, setNumeroGeracoes)}
                                    className="px-3 py-2 w-28 border rounded"
                                />
                            </div>
                            
                            <div className="flex flex-row gap-2 items-center">
                                <label htmlFor="intervaloGeracao" className="font-medium w-48">
                                    Intervalo de Geração:
                                </label>
                                <input
                                    id="intervaloGeracao"
                                    type="text"
                                    inputMode="numeric"
                                    min="1"
                                    value={intervaloGeracao}
                                    onChange={(e) => handleParametroNumerico(e.target.value, setIntervaloGeracao)}
                                    className="px-3 py-2 w-28 border rounded"
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
                            <div className="text-blue-600 whitespace-pre-line">
                                {resultados}
                            </div>
                        )}
                        
                        <button
                            onClick={handleExecutarAlgoritmo}
                            className="px-4 py-2"
                            disabled={!grafoGerado || !problemaConfig || executando}
                        >
                            {executando ? 'Executando...' : 'Executar Algoritmo Genético'}
                        </button>

                        {resultado && (
                            <div className="p-3 border rounded bg-gray-50">
                                <h5 className="font-semibold">Resultado</h5>
                                <div className="mt-2 text-sm space-y-2">
                                    <p><strong>Matriz de custos:</strong> {problemaConfig?.tamanhoProblema}x{problemaConfig?.tamanhoProblema}</p>
                                    <p><strong>Solução Inicial:</strong> 
                                        {resultado.initialSolution.map(n => n + 1).join(' → ')} → {resultado.initialSolution[0] + 1}
                                    </p>
                                    <p><strong>Custo Inicial:</strong> {isFinite(resultado.initialCost) ? resultado.initialCost.toFixed(2) : 'Inválido'}</p>
                                    <p><strong>Melhor Solução:</strong> 
                                        {resultado.finalSolution.map(n => n + 1).join(' → ')} → {resultado.finalSolution[0] + 1}
                                    </p>
                                    <p><strong>Melhor Custo:</strong> {isFinite(resultado.finalCost) ? resultado.finalCost.toFixed(2) : 'Inválido'}</p>
                                    {isFinite(resultado.initialCost) && isFinite(resultado.finalCost) && (
                                        <p><strong>Melhoria:</strong> {((resultado.initialCost - resultado.finalCost) / resultado.initialCost * 100).toFixed(2)}%</p>
                                    )}
                                </div>
                            </div>
                        )}
                    </div>
                    
                    {/* Área de Visualização*/}
                    <div className="hidden md:flex flex-col items-center justify-center p-6 bg-white rounded-md border border-gray-300 w-2/3 min-h-screen">
                        {grafoGerado && problemaConfig ? (
                            <div className="w-full h-full">
                                <VisualizacaoGrafo 
                                    nodeCount={problemaConfig.tamanhoProblema} 
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