import React, { useMemo, useState } from 'react';
import ReactFlow, {
  Node,
  Edge,
  Background,
  Controls,
  MiniMap,
  NodeTypes,
  Position,
  NodeProps,
  MarkerType,
} from 'reactflow';
import 'reactflow/dist/style.css';
import { PullRequestNode, Commit } from '../types/analysis';
import { Box, Dialog, DialogTitle, DialogContent, Typography, IconButton, Paper, Chip } from '@mui/material';
import { Close as CloseIcon } from '@mui/icons-material';

interface NodeData {
  label: string;
  type: 'commit' | 'pr' | 'main';
  originalData: PullRequestNode | Commit;
  onClick?: () => void;
}

interface NodeDetailsModalProps {
  open: boolean;
  onClose: () => void;
  data: NodeData | null;
}

const NodeDetailsModal: React.FC<NodeDetailsModalProps> = ({ open, onClose, data }) => {
  if (!data) return null;

  const isPR = 'commits' in data.originalData;
  const prData = isPR ? data.originalData as PullRequestNode : null;
  const commitData = !isPR ? data.originalData as Commit : null;

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle sx={{ m: 0, p: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Typography variant="h6">
          {isPR ? 'Pull Request Details' : 'Commit Details'}
        </Typography>
        <IconButton onClick={onClose}>
          <CloseIcon />
        </IconButton>
      </DialogTitle>
      <DialogContent dividers>
        {isPR && prData && (
          <>
            <Box sx={{ mb: 3 }}>
              <Typography variant="h6" gutterBottom>
                {prData.headCommitMessage}
              </Typography>
              <Typography color="textSecondary" gutterBottom>
                by {prData.pusher} on {prData.branch}
              </Typography>
              <Typography variant="caption" display="block">
                Commit: {prData.headCommitSha}
              </Typography>
            </Box>

            <Box sx={{ mb: 3 }}>
              <Typography variant="subtitle1" gutterBottom>Analysis</Typography>
              <Paper variant="outlined" sx={{ p: 2, mb: 2 }}>
                <Typography variant="body2" gutterBottom>
                  <strong>Technical:</strong> {prData.analysis.technicalComment}
                </Typography>
                <Typography variant="body2" gutterBottom>
                  <strong>Functional:</strong> {prData.analysis.functionalComment}
                </Typography>
                <Typography variant="body2">
                  <strong>Architectural:</strong> {prData.analysis.architecturalComment}
                </Typography>
              </Paper>
              <Chip 
                label={`Risk Score: ${prData.analysis.riskScore}`}
                color={prData.analysis.riskScore > 5 ? 'error' : 'success'}
              />
            </Box>

            {prData.solves.length > 0 && (
              <Box sx={{ mb: 3 }}>
                <Typography variant="subtitle1" gutterBottom>Solves</Typography>
                <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                  {prData.solves.map((id) => (
                    <Chip key={id} label={`#${id}`} variant="outlined" />
                  ))}
                </Box>
              </Box>
            )}
          </>
        )}

        {!isPR && commitData && (
          <>
            <Typography variant="h6" gutterBottom>
              {commitData.message}
            </Typography>
            <Typography color="textSecondary" gutterBottom>
              Commit: {commitData.hash}
            </Typography>
            <Box sx={{ mt: 2 }}>
              <Typography variant="subtitle1" gutterBottom>Analysis</Typography>
              <Paper variant="outlined" sx={{ p: 2 }}>
                <Typography variant="body2" gutterBottom>
                  <strong>Technical:</strong> {commitData.analysis.technicalComment}
                </Typography>
                <Typography variant="body2" gutterBottom>
                  <strong>Functional:</strong> {commitData.analysis.functionalComment}
                </Typography>
                <Typography variant="body2">
                  <strong>Architectural:</strong> {commitData.analysis.architecturalComment}
                </Typography>
              </Paper>
            </Box>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
};

const CustomNode: React.FC<NodeProps<NodeData>> = ({ data }) => {
  const getNodeColor = (type: string) => {
    switch (type) {
      case 'main':
        return '#ff9800';
      case 'commit':
        return '#795548';
      default:
        return '#2196f3';
    }
  };

  const backgroundColor = getNodeColor(data.type);
  const size = data.type === 'main' ? 60 : 40;

  return (
    <div
      onClick={data.onClick}
      style={{
        width: size,
        height: size,
        backgroundColor,
        borderRadius: '50%',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        cursor: 'pointer',
        transition: 'transform 0.2s',
        color: '#fff',
        fontSize: data.type === 'main' ? '16px' : '12px',
        border: '2px solid rgba(255, 255, 255, 0.2)',
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.transform = 'scale(1.1)';
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.transform = 'scale(1)';
      }}
    >
      {data.type.charAt(0).toUpperCase()}
    </div>
  );
};

const nodeTypes: NodeTypes = {
  custom: CustomNode,
};

const defaultEdgeOptions = {
  style: { strokeWidth: 2 },
  markerEnd: {
    type: MarkerType.ArrowClosed,
    width: 20,
    height: 20,
  },
  labelStyle: {
    fontSize: 12,
    fill: '#888',
    strokeWidth: 0,
    backgroundColor: '#fff',
    padding: 5,
    borderRadius: 4,
  },
  labelBgStyle: {
    fill: '#fff',
    opacity: 0.8,
  },
  labelBgPadding: [8, 4] as [number, number],
};

interface ContextGraphVisualizerProps {
  nodes: PullRequestNode[];
}

export const ContextGraphVisualizer: React.FC<ContextGraphVisualizerProps> = ({
  nodes,
}) => {
  const [selectedNode, setSelectedNode] = useState<NodeData | null>(null);

  const { flowNodes, flowEdges } = useMemo(() => {
    const mainNode = nodes[0];
    const centerX = 400;
    const centerY = 300;
    const radius = 250;

    const graphNodes: Node[] = [];
    const graphEdges: Edge[] = [];

    // Add main node
    graphNodes.push({
      id: mainNode.id.toString(),
      type: 'custom',
      position: { x: centerX, y: centerY },
      data: {
        label: 'Main',
        type: 'main',
        originalData: mainNode,
      },
    });

    // Add related nodes in a circular layout
    const angleStep = (2 * Math.PI) / (nodes.length - 1);
    nodes.slice(1).forEach((node, index) => {
      const angle = angleStep * index;
      const x = centerX + radius * Math.cos(angle);
      const y = centerY + radius * Math.sin(angle);

      const nodeId = node.id.toString();
      graphNodes.push({
        id: nodeId,
        type: 'custom',
        position: { x, y },
        data: {
          label: 'PR',
          type: 'pr',
          originalData: node,
        },
      });

      // Add edge from main node to this node if it solves the main PR
      if (node.solves.includes(mainNode.id)) {
        graphEdges.push({
          id: `${mainNode.id}-${nodeId}`,
          source: nodeId,
          target: mainNode.id.toString(),
          animated: true,
          type: 'default',
          label: 'Solves',
          style: { stroke: '#4caf50', strokeWidth: 2 },
        });
      }

      // Add edges for other relationships
      node.solves.forEach((solvedId) => {
        if (solvedId !== mainNode.id) {
          graphEdges.push({
            id: `${nodeId}-${solvedId}`,
            source: nodeId,
            target: solvedId.toString(),
            animated: true,
            type: 'default',
            label: 'Solves',
            style: { stroke: '#2196f3', strokeWidth: 2 },
          });
        }
      });

      // Add commit nodes for each PR
      node.commits.forEach((commit, commitIndex) => {
        const commitAngle = angle + (commitIndex - 0.5) * 0.2;
        const commitRadius = radius * 1.4;
        const commitX = centerX + commitRadius * Math.cos(commitAngle);
        const commitY = centerY + commitRadius * Math.sin(commitAngle);

        const commitNodeId = `commit-${commit.hash}`;
        graphNodes.push({
          id: commitNodeId,
          type: 'custom',
          position: { x: commitX, y: commitY },
          data: {
            label: 'C',
            type: 'commit',
            originalData: commit,
          },
        });

        graphEdges.push({
          id: `${nodeId}-${commitNodeId}`,
          source: nodeId,
          target: commitNodeId,
          type: 'default',
          label: 'Contains',
          style: { stroke: '#795548', strokeWidth: 1 },
        });
      });
    });

    return {
      flowNodes: graphNodes,
      flowEdges: graphEdges,
    };
  }, [nodes]);

  const handleNodeClick = (node: NodeData) => {
    setSelectedNode(node);
  };

  return (
    <Box sx={{ width: '100%', height: '600px', mb: 4 }}>
      <ReactFlow
        nodes={flowNodes.map(node => ({
          ...node,
          data: {
            ...node.data,
            onClick: () => handleNodeClick(node.data),
          },
        }))}
        edges={flowEdges}
        nodeTypes={nodeTypes}
        defaultEdgeOptions={defaultEdgeOptions}
        fitView
        minZoom={0.1}
        maxZoom={1.5}
        defaultViewport={{ x: 0, y: 0, zoom: 0.5 }}
      >
        <Background />
        <Controls />
        <MiniMap />
      </ReactFlow>

      <NodeDetailsModal
        open={!!selectedNode}
        onClose={() => setSelectedNode(null)}
        data={selectedNode}
      />
    </Box>
  );
}; 