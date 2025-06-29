export interface GeneticAlgorithmResult {
    initialSolution: number[]
    finalSolution: number[]
    initialCost: number
    finalCost: number
    progress: { generation: number; bestCost: number }[]
}