// src/components/Leaderboard.jsx
import { useState, useEffect } from 'react';
import { contestAPI } from '../services/api';

const Leaderboard = ({ contestId }) => {
  const [leaderboard, setLeaderboard] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchLeaderboard();

    // Poll every 20 seconds for live updates
    const interval = setInterval(() => {
      fetchLeaderboard();
    }, 20000);

    return () => clearInterval(interval);
  }, [contestId]);

  const fetchLeaderboard = async () => {
    try {
      const response = await contestAPI.getLeaderboard(contestId);
      setLeaderboard(response.data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching leaderboard:', error);
      setLoading(false);
    }
  };

  const formatTime = (seconds) => {
    if (!seconds || seconds === 9223372036854775807) return '-'; // MAX_VALUE
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;

    if (hours > 0) {
      return `${hours}h ${minutes}m`;
    } else if (minutes > 0) {
      return `${minutes}m ${secs}s`;
    } else {
      return `${secs}s`;
    }
  };

  const getRankColor = (rank) => {
    switch (rank) {
      case 1:
        return 'text-yellow-400';
      case 2:
        return 'text-gray-300';
      case 3:
        return 'text-orange-400';
      default:
        return 'text-gray-400';
    }
  };

  const getRankIcon = (rank) => {
    switch (rank) {
      case 1:
        return '🥇';
      case 2:
        return '🥈';
      case 3:
        return '🥉';
      default:
        return rank;
    }
  };

  if (loading) {
    return (
      <div className="p-6">
        <div className="animate-pulse">
          <div className="h-6 bg-slate-700 rounded mb-4"></div>
          <div className="space-y-3">
            {[1, 2, 3, 4, 5].map((i) => (
              <div key={i} className="h-16 bg-slate-700 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col bg-slate-800">
      {/* Header */}
      <div className="px-4 py-4 border-b border-slate-700">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-bold text-white">Leaderboard</h3>
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
            <span className="text-xs text-gray-400">Live</span>
          </div>
        </div>
      </div>

      {/* Leaderboard List */}
      <div className="flex-1 overflow-y-auto">
        {!leaderboard || leaderboard.entries.length === 0 ? (
          <div className="p-6 text-center text-gray-400">
            <p>No submissions yet</p>
            <p className="text-sm mt-2">Be the first to solve a problem!</p>
          </div>
        ) : (
          <div className="divide-y divide-slate-700">
            {leaderboard.entries.map((entry) => (
              <div
                key={entry.userId}
                className="p-4 hover:bg-slate-700/50 transition-colors"
              >
                <div className="flex items-center gap-3">
                  {/* Rank */}
                  <div
                    className={`text-xl font-bold w-8 text-center ${getRankColor(
                      entry.rank
                    )}`}
                  >
                    {getRankIcon(entry.rank)}
                  </div>

                  {/* User Info */}
                  <div className="flex-1 min-w-0">
                    <p className="text-white font-medium truncate">
                      {entry.userName}
                    </p>
                    <div className="flex items-center gap-3 text-xs text-gray-400 mt-1">
                      <span className="flex items-center gap-1">
                        <span className="text-green-400">✓</span>
                        {entry.problemsSolved} solved
                      </span>
                      <span>⏱ {formatTime(entry.timeToFirstAC)}</span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Footer */}
      <div className="px-4 py-3 border-t border-slate-700 text-xs text-gray-400 text-center">
        Updates every 20 seconds
      </div>
    </div>
  );
};

export default Leaderboard;