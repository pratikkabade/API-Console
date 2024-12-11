import React, { useState, useEffect } from 'react';
import InputBar from './components/InputBar';
import RequestMethodDropdown from './components/RequestMethodDropdown';
import JsonEditor from './components/JsonEditor';
import OutputComponent from './components/OutputComponent';
import Sidebar from './components/SideBar';

const App: React.FC = () => {
  const [apiUrl, setApiUrl] = useState('');
  const [method, setMethod] = useState('GET');
  const [jsonBody, setJsonBody] = useState('{"name": "New Data", "description": "Sample POST request"}');
  const [output, setOutput] = useState('');
  const [savedRequests, setSavedRequests] = useState<ApiRequest[]>([]);

  // Load saved requests from localStorage
  useEffect(() => {
    const savedData = localStorage.getItem('savedRequests');
    if (savedData) {
      setSavedRequests(JSON.parse(savedData));
    }
  }, []);

  // Save a request to localStorage
  const saveRequest = (newRequest: ApiRequest) => {
    // Check if the request with the same URL already exists
    const isRequestExist = savedRequests.some(
      (request) => request.url === newRequest.url && request.method === newRequest.method
    );

    if (!isRequestExist) {
      const updatedRequests = [newRequest, ...savedRequests];
      setSavedRequests(updatedRequests);
      localStorage.setItem('savedRequests', JSON.stringify(updatedRequests));
    }
  };

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

      const response = await fetch(apiUrl, options);
      const result = await response.json();
      setOutput(JSON.stringify(result, null, 2));

      // Save the request to localStorage
      saveRequest({ url: apiUrl, method, body: jsonBody });
    } catch (error) {
      setOutput(`Error: ${error}`);
    }
  };

  const handleSelectRequest = (request: ApiRequest) => {
    setApiUrl(request.url);
    setMethod(request.method);
    setJsonBody(request.body);
  };

  return (
    <div className="flex w-full">
      {/* Sidebar */}
      <Sidebar savedRequests={savedRequests} setSavedRequests={setSavedRequests} onSelectRequest={handleSelectRequest} />

      {/* Main Content */}
      <div className="p-4 max-md:w-full md:w-3/4 h-screen overflow-auto">
        <h1 className="text-2xl font-bold mb-6">API-Console</h1>
        <div className="flex flex-row w-full gap-2 mb-4">
          <RequestMethodDropdown method={method} setMethod={setMethod} />
          <div className="flex flex-col w-full">
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
    </div>
  );
};

export default App;
