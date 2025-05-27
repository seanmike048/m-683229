
import React, { useState, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { AlertCircle, CheckCircle, Info, Upload, FileText, BarChart3, TrendingUp, Eye, Search, Zap } from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { validateBidRequest, BidRequestValidationResult, ValidationIssue } from '@/utils/bidRequestValidator';
import { formatJSON } from '@/utils/jsonFormatter';
import { BID_REQUEST_EXAMPLES } from '@/utils/bidRequestExamples';
import { JsonHighlighter } from '@/components/JsonHighlighter';
import { BidRequestAnalyzer } from '@/components/BidRequestAnalyzer';

const BidVerificator = () => {
  const [jsonInput, setJsonInput] = useState('');
  const [validationResult, setValidationResult] = useState<BidRequestValidationResult | null>(null);
  const [isValidating, setIsValidating] = useState(false);
  const [selectedExample, setSelectedExample] = useState('');
  const [issueFilter, setIssueFilter] = useState('all');
  const [highlightedPath, setHighlightedPath] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  const handleAnalyze = async () => {
    if (!jsonInput.trim()) {
      toast({
        title: "No Input",
        description: "Please paste a bid request JSON or upload a file",
        variant: "destructive"
      });
      return;
    }

    setIsValidating(true);
    try {
      const result = await validateBidRequest(jsonInput);
      setValidationResult(result);
      
      const errorCount = result.issues.filter(i => i.severity === 'error').length;
      const warningCount = result.issues.filter(i => i.severity === 'warning').length;
      
      toast({
        title: "Validation Complete",
        description: `Found ${errorCount} errors and ${warningCount} warnings`,
        variant: errorCount > 0 ? "destructive" : "default"
      });
    } catch (error) {
      toast({
        title: "Validation Error",
        description: "Failed to validate bid request. Please check your JSON format.",
        variant: "destructive"
      });
    } finally {
      setIsValidating(false);
    }
  };

  const handleClear = () => {
    setJsonInput('');
    setValidationResult(null);
    setSelectedExample('');
    setHighlightedPath(null);
  };

  const handleFormatJSON = () => {
    try {
      const formatted = formatJSON(jsonInput);
      setJsonInput(formatted);
      toast({
        title: "JSON Formatted",
        description: "Your JSON has been properly formatted",
      });
    } catch (error) {
      toast({
        title: "Format Error",
        description: "Invalid JSON format. Please check your input.",
        variant: "destructive"
      });
    }
  };

  const handleLoadExample = (exampleKey: string) => {
    if (exampleKey && BID_REQUEST_EXAMPLES[exampleKey]) {
      setJsonInput(JSON.stringify(BID_REQUEST_EXAMPLES[exampleKey], null, 2));
      setSelectedExample(exampleKey);
      setValidationResult(null);
      setHighlightedPath(null);
    }
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const content = e.target?.result as string;
        setJsonInput(content);
        setValidationResult(null);
        setHighlightedPath(null);
        toast({
          title: "File Loaded",
          description: `Successfully loaded ${file.name}`,
        });
      };
      reader.readAsText(file);
    }
  };

  const handleIssueClick = (fieldPath: string) => {
    setHighlightedPath(fieldPath);
    // Smooth scroll to the JSON input area
    document.getElementById('json-input-area')?.scrollIntoView({ 
      behavior: 'smooth', 
      block: 'center' 
    });
  };

  const getFilteredIssues = () => {
    if (!validationResult) return [];
    
    switch (issueFilter) {
      case 'errors':
        return validationResult.issues.filter(i => i.severity === 'error');
      case 'warnings':
        return validationResult.issues.filter(i => i.severity === 'warning');
      case 'info':
        return validationResult.issues.filter(i => i.severity === 'info');
      default:
        return validationResult.issues;
    }
  };

  const getSeverityIcon = (severity: string) => {
    switch (severity) {
      case 'error':
        return <AlertCircle className="h-4 w-4 text-red-500" />;
      case 'warning':
        return <AlertCircle className="h-4 w-4 text-orange-500" />;
      case 'info':
        return <Info className="h-4 w-4 text-blue-500" />;
      default:
        return <CheckCircle className="h-4 w-4 text-green-500" />;
    }
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'error':
        return 'bg-red-50 border-red-200 text-red-800 hover:bg-red-100';
      case 'warning':
        return 'bg-orange-50 border-orange-200 text-orange-800 hover:bg-orange-100';
      case 'info':
        return 'bg-blue-50 border-blue-200 text-blue-800 hover:bg-blue-100';
      default:
        return 'bg-green-50 border-green-200 text-green-800 hover:bg-green-100';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-gray-900 to-black">
      {/* Equativ Header */}
      <div className="bg-black border-b border-orange-500/20">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="text-2xl font-bold text-white">EQUATIV</div>
              <div className="h-6 w-px bg-orange-500"></div>
              <h1 className="text-xl font-semibold text-white">OpenRTB Bid Verificator</h1>
            </div>
            <div className="flex items-center gap-4">
              <Badge variant="outline" className="border-orange-500 text-orange-400 bg-orange-500/10">
                NextGen Platform
              </Badge>
              <Button className="bg-orange-500 hover:bg-orange-600 text-white px-6">
                Contact Us
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto p-6">
        {/* Hero Section */}
        <div className="text-center mb-8 animate-fade-in">
          <h2 className="text-3xl font-bold text-white mb-2">
            Smarter Ads, <span className="text-orange-500">Better Outcomes</span>
          </h2>
          <p className="text-gray-400 text-lg max-w-2xl mx-auto">
            Advanced OpenRTB bid request validation with intelligent analysis and comprehensive rule checking
          </p>
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
          {/* Left Panel - Input Controls */}
          <div className="space-y-4 animate-slide-up" style={{ '--delay': '100ms' } as React.CSSProperties}>
            <Card className="bg-gray-900/50 border-gray-700 backdrop-blur-sm">
              <CardHeader className="border-b border-gray-700">
                <CardTitle className="flex items-center gap-2 text-white">
                  <FileText className="h-5 w-5 text-orange-500" />
                  Bid Request Input
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4 pt-6">
                {/* Control Buttons Row 1 */}
                <div className="flex flex-wrap gap-3">
                  <Button 
                    onClick={handleAnalyze}
                    disabled={isValidating}
                    className="flex-1 min-w-[140px] bg-orange-500 hover:bg-orange-600 text-white font-semibold shadow-lg"
                  >
                    <Zap className="h-4 w-4 mr-2" />
                    {isValidating ? 'Analyzing...' : 'Analyze Request'}
                  </Button>
                  <Button 
                    variant="outline" 
                    onClick={handleClear}
                    className="border-2 border-gray-500 text-gray-200 hover:bg-gray-700 hover:border-gray-400 bg-gray-800/50 font-medium"
                  >
                    Clear All
                  </Button>
                  <Button 
                    variant="outline" 
                    onClick={handleFormatJSON}
                    className="border-2 border-blue-500/50 text-blue-300 hover:bg-blue-900/30 hover:border-blue-400 bg-blue-900/10 font-medium"
                  >
                    Format JSON
                  </Button>
                </div>

                {/* Control Buttons Row 2 */}
                <div className="flex flex-wrap gap-3">
                  <Select value={selectedExample} onValueChange={handleLoadExample}>
                    <SelectTrigger className="flex-1 bg-gray-800 border-gray-600 text-gray-200 hover:border-gray-500">
                      <SelectValue placeholder="Load Example..." />
                    </SelectTrigger>
                    <SelectContent className="bg-gray-800 border-gray-600">
                      <SelectItem value="display">Valid Display Ad</SelectItem>
                      <SelectItem value="video">Valid Video (In-Stream)</SelectItem>
                      <SelectItem value="native">Valid Native Ad</SelectItem>
                      <SelectItem value="ctv">Valid CTV Ad</SelectItem>
                      <SelectItem value="audio">Valid Audio Ad</SelectItem>
                      <SelectItem value="gdpr">Request with GDPR</SelectItem>
                    </SelectContent>
                  </Select>
                  
                  <Button 
                    variant="outline" 
                    onClick={() => fileInputRef.current?.click()}
                    className="flex items-center gap-2 border-2 border-purple-500/50 text-purple-300 hover:bg-purple-900/30 hover:border-purple-400 bg-purple-900/10 font-medium"
                  >
                    <Upload className="h-4 w-4" />
                    Upload File
                  </Button>
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept=".json,.txt"
                    onChange={handleFileUpload}
                    className="hidden"
                  />
                </div>

                {/* Validation Profile */}
                <div className="flex items-center gap-2 pt-2">
                  <span className="text-sm font-medium text-gray-300">Validation Mode:</span>
                  <Badge className="bg-orange-500/20 text-orange-400 border-orange-500/30">
                    Auto-Detect Request Type
                  </Badge>
                  <Badge className="bg-blue-500/20 text-blue-400 border-blue-500/30">
                    Universal Parser (120 Rules)
                  </Badge>
                </div>

                {/* JSON Input Area with Enhanced Syntax Highlighting */}
                <div className="relative" id="json-input-area">
                  <JsonHighlighter
                    value={jsonInput}
                    onChange={setJsonInput}
                    highlightedPath={highlightedPath}
                    placeholder="Paste your OpenRTB JSON bid request here..."
                  />
                  {jsonInput && (
                    <div className="absolute top-3 right-3 z-10 flex gap-2">
                      <Badge variant="outline" className="bg-black/80 text-orange-400 border-orange-500/50 font-mono">
                        {jsonInput.split('\n').length} lines
                      </Badge>
                      <Badge variant="outline" className="bg-black/80 text-blue-400 border-blue-500/50 font-mono">
                        {Math.round(jsonInput.length / 1024 * 10) / 10}KB
                      </Badge>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Right Panel - Results */}
          <div className="space-y-4 animate-slide-up" style={{ '--delay': '200ms' } as React.CSSProperties}>
            {/* Bid Request Analysis */}
            {validationResult && (
              <BidRequestAnalyzer 
                jsonInput={jsonInput}
                validationResult={validationResult}
              />
            )}

            {/* Validation Summary */}
            {validationResult && (
              <Card className="bg-gray-900/50 border-gray-700 backdrop-blur-sm">
                <CardHeader className="border-b border-gray-700">
                  <CardTitle className="flex items-center gap-2 text-white">
                    <BarChart3 className="h-5 w-5 text-orange-500" />
                    Validation Summary
                  </CardTitle>
                </CardHeader>
                <CardContent className="pt-6">
                  <div className="grid grid-cols-3 gap-4 mb-4">
                    <div className="text-center p-4 bg-red-500/10 border border-red-500/20 rounded-lg">
                      <div className="text-2xl font-bold text-red-400">
                        {validationResult.issues.filter(i => i.severity === 'error').length}
                      </div>
                      <div className="text-sm text-gray-400">Errors</div>
                    </div>
                    <div className="text-center p-4 bg-orange-500/10 border border-orange-500/20 rounded-lg">
                      <div className="text-2xl font-bold text-orange-400">
                        {validationResult.issues.filter(i => i.severity === 'warning').length}
                      </div>
                      <div className="text-sm text-gray-400">Warnings</div>
                    </div>
                    <div className="text-center p-4 bg-blue-500/10 border border-blue-500/20 rounded-lg">
                      <div className="text-2xl font-bold text-blue-400">
                        {validationResult.issues.filter(i => i.severity === 'info').length}
                      </div>
                      <div className="text-sm text-gray-400">Info</div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Issue Filters & List */}
            {validationResult && (
              <Card className="bg-gray-900/50 border-gray-700 backdrop-blur-sm">
                <CardHeader className="border-b border-gray-700">
                  <CardTitle className="flex items-center gap-2 text-white">
                    <Search className="h-5 w-5 text-orange-500" />
                    Issues Found
                  </CardTitle>
                </CardHeader>
                <CardContent className="pt-6">
                  <div className="flex flex-wrap gap-2 mb-4">
                    <Button
                      variant={issueFilter === 'all' ? 'default' : 'outline'}
                      size="sm"
                      onClick={() => setIssueFilter('all')}
                      className={issueFilter === 'all' ? 'bg-orange-500 hover:bg-orange-600' : 'border-gray-600 text-gray-300 hover:bg-gray-800'}
                    >
                      All ({validationResult.issues.length})
                    </Button>
                    <Button
                      variant={issueFilter === 'errors' ? 'default' : 'outline'}
                      size="sm"
                      onClick={() => setIssueFilter('errors')}
                      className={issueFilter === 'errors' ? 'bg-red-500 hover:bg-red-600' : 'border-gray-600 text-gray-300 hover:bg-gray-800'}
                    >
                      Errors ({validationResult.issues.filter(i => i.severity === 'error').length})
                    </Button>
                    <Button
                      variant={issueFilter === 'warnings' ? 'default' : 'outline'}
                      size="sm"
                      onClick={() => setIssueFilter('warnings')}
                      className={issueFilter === 'warnings' ? 'bg-orange-500 hover:bg-orange-600' : 'border-gray-600 text-gray-300 hover:bg-gray-800'}
                    >
                      Warnings ({validationResult.issues.filter(i => i.severity === 'warning').length})
                    </Button>
                    <Button
                      variant={issueFilter === 'info' ? 'default' : 'outline'}
                      size="sm"
                      onClick={() => setIssueFilter('info')}
                      className={issueFilter === 'info' ? 'bg-blue-500 hover:bg-blue-600' : 'border-gray-600 text-gray-300 hover:bg-gray-800'}
                    >
                      Info ({validationResult.issues.filter(i => i.severity === 'info').length})
                    </Button>
                  </div>

                  {/* Enhanced Issues List with Better Error Location */}
                  <div className="space-y-3 max-h-[450px] overflow-y-auto custom-scrollbar">
                    {getFilteredIssues().map((issue, index) => (
                      <div
                        key={index}
                        onClick={() => handleIssueClick(issue.fieldPath)}
                        className={`p-4 rounded-lg border cursor-pointer transition-all duration-300 transform hover:scale-[1.02] hover:shadow-xl hover:shadow-orange-500/20 ${getSeverityColor(issue.severity)}`}
                      >
                        <div className="flex items-start gap-3">
                          {getSeverityIcon(issue.severity)}
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 mb-2">
                              <code className="text-sm font-mono bg-black/30 px-3 py-1 rounded-md border border-orange-500/30 text-orange-300">
                                {issue.fieldPath}
                              </code>
                              <Eye className="h-4 w-4 opacity-70 text-orange-400" />
                              <span className="text-xs text-gray-400 font-medium">Click to locate</span>
                            </div>
                            <div className="text-sm font-semibold mb-2">{issue.message}</div>
                            {issue.actualValue && (
                              <div className="text-xs opacity-80 mt-2 p-2 bg-black/20 rounded border">
                                <strong className="text-red-300">Found:</strong> 
                                <code className="ml-2 bg-red-900/30 px-2 py-1 rounded text-red-200 border border-red-500/30">
                                  {String(issue.actualValue)}
                                </code>
                              </div>
                            )}
                            {issue.expectedValue && (
                              <div className="text-xs opacity-80 mt-2 p-2 bg-black/20 rounded border">
                                <strong className="text-green-300">Expected:</strong> 
                                <span className="ml-2 text-green-200">{issue.expectedValue}</span>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                    
                    {getFilteredIssues().length === 0 && (
                      <div className="text-center py-8 text-gray-400">
                        <CheckCircle className="h-12 w-12 mx-auto mb-2 text-green-500" />
                        <div className="text-lg font-medium text-white">No issues found!</div>
                        <div className="text-sm">Your bid request looks good for this filter.</div>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Default state when no validation has been run */}
            {!validationResult && (
              <Card className="bg-gray-900/50 border-gray-700 backdrop-blur-sm">
                <CardContent className="text-center py-12">
                  <TrendingUp className="h-16 w-16 mx-auto mb-4 text-orange-500" />
                  <h3 className="text-lg font-medium text-white mb-2">Ready to Validate</h3>
                  <p className="text-gray-400">
                    Paste your OpenRTB bid request JSON or upload a file to get started with comprehensive validation.
                  </p>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>

      <style>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 8px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: rgba(75, 85, 99, 0.1);
          border-radius: 4px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: rgba(249, 115, 22, 0.4);
          border-radius: 4px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: rgba(249, 115, 22, 0.6);
        }
      `}</style>
    </div>
  );
};

export default BidVerificator;
