// src/components/ProblemView.jsx
const ProblemView = ({ problem }) => {
  if (!problem) {
    return (
      <div className="p-6 text-center text-gray-400">
        Select a problem to view details
      </div>
    );
  }

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <div className="mb-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-3xl font-bold text-white">{problem.title}</h2>
          <span
            className={`px-3 py-1 rounded-lg font-medium ${
              problem.difficulty === 'EASY'
                ? 'bg-green-500/20 text-green-400'
                : problem.difficulty === 'MEDIUM'
                ? 'bg-yellow-500/20 text-yellow-400'
                : 'bg-red-500/20 text-red-400'
            }`}
          >
            {problem.difficulty}
          </span>
        </div>

        <div className="flex gap-6 text-sm text-gray-400">
          <div>
            <span className="font-medium">Time Limit:</span>{' '}
            {problem.timeLimit}s
          </div>
          <div>
            <span className="font-medium">Memory Limit:</span>{' '}
            {problem.memoryLimit}MB
          </div>
        </div>
      </div>

      <div className="prose prose-invert max-w-none">
        <div className="bg-slate-800 rounded-lg p-6 mb-6">
          <h3 className="text-xl font-semibold text-white mb-3">
            Problem Description
          </h3>
          <div className="text-gray-300 whitespace-pre-wrap leading-relaxed">
            {problem.description}
          </div>
        </div>

        {problem.sampleTestCases && problem.sampleTestCases.length > 0 && (
          <div className="space-y-4">
            <h3 className="text-xl font-semibold text-white mb-3">
              Sample Test Cases
            </h3>
            {problem.sampleTestCases.map((testCase, index) => (
              <div
                key={index}
                className="bg-slate-800 rounded-lg p-6 border border-slate-700"
              >
                <div className="mb-4">
                  <h4 className="text-sm font-semibold text-gray-400 mb-2">
                    Input:
                  </h4>
                  <pre className="bg-slate-900 rounded p-4 text-sm text-gray-300 overflow-x-auto border border-slate-700">
                    {testCase.input}
                  </pre>
                </div>

                <div>
                  <h4 className="text-sm font-semibold text-gray-400 mb-2">
                    Output:
                  </h4>
                  <pre className="bg-slate-900 rounded p-4 text-sm text-gray-300 overflow-x-auto border border-slate-700">
                    {testCase.output}
                  </pre>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default ProblemView