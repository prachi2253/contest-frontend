// src/pages/ContestPage.jsx
import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { contestAPI, problemAPI } from '../services/api';
import { useAuth } from '../context/AuthContext';
import ProblemView from '../components/ProblemView';
import CodeEditor from '../components/CodeEditor';
import Leaderboard from '../components/Leaderboard';

const ContestPage = () => {
  const { contestId } = useParams();
  const { user } = useAuth();
  const [contest, setContest] = useState(null);
  const [problems, setProblems] = useState([]);
  const [selectedProblem, setSelectedProblem] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchContestData();
  }, [contestId]);

  const fetchContestData = async () => {
    try {
      const [contestRes, problemsRes] = await Promise.all([
        contestAPI.getContestById(contestId),
        problemAPI.getProblemsByContestId(contestId),
      ]);
      setContest(contestRes.data);
      setProblems(problemsRes.data);
      if (problemsRes.data.length > 0) {
        setSelectedProblem(problemsRes.data[0]);
      }
    } catch (error) {
      console.error('Error fetching contest data:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center">
        <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-900 flex flex-col">
      {/* Header */}
      <div className="bg-slate-800 border-b border-slate-700 px-6 py-4">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-2xl font-bold text-white mb-1">{contest?.title}</h1>
          <p className="text-gray-400 text-sm">{contest?.description}</p>
        </div>
      </div>

      {/* Problem Tabs */}
      <div className="bg-slate-800 border-b border-slate-700 px-6">
        <div className="max-w-7xl mx-auto flex gap-2 overflow-x-auto">
          {problems.map((problem) => (
            <button
              key={problem.id}
              onClick={() => setSelectedProblem(problem)}
              className={`px-4 py-3 font-medium transition-colors whitespace-nowrap ${
                selectedProblem?.id === problem.id
                  ? 'text-primary border-b-2 border-primary'
                  : 'text-gray-400 hover:text-white'
              }`}
            >
              {problem.title}
              <span
                className={`ml-2 text-xs px-2 py-0.5 rounded ${
                  problem.difficulty === 'EASY'
                    ? 'bg-green-500/20 text-green-400'
                    : problem.difficulty === 'MEDIUM'
                    ? 'bg-yellow-500/20 text-yellow-400'
                    : 'bg-red-500/20 text-red-400'
                }`}
              >
                {problem.difficulty}
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex overflow-hidden">
        {/* Left Side - Problem + Code Editor */}
        <div className="flex-1 flex flex-col overflow-hidden">
          {/* Problem Statement */}
          <div className="flex-1 overflow-auto">
            <ProblemView problem={selectedProblem} />
          </div>

          {/* Code Editor */}
          <div className="h-96 border-t border-slate-700">
            <CodeEditor
              problem={selectedProblem}
              contestId={contestId}
              userId={user?.userId}
            />
          </div>
        </div>

        {/* Right Side - Leaderboard */}
        <div className="w-80 border-l border-slate-700 overflow-auto">
          <Leaderboard contestId={contestId} />
        </div>
      </div>
    </div>
  );
};

export default ContestPage;