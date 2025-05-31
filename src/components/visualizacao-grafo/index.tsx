// components/visualizacao-grafo/index.tsx
import React, { useEffect, useMemo, useState } from 'react'

interface VisualizacaoGrafoProps {
  nodeCount: number
  onGraphGenerated?: (connections: number[][]) => void
}

function VisualizacaoGrafo({ nodeCount, onGraphGenerated }: VisualizacaoGrafoProps) {
  const [initialized, setInitialized] = useState(false)
  // Gerar nós em posição circular
  const nodes = useMemo(() => {
    const center = 250
    const radius = 200

    return Array.from({ length: nodeCount }, (_, i) => ({
      id: i,
      x: center + radius * Math.cos((i * 2 * Math.PI) / nodeCount),
      y: center + radius * Math.sin((i * 2 * Math.PI) / nodeCount),
    }))
  }, [nodeCount])

  // Gerar conexões com limite máximo de 3 por nó
  const { connections, connectionPaths } = useMemo(() => {
    const connections: number[][] = Array.from({ length: nodeCount }, () => [])
    const connectionPaths: { path: string, from: number, to: number }[] = []
    const connectionCounts = new Array(nodeCount).fill(0)
    const connectionProbability = 0.3

    // Garantir que cada nó tenha pelo menos uma conexão
    for (let i = 0; i < nodeCount; i++) {
      if (connectionCounts[i] === 0) {
        const availableNodes = Array.from({ length: nodeCount }, (_, j) => j)
          .filter(j => j !== i && connectionCounts[j] < 3)
        
        if (availableNodes.length > 0) {
          const j = availableNodes[Math.floor(Math.random() * availableNodes.length)]
          connections[i].push(j + 1)
          connections[j].push(i + 1)
          connectionPaths.push({
            path: `M${nodes[i].x},${nodes[i].y} L${nodes[j].x},${nodes[j].y}`,
            from: i,
            to: j
          })
          connectionCounts[i]++
          connectionCounts[j]++
        }
      }
    }

    // Adicionar conexões aleatórias adicionais
    for (let i = 0; i < nodeCount; i++) {
      for (let j = i + 1; j < nodeCount; j++) {
        if (connectionCounts[i] < 3 && connectionCounts[j] < 3 && 
            Math.random() < connectionProbability) {
          
          if (!connections[i].includes(j + 1)) {
            connections[i].push(j + 1)
            connections[j].push(i + 1)
            connectionPaths.push({
              path: `M${nodes[i].x},${nodes[i].y} L${nodes[j].x},${nodes[j].y}`,
              from: i,
              to: j
            })
            connectionCounts[i]++
            connectionCounts[j]++
          }
        }
      }
    }

    // Ordenar as conexões
    connections.forEach(conn => conn.sort((a, b) => a - b))
    
    return { connections, connectionPaths }
  }, [nodeCount, nodes])

  // Notificar quando o grafo for gerado
  useEffect(() => {
    if (!initialized && onGraphGenerated) {
      onGraphGenerated(connections)
      setInitialized(true)
    }
  }, [connections, initialized, onGraphGenerated])

  return (
    <div className="flex items-center justify-center h-full">
      <svg
        width="500" 
        height="500" 
        viewBox="0 0 500 500"
      >
        {connectionPaths.map((conn, idx) => (
          <path
            key={`conn-${idx}`}
            d={conn.path}
            stroke="#555"
            strokeWidth="2"
            fill="none"
          />
        ))}
        
        {nodes.map((node, i) => (
          <g key={i}>
            <circle cx={node.x} cy={node.y} r="20" fill="#3b82f6" />
            <text
              x={node.x}
              y={node.y}
              textAnchor="middle"
              dominantBaseline="middle"
              fill="white"
              fontSize="12"
              fontWeight="bold"
            >
              {i + 1}
            </text>
          </g>
        ))}
      </svg>
    </div>
  )
}

export default React.memo(VisualizacaoGrafo)