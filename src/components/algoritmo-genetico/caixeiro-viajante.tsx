import { GeneticAlgorithmResult } from "@/types/algoritmo-genetico"

export default class CaixeiroViajante {
    private static gerarProblema(n: number, min: number, max: number): number[][] {
        const mat: number[][] = []
        for (let i = 0; i < n; i++) {
            mat[i] = [];
            for (let j = 0; j < n; j++) {
                mat[i][j] = i === j ? 0 : Math.floor(Math.random() * (max - min + 1)) + min;
            }
        }
        return mat
    }

    private static avalia(mat: number[][], sol: number[]): number {
        let cost = 0
        // Verifica se a solução é válida
        if (!sol || sol.length === 0) return Infinity
        
        // Calcula o custo do caminho
        for (let i = 0; i < sol.length - 1; i++) {
            const from = sol[i]
            const to = sol[i+1]
            if (from === undefined || to === undefined || !mat[from] || mat[from][to] === undefined) {
                return Infinity
            }
            cost += mat[from][to]
        }
        
        // Adiciona o custo de retorno à origem
        const last = sol[sol.length - 1]
        const first = sol[0]
        if (last !== undefined && first !== undefined && mat[last] && mat[last][first] !== undefined) {
            cost += mat[last][first]
        }
        
        return cost
    }

    private static ordena(populacao: number[][], fitness: number[]): { populacao: number[][]; fitness: number[] } {
        const combined = populacao.map((ind: number[], idx: number) => ({ ind, fit: fitness[idx] }));
        combined.sort((a, b) => b.fit - a.fit);
        return {
            populacao: combined.map(item => item.ind),
            fitness: combined.map(item => item.fit)
        }
    }

    private static popInicial(n: number, tamanhoPopulacao: number): number[][] {
        const pop: number[][] = []
        for (let i = 0; i < tamanhoPopulacao; i++) {
            pop[i] = [...Array(n).keys()];
            for (let j = n - 1; j > 0; j--) {
                const k = Math.floor(Math.random() * (j + 1));
                [pop[i][j], pop[i][k]] = [pop[i][k], pop[i][j]];
            }
        }
        return pop
    }

    private static aptidao(mat: number[][], populacao: number[][]): number[] {
        const fitness = populacao.map(ind => 1 / this.avalia(mat, ind))
        const soma = fitness.reduce((a, b) => a + b, 0)
        return fitness.map(f => f / soma)
    }

    private static roleta(fitness: number[]): number {
        const ale = Math.random()
        let ind = 0
        let soma = fitness[ind]
        while (soma < ale && ind < fitness.length - 1) {
            ind++
            soma += fitness[ind]
        }
        return ind
    }

    private static torneio(fitness: number[]): number {
        const p1 = Math.floor(Math.random() * fitness.length)
        const p2 = Math.floor(Math.random() * fitness.length)
        return fitness[p1] > fitness[p2] ? p1 : p2;
    }

    private static cruzamento(p1: number[], p2: number[], ponto: number): [number[], number[]] {
        // Cruzamento OX (Order Crossover) para manter permutações válidas
        const fillChild = (parent1: number[], parent2: number[]) => {
            const child = new Array(parent1.length).fill(-1)
            const segment = parent1.slice(ponto, ponto)
            
            // Copia o segmento do parent1 para o child
            for (let i = ponto; i < ponto; i++) {
                child[i] = parent1[i]
            }
            
            // Preenche os demais elementos com os genes do parent2, evitando repetições
            let currentPos = 0
            for (const gene of parent2) {
                if (!segment.includes(gene)) {
                    if (currentPos === ponto) currentPos = ponto
                    while (currentPos < child.length && child[currentPos] !== -1) {
                        currentPos++
                    }
                    if (currentPos < child.length) {
                        child[currentPos] = gene
                    }
                }
            }
            return child
        }

        const d1 = fillChild(p1, p2)
        const d2 = fillChild(p2, p1)
        
        return [d1, d2]
    }

    private static mutacao(individuo: number[]): number[] {
        const d = [...individuo]
        const pos1 = Math.floor(Math.random() * d.length)
        let pos2 = Math.floor(Math.random() * d.length)
        while (pos2 === pos1) {
            pos2 = Math.floor(Math.random() * d.length)
        }
        [d[pos1], d[pos2]] = [d[pos2], d[pos1]]
        return d
    }

