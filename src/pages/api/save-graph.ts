// pages/api/save-graph.ts
import { writeFileSync, existsSync, mkdirSync } from 'fs'
import { NextApiRequest, NextApiResponse } from 'next'
import path from 'path'

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'POST') {
    const { nodeCount, connections } = req.body
    
    // Validação dos dados
    if (!nodeCount || !connections) {
      return res.status(400).json({ error: 'Dados inválidos' })
    }

    // Cria conteúdo do arquivo
    let fileContent = ''
    fileContent += Array.from({ length: nodeCount }, (_, i) => i + 1).join(', ') + '\n'
    connections.forEach((conexoesNo: number[]) => {
      fileContent += conexoesNo.join(', ') + '\n'
    })
    
    try {
      // Garante que o diretório existe
      const dirPath = path.join(process.cwd(), 'public', 'graphs')
      if (!existsSync(dirPath)) {
        mkdirSync(dirPath, { recursive: true })
      }

      // Nome fixo para o arquivo (sobrescreve sempre)
      const fileName = 'mapa_grafo.txt'
      const filePath = path.join(dirPath, fileName)
      
      // Escreve o arquivo
      writeFileSync(filePath, fileContent)
      
      return res.status(200).json({ 
        success: true, 
        path: `/graphs/${fileName}`,
        message: 'Arquivo salvo com sucesso'
      })
    } catch (error) {
      console.error('Erro ao salvar arquivo:', error)
      return res.status(500).json({ 
        error: 'Falha ao salvar arquivo',
        details: error instanceof Error ? error.message : String(error)
      })
    }
  } else {
    res.setHeader('Allow', ['POST'])
    return res.status(405).end(`Method ${req.method} Not Allowed`)
  }
}