// src/pages/ContestsPage.jsx
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { contestAPI } from '../services/api';
import { useAuth } from '../context/AuthContext';

const ContestsPage = () => {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const [contests, setContests] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchContests();
  }, []);

  const fetchContests = async () => {
    try {
      const response = await contestAPI.getAllContests();
      setContests(response.data);
    } catch (error) {
      console.error('Error fetching contests:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleContestClick = (contestId) => {
    navigate(`/contest/${contestId}`);
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const isActive = (startTime, endTime) => {
    const now = new Date();
    return new Date(startTime) <= now && now <= new Date(endTime);
  };

  return (
    <div className="min-h-screen bg-slate-900">
      {/* Navbar */}
      <nav className="bg-slate-800 border-b border-slate-700 px-6 py-4">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <h1 className="text-2xl font-bold text-white">Contest Platform</h1>
          <div className="flex items-center gap-4">
            <div className="text-right">
              <p className="text-sm text-gray-400">Logged in as</p>
              <p className="text-white font-medium">{user?.name}</p>
              <p className="text-xs text-gray-500">ID: {user?.userId}</p>
            </div>
            <button
              onClick={logout}
              className="px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg transition-colors"
            >
              Logout
            </button>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-6 py-8">
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-white mb-2">
            Available Contests
          </h2>
          <p className="text-gray-400">
            Choose a contest to start competing and solving problems
          </p>
        </div>

        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
          </div>
        ) : contests.length === 0 ? (
          <div className="text-center py-16">
            <p className="text-gray-400 text-lg">No contests available</p>
          </div>
        ) : (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {contests.map((contest) => (
              <div
                key={contest.id}
                onClick={() => handleContestClick(contest.id)}
                className="bg-slate-800 rounded-lg border border-slate-700 p-6 hover:border-primary transition-all cursor-pointer group"
              >
                <div className="flex justify-between items-start mb-4">
                  <h3 className="text-xl font-semibold text-white group-hover:text-primary transition-colors">
                    {contest.title}
                  </h3>
                  {isActive(contest.startTime, contest.endTime) && (
                    <span className="px-2 py-1 bg-green-500 text-white text-xs font-medium rounded">
                      LIVE
                    </span>
                  )}
                </div>

                <p className="text-gray-400 text-sm mb-4 line-clamp-2">
                  {contest.description}
                </p>

                <div className="space-y-2 text-sm">
                  <div className="flex justify-between text-gray-400">
                    <span>Start:</span>
                    <span className="text-white">
                      {formatDate(contest.startTime)}
                    </span>
                  </div>
                  <div className="flex justify-between text-gray-400">
                    <span>End:</span>
                    <span className="text-white">
                      {formatDate(contest.endTime)}
                    </span>
                  </div>
                  <div className="flex justify-between text-gray-400">
                    <span>Problems:</span>
                    <span className="text-white">{contest.problems.length}</span>
                  </div>
                </div>

                <button className="w-full mt-4 py-2 bg-primary hover:bg-blue-600 text-white font-medium rounded-lg transition-colors">
                  Enter Contest
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default ContestsPage;