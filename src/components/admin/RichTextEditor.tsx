import React, { useState, useEffect } from 'react';
import { cn } from '@/lib/utils';

interface RichTextEditorProps {
  value: string;
  onChange: (value: string) => void;
  className?: string;
}

const RichTextEditor: React.FC<RichTextEditorProps> = ({
  value,
  onChange,
  className,
}) => {
  const [editorContent, setEditorContent] = useState<string>(value || '');

  useEffect(() => {
    setEditorContent(value || '');
  }, [value]);

  const handleEditorChange = (e: React.FormEvent<HTMLDivElement>) => {
    const content = e.currentTarget.innerHTML;
    setEditorContent(content);
    onChange(content);
  };

  const formatText = (command: string, value: string = '') => {
    document.execCommand(command, false, value);
    const selection = window.getSelection();
    if (selection && selection.rangeCount > 0) {
      const range = selection.getRangeAt(0);
      const selectedContent = range.extractContents();
      range.insertNode(selectedContent);
      selection.removeAllRanges();
      selection.addRange(range);
    }
  };

  return (
    <div className={cn('rich-text-editor w-full', className)}>
      <div className="toolbar flex flex-wrap gap-1 mb-2 p-1 border rounded-md bg-muted/30">
        <button
          type="button"
          onClick={() => formatText('bold')}
          className="p-1 rounded hover:bg-muted"
          title="Bold"
        >
          <span className="font-bold">B</span>
        </button>
        <button
          type="button"
          onClick={() => formatText('italic')}
          className="p-1 rounded hover:bg-muted"
          title="Italic"
        >
          <span className="italic">I</span>
        </button>
        <button
          type="button"
          onClick={() => formatText('underline')}
          className="p-1 rounded hover:bg-muted"
          title="Underline"
        >
          <span className="underline">U</span>
        </button>
        <span className="border-r mx-1"></span>
        <button
          type="button"
          onClick={() => formatText('insertUnorderedList')}
          className="p-1 rounded hover:bg-muted"
          title="Bullet List"
        >
          • List
        </button>
        <button
          type="button"
          onClick={() => formatText('insertOrderedList')}
          className="p-1 rounded hover:bg-muted"
          title="Numbered List"
        >
          1. List
        </button>
        <span className="border-r mx-1"></span>
        <button
          type="button"
          onClick={() => {
            const url = prompt('Enter URL:');
            if (url) formatText('createLink', url);
          }}
          className="p-1 rounded hover:bg-muted"
          title="Insert Link"
        >
          Link
        </button>
      </div>
      <div
        contentEditable
        dangerouslySetInnerHTML={{ __html: editorContent }}
        onInput={handleEditorChange}
        className="min-h-[200px] p-3 border rounded-md focus:outline-none focus:ring-1 focus:ring-primary overflow-auto"
      />
    </div>
  );
};

export default RichTextEditor;
