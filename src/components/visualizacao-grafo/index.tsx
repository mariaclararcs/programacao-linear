import React, { useMemo } from 'react'

interface VisualizacaoGrafoProps {
  nodeCount: number
}

function VisualizacaoGrafo({ nodeCount }: VisualizacaoGrafoProps) {
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
  const connections = useMemo(() => {
    const connections = []
    const connectionCounts = new Array(nodeCount).fill(0)
    const connectionProbability = 0.3

    // Garantir que cada nó tenha pelo menos uma conexão
    for (let i = 0; i < nodeCount; i++) {
      if (connectionCounts[i] === 0) {
        const availableNodes = Array.from({ length: nodeCount }, (_, j) => j)
          .filter(j => j !== i && connectionCounts[j] < 3)
        
        if (availableNodes.length > 0) {
          const j = availableNodes[Math.floor(Math.random() * availableNodes.length)]
          
          connections.push({
            from: Math.min(i, j),
            to: Math.max(i, j),
            path: `M${nodes[i].x},${nodes[i].y} L${nodes[j].x},${nodes[j].y}`
          })
          
          connectionCounts[i]++
          connectionCounts[j]++
        }
      }
    }

    // Adicionar conexões aleatórias adicionais respeitando o limite
    for (let i = 0; i < nodeCount; i++) {
      for (let j = i + 1; j < nodeCount; j++) {
        if (connectionCounts[i] < 3 && connectionCounts[j] < 3 && 
            Math.random() < connectionProbability) {
          
          const exists = connections.some(conn => 
            (conn.from === i && conn.to === j)
          )
          
          if (!exists) {
            connections.push({
              from: i,
              to: j,
              path: `M${nodes[i].x},${nodes[i].y} L${nodes[j].x},${nodes[j].y}`
            })
            
            connectionCounts[i]++
            connectionCounts[j]++
          }
        }
      }
    }
    
    return connections
  }, [nodeCount, nodes])

  return (
    <div className="flex items-center justify-center h-full">
      <svg
        width="500" 
        height="500" 
        viewBox="0 0 500 500"
      >
        {connections.map((conn, idx) => (
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