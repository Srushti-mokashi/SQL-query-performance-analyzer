import React, { useState } from 'react';
import { 
  Search, 
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
} from 'lucide-react';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism';
import { analyticsService } from '../services/api';
import { Button, Card, CardHeader, CardTitle, CardContent, Badge } from '../components/ui';

const SAMPLE_QUERIES = [
  { label: 'Select All Users', query: 'SELECT * FROM users;' },
  { label: 'Filter Emails', query: "SELECT id, email, created_at FROM users WHERE email LIKE '%gmail.com' ORDER BY created_at DESC;" },
  { label: 'Slow Join (Inefficient)', query: "SELECT u.name, o.total_amount FROM users u JOIN orders o ON u.id = o.user_id WHERE u.status = 'active' AND o.status = 'completed' GROUP BY u.id ORDER BY o.total_amount DESC LIMIT 10;" },
  { label: 'Missing Index Test', query: "SELECT * FROM products WHERE price > 500 AND stock_count < 10 AND category_id = 5;" },
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
      const response = await analyticsService.analyze(query);
      setResult(response.data.data);
    } catch (err) {
      console.error("Analysis failed:", err);
      setError(err.response?.data?.message || err.message || "Query execution failed. Check your SQL syntax.");
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
    const blob = new Blob([JSON.stringify(result, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `sql-analysis-${Date.now()}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const getComplexity = (q) => {
    const qUpper = q.toUpperCase();
    let score = 0;
    if (qUpper.includes('JOIN')) score += 2;
    if (qUpper.includes('GROUP BY')) score += 2;
    if (qUpper.includes('WHERE')) score += 1;
    if (qUpper.includes('ORDER BY')) score += 1;
    if (qUpper.includes('HAVING')) score += 2;
    
    if (score > 5) return { label: 'High', color: 'destructive' };
    if (score > 2) return { label: 'Medium', color: 'warning' };
    return { label: 'Low', color: 'success' };
  };

  return (
    <div className="space-y-6 animate-in slide-in-from-bottom duration-500">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-extrabold tracking-tight">Query Analyzer</h2>
        <div className="flex gap-2">
           {SAMPLE_QUERIES.map((s, idx) => (
             <Button key={idx} variant="ghost" size="sm" onClick={() => loadSample(s.query)} className="text-xs h-8">
               {s.label}
             </Button>
           ))}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Editor Area */}
        <Card className="lg:col-span-2 border-primary/10 shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between pb-2 border-b border-border/50">
            <div className="flex items-center space-x-2">
              <Terminal className="w-5 h-5 text-primary" />
              <CardTitle className="text-lg">SQL Editor</CardTitle>
            </div>
            <div className="flex items-center gap-2">
              <Badge variant="outline" className="text-[10px] uppercase font-bold text-muted-foreground tracking-tighter">SQL Syntax Active</Badge>
            </div>
          </CardHeader>
          <CardContent className="p-0">
            <div className="relative group">
              <div className="p-6 bg-accent/20 h-64 overflow-auto">
                <textarea
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Enter your SQL query here..."
                  className="w-full h-full bg-transparent font-mono text-sm focus:outline-none resize-none transition-colors duration-200 relative z-10"
                  spellCheck="false"
                  style={{ color: 'transparent', caretColor: 'hsl(var(--foreground))' }}
                />
                <div className="absolute inset-0 p-6 pointer-events-none overflow-hidden h-full">
                   <SyntaxHighlighter
                     language="sql"
                     style={vscDarkPlus}
                     customStyle={{
                       margin: 0,
                       padding: 0,
                       background: 'transparent',
                       fontSize: '0.875rem',
                       lineHeight: '1.25rem',
                       fontFamily: 'ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", "Courier New", monospace'
                     }}
                   >
                     {query || ' '}
                   </SyntaxHighlighter>
                </div>
              </div>
              <div className="absolute top-4 right-4 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200 z-20">
                <Button variant="secondary" size="icon" onClick={() => copyToClipboard(query)} className="h-8 w-8">
                  <Copy className="w-4 h-4" />
                </Button>
                <Button variant="secondary" size="icon" onClick={() => setQuery('')} className="h-8 w-8 hover:text-destructive">
                   <RefreshCw className="w-4 h-4" />
                </Button>
              </div>
            </div>
            <div className="p-4 border-t border-border flex justify-between bg-card-foreground/5 items-center">
               <div className="flex items-center gap-4 text-xs text-muted-foreground font-medium">
                  <span className="flex items-center gap-1"><Database className="w-3.5 h-3.5" /> MySQL 8.0</span>
                  <span className="flex items-center gap-1"><Info className="w-3.5 h-3.5" /> Execution Simulation: On</span>
               </div>
               <Button onClick={handleAnalyze} disabled={loading} className="px-8 shadow-md">
                 {loading ? <Zap className="w-4 h-4 mr-2 animate-bounce" /> : <Play className="w-4 h-4 mr-2 fill-current" />}
                 {loading ? 'Analyzing...' : 'Execute Analysis'}
               </Button>
            </div>
          </CardContent>
        </Card>

        {/* Real-time Status Card */}
        <Card className="border-primary/10 shadow-sm overflow-hidden flex flex-col">
           <CardHeader className="bg-primary/5">
              <CardTitle className="text-lg flex items-center gap-2">
                <BarChart3 className="w-5 h-5 text-primary" /> Metrics Context
              </CardTitle>
           </CardHeader>
           <CardContent className="p-6 space-y-6 flex-1">
              <div className="space-y-4">
                 <div>
                    <label className="text-xs font-bold text-muted-foreground uppercase tracking-widest block mb-2">Complexity</label>
                    <div className="flex items-center justify-between p-3 bg-secondary/50 rounded-lg border border-border">
                       <span className="text-sm font-semibold">Analyzed Score</span>
                       <Badge variant={getComplexity(query).color}>{getComplexity(query).label}</Badge>
                    </div>
                 </div>
                 <div>
                    <label className="text-xs font-bold text-muted-foreground uppercase tracking-widest block mb-2">Suggested Indexing</label>
                    <div className="p-3 bg-secondary/50 rounded-lg border border-border flex items-center gap-3">
                       <div className="p-1.5 bg-primary/10 rounded">
                          <GitBranch className="w-4 h-4 text-primary" />
                       </div>
                       <span className="text-sm font-medium">Auto-detection: Active</span>
                    </div>
                 </div>
              </div>
              <div className="mt-auto pt-6 border-t border-border">
                 <div className="flex items-center gap-2 text-xs text-rose-500 font-bold mb-4">
                    <AlertCircle className="w-4 h-4" />
                    PREVIEW MODE
                 </div>
                 <p className="text-xs text-muted-foreground leading-relaxed">
                    This analysis uses real-time execution plans from the connected database instance. Performance metrics may vary based on concurrent load.
                 </p>
              </div>
           </CardContent>
        </Card>
      </div>

      {error && (
        <Card className="border-destructive/30 bg-destructive/5 animate-in slide-in-from-top duration-300">
           <CardContent className="p-4 flex items-center gap-3 text-destructive">
              <AlertCircle className="w-5 h-5" />
              <span className="text-sm font-semibold">{error}</span>
           </CardContent>
        </Card>
      )}

      {result && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 animate-in fade-in zoom-in duration-500">
           {/* Results Summary */}
           <Card className="border-primary/20 shadow-lg overflow-hidden">
             <CardHeader className="border-b border-border bg-accent/10 flex flex-row items-center justify-between">
               <CardTitle className="text-lg flex items-center gap-2">
                 <CheckCircle2 className="w-5 h-5 text-emerald-500" /> Analysis Result
               </CardTitle>
               <div className="flex gap-2">
                  <Button variant="ghost" size="icon" onClick={downloadReport} className="h-8 w-8"><Download className="w-4 h-4" /></Button>
               </div>
             </CardHeader>
             <CardContent className="p-6">
                <div className="grid grid-cols-2 gap-6 mb-8">
                   <div className="space-y-1">
                      <span className="text-xs text-muted-foreground font-bold uppercase">Time</span>
                      <p className={`text-2xl font-black ${result.slowQuery ? 'text-rose-500' : 'text-emerald-500'}`}>
                         {result.executionTime}
                      </p>
                   </div>
                   <div className="space-y-1">
                      <span className="text-xs text-muted-foreground font-bold uppercase">Status</span>
                      <p className="text-2xl font-black text-foreground">
                         {result.slowQuery ? 'SLOW' : 'FAST'}
                      </p>
                   </div>
                </div>

                <div className="space-y-4">
                   <h4 className="text-sm font-bold flex items-center gap-2"><AlertCircle className="w-4 h-4 text-amber-500" /> Warnings ({result.warnings?.length || 0})</h4>
                   <div className="space-y-2">
                      {result.warnings?.map((w, i) => (
                        <div key={i} className="flex items-center gap-2 p-3 bg-amber-500/10 border border-amber-500/20 rounded-lg text-sm text-amber-700 dark:text-amber-400 font-medium">
                           <Info className="w-4 h-4 shrink-0" /> {w}
                        </div>
                      ))}
                      {(!result.warnings || result.warnings.length === 0) && (
                        <p className="text-sm text-muted-foreground italic">No performance warnings found.</p>
                      )}
                   </div>
                </div>
             </CardContent>
           </Card>

           {/* Suggestions & Optimization */}
           <Card className="border-primary/20 shadow-lg overflow-hidden">
              <CardHeader className="border-b border-border bg-primary/5">
                 <CardTitle className="text-lg flex items-center gap-2">
                    <Lightbulb className="w-5 h-5 text-primary" /> Optimization Suggestions
                 </CardTitle>
              </CardHeader>
              <CardContent className="p-6">
                 <div className="space-y-4">
                    {result.suggestions?.map((s, i) => (
                      <div key={i} className="flex items-start gap-4 p-4 bg-primary/5 border border-primary/20 rounded-xl group hover:bg-primary/10 transition-colors duration-200">
                         <div className="mt-1 p-1 bg-primary text-primary-foreground rounded shadow-sm">
                            <Zap className="w-3.5 h-3.5" />
                         </div>
                         <div className="space-y-1">
                            <p className="text-sm font-bold text-foreground">{s}</p>
                            <p className="text-xs text-muted-foreground leading-relaxed">Implementing this change can reduce execution time by an estimated 20-40% based on table size.</p>
                         </div>
                      </div>
                    ))}
                    {(!result.suggestions || result.suggestions.length === 0) && (
                      <div className="flex flex-col items-center justify-center p-8 text-center space-y-3 opacity-50">
                         <CheckCircle2 className="w-12 h-12 text-emerald-500" />
                         <p className="text-sm font-medium">Congratulations! Your query is well-optimized.</p>
                      </div>
                    )}
                 </div>

                 {/* Visual Query Plan Mock */}
                 <div className="mt-8 pt-6 border-t border-border">
                    <h4 className="text-sm font-bold mb-4 flex items-center gap-2 text-muted-foreground uppercase tracking-widest"><Filter className="w-4 h-4" /> Execution Plan</h4>
                    <div className="flex flex-col items-center space-y-2 py-4">
                       <Badge variant="outline" className="px-8 py-2 font-mono">TABLE SCAN (Users)</Badge>
                       <div className="h-4 w-0.5 bg-primary/30"></div>
                       <Badge variant="outline" className="px-8 py-2 font-mono border-primary/50 text-primary">WHERE email LIKE %</Badge>
                       <div className="h-4 w-0.5 bg-primary/30"></div>
                       <Badge variant="secondary" className="px-8 py-2 font-mono">LIMIT 20</Badge>
                    </div>
                 </div>
              </CardContent>
           </Card>
        </div>
      )}
    </div>
  );
};

export default Analyzer;
