
import React, { useEffect, useRef, useState } from 'react';

interface JsonHighlighterProps {
  value: string;
  onChange: (value: string) => void;
  highlightedPath?: string | null;
  placeholder?: string;
}

export const JsonHighlighter: React.FC<JsonHighlighterProps> = ({
  value,
  onChange,
  highlightedPath,
  placeholder = "Enter JSON here..."
}) => {
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const highlightRef = useRef<HTMLDivElement>(null);
  const [scrollTop, setScrollTop] = useState(0);
  const [scrollLeft, setScrollLeft] = useState(0);

  const highlightJSON = (json: string) => {
    // Enhanced JSON syntax highlighting with VS Code-like colors
    let highlighted = json
      // Strings (orange/salmon)
      .replace(/"([^"\\]|\\.)*"/g, '<span class="json-string">$&</span>')
      // Numbers (light green)
      .replace(/\b-?\d+\.?\d*([eE][+-]?\d+)?\b/g, '<span class="json-number">$&</span>')
      // Booleans (blue)
      .replace(/\b(true|false)\b/g, '<span class="json-boolean">$&</span>')
      // Null (blue)
      .replace(/\bnull\b/g, '<span class="json-null">$&</span>')
      // Keys (light blue/cyan)
      .replace(/"([^"]+)"(\s*:)/g, '<span class="json-key">"$1"</span>$2')
      // Brackets (yellow/gold)
      .replace(/[\[\]]/g, '<span class="json-bracket">$&</span>')
      .replace(/[{}]/g, '<span class="json-brace">$&</span>')
      // Commas and colons (white)
      .replace(/,/g, '<span class="json-comma">,</span>')
      .replace(/:/g, '<span class="json-colon">:</span>');

    // Enhanced path highlighting for error location
    if (highlightedPath) {
      // Convert path like "device.ifa" or "imp[0].native.request" to regex patterns
      const pathSegments = highlightedPath.split('.');
      let currentRegex = '';
      
      pathSegments.forEach((segment, index) => {
        const arrayMatch = segment.match(/^(.+)\[(\d+)\]$/);
        if (arrayMatch) {
          // Handle array notation like imp[0]
          const fieldName = arrayMatch[1];
          const arrayIndex = parseInt(arrayMatch[2]);
          
          // Create a more precise regex to find the exact array element
          const fieldPattern = `("${fieldName}"\\s*:\\s*\\[)([^\\]]*?)`;
          highlighted = highlighted.replace(new RegExp(fieldPattern, 'g'), (match, opening, content) => {
            const elements = content.split(',');
            if (elements[arrayIndex]) {
              elements[arrayIndex] = `<span class="json-highlighted-array">${elements[arrayIndex]}</span>`;
            }
            return opening + elements.join(',');
          });
        } else {
          // Handle regular field highlighting
          const regex = new RegExp(`("${segment}")(\\s*:)`, 'g');
          highlighted = highlighted.replace(regex, '<span class="json-highlighted">"$1"</span>$2');
        }
      });
    }

    return highlighted;
  };

  const findLineAndColumn = (text: string, path: string) => {
    const lines = text.split('\n');
    const pathParts = path.split('.');
    
    for (let i = 0; i < lines.length; i++) {
      const line = lines[i];
      const lastPart = pathParts[pathParts.length - 1];
      
      // Handle array notation
      const arrayMatch = lastPart.match(/^(.+)\[(\d+)\]$/);
      const searchKey = arrayMatch ? arrayMatch[1] : lastPart;
      
      if (line.includes(`"${searchKey}"`)) {
        return { line: i + 1, column: line.indexOf(`"${searchKey}"`) + 1 };
      }
    }
    return { line: 1, column: 1 };
  };

  const scrollToHighlightedPath = () => {
    if (highlightedPath && textareaRef.current) {
      const { line } = findLineAndColumn(value, highlightedPath);
      const lineHeight = 22; // Approximate line height
      const scrollPosition = (line - 1) * lineHeight;
      
      textareaRef.current.scrollTop = scrollPosition;
      if (highlightRef.current) {
        highlightRef.current.scrollTop = scrollPosition;
      }
    }
  };

  const handleScroll = (e: React.UIEvent<HTMLTextAreaElement>) => {
    const target = e.target as HTMLTextAreaElement;
    setScrollTop(target.scrollTop);
    setScrollLeft(target.scrollLeft);
    
    if (highlightRef.current) {
      highlightRef.current.scrollTop = target.scrollTop;
      highlightRef.current.scrollLeft = target.scrollLeft;
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    onChange(e.target.value);
  };

  useEffect(() => {
    if (highlightRef.current) {
      highlightRef.current.scrollTop = scrollTop;
      highlightRef.current.scrollLeft = scrollLeft;
    }
  }, [scrollTop, scrollLeft, value]);

  useEffect(() => {
    if (highlightedPath) {
      scrollToHighlightedPath();
    }
  }, [highlightedPath]);

  return (
    <>
      <style>{`
        .json-highlighter-container {
          position: relative;
          font-family: 'Fira Code', 'JetBrains Mono', 'Consolas', 'Monaco', 'Courier New', monospace;
          font-size: 14px;
          line-height: 22px;
          border-radius: 8px;
          overflow: hidden;
          background: #1e1e1e;
        }
        
        .json-highlight-layer {
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: #1e1e1e;
          color: transparent;
          pointer-events: none;
          white-space: pre-wrap;
          word-wrap: break-word;
          overflow: hidden;
          padding: 16px;
          border: 2px solid #404040;
          border-radius: 8px;
          z-index: 1;
          transition: border-color 0.3s ease;
        }
        
        .json-textarea {
          position: relative;
          width: 100%;
          min-height: 450px;
          max-height: 650px;
          background: transparent;
          color: #d4d4d4;
          border: 2px solid #404040;
          border-radius: 8px;
          padding: 16px;
          font-family: 'Fira Code', 'JetBrains Mono', 'Consolas', 'Monaco', 'Courier New', monospace;
          font-size: 14px;
          line-height: 22px;
          resize: vertical;
          outline: none;
          z-index: 2;
          transition: border-color 0.3s ease, box-shadow 0.3s ease;
        }
        
        .json-textarea:focus {
          border-color: #f97316;
          box-shadow: 0 0 0 3px rgba(249, 115, 22, 0.1);
        }
        
        .json-textarea::placeholder {
          color: #6b7280;
          font-style: italic;
        }
        
        /* VS Code-like syntax highlighting */
        .json-string {
          color: #ce9178;
        }
        
        .json-number {
          color: #b5cea8;
        }
        
        .json-boolean {
          color: #569cd6;
          font-weight: 500;
        }
        
        .json-null {
          color: #569cd6;
          font-weight: 500;
        }
        
        .json-key {
          color: #9cdcfe;
          font-weight: 600;
        }
        
        .json-bracket {
          color: #ffd700;
          font-weight: bold;
        }
        
        .json-brace {
          color: #ffd700;
          font-weight: bold;
        }
        
        .json-comma {
          color: #d4d4d4;
        }
        
        .json-colon {
          color: #d4d4d4;
        }
        
        .json-highlighted {
          background: rgba(249, 115, 22, 0.4);
          color: #ff6b35 !important;
          font-weight: bold;
          animation: errorPulse 3s ease-in-out;
          border-radius: 4px;
          padding: 2px 4px;
          margin: 0 1px;
          border: 1px solid #f97316;
          box-shadow: 0 0 8px rgba(249, 115, 22, 0.3);
        }
        
        .json-highlighted-array {
          background: rgba(249, 115, 22, 0.3);
          color: #f97316 !important;
          border-radius: 3px;
          padding: 1px 2px;
          border: 1px solid rgba(249, 115, 22, 0.5);
        }
        
        @keyframes errorPulse {
          0%, 100% { 
            background: rgba(249, 115, 22, 0.4);
            box-shadow: 0 0 8px rgba(249, 115, 22, 0.3);
          }
          25% { 
            background: rgba(249, 115, 22, 0.6);
            box-shadow: 0 0 12px rgba(249, 115, 22, 0.5);
          }
          50% { 
            background: rgba(249, 115, 22, 0.8);
            box-shadow: 0 0 16px rgba(249, 115, 22, 0.7);
          }
          75% { 
            background: rgba(249, 115, 22, 0.6);
            box-shadow: 0 0 12px rgba(249, 115, 22, 0.5);
          }
        }
      `}</style>
      
      <div className="json-highlighter-container">
        <div
          ref={highlightRef}
          className="json-highlight-layer"
          dangerouslySetInnerHTML={{
            __html: value ? highlightJSON(value) : ''
          }}
        />
        <textarea
          ref={textareaRef}
          className="json-textarea"
          value={value}
          onChange={handleChange}
          onScroll={handleScroll}
          placeholder={placeholder}
          spellCheck={false}
          autoComplete="off"
          autoCorrect="off"
          autoCapitalize="off"
        />
      </div>
    </>
  );
};
