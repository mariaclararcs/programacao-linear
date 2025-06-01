export interface ResultadoTemperaSimulada {
  solucao: number[];
  custo: number;
  iteracoes: number;
  tempoExecucao: number;
  temperaturaFinal: number;
}

export async function temperaSimulada(
  conexoes: number[][],
  estadoInicial: number[],
  temperaturaInicial = 1000,
  fatorResfriamento = 0.95,
  temperaturaMinima = 1
): Promise<ResultadoTemperaSimulada> {
  const inicio = performance.now();
  let iteracoes = 0;
  
  let estadoAtual = [...estadoInicial];
  let custoAtual = calcularCusto(estadoAtual, conexoes);
  let melhorEstado = [...estadoAtual];
  let melhorCusto = custoAtual;
  let temperatura = temperaturaInicial;
  
  while (temperatura > temperaturaMinima) {
    iteracoes++;
    
    // Gera um vizinho aleatório
    const vizinho = gerarVizinhoAleatorio(estadoAtual);
    const custoVizinho = calcularCusto(vizinho, conexoes);
    const diferencaCusto = custoVizinho - custoAtual;
    
    // Aceita a solução se for melhor ou com probabilidade de Boltzmann
    if (diferencaCusto < 0 || Math.random() < Math.exp(-diferencaCusto / temperatura)) {
      estadoAtual = vizinho;
      custoAtual = custoVizinho;
      
      // Atualiza a melhor solução encontrada
      if (custoAtual < melhorCusto) {
        melhorEstado = [...estadoAtual];
        melhorCusto = custoAtual;
      }
    }
    
    // Resfria o sistema
    temperatura *= fatorResfriamento;
  }
  
  const fim = performance.now();
  
  return {
    solucao: melhorEstado,
    custo: melhorCusto,
    iteracoes,
    tempoExecucao: fim - inicio,
    temperaturaFinal: temperatura
  };
}

// Função para gerar um vizinho aleatório (similar à subida encosta alterada)
function gerarVizinhoAleatorio(estado: number[]): number[] {
  const novoEstado = [...estado];
  const i = Math.floor(Math.random() * novoEstado.length);
  let j = Math.floor(Math.random() * novoEstado.length);
  while (j === i) j = Math.floor(Math.random() * novoEstado.length);
  
  [novoEstado[i], novoEstado[j]] = [novoEstado[j], novoEstado[i]];
  return novoEstado;
}

// Função de cálculo de custo (idêntica às anteriores)
function calcularCusto(solucao: number[], conexoes: number[][]): number {
  let custo = 0;
  for (let i = 0; i < solucao.length - 1; i++) {
    const noAtual = solucao[i];
    const proximoNo = solucao[i + 1];
    custo += conexoes[noAtual]?.[proximoNo] || 0;
  }
  // Adiciona o custo de voltar ao início (para ciclo completo)
  custo += conexoes[solucao[solucao.length - 1]]?.[solucao[0]] || 0;
  return custo;
}