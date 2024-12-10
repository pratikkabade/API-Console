// import { Editor } from '@monaco-editor/react';
import React from 'react';

interface OutputProps {
  output: string;
}

const OutputComponent: React.FC<OutputProps> = ({ output }) => {
  return output && (
    <div className="mt-4 p-4 border border-gray-300 rounded-md bg-gray-100">
      <pre className="whitespace-pre-wrap break-words">{output}</pre>

      {/* <Editor
        height="200px"
        defaultLanguage="json"
        value={output}
        options={{ theme: 'vs-light', minimap: { enabled: false } }}
      /> */}
    </div>
  );
};

export default OutputComponent;
