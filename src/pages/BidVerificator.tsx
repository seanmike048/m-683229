
import React, { useState, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { AlertCircle, CheckCircle, Info, Upload, FileText, BarChart3, TrendingUp } from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { validateBidRequest, BidRequestValidationResult, ValidationIssue } from '@/utils/bidRequestValidator';
import { formatJSON } from '@/utils/jsonFormatter';
import { BID_REQUEST_EXAMPLES } from '@/utils/bidRequestExamples';

const BidVerificator = () => {
  const [jsonInput, setJsonInput] = useState('');
  const [validationResult, setValidationResult] = useState<BidRequestValidationResult | null>(null);
  const [isValidating, setIsValidating] = useState(false);
  const [selectedExample, setSelectedExample] = useState('');
  const [issueFilter, setIssueFilter] = useState('all');
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
        toast({
          title: "File Loaded",
          description: `Successfully loaded ${file.name}`,
        });
      };
      reader.readAsText(file);
    }
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
        return <AlertCircle className="h-4 w-4 text-yellow-500" />;
      case 'info':
        return <Info className="h-4 w-4 text-blue-500" />;
      default:
        return <CheckCircle className="h-4 w-4 text-green-500" />;
    }
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'error':
        return 'bg-red-50 border-red-200 text-red-800';
      case 'warning':
        return 'bg-yellow-50 border-yellow-200 text-yellow-800';
      case 'info':
        return 'bg-blue-50 border-blue-200 text-blue-800';
      default:
        return 'bg-green-50 border-green-200 text-green-800';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-indigo-100 p-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8 animate-fade-in">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent mb-2">
            OpenRTB Bid Verificator NextGen
          </h1>
          <p className="text-gray-600 text-lg">
            Comprehensive validation tool for OpenRTB bid requests with 120+ intelligent rules
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Left Panel - Input Controls */}
          <div className="space-y-4 animate-slide-up" style={{ '--delay': '100ms' } as React.CSSProperties}>
            <Card className="glass">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileText className="h-5 w-5" />
                  Bid Request Input
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Control Buttons Row 1 */}
                <div className="flex flex-wrap gap-2">
                  <Button 
                    onClick={handleAnalyze}
                    disabled={isValidating}
                    className="flex-1 min-w-[120px]"
                  >
                    {isValidating ? 'Analyzing...' : 'Analyze Request'}
                  </Button>
                  <Button variant="secondary" onClick={handleClear}>
                    Clear All
                  </Button>
                  <Button variant="outline" onClick={handleFormatJSON}>
                    Format JSON
                  </Button>
                </div>

                {/* Control Buttons Row 2 */}
                <div className="flex flex-wrap gap-2">
                  <Select value={selectedExample} onValueChange={handleLoadExample}>
                    <SelectTrigger className="flex-1">
                      <SelectValue placeholder="Load Example..." />
                    </SelectTrigger>
                    <SelectContent>
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
                    className="flex items-center gap-2"
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
                <div className="flex items-center gap-2">
                  <span className="text-sm font-medium">Validation Profile:</span>
                  <Badge variant="secondary">Comprehensive (120 Rules)</Badge>
                </div>

                {/* JSON Input Area */}
                <div className="relative">
                  <Textarea
                    value={jsonInput}
                    onChange={(e) => setJsonInput(e.target.value)}
                    placeholder="Paste your OpenRTB JSON bid request here..."
                    className="min-h-[400px] font-mono text-sm resize-none"
                    style={{
                      backgroundColor: '#1e1e1e',
                      color: '#d4d4d4',
                      border: '1px solid #404040'
                    }}
                  />
                  {jsonInput && (
                    <div className="absolute top-2 right-2">
                      <Badge variant="outline" className="bg-black/50 text-white">
                        {jsonInput.split('\n').length} lines
                      </Badge>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Right Panel - Results */}
          <div className="space-y-4 animate-slide-up" style={{ '--delay': '200ms' } as React.CSSProperties}>
            {/* Validation Summary */}
            {validationResult && (
              <Card className="glass">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <BarChart3 className="h-5 w-5" />
                    Validation Summary
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-3 gap-4 mb-4">
                    <div className="text-center">
                      <div className="text-2xl font-bold text-red-600">
                        {validationResult.issues.filter(i => i.severity === 'error').length}
                      </div>
                      <div className="text-sm text-gray-600">Errors</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-yellow-600">
                        {validationResult.issues.filter(i => i.severity === 'warning').length}
                      </div>
                      <div className="text-sm text-gray-600">Warnings</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-blue-600">
                        {validationResult.issues.filter(i => i.severity === 'info').length}
                      </div>
                      <div className="text-sm text-gray-600">Info</div>
                    </div>
                  </div>
                  
                  {validationResult.detectedCharacteristics && (
                    <div className="space-y-2">
                      <Separator />
                      <h4 className="font-medium">Detected Characteristics:</h4>
                      <div className="space-y-1 text-sm">
                        <div><strong>Type:</strong> {validationResult.detectedCharacteristics.primaryType}</div>
                        {validationResult.detectedCharacteristics.mediaFormats && (
                          <div><strong>Media:</strong> {validationResult.detectedCharacteristics.mediaFormats.join(', ')}</div>
                        )}
                        {validationResult.detectedCharacteristics.platform && (
                          <div><strong>Platform:</strong> {validationResult.detectedCharacteristics.platform}</div>
                        )}
                        {validationResult.detectedCharacteristics.deviceInfo && (
                          <div><strong>Device:</strong> {validationResult.detectedCharacteristics.deviceInfo}</div>
                        )}
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            )}

            {/* Issue Filters */}
            {validationResult && (
              <Card className="glass">
                <CardHeader>
                  <CardTitle>Issues Found</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-wrap gap-2 mb-4">
                    <Button
                      variant={issueFilter === 'all' ? 'default' : 'outline'}
                      size="sm"
                      onClick={() => setIssueFilter('all')}
                    >
                      All ({validationResult.issues.length})
                    </Button>
                    <Button
                      variant={issueFilter === 'errors' ? 'default' : 'outline'}
                      size="sm"
                      onClick={() => setIssueFilter('errors')}
                    >
                      Errors ({validationResult.issues.filter(i => i.severity === 'error').length})
                    </Button>
                    <Button
                      variant={issueFilter === 'warnings' ? 'default' : 'outline'}
                      size="sm"
                      onClick={() => setIssueFilter('warnings')}
                    >
                      Warnings ({validationResult.issues.filter(i => i.severity === 'warning').length})
                    </Button>
                    <Button
                      variant={issueFilter === 'info' ? 'default' : 'outline'}
                      size="sm"
                      onClick={() => setIssueFilter('info')}
                    >
                      Info ({validationResult.issues.filter(i => i.severity === 'info').length})
                    </Button>
                  </div>

                  {/* Issues List */}
                  <div className="space-y-2 max-h-[500px] overflow-y-auto">
                    {getFilteredIssues().map((issue, index) => (
                      <div
                        key={index}
                        className={`p-3 rounded-lg border cursor-pointer hover:shadow-md transition-all ${getSeverityColor(issue.severity)}`}
                      >
                        <div className="flex items-start gap-2">
                          {getSeverityIcon(issue.severity)}
                          <div className="flex-1 min-w-0">
                            <div className="font-medium text-sm">{issue.fieldPath}</div>
                            <div className="text-sm mt-1">{issue.message}</div>
                            {issue.actualValue && (
                              <div className="text-xs mt-1 opacity-75">
                                <strong>Found:</strong> {String(issue.actualValue)}
                              </div>
                            )}
                            {issue.expectedValue && (
                              <div className="text-xs mt-1 opacity-75">
                                <strong>Expected:</strong> {issue.expectedValue}
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                    
                    {getFilteredIssues().length === 0 && (
                      <div className="text-center py-8 text-gray-500">
                        <CheckCircle className="h-12 w-12 mx-auto mb-2 text-green-500" />
                        <div className="text-lg font-medium">No issues found!</div>
                        <div className="text-sm">Your bid request looks good for this filter.</div>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Default state when no validation has been run */}
            {!validationResult && (
              <Card className="glass">
                <CardContent className="text-center py-12">
                  <TrendingUp className="h-16 w-16 mx-auto mb-4 text-gray-400" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">Ready to Validate</h3>
                  <p className="text-gray-600">
                    Paste your OpenRTB bid request JSON or upload a file to get started with comprehensive validation.
                  </p>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default BidVerificator;
