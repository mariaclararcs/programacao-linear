export default function SobreSistema() {
    return (
        <div className="min-h-screen flex flex-col">
            <main className="flex-grow">
                <div className="flex flex-col items-center justify-center">
                    <h3 className="text-2xl font-bold">Sobre o Sistema</h3>
                    <div className="flex flex-col items-center px-10 mb-6 text-center max-w-2xl">
                        <h4 className="text-xl font-semibold mb-2">Otimização de Rotas em Grafos</h4>
                        <p className="text-gray-700">
                            Este sistema tem como objetivo utilizar métodos básicos de busca para encontrar o melhor resultado, e posteriormente, algoritmos genéticos para resolver problemas de otimização de rotas em um grafo.
                        </p>
                    </div>

                    <div className="flex flex-col items-center mb-8 max-w-2xl">
                        <h4 className="text-xl font-semibold mb-2">Funcionalidades (em desenvolvimento):</h4>
                        <ul className="list-disc pl-5 text-gray-700">
                            <li>Geração de problemas de roteamento</li>
                            <li>Cálculo de soluções iniciais</li>
                            <li>Avaliação de soluções</li>
                            <li>Implementação de métodos básicos de busca</li>
                        </ul>
                    </div>
                </div>
            </main>

            <footer className="w-full py-4 mt-auto">
                <div className="flex items-center justify-center text-center gap-[8px]">
                    <h6 className="font-semibold">Desenvolvido por:</h6>
                    <p className="text-gray-600">Maria Clara Rocha - Estudante de Análise e Desenvolvimento de Sistemas</p>
                </div>
            </footer>
        </div>
    )
}