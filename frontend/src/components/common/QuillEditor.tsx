import React, { useEffect, useRef } from 'react';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';

interface QuillEditorProps {
  value: string;
  onChange: (value: string) => void;
  className?: string;
  placeholder?: string;
  modules?: any;
  formats?: string[];
  theme?: string;
}

const QuillEditor: React.FC<QuillEditorProps> = ({
  value,
  onChange,
  className,
  placeholder,
  modules,
  formats,
  theme = "snow"
}) => {
  const quillRef = useRef<any>(null);

  useEffect(() => {
    // Suppress ReactQuill findDOMNode warnings
    const originalWarn = console.warn;
    const originalError = console.error;
    
    console.warn = (...args: any[]) => {
      if (typeof args[0] === 'string' && args[0].includes('findDOMNode')) {
        return;
      }
      originalWarn.apply(console, args);
    };

    console.error = (...args: any[]) => {
      if (typeof args[0] === 'string' && args[0].includes('findDOMNode')) {
        return;
      }
      originalError.apply(console, args);
    };

    return () => {
      console.warn = originalWarn;
      console.error = originalError;
    };
  }, []);

  return (
    <ReactQuill
      ref={quillRef}
      value={value}
      onChange={onChange}
      className={className}
      placeholder={placeholder}
      modules={modules}
      formats={formats}
      theme={theme}
    />
  );
};

export default QuillEditor;
