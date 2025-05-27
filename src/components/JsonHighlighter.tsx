
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
    // JSON syntax highlighting patterns
    let highlighted = json
      // Strings
      .replace(/"([^"\\]|\\.)*"/g, '<span class="json-string">$&</span>')
      // Numbers
      .replace(/\b-?\d+\.?\d*([eE][+-]?\d+)?\b/g, '<span class="json-number">$&</span>')
      // Booleans
      .replace(/\b(true|false)\b/g, '<span class="json-boolean">$&</span>')
      // Null
      .replace(/\bnull\b/g, '<span class="json-null">$&</span>')
      // Keys (property names)
      .replace(/"([^"]+)"(\s*:)/g, '<span class="json-key">"$1"</span>$2')
      // Brackets and braces
      .replace(/[\[\]]/g, '<span class="json-bracket">$&</span>')
      .replace(/[{}]/g, '<span class="json-brace">$&</span>')
      // Commas and colons
      .replace(/,/g, '<span class="json-comma">,</span>')
      .replace(/:/g, '<span class="json-colon">:</span>');

    // Highlight specific path if provided
    if (highlightedPath) {
      const pathParts = highlightedPath.split('.');
      let currentPath = '';
      
      pathParts.forEach((part, index) => {
        currentPath += (index > 0 ? '\\.' : '') + part.replace(/\[(\d+)\]/, '\\[$1\\]');
        const regex = new RegExp(`("${part.replace(/\[(\d+)\]/, '')}")(\\s*:)`, 'g');
        highlighted = highlighted.replace(regex, '<span class="json-highlighted">"$1"</span>$2');
      });
    }

    return highlighted;
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

  return (
    <div className="relative">
      <style jsx>{`
        .json-highlighter-container {
          position: relative;
          font-family: 'Fira Code', 'Monaco', 'Consolas', 'Courier New', monospace;
          font-size: 14px;
          line-height: 1.5;
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
          padding: 12px;
          border: 1px solid #404040;
          border-radius: 6px;
          z-index: 1;
        }
        
        .json-textarea {
          position: relative;
          width: 100%;
          min-height: 400px;
          max-height: 600px;
          background: transparent;
          color: #d4d4d4;
          border: 1px solid #404040;
          border-radius: 6px;
          padding: 12px;
          font-family: 'Fira Code', 'Monaco', 'Consolas', 'Courier New', monospace;
          font-size: 14px;
          line-height: 1.5;
          resize: vertical;
          outline: none;
          z-index: 2;
        }
        
        .json-textarea:focus {
          border-color: #f97316;
          box-shadow: 0 0 0 2px rgba(249, 115, 22, 0.2);
        }
        
        .json-textarea::placeholder {
          color: #6b7280;
        }
        
        :global(.json-string) {
          color: #ce9178;
        }
        
        :global(.json-number) {
          color: #b5cea8;
        }
        
        :global(.json-boolean) {
          color: #569cd6;
        }
        
        :global(.json-null) {
          color: #569cd6;
        }
        
        :global(.json-key) {
          color: #9cdcfe;
          font-weight: 500;
        }
        
        :global(.json-bracket) {
          color: #ffd700;
          font-weight: bold;
        }
        
        :global(.json-brace) {
          color: #ffd700;
          font-weight: bold;
        }
        
        :global(.json-comma) {
          color: #d4d4d4;
        }
        
        :global(.json-colon) {
          color: #d4d4d4;
        }
        
        :global(.json-highlighted) {
          background: rgba(249, 115, 22, 0.3);
          color: #f97316 !important;
          font-weight: bold;
          animation: pulse 2s infinite;
          border-radius: 2px;
          padding: 0 2px;
        }
        
        @keyframes pulse {
          0%, 100% { 
            background: rgba(249, 115, 22, 0.3);
          }
          50% { 
            background: rgba(249, 115, 22, 0.6);
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
    </div>
  );
};
