import React, { useState } from "react";
import {
  Play,
  Terminal,
  Info,
  AlertCircle,
  CheckCircle2,
  Database,
  Zap,
  Copy,
  Download,
  Lightbulb,
  GitBranch,
  Filter,
  RefreshCw,
  BarChart3
} from "lucide-react";

import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { vscDarkPlus } from "react-syntax-highlighter/dist/esm/styles/prism";

import { queryService } from "../services/api";
import { Button, Card, CardHeader, CardTitle, CardContent, Badge } from "../components/ui";

const SAMPLE_QUERIES = [
  { label: "Current Time", query: "SELECT NOW();" },
  { label: "Generate Series", query: "SELECT generate_series(1,100);" },
  { label: "Simple Query", query: "SELECT 1;" }
];

const Analyzer = () => {
  const [query, setQuery] = useState(SAMPLE_QUERIES[0].query);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);

  const handleAnalyze = async () => {
    if (!query.trim()) return;

    setLoading(true);
    setError(null);
    setResult(null);

    try {

      const response = await queryService.execute(query);

      setResult(response.data);

    } catch (err) {

      console.error("Query failed:", err);

      setError(
        err.response?.data?.error ||
        err.response?.data?.message ||
        err.message ||
        "Query execution failed"
      );

    } finally {
      setLoading(false);
    }
  };

  const loadSample = (q) => {
    setQuery(q);
    setResult(null);
    setError(null);
  };

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
  };

  const downloadReport = () => {
    if (!result) return;

    const blob = new Blob([JSON.stringify(result, null, 2)], {
      type: "application/json"
    });

    const url = URL.createObjectURL(blob);

    const a = document.createElement("a");
    a.href = url;
    a.download = `sql-analysis-${Date.now()}.json`;
    a.click();

    URL.revokeObjectURL(url);
  };

  const getComplexity = (q) => {
    const qUpper = q.toUpperCase();
    let score = 0;

    if (qUpper.includes("JOIN")) score += 2;
    if (qUpper.includes("GROUP BY")) score += 2;
    if (qUpper.includes("WHERE")) score += 1;
    if (qUpper.includes("ORDER BY")) score += 1;

    if (score > 5) return { label: "High", color: "destructive" };
    if (score > 2) return { label: "Medium", color: "warning" };
    return { label: "Low", color: "success" };
  };

  return (
    <div className="space-y-6">

      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-extrabold">Query Analyzer</h2>

        <div className="flex gap-2">
          {SAMPLE_QUERIES.map((s, idx) => (
            <Button
              key={idx}
              variant="ghost"
              size="sm"
              onClick={() => loadSample(s.query)}
            >
              {s.label}
            </Button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

        <Card className="lg:col-span-2">
          <CardHeader className="flex flex-row justify-between">
            <div className="flex items-center space-x-2">
              <Terminal className="w-5 h-5" />
              <CardTitle>SQL Editor</CardTitle>
            </div>

            <Badge variant="outline">SQL Syntax</Badge>
          </CardHeader>

          <CardContent className="p-0">

            <div className="relative">

              <div className="p-6 h-64 overflow-auto">

                <textarea
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  className="w-full h-full bg-transparent font-mono text-sm focus:outline-none resize-none"
                />

                <SyntaxHighlighter
                  language="sql"
                  style={vscDarkPlus}
                  customStyle={{
                    position: "absolute",
                    top: 0,
                    left: 0,
                    width: "100%",
                    height: "100%",
                    background: "transparent",
                    pointerEvents: "none"
                  }}
                >
                  {query || " "}
                </SyntaxHighlighter>

              </div>

              <div className="absolute top-4 right-4 flex gap-2">

                <Button
                  variant="secondary"
                  size="icon"
                  onClick={() => copyToClipboard(query)}
                >
                  <Copy className="w-4 h-4" />
                </Button>

                <Button
                  variant="secondary"
                  size="icon"
                  onClick={() => setQuery("")}
                >
                  <RefreshCw className="w-4 h-4" />
                </Button>

              </div>

            </div>

            <div className="p-4 border-t flex justify-between items-center">

              <div className="flex items-center gap-4 text-xs">
                <span className="flex items-center gap-1">
                  <Database className="w-3.5 h-3.5" /> PostgreSQL
                </span>

                <span className="flex items-center gap-1">
                  <Info className="w-3.5 h-3.5" /> Execution Simulation
                </span>
              </div>

              <Button onClick={handleAnalyze} disabled={loading}>

                {loading ? (
                  <>
                    <Zap className="w-4 h-4 mr-2 animate-bounce" />
                    Running...
                  </>
                ) : (
                  <>
                    <Play className="w-4 h-4 mr-2" />
                    Execute Analysis
                  </>
                )}

              </Button>

            </div>

          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BarChart3 className="w-5 h-5" /> Metrics Context
            </CardTitle>
          </CardHeader>

          <CardContent>

            <div className="space-y-4">

              <div>
                <label className="text-xs font-bold uppercase">
                  Complexity
                </label>

                <div className="flex justify-between p-3 border rounded">

                  <span>Analyzed Score</span>

                  <Badge variant={getComplexity(query).color}>
                    {getComplexity(query).label}
                  </Badge>

                </div>
              </div>

              <div>
                <label className="text-xs font-bold uppercase">
                  Suggested Indexing
                </label>

                <div className="p-3 border rounded flex items-center gap-3">
                  <GitBranch className="w-4 h-4" />
                  <span>Auto-detection active</span>
                </div>
              </div>

            </div>

          </CardContent>
        </Card>

      </div>

      {error && (
        <Card className="border-red-500">
          <CardContent className="p-4 flex items-center gap-3 text-red-500">
            <AlertCircle className="w-5 h-5" />
            <span>{error}</span>
          </CardContent>
        </Card>
      )}

      {result && (
        <Card>

          <CardHeader className="flex flex-row justify-between">
            <CardTitle className="flex items-center gap-2">
              <CheckCircle2 className="w-5 h-5 text-green-500" />
              Analysis Result
            </CardTitle>

            <Button
              variant="ghost"
              size="icon"
              onClick={downloadReport}
            >
              <Download className="w-4 h-4" />
            </Button>

          </CardHeader>

          <CardContent>

            <div className="grid grid-cols-2 gap-6 mb-6">

              <div>
                <span className="text-xs">Execution Time</span>

                <p className="text-2xl font-bold">
                  {result.executionTime}
                </p>
              </div>

              <div>
                <span className="text-xs">Status</span>

                <p className="text-2xl font-bold">
                  {result.status}
                </p>
              </div>

            </div>

            <div>

              <h4 className="text-sm font-bold flex items-center gap-2">
                <AlertCircle className="w-4 h-4" /> Warnings
              </h4>

              {result.warnings?.map((w, i) => (
                <div key={i} className="p-2 text-sm">
                  {w}
                </div>
              ))}

            </div>

            <div className="mt-4">

              <h4 className="text-sm font-bold flex items-center gap-2">
                <Lightbulb className="w-4 h-4" /> Suggestions
              </h4>

              {result.suggestions?.map((s, i) => (
                <div key={i} className="p-2 text-sm">
                  {s}
                </div>
              ))}

            </div>

          </CardContent>

        </Card>
      )}

    </div>
  );
};

export default Analyzer;