import React, { useEffect, useState, useCallback } from 'react';
import { 
  History as HistoryIcon, 
  Search, 
  ChevronLeft, 
  ChevronRight, 
  ExternalLink,
  Clock,
  AlertTriangle,
  CheckCircle2,
  Filter,
  Download,
  Trash2
} from 'lucide-react';
import { queryService } from '../services/api';
import { Button, Card, CardHeader, CardTitle, CardContent, Badge } from '../components/ui';

const History = () => {
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [filter, setFilter] = useState('ALL'); // ALL, SLOW, FAST, ERROR

  const fetchHistory = useCallback(async () => {
    setLoading(true);
    try {
      const limit = 10;
      const response = await queryService.getHistory(page, limit);
      const { logs, total } = response.data;
      setHistory(logs || []);
      setTotalPages(Math.ceil((total || 0) / limit));
    } catch (error) {
      console.error("Failed to fetch history:", error);
    } finally {
      setLoading(false);
    }
  }, [page]);

  useEffect(() => {
    fetchHistory();
  }, [fetchHistory]);

  const filteredHistory = history.filter(item => {
    if (filter === 'ALL') return true;
    if (filter === 'SLOW') return item.is_slow === 1;
    if (filter === 'FAST') return item.is_slow === 0 && item.status === 'SUCCESS';
    if (filter === 'ERROR') return item.status === 'ERROR';
    return true;
  });

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-right duration-500">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-3xl font-extrabold tracking-tight">Query History</h2>
          <p className="text-muted-foreground">Audit log of all analyzed and executed SQL queries.</p>
        </div>
        <div className="flex items-center gap-2">
           <Button variant="outline" size="sm"><Download className="w-4 h-4 mr-2" /> Export JSON</Button>
           <Button variant="outline" size="sm" className="text-destructive hover:bg-destructive/10 border-destructive/20"><Trash2 className="w-4 h-4 mr-2" /> Clear All</Button>
        </div>
      </div>

      <Card className="border-primary/10 shadow-sm">
        <CardHeader className="border-b border-border bg-accent/5">
           <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div className="relative flex-1 max-w-sm">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <input 
                  type="text" 
                  placeholder="Search queries..." 
                  className="w-full pl-10 pr-4 py-2 bg-background border border-border rounded-lg text-sm focus:ring-2 focus:ring-primary focus:outline-none transition-all duration-200"
                />
              </div>
              <div className="flex items-center gap-2">
                 <Filter className="w-4 h-4 text-muted-foreground mr-2" />
                 {['ALL', 'SLOW', 'FAST', 'ERROR'].map((f) => (
                   <Button 
                    key={f}
                    variant={filter === f ? 'default' : 'ghost'} 
                    size="sm" 
                    onClick={() => setFilter(f)}
                    className="text-xs h-8 px-4"
                   >
                     {f}
                   </Button>
                 ))}
              </div>
           </div>
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead>
                <tr className="bg-muted/30 border-b border-border">
                  <th className="px-6 py-4 font-bold text-muted-foreground uppercase tracking-wider">Query Snippet</th>
                  <th className="px-6 py-4 font-bold text-muted-foreground uppercase tracking-wider text-center">Execution Time</th>
                  <th className="px-6 py-4 font-bold text-muted-foreground uppercase tracking-wider text-center">Performance</th>
                  <th className="px-6 py-4 font-bold text-muted-foreground uppercase tracking-wider">Executed At</th>
                  <th className="px-6 py-4 font-bold text-muted-foreground uppercase tracking-wider text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {loading ? (
                  Array.from({ length: 5 }).map((_, i) => (
                    <tr key={i} className="animate-pulse">
                      <td colSpan="5" className="px-6 py-10 bg-accent/5"></td>
                    </tr>
                  ))
                ) : filteredHistory.length > 0 ? (
                  filteredHistory.map((item) => (
                    <tr key={item.id} className="hover:bg-accent/20 transition-colors duration-150 group">
                      <td className="px-6 py-4">
                        <div className="flex flex-col gap-1">
                           <code className="text-xs bg-muted p-1 px-2 rounded font-semibold text-primary truncate max-w-[300px] block">
                             {item.query_text}
                           </code>
                           <span className="text-[10px] text-muted-foreground font-mono">ID: {item.id}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-center font-mono font-bold">
                        {item.execution_time_ms} ms
                      </td>
                      <td className="px-6 py-4 text-center">
                        {item.status === 'ERROR' ? (
                          <Badge variant="destructive">ERROR</Badge>
                        ) : item.is_slow === 1 ? (
                          <Badge variant="warning">SLOW</Badge>
                        ) : (
                          <Badge variant="success">FAST</Badge>
                        )}
                      </td>
                      <td className="px-6 py-4 text-muted-foreground whitespace-nowrap">
                         {new Date(item.executed_at).toLocaleString()}
                      </td>
                      <td className="px-6 py-4 text-right">
                         <Button variant="ghost" size="icon" className="group-hover:text-primary transition-all duration-200">
                           <ExternalLink className="w-4 h-4" />
                         </Button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="5" className="px-6 py-20 text-center text-muted-foreground font-medium italic">
                       No queries found matching the current filter.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          <div className="p-4 border-t border-border flex items-center justify-between bg-accent/5">
             <p className="text-xs text-muted-foreground font-medium">
                Showing <span className="text-foreground">{filteredHistory.length}</span> of <span className="text-foreground">{history.length}</span> results
             </p>
             <div className="flex items-center gap-2">
                <Button 
                  variant="outline" 
                  size="icon" 
                  onClick={() => setPage(p => Math.max(1, p - 1))} 
                  disabled={page === 1}
                  className="h-8 w-8"
                >
                  <ChevronLeft className="w-4 h-4" />
                </Button>
                <span className="text-xs font-bold px-3 py-1 bg-background border border-border rounded">Page {page}</span>
                <Button 
                  variant="outline" 
                  size="icon" 
                  onClick={() => setPage(p => p + 1)} 
                  disabled={page >= totalPages}
                  className="h-8 w-8"
                >
                  <ChevronRight className="w-4 h-4" />
                </Button>
             </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default History;
