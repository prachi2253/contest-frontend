// src/components/CodeEditor.jsx
import { useState, useEffect } from 'react';
import Editor from '@monaco-editor/react';
import { submissionAPI } from '../services/api';

const CodeEditor = ({ problem, contestId, userId }) => {
  const [code, setCode] = useState('');
  const [language, setLanguage] = useState('PYTHON');
  const [submitting, setSubmitting] = useState(false);
  const [submissionId, setSubmissionId] = useState(null);
  const [status, setStatus] = useState(null);
  const [pollingInterval, setPollingInterval] = useState(null);

  const languageTemplates = {
    PYTHON: `# Write your solution here
def solve():
    pass

solve()`,
    CPP: `#include <iostream>
using namespace std;

int main() {
    // Write your solution here
    return 0;
}`,
    JAVA: `import java.util.*;

public class Solution {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        // Write your solution here
    }
}`,
  };

  useEffect(() => {
    setCode(languageTemplates[language]);
  }, [language]);

  useEffect(() => {
    // Cleanup polling on unmount
    return () => {
      if (pollingInterval) {
        clearInterval(pollingInterval);
      }
    };
  }, [pollingInterval]);

  const handleSubmit = async () => {
    if (!code.trim()) {
      alert('Please write some code before submitting!');
      return;
    }

    setSubmitting(true);
    setStatus(null);

    try {
      const response = await submissionAPI.submitCode({
        userId: userId,
        problemId: problem.id,
        contestId: contestId,
        code: code,
        language: language,
      });

      const subId = response.data.submissionId;
      setSubmissionId(subId);
      setStatus({ status: 'PENDING', result: 'Submission queued...' });

      // Start polling for status
      startPolling(subId);
    } catch (error) {
      console.error('Submission error:', error);
      setStatus({
        status: 'ERROR',
        result: 'Failed to submit code. Please try again.',
      });
      setSubmitting(false);
    }
  };

  const startPolling = (subId) => {
    const interval = setInterval(async () => {
      try {
        const response = await submissionAPI.getSubmissionStatus(subId);
        const data = response.data;
        setStatus(data);

        // Stop polling if status is final
        if (
          data.status === 'ACCEPTED' ||
          data.status === 'WRONG_ANSWER' ||
          data.status === 'TIME_LIMIT_EXCEEDED' ||
          data.status === 'COMPILATION_ERROR' ||
          data.status === 'RUNTIME_ERROR'
        ) {
          clearInterval(interval);
          setPollingInterval(null);
          setSubmitting(false);
        }
      } catch (error) {
        console.error('Polling error:', error);
        clearInterval(interval);
        setPollingInterval(null);
        setSubmitting(false);
      }
    }, 2000); // Poll every 2 seconds

    setPollingInterval(interval);
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'ACCEPTED':
        return 'bg-green-500';
      case 'WRONG_ANSWER':
        return 'bg-red-500';
      case 'TIME_LIMIT_EXCEEDED':
        return 'bg-yellow-500';
      case 'COMPILATION_ERROR':
        return 'bg-orange-500';
      case 'RUNTIME_ERROR':
        return 'bg-red-600';
      case 'PENDING':
      case 'RUNNING':
        return 'bg-blue-500';
      default:
        return 'bg-gray-500';
    }
  };

  return (
    <div className="h-full flex flex-col bg-slate-800">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-slate-700">
        <div className="flex items-center gap-4">
          <h3 className="text-white font-medium">Code Editor</h3>
          <select
            value={language}
            onChange={(e) => setLanguage(e.target.value)}
            className="px-3 py-1.5 bg-slate-700 text-white rounded border border-slate-600 focus:outline-none focus:ring-2 focus:ring-primary"
          >
            <option value="PYTHON">Python</option>
            <option value="CPP">C++</option>
            <option value="JAVA">Java</option>
          </select>
        </div>

        <button
          onClick={handleSubmit}
          disabled={submitting || !problem}
          className="px-6 py-2 bg-primary hover:bg-blue-600 text-white font-medium rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {submitting ? 'Submitting...' : 'Submit Code'}
        </button>
      </div>

      {/* Editor */}
      <div className="flex-1 overflow-hidden">
        <Editor
          height="100%"
          language={
            language === 'CPP' ? 'cpp' : language.toLowerCase()
          }
          value={code}
          onChange={(value) => setCode(value)}
          theme="vs-dark"
          options={{
            fontSize: 14,
            minimap: { enabled: false },
            scrollBeyondLastLine: false,
            wordWrap: 'on',
            automaticLayout: true,
          }}
        />
      </div>

      {/* Status Display */}
      {status && (
        <div className="border-t border-slate-700 p-4 bg-slate-900">
          <div className="flex items-start gap-3">
            <div
              className={`mt-1 w-3 h-3 rounded-full ${getStatusColor(
                status.status
              )} ${
                status.status === 'PENDING' || status.status === 'RUNNING'
                  ? 'animate-pulse'
                  : ''
              }`}
            ></div>
            <div className="flex-1">
              <div className="flex items-center justify-between mb-1">
                <h4 className="text-white font-medium">
                  Status: {status.status.replace(/_/g, ' ')}
                </h4>
                {status.executionTime && (
                  <span className="text-sm text-gray-400">
                    {status.executionTime}ms
                  </span>
                )}
              </div>
              {status.result && (
                <p className="text-sm text-gray-300">{status.result}</p>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CodeEditor;