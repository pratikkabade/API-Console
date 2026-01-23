import { useState, useEffect } from 'react';
import RequestMethodDropdown from './components/components-test/api-tester/RequestMethodDropdown.tsx';
import InputBar from './components/components-test/api-tester/InputBar.tsx';
import JsonEditor from './components/components-test/api-tester/JsonEditor.tsx';
import OutputComponent from './components/components-test/api-tester/OutputComponent.tsx';
import Sidebar from './components/components-test/api-tester/Sidebar.tsx';
import { Button } from 'flowbite-react';
import { ApiRequest } from './interfaces/iApiTester.ts';
import { ANIMATION_TIME } from './constants/CODING_CONSTANTS.tsx';
import { CARD_CONTAINER, DEV_HEADER_CLASSES } from './constants/TAILWING_CLASSES.tsx';

const App: React.FC = () => {
    const [apiUrl, setApiUrl] = useState('');
    const [method, setMethod] = useState('GET');
    const [jsonBody, setJsonBody] = useState('{"name": "New Data", "description": "Sample POST request"}');
    const [loading, setLoading] = useState(false);
    const [output, setOutput] = useState('');
    const [recordedOutput, setRecordedOutput] = useState('');
    const [savedRequests, setSavedRequests] = useState<ApiRequest[]>([]);
    const [currentRequest, setCurrentRequest] = useState<ApiRequest | null>(null);

    const request = apiUrl + '|' + method;

    // Load saved requests from localStorage
    useEffect(() => {
        const savedData = localStorage.getItem('savedRequests');
        if (savedData) {
            setSavedRequests(JSON.parse(savedData));
        }
    }, []);

    // Update recorded output when selecting a request
    useEffect(() => {
        if (currentRequest?.recordedOutput) {
            setRecordedOutput(currentRequest.recordedOutput);
        } else {
            setRecordedOutput('');
        }
    }, [currentRequest]);

    // Save a request to localStorage
    const saveRequest = (newRequest: ApiRequest) => {
        // Check if the request with the same URL already exists
        const existingIndex = savedRequests.findIndex(
            (request) => request.url === newRequest.url && request.method === newRequest.method
        );

        let updatedRequests: ApiRequest[];

        if (existingIndex !== -1) {
            // Update existing request
            updatedRequests = [...savedRequests];
            // Preserve recorded output if it exists
            if (updatedRequests[existingIndex].recordedOutput) {
                newRequest.recordedOutput = updatedRequests[existingIndex].recordedOutput;
                newRequest.lastSaved = updatedRequests[existingIndex].lastSaved;
            }
            updatedRequests[existingIndex] = newRequest;
        } else {
            // Add new request
            updatedRequests = [newRequest, ...savedRequests];
        }

        setSavedRequests(updatedRequests);
        localStorage.setItem('savedRequests', JSON.stringify(updatedRequests));
        setCurrentRequest(newRequest);
    };

    // Save output for the current API request
    const saveOutput = (outputContent: string) => {
        if (!apiUrl || !method) return;

        // Find the request in the saved requests list
        const existingIndex = savedRequests.findIndex(
            req => req.url === apiUrl && req.method === method
        );

        let updatedRequests: ApiRequest[];

        if (existingIndex !== -1) {
            // Update existing request
            updatedRequests = [...savedRequests];
            updatedRequests[existingIndex] = {
                ...updatedRequests[existingIndex],
                recordedOutput: outputContent,
                lastSaved: Date.now()
            };
        } else {
            // Create new request with the output
            const newRequest: ApiRequest = {
                url: apiUrl,
                method,
                body: method === 'POST' || method === 'PUT' ? jsonBody : '',
                recordedOutput: outputContent,
                lastSaved: Date.now()
            };
            updatedRequests = [newRequest, ...savedRequests];
        }

        setSavedRequests(updatedRequests);
        localStorage.setItem('savedRequests', JSON.stringify(updatedRequests));
        setRecordedOutput(outputContent);

        // Update current request
        setCurrentRequest(updatedRequests.find(req => req.url === apiUrl && req.method === method) || null);
    };

    const handleRequest = async () => {
        if (!apiUrl) {
            setOutput('Please provide a valid API URL.');
            return;
        }

        try {
            setLoading(true);
            const options: RequestInit = {
                method,
                headers: { 'Content-Type': 'application/json' },
                body: method === 'POST' || method === 'PUT' ? jsonBody : undefined,
            };

            const response = await fetch(apiUrl, options);
            if (response.status === 200) {
                setTimeout(() => { setLoading(false); }, ANIMATION_TIME);
            };
            const result = await response.json();
            setOutput(JSON.stringify(result, null, 2));

            // Save the request to localStorage
            saveRequest({
                url: apiUrl,
                method,
                body: jsonBody
            });

            let _sessionrequests = JSON.parse(localStorage.getItem('sessionrequests') || '{}');
            _sessionrequests[request] = result;
            if (_sessionrequests !== null) {
                localStorage.setItem('sessionrequests', JSON.stringify(_sessionrequests));
            }
        } catch (error) {
            setOutput(`Error: ${error}`);
        }
    };

    const handleSelectRequest = (request: ApiRequest) => {
        setApiUrl(request.url);
        setMethod(request.method);
        setJsonBody(request.body);
        setCurrentRequest(request);
    };

    useEffect(() => {
        setOutput('');
    }, [apiUrl, method]);

    return (
        <div className="fade-in2">
            <div className='grid grid-cols-3 max-lg:grid-cols-2 gap-4 px-10'>
                <div className="col-span-1 h-screen py-20 fade-in">
                    <div className={`${CARD_CONTAINER} !p-0 mb-4 flex flex-col`}>
                        <span className={`${DEV_HEADER_CLASSES}`}>API-Console</span>
                        <div className='p-2'>
                            <div className="flex flex-row w-full gap-2 mb-4">
                                <RequestMethodDropdown method={method} setMethod={setMethod} />
                                <div className="flex flex-col w-full">
                                    <InputBar apiUrl={apiUrl} setApiUrl={setApiUrl} />
                                </div>
                            </div>
                            {(method === 'POST' || method === 'PUT') ? (
                                <JsonEditor jsonBody={jsonBody} setJsonBody={setJsonBody} />
                            ) : (
                                <div className='h-52'></div>
                            )}
                            <div className="flex flex-row gap-2">
                                <Button
                                    color='blue'
                                    className="flex-grow"
                                    onClick={handleRequest}
                                >
                                    Send Request
                                </Button>
                            </div>
                        </div>
                    </div>
                    <Sidebar apiUrl={apiUrl} method={method} savedRequests={savedRequests} setSavedRequests={setSavedRequests} onSelectRequest={handleSelectRequest} handleRequest={handleRequest} />
                </div>
                <div className="col-span-2 h-screen py-20 fade-in">
                    {/* <div className="flex rounded-2xl bg-white flex-col border-2 border-slate-200 p-4 scrollable-container-dev-testcase"> */}
                    <div className={`${CARD_CONTAINER} !p-0 flex flex-col`}>
                        <span className={`${DEV_HEADER_CLASSES} mb-4`}>
                            Output
                        </span>
                        <OutputComponent
                            request={request}
                            _output={output}
                            loading={loading}
                            recordedOutput={recordedOutput}
                            onSaveOutput={saveOutput}
                        />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default App;