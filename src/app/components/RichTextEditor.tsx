'use client';

import { useRef, useState, useEffect } from 'react';
import ReactMarkdown from 'react-markdown';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { materialDark } from 'react-syntax-highlighter/dist/esm/styles/prism';
import remarkGfm from 'remark-gfm';

interface RichTextEditorProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  minHeight?: string;
}

const RichTextEditor: React.FC<RichTextEditorProps> = ({
  value,
  onChange,
  placeholder = 'Write your content here...',
  minHeight = '300px'
}) => {
  const [isPreview, setIsPreview] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const [selectedTab, setSelectedTab] = useState<'write' | 'preview'>('write');

  const insertTextAtCursor = (before: string, after: string = '') => {
    const textarea = textareaRef.current;
    if (!textarea) return;

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const selectedText = value.substring(start, end);
    const textBefore = value.substring(0, start);
    const textAfter = value.substring(end);

    const newText = textBefore + before + selectedText + after + textAfter;
    onChange(newText);

    // Set cursor position after the operation
    setTimeout(() => {
      textarea.focus();
      textarea.setSelectionRange(
        start + before.length,
        start + before.length + selectedText.length
      );
    }, 0);
  };

  const insertCodeBlock = () => {
    insertTextAtCursor('```javascript\n', '\n```');
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Tab') {
      e.preventDefault();
      insertTextAtCursor('  ');
    }
  };

  return (
    <div className="border border-gray-300 rounded-lg overflow-hidden">
      <div className="flex items-center border-b border-gray-300 bg-gray-50">
        <div className="flex text-sm">
          <button
            type="button"
            onClick={() => setSelectedTab('write')}
            className={`px-4 py-2 ${
              selectedTab === 'write' ? 'bg-white border-r border-t border-l border-gray-300' : 'bg-gray-50'
            }`}
          >
            Write
          </button>
          <button
            type="button"
            onClick={() => setSelectedTab('preview')}
            className={`px-4 py-2 ${
              selectedTab === 'preview' ? 'bg-white border-r border-t border-l border-gray-300' : 'bg-gray-50'
            }`}
          >
            Preview
          </button>
        </div>

        {selectedTab === 'write' && (
          <div className="flex space-x-2 ml-4">
            <button
              type="button"
              onClick={() => insertTextAtCursor('**', '**')}
              className="p-1 rounded hover:bg-gray-200"
              title="Bold"
            >
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
                <path d="M8.25 4.5a3.75 3.75 0 117.5 0v8.25a3.75 3.75 0 11-7.5 0V4.5z" />
                <path d="M6 20.25a.75.75 0 01-.75-.75V10.5A.75.75 0 016 9.75h3a.75.75 0 01.75.75v1.5a.75.75 0 01-.75.75H6.75v6.75a.75.75 0 01-.75.75z" />
              </svg>
            </button>
            <button
              type="button"
              onClick={() => insertTextAtCursor('*', '*')}
              className="p-1 rounded hover:bg-gray-200"
              title="Italic"
            >
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
                <path d="M15 4.5A2.25 2.25 0 0017.25 2h-3.375c-.621 0-1.125.504-1.125 1.125v9.75c0 .621.504 1.125 1.125 1.125h1.5c.621 0 1.125.504 1.125 1.125v1.5c0 .621-.504 1.125-1.125 1.125h-9.75a.75.75 0 010-1.5h3.375c.621 0 1.125-.504 1.125-1.125V4.125C10.125 3.504 9.621 3 9 3H7.5a.75.75 0 010-1.5h9.75c.621 0 1.125.504 1.125 1.125V4.5c0 .621-.504 1.125-1.125 1.125H15zM20.25 10.5H15M11.25 15H6" stroke="#000" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </button>
            <button
              type="button"
              onClick={() => insertTextAtCursor('### ', '')}
              className="p-1 rounded hover:bg-gray-200"
              title="Heading"
            >
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
                <path fillRule="evenodd" d="M6 2.5a.5.5 0 01.5-.5h3a.5.5 0 01.5.5v5h6v-5a.5.5 0 01.5-.5h3a.5.5 0 01.5.5v15a.5.5 0 01-.5.5h-3a.5.5 0 01-.5-.5v-5h-6v5a.5.5 0 01-.5.5h-3a.5.5 0 01-.5-.5v-15z" clipRule="evenodd" />
              </svg>
            </button>
            <button
              type="button"
              onClick={() => insertTextAtCursor('- ', '')}
              className="p-1 rounded hover:bg-gray-200"
              title="List"
            >
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
                <path fillRule="evenodd" d="M3 5a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 6a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 6a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z" clipRule="evenodd" />
              </svg>
            </button>
            <button
              type="button"
              onClick={() => insertTextAtCursor('[link text](https://example.com)', '')}
              className="p-1 rounded hover:bg-gray-200"
              title="Link"
            >
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
                <path fillRule="evenodd" d="M19.902 4.098a3.75 3.75 0 00-5.304 0l-4.5 4.5a3.75 3.75 0 001.035 6.037.75.75 0 01-.646 1.353 5.25 5.25 0 01-1.449-8.45l4.5-4.5a5.25 5.25 0 117.424 7.424l-1.757 1.757a.75.75 0 11-1.06-1.06l1.757-1.757a3.75 3.75 0 000-5.304zm-7.389 4.267a.75.75 0 011-.03l5.25 4.5a.75.75 0 01-.97 1.14l-5.25-4.5a.75.75 0 01-.03-1.11z" clipRule="evenodd" />
                <path d="M14.882 8.735a.75.75 0 00-1.06-1.06 8.25 8.25 0 00-11.715 0 .75.75 0 001.06 1.06 6.75 6.75 0 019.592 0 .75.75 0 001.123-.027z" />
              </svg>
            </button>
            <button
              type="button"
              onClick={insertCodeBlock}
              className="p-1 rounded hover:bg-gray-200"
              title="Code Block"
            >
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
                <path fillRule="evenodd" d="M14.447 3.027a.75.75 0 01.527.92l-4.5 16.5a.75.75 0 01-1.448-.394l4.5-16.5a.75.75 0 01.921-.526zM16.72 6.22a.75.75 0 011.06 0l5.25 5.25a.75.75 0 010 1.06l-5.25 5.25a.75.75 0 11-1.06-1.06L21.44 12l-4.72-4.72a.75.75 0 010-1.06zm-9.44 0a.75.75 0 010 1.06L2.56 12l4.72 4.72a.75.75 0 11-1.06 1.06L.97 12.53a.75.75 0 010-1.06l5.25-5.25a.75.75 0 011.06 0z" clipRule="evenodd" />
              </svg>
            </button>
            <button
              type="button"
              onClick={() => insertTextAtCursor('![alt text](image-url.jpg)', '')}
              className="p-1 rounded hover:bg-gray-200"
              title="Image"
            >
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
                <path fillRule="evenodd" d="M1.5 6a2.25 2.25 0 012.25-2.25h16.5A2.25 2.25 0 0122.5 6v12a2.25 2.25 0 01-2.25 2.25H3.75A2.25 2.25 0 011.5 18V6zM3 16.06V18c0 .414.336.75.75.75h16.5A.75.75 0 0021 18v-1.94l-2.69-2.689a1.5 1.5 0 00-2.12 0l-.88.879.97.97a.75.75 0 11-1.06 1.06l-5.16-5.159a1.5 1.5 0 00-2.12 0L3 16.061zm10.125-7.81a1.125 1.125 0 112.25 0 1.125 1.125 0 01-2.25 0z" clipRule="evenodd" />
              </svg>
            </button>
          </div>
        )}
      </div>

      <div className={selectedTab === 'write' ? 'block' : 'hidden'}>
        <textarea
          ref={textareaRef}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          className="w-full px-4 py-3 text-gray-900 focus:outline-none focus:ring-0 border-0"
          style={{ minHeight }}
          onKeyDown={handleKeyDown}
        />
      </div>

      <div className={selectedTab === 'preview' ? 'block bg-white p-4' : 'hidden'}>
        {value ? (
          <div className="prose max-w-none">
            <ReactMarkdown
              remarkPlugins={[remarkGfm]}
              components={{
                code({node, inline, className, children, ...props}) {
                  const match = /language-(\w+)/.exec(className || '');
                  return !inline && match ? (
                    <SyntaxHighlighter
                      style={materialDark}
                      language={match[1]}
                      PreTag="div"
                      {...props}
                    >
                      {String(children).replace(/\n$/, '')}
                    </SyntaxHighlighter>
                  ) : (
                    <code className={className} {...props}>
                      {children}
                    </code>
                  )
                }
              }}
            >
              {value}
            </ReactMarkdown>
          </div>
        ) : (
          <div className="text-gray-400 italic">{placeholder}</div>
        )}
      </div>
    </div>
  );
};

export default RichTextEditor; 