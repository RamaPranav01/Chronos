// components/report/KnowledgeGraph.tsx
'use client';

import { useMemo } from 'react';
import ReactFlow, { Background, Controls, MiniMap, Node, Edge } from 'reactflow';
import 'reactflow/dist/style.css';
import { FinalReportPayload } from '@/lib/types';

interface KnowledgeGraphProps {
  graphData: FinalReportPayload['knowledge_graph'];
}

export function KnowledgeGraph({ graphData = { nodes: [], edges: [] } }: KnowledgeGraphProps) {
  // Memoize the transformation to prevent re-calculating on every render
  const { nodes, edges } = useMemo(() => {
    const initialNodes: Node[] = graphData.nodes.map((node, i) => ({
      id: node.id,
      position: { x: (i % 5) * 200, y: Math.floor(i / 5) * 150 },
      data: { label: node.label },
      style: {
        background: node.type === 'finding' ? '#6366F1' : '#1F2937', // indigo-500, gray-800
        color: 'white',
        border: `1px solid ${node.type === 'finding' ? '#818CF8' : '#4B5563'}`, // indigo-400, gray-600
      }
    }));

    const initialEdges: Edge[] = graphData.edges.map(edge => ({
      id: `e-${edge.source}-${edge.target}`,
      source: edge.source,
      target: edge.target,
      label: edge.label,
      animated: true,
      style: { stroke: '#9CA3AF' }, // gray-400
    }));
    return { nodes: initialNodes, edges: initialEdges };
  }, [graphData]);

  return (
    <ReactFlow nodes={nodes} edges={edges} fitView>
      <Background color="#4B5563" />
      <Controls />
      <MiniMap />
    </ReactFlow>
  );
}