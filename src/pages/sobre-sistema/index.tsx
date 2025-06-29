export default function SobreSistema() {
    return (
        <div className="min-h-screen flex flex-col bg-gray-50">
            <main className="flex-grow container mx-auto px-4 py-8">
                <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-md p-8">
                    <h1 className="text-3xl font-bold text-center text-blue-600 mb-8">Sobre o Sistema de Otimização</h1>
                    
                    <section className="mb-10">
                        <h2 className="text-2xl font-semibold mb-4 text-gray-800 border-b pb-2">Visão Geral</h2>
                        <p className="text-gray-700 mb-4">
                            Este sistema foi desenvolvido para resolver problemas de otimização em grafos, utilizando diferentes abordagens computacionais para encontrar soluções eficientes.
                        </p>
                        <p className="text-gray-700">
                            A aplicação combina métodos clássicos de busca local com algoritmos genéticos para oferecer diferentes perspectivas na solução de problemas complexos de roteamento.
                        </p>
                    </section>

                    <section className="mb-10">
                        <h2 className="text-2xl font-semibold mb-4 text-gray-800 border-b pb-2">Módulos Principais</h2>
                        
                        <div className="mb-6">
                            <h3 className="text-xl font-medium text-blue-600 mb-2">1. Métodos Básicos</h3>
                            <p className="text-gray-700 mb-3">
                                Implementação de algoritmos clássicos de busca local para otimização:
                            </p>
                            <ul className="list-disc pl-6 space-y-2 text-gray-700">
                                <li>
                                    <strong>Subida de Encosta (Hill Climbing):</strong> Algoritmo de busca local que move iterativamente para soluções vizinhas melhores
                                </li>
                                <li>
                                    <strong>Subida de Encosta Alterada:</strong> Versão modificada que permite escapar de máximos locais ocasionalmente
                                </li>
                                <li>
                                    <strong>Têmpera Simulada (Simulated Annealing):</strong> Inspirado no processo metalúrgico, aceita soluções piores no início para evitar mínimos locais
                                </li>
                            </ul>
                        </div>

                        <div className="mb-6">
                            <h3 className="text-xl font-medium text-blue-600 mb-2">2. Algoritmos Genéticos</h3>
                            <p className="text-gray-700 mb-3">
                                Solução do Problema do Caixeiro Viajante (TSP) usando técnicas evolucionárias:
                            </p>
                            <ul className="list-disc pl-6 space-y-2 text-gray-700">
                                <li>
                                    <strong>População Inicial:</strong> Geração de rotas aleatórias
                                </li>
                                <li>
                                    <strong>Operadores Genéticos:</strong> Cruzamento (recombinação) e mutação para explorar o espaço de busca
                                </li>
                                <li>
                                    <strong>Seleção Natural:</strong> Manutenção das melhores soluções através de gerações
                                </li>
                                <li>
                                    <strong>Critérios de Parada:</strong> Número de gerações ou convergência da solução
                                </li>
                            </ul>
                        </div>
                    </section>

                    <section className="mb-10">
                        <h2 className="text-2xl font-semibold mb-4 text-gray-800 border-b pb-2">Tecnologias Utilizadas</h2>
                        <div className="flex flex-row justify-center w-full gap-4">
                            <div className="bg-gray-100 w-full p-4 rounded-lg">
                                <h4 className="font-medium text-gray-800">Frontend</h4>
                                <ul className="mt-2 text-gray-700">
                                    <li>React.js</li>
                                    <li>TypeScript</li>
                                    <li>Tailwind CSS</li>
                                    <li>Next.js</li>
                                </ul>
                            </div>
                            <div className="bg-gray-100 w-full p-4 rounded-lg">
                                <h4 className="font-medium text-gray-800">Visualização</h4>
                                <ul className="mt-2 text-gray-700">
                                    <li>React Flow</li>
                                    <li>Graph Visualization</li>
                                    <li>PDFKit</li>
                                </ul>
                            </div>
                        </div>
                    </section>
                </div>
            </main>

            <footer className="w-full py-6 bg-gray-800 text-white">
                <div className="container mx-auto px-4 text-center">
                    <div className="mb-2">
                        <h6 className="font-semibold text-lg">Desenvolvido por:</h6>
                        <p className="text-gray-300">Maria Clara Rocha</p>
                        <p className="text-gray-400">Estudante de Análise e Desenvolvimento de Sistemas</p>
                    </div>
                    <div className="text-sm text-gray-400">
                        <p>Projeto Acadêmico - Programação Linear e Aplicações</p>
                        <p>© {new Date().getFullYear()}</p>
                    </div>
                </div>
            </footer>
        </div>
    )
}