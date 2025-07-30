import React, { useEffect, useState } from 'react';
import { PullRequestNode } from '../types/analysis';
import { getContextGraph } from '../services/analysisService';

interface ContextGraphProps {
  repoId: number;
  branch?: string;
}

export const ContextGraph: React.FC<ContextGraphProps> = ({ repoId, branch }) => {
  const [nodes, setNodes] = useState<PullRequestNode[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const data = await getContextGraph(repoId, branch);
        setNodes(data);
      } catch (err) {
        setError('Failed to fetch context graph data');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [repoId, branch]);

  if (loading) {
    return <div className="flex justify-center items-center p-8">Loading...</div>;
  }

  if (error) {
    return <div className="text-red-500 p-4">{error}</div>;
  }

  return (
    <div className="p-4">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {nodes.map((node) => (
          <div key={node.id} className="bg-white rounded-lg shadow-md p-4">
            <div className="flex items-center gap-2 mb-4">
              {node.createdBy && (
                <img
                  src={node.createdBy.avatarUrl}
                  alt={node.createdBy.username}
                  className="w-8 h-8 rounded-full"
                />
              )}
              <div>
                <h3 className="font-semibold">{node.headCommitMessage}</h3>
                <p className="text-sm text-gray-500">
                  by {node.pusher} on {node.branch}
                </p>
              </div>
            </div>
            
            <div className="mb-4">
              <h4 className="font-medium mb-2">Analysis</h4>
              <div className="space-y-2 text-sm">
                <p>{node.analysis.technicalComment}</p>
                <p>{node.analysis.functionalComment}</p>
                <p>{node.analysis.architecturalComment}</p>
              </div>
            </div>

            {node.solves.length > 0 && (
              <div className="mt-2">
                <h4 className="font-medium mb-1">Solves</h4>
                <div className="flex flex-wrap gap-2">
                  {node.solves.map((issue) => (
                    <span
                      key={issue.id}
                      className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded"
                    >
                      #{issue.number} {issue.title}
                    </span>
                  ))}
                </div>
              </div>
            )}

            <div className="mt-4 pt-4 border-t">
              <p className="text-xs text-gray-500">
                Commit: {node.headCommitSha.substring(0, 7)}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}; 