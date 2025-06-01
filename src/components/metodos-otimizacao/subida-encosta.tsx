export interface ResultadoSubidaEncosta {
  solucao: number[];
  custo: number;
  iteracoes: number;
  tempoExecucao: number;
}

export async function subidaEncosta(
  conexoes: number[][],
  estadoInicial: number[]
): Promise<ResultadoSubidaEncosta> {
  const inicio = performance.now();
  let iteracoes = 0;
  
  let estadoAtual = [...estadoInicial];
  let custoAtual = calcularCusto(estadoAtual, conexoes);
  
  while (true) {
    iteracoes++;
    const vizinhos = gerarTodosVizinhos(estadoAtual);
    let melhorVizinho: number[] | null = null;
    let melhorCusto = custoAtual;
    
    // Avalia todos os vizinhos
    for (const vizinho of vizinhos) {
      const custoVizinho = calcularCusto(vizinho, conexoes);
      if (custoVizinho < melhorCusto) {
        melhorCusto = custoVizinho;
        melhorVizinho = vizinho;
      }
    }
    
    // Critério de parada (não há melhoria)
    if (melhorCusto >= custoAtual || !melhorVizinho) {
      break;
    }
    
    estadoAtual = melhorVizinho;
    custoAtual = melhorCusto;
  }
  
  const fim = performance.now();
  
  return {
    solucao: estadoAtual,
    custo: custoAtual,
    iteracoes,
    tempoExecucao: fim - inicio
  };
}

// Função para gerar todos os vizinhos possíveis (diferente da versão alterada)
function gerarTodosVizinhos(estado: number[]): number[][] {
  const vizinhos: number[][] = [];
  
  // Gera vizinhos trocando cada par de posições
  for (let i = 0; i < estado.length - 1; i++) {
    for (let j = i + 1; j < estado.length; j++) {
      const novoVizinho = [...estado];
      [novoVizinho[i], novoVizinho[j]] = [novoVizinho[j], novoVizinho[i]];
      vizinhos.push(novoVizinho);
    }
  }
  
  return vizinhos;
}

// Funções auxiliares (iguais às da versão alterada)
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