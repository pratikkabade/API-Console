import React, { useState } from 'react';
import InputBar from './components/InputBar';
import RequestMethodDropdown from './components/RequestMethodDropdown';
import JsonEditor from './components/JsonEditor';
import OutputComponent from './components/OutputComponent';

const App: React.FC = () => {
  const [apiUrl, setApiUrl] = useState('');
  const [method, setMethod] = useState('GET');
  const [jsonBody, setJsonBody] = useState('{"name": "New Data", "description": "Sample POST request"}')
  const [output, setOutput] = useState('');

  const handleRequest = async () => {
    if (!apiUrl) {
      setOutput('Please provide a valid API URL.');
      return;
    }

    try {
      const options: RequestInit = {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: method === 'POST' || method === 'PUT' ? jsonBody : undefined,
      };

      const endpoint = apiUrl;

      const response = await fetch(endpoint, options);
      const result = await response.json();
      // setOutput(JSON.stringify(result?.message, null, 2));
      setOutput(JSON.stringify(result, null, 2));
    } catch (error) {
      setOutput(`Error: ${error}`);
    }
  };


  return (
    <div className="p-4 max-w-xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">API-Console</h1>
      <div className='flex flex-row w-full gap-2'>
        <RequestMethodDropdown method={method} setMethod={setMethod} />
        <div className='flex flex-col w-full'>
          <InputBar apiUrl={apiUrl} setApiUrl={setApiUrl} />
        </div>
      </div>
      {(method === 'POST' || method === 'PUT') && (
        <JsonEditor jsonBody={jsonBody} setJsonBody={setJsonBody} />
      )}
      <button
        onClick={handleRequest}
        className="w-full px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
      >
        Send Request
      </button>
      <OutputComponent output={output} />
    </div>
  );
};

export default App;
