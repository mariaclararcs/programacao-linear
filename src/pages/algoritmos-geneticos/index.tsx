import React, { useState } from "react";
import VisualizacaoGrafo from "@/components/visualizacao-grafo";
import CaixeiroViajante from "@/components/algoritmo-genetico/caixeiro-viajante";
import { GeneticAlgorithmResult } from "@/types/algoritmo-genetico";

interface ProblemaConfig {
  tamanhoProblema: number;
  tamanhoPopulacao: number;
  taxaCruzamento: number;
  taxaMutacao: number;
  numeroGeracoes: number;
  intervaloGeracao: number;
  conexoes: number[][];
}

export default function AlgoritmosGeneticos() {
    const [valorInput, setValorInput] = useState<string>('5');
    const [tamanhoPopulacao, setTamanhoPopulacao] = useState<string>('30');
    const [taxaCruzamento, setTaxaCruzamento] = useState<string>('0.9');
    const [taxaMutacao, setTaxaMutacao] = useState<string>('0.1');
    const [numeroGeracoes, setNumeroGeracoes] = useState<string>('100');
    const [intervaloGeracao, setIntervaloGeracao] = useState<string>('20');
    const [resultados, setResultados] = useState<string | null>(null);
    const [grafoGerado, setGrafoGerado] = useState<boolean>(false);
    const [conexoes, setConexoes] = useState<number[][]>([]);
    const [problemaConfig, setProblemaConfig] = useState<ProblemaConfig | null>(null);
    const [executando, setExecutando] = useState<boolean>(false);
    const [resultado, setResultado] = useState<GeneticAlgorithmResult | null>(null);

    const MIN_DISTANCE = 10;
    const MAX_DISTANCE = 100;

    const handleMudancaInput = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        if (value === '' || /^[0-9\b]+$/.test(value)) {
            setValorInput(value);
            if (grafoGerado) {
                setGrafoGerado(false);
            }
        }
    };

    const handleParametroNumerico = (value: string, setter: React.Dispatch<React.SetStateAction<string>>, isFloat = false) => {
        if (value === '' || (isFloat ? /^[0-9]*\.?[0-9]*$/.test(value) : /^[0-9\b]+$/.test(value))) {
            setter(value);
            if (grafoGerado) {
                setGrafoGerado(false);
            }
        }
    };

    const handleGerarGrafo = () => {
        const tamanhoProblema = Math.min(20, Math.max(2, Number(valorInput) || 5))
        setValorInput(tamanhoProblema.toString());
        
        const config: ProblemaConfig = {
            tamanhoProblema,
            tamanhoPopulacao: 0,
            taxaCruzamento: 0,
            taxaMutacao: 0,
            numeroGeracoes: 0,
            intervaloGeracao: 0,
            conexoes: []
        };

        setProblemaConfig(config);
        setGrafoGerado(true);
        setResultados(`Grafo gerado com ${tamanhoProblema} nós`);
        setResultado(null);
    };

    const handleGrafoGerado = (conexoesGeradas: number[][]) => {
        const n = conexoesGeradas.length;
        const matrizCustos = Array.from({ length: n }, (_, i) => 
            Array.from({ length: n }, (_, j) => {
                if (i === j) return 0;
                return Math.floor(Math.random() * (MAX_DISTANCE - MIN_DISTANCE + 1)) + MIN_DISTANCE;
            })
        );

        for (let i = 0; i < n; i++) {
            for (let j = i + 1; j < n; j++) {
                matrizCustos[j][i] = matrizCustos[i][j];
            }
        }

        setConexoes(matrizCustos);
        if (problemaConfig) {
            setProblemaConfig({
                ...problemaConfig,
                conexoes: matrizCustos
            });
        }
    };

    const handleSalvarConfiguracoes = () => {
        if (!problemaConfig) return;

        const popSize = Math.max(10, Number(tamanhoPopulacao) || 30)
        const crossoverRate = Math.min(1, Math.max(0, Number(taxaCruzamento) || 0.9))
        const mutationRate = Math.min(1, Math.max(0, Number(taxaMutacao) || 0.1))
        const generations = Math.max(1, Number(numeroGeracoes) || 100)
        const generationInterval = Math.max(1, Number(intervaloGeracao) || 20)

        const configAtualizado = {
            ...problemaConfig,
            tamanhoPopulacao: popSize,
            taxaCruzamento: crossoverRate,
            taxaMutacao: mutationRate,
            numeroGeracoes: generations,
            intervaloGeracao: generationInterval
        };

        setProblemaConfig(configAtualizado);
        setResultados(`Configurações do algoritmo salvas:
        - Tamanho da população: ${popSize}
        - Taxa de cruzamento: ${(crossoverRate * 100).toFixed(0)}%
        - Taxa de mutação: ${(mutationRate * 100).toFixed(0)}%
        - Número de gerações: ${generations}
        - Intervalo: ${generationInterval}`);
    };

    const handleAnalisarAG = async () => {
        if (!problemaConfig || !grafoGerado || problemaConfig.conexoes.length === 0) {
            setResultados('Erro: Configure o grafo e os parâmetros primeiro');
            return;
        }

        setExecutando(true);
        setResultados('Executando análise com Algoritmo Genético...');
        
        try {
            const resultado = await CaixeiroViajante.executar(
                problemaConfig.conexoes,
                problemaConfig.tamanhoPopulacao,
                problemaConfig.numeroGeracoes,
                problemaConfig.taxaCruzamento,
                problemaConfig.taxaMutacao,
                problemaConfig.intervaloGeracao,
                (progress) => {
                    setResultados(`Processando... Geração ${progress.generation}, Melhor Custo: ${progress.bestCost.toFixed(2)}`);
                }
            );
            
            setResultado(resultado);
            setResultados(`Análise concluída!
            Melhor custo encontrado: ${resultado.finalCost.toFixed(2)}
            Custo inicial: ${resultado.initialCost.toFixed(2)}`);
        } catch (error) {
            console.error(error);
            setResultados('Erro durante a execução do Algoritmo Genético');
        } finally {
            setExecutando(false);
        }
    };

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

                        <button 
                            onClick={handleGerarGrafo}
                            className="px-4 py-2"
                            disabled={executando}
                        >
                            Gerar Problema
                        </button>

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
                            onClick={handleSalvarConfiguracoes}
                            className="px-4 py-2"
                            disabled={!grafoGerado || executando}
                        >
                            Executar AG
                        </button>

                        {resultados && (
                            <div className="p-3 bg-gray-50 rounded border border-gray-200">
                                <p className="whitespace-pre-line text-gray-800">{resultados}</p>
                            </div>
                        )}
                        
                        <button
                            onClick={handleAnalisarAG}
                            className="px-4 py-2"
                            disabled={!grafoGerado || !problemaConfig || problemaConfig.tamanhoPopulacao === 0 || executando}
                        >
                            {executando ? 'Analisando...' : 'Analisar AG'}
                        </button>

                        {resultado && (
                            <div className="p-4 border rounded bg-white shadow">
                                <h5 className="font-semibold text-lg mb-2">Resultado da Análise</h5>
                                <div className="grid grid-cols-1 gap-2">
                                    <div>
                                        <span className="font-medium">Solução Inicial:</span>
                                        <p className="bg-gray-50 p-2 rounded">
                                            {resultado.initialSolution.map(n => n + 1).join(' → ')} → {resultado.initialSolution[0] + 1}
                                        </p>
                                    </div>
                                    <div>
                                        <span className="font-medium">Melhor Solução:</span>
                                        <p className="bg-gray-50 p-2 rounded">
                                            {resultado.finalSolution.map(n => n + 1).join(' → ')} → {resultado.finalSolution[0] + 1}
                                        </p>
                                    </div>
                                    <div className="grid grid-cols-2 gap-2">
                                        <div>
                                            <span className="font-medium">Custo Inicial:</span>
                                            <p>{resultado.initialCost.toFixed(2)}</p>
                                        </div>
                                        <div>
                                            <span className="font-medium">Melhor Custo:</span>
                                            <p>{resultado.finalCost.toFixed(2)}</p>
                                        </div>
                                    </div>
                                    <div className="bg-blue-50 p-2 rounded text-center">
                                        <span className="font-medium">Melhoria:</span>
                                        <p className="text-blue-600 font-bold">
                                            {((resultado.initialCost - resultado.finalCost) / resultado.initialCost * 100).toFixed(2)}%
                                        </p>
                                    </div>
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
                            <div className="text-center p-8">
                                <p className="text-gray-500 text-lg mb-4">Nenhum grafo gerado</p>
                                <p className="text-gray-400">Clique em Gerar Problema para criar um novo grafo</p>
                            </div>
                        )}
                    </div>
                </div>
            </main>
        </div>
    )
}