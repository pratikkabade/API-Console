import React from 'react';
import { Editor } from '@monaco-editor/react';

interface JsonEditorProps {
  jsonBody: string;
  setJsonBody: (body: string) => void;
}

const JsonEditor: React.FC<JsonEditorProps> = ({ jsonBody, setJsonBody }) => {
  return (
    <div className="mb-4">
      <Editor
        height="200px"
        defaultLanguage="json"
        value={jsonBody}
        onChange={(value) => setJsonBody(value ?? '')} // Handle 'value' and ignore 'ev'
        options={{ theme: 'vs-light', minimap: { enabled: false } }}
      />
    </div>
  );
};

export default JsonEditor;