    private static descendentes(
        populacao: number[][],
        fitness: number[],
        taxaCruzamento: number,
        taxaMutacao: number
    ): number[][] {
        const desc: number[][] = []
        const corte = Math.floor(Math.random() * (populacao[0].length - 1)) + 1
        
        for (let i = 0; i < populacao.length; i++) {
            const p1 = populacao[this.roleta(fitness)]
            const p2 = populacao[this.roleta(fitness)]
            
            let d1: number[], d2: number[]
            if (Math.random() <= taxaCruzamento) {
                [d1, d2] = this.cruzamento(p1, p2, corte)
            } else {
                d1 = [...p1]
                d2 = [...p2]
            }
            
            if (Math.random() <= taxaMutacao) {
                d1 = this.mutacao(d1)
            }
            if (Math.random() <= taxaMutacao) {
                d2 = this.mutacao(d2)
            }
            
            desc.push(d1, d2)
        }
        
        return this.ajustaRestricao(desc, corte)
    }

    private static ajustaRestricao(desc: number[][], corte: number): number[][] {
        return desc.map(individuo => {
            const n = individuo.length
            const elementosUnicos = new Set(individuo)
            
            // Se já é uma permutação válida, retorna sem alterações
            if (elementosUnicos.size === n) return individuo
            
            // Lista de elementos faltantes
            const faltantes: number[] = []
            for (let i = 0; i < n; i++) {
                if (!elementosUnicos.has(i)) {
                    faltantes.push(i)
                }
            }
            
            // Embaralha os faltantes
            for (let i = faltantes.length - 1; i > 0; i--) {
                const j = Math.floor(Math.random() * (i + 1));
                [faltantes[i], faltantes[j]] = [faltantes[j], faltantes[i]]
            }
            
            // Corrige as duplicatas
            const corrigido = [...individuo]
            const visto = new Set()
            let faltanteIdx = 0
            
            for (let i = 0; i < n; i++) {
                if (visto.has(corrigido[i])) {
                    corrigido[i] = faltantes[faltanteIdx++]
                }
                visto.add(corrigido[i])
            }
            
            return corrigido
        })
    }

    private static novaPopulacao(
        populacao: number[][],
        descendentes: number[][],
        tamanhoElite: number
    ): number[][] {
        const novaPop = [...populacao.slice(0, tamanhoElite)];
        for (let i = tamanhoElite; i < populacao.length; i++) {
            novaPop.push(descendentes[i - tamanhoElite]);
        }
        return novaPop;
    }

    public static async executar(
        matrizDistancias: number[][],
        tamanhoPopulacao: number,
        numeroGeracoes: number,
        taxaCruzamento: number,
        taxaMutacao: number,
        intervaloGeracao: number,
        onProgress?: (progress: { generation: number; bestCost: number }) => void
    ): Promise<GeneticAlgorithmResult> {
        const n = matrizDistancias.length
        let populacao = this.popInicial(n, tamanhoPopulacao);
        // Valida cada indivíduo da população
        populacao = populacao.map(ind => {
            const unicos = new Set(ind)
            return unicos.size === n ? ind : [...Array(n).keys()].sort(() => Math.random() - 0.5)
        })
        let fitness = this.aptidao(matrizDistancias, populacao)
        
        const { populacao: popOrdenada, fitness: fitOrdenada } = this.ordena(populacao, fitness)
        populacao = popOrdenada
        fitness = fitOrdenada
        
        const initialSolution = [...populacao[0]]
        const initialCost = this.avalia(matrizDistancias, initialSolution)
        
        const progress: { generation: number; bestCost: number }[] = []
        const tamanhoElite = Math.floor(tamanhoPopulacao * 0.1)
        
        for (let g = 0; g < numeroGeracoes; g++) {
            const descendentes = this.descendentes(populacao, fitness, taxaCruzamento, taxaMutacao)
            const fitDesc = this.aptidao(matrizDistancias, descendentes)
            
            const { populacao: descOrdenada } = this.ordena(descendentes, fitDesc)
            
            populacao = this.novaPopulacao(populacao, descOrdenada, tamanhoElite)
            fitness = this.aptidao(matrizDistancias, populacao)
            
            const { populacao: popFinalOrdenada, fitness: fitFinalOrdenada } = this.ordena(populacao, fitness)
            populacao = popFinalOrdenada
            fitness = fitFinalOrdenada
            
            if (g % intervaloGeracao === 0 || g === numeroGeracoes - 1) {
                const bestCost = this.avalia(matrizDistancias, populacao[0])
                progress.push({ generation: g, bestCost })
                if (onProgress) {
                    onProgress({ generation: g, bestCost })
                }
            }
        }
        
        const finalSolution = [...populacao[0]]
        const finalCost = this.avalia(matrizDistancias, finalSolution)
        
        return {
            initialSolution,
            finalSolution,
            initialCost,
            finalCost,
            progress
        }
    }
}