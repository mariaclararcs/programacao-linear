export interface ResultadoSubidaEncostaAlterada {
  solucao: number[];
  custo: number;
  iteracoes?: number;
  tempoExecucao?: number;
}

export async function subidaEncostaAlterada(
  conexoes: number[][],
  estadoInicial: number[],
  maxTentativas = 1000
): Promise<ResultadoSubidaEncostaAlterada> {
  const inicio = performance.now();
  let iteracoes = 0;
  let tentativas = 0;
  
  let estadoAtual = [...estadoInicial];
  let custoAtual = calcularCusto(estadoAtual, conexoes);
  
  while (tentativas < maxTentativas) {
    iteracoes++;
    const vizinhoAleatorio = gerarVizinhoAleatorio(estadoAtual);
    const custoVizinho = calcularCusto(vizinhoAleatorio, conexoes);
    
    if (custoVizinho < custoAtual) {
      estadoAtual = vizinhoAleatorio;
      custoAtual = custoVizinho;
      tentativas = 0;
    } else {
      tentativas++;
    }
  }
  
  const fim = performance.now();
  
  return {
    solucao: estadoAtual,
    custo: custoAtual,
    iteracoes,
    tempoExecucao: fim - inicio
  };
}

// Funções auxiliares
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

function gerarVizinhoAleatorio(solucao: number[]): number[] {
  const novoEstado = [...solucao];
  const i = Math.floor(Math.random() * novoEstado.length);
  let j = Math.floor(Math.random() * novoEstado.length);
  while (j === i) j = Math.floor(Math.random() * novoEstado.length);
  
  [novoEstado[i], novoEstado[j]] = [novoEstado[j], novoEstado[i]];
  return novoEstado;
}