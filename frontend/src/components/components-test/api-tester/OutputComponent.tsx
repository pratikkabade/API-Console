import { Button, Spinner } from 'flowbite-react';
import React, { useState, useEffect } from 'react';

interface OutputProps {
    request: string;
    _output: string;
    loading?: boolean;
    recordedOutput?: string;
    onSaveOutput?: (output: string) => void;
}

const OutputComponent: React.FC<OutputProps> = ({
    request,
    _output,
    loading,
    recordedOutput = '',
    onSaveOutput
}) => {
    const [comparisonResult, setComparisonResult] = useState<string | null>(null);
    const [sessionOutput, setSessionOutput] = useState<string | null>(null);

    // Copy the output to clipboard
    const copyToClipboard = () => {
        navigator.clipboard.writeText(_output)
            .then(() => {
                document.getElementById('output')?.focus();
                (document.getElementById('output') as HTMLTextAreaElement)?.select();
            })
            .catch((err) => {
                console.error('Failed to copy: ', err);
            });
    };

    // Save current output as recorded output
    const saveOutput = () => {
        if (_output && onSaveOutput) {
            onSaveOutput(_output);
        }
    };

    // Compare current output with recorded output
    const compareOutputs = () => {
        if (!sessionOutput || !recordedOutput) {
            setComparisonResult('Nothing to compare - make sure both current and recorded outputs exist');
            return;
        }

        try {
            // Parse both outputs as JSON to compare their structure instead of string equality
            const currentJson = JSON.parse(JSON.stringify(sessionOutput, null, 2));
            const recordedJson = JSON.parse(recordedOutput);

            // Deep comparison
            const isEqual = JSON.stringify(currentJson) === JSON.stringify(recordedJson);

            setComparisonResult(isEqual ?
                '✅ Match: Current output matches recorded output' :
                '❌ Mismatch: Current output differs from recorded output');

        } catch (error) {
            setComparisonResult(`Error comparing outputs: ${error}`);
        }
    };

    useEffect(() => {
        if (_output !== '') {
            setSessionOutput(JSON.parse(_output));
        }
        if (sessionOutput && recordedOutput) {
            compareOutputs();
        } else {
            setComparisonResult(null);
        }
    }, [_output, sessionOutput, recordedOutput]);

    useEffect(() => {
        let sessionrequests = localStorage.getItem('sessionrequests');
        if (sessionrequests) {
            const requests = JSON.parse(sessionrequests);
            if (requests[request]) {
                const recordedOutput = requests[request];
                if (_output === '') {
                    setSessionOutput(recordedOutput);
                }
            } else {
                setSessionOutput(null);
            }
        }
    }, [request]);

    useEffect(() => {
        // Save it in localStorage
        const comparisonResults = comparisonResult?.includes('Match') ? true : comparisonResult?.includes('Mismatch') ? false : null;

        let _sessionrequests = JSON.parse(localStorage.getItem('sessionrequests') || '{}');
        _sessionrequests[request + '|comparisonResults'] = comparisonResults;
        localStorage.setItem('sessionrequests', JSON.stringify(_sessionrequests));
    }, [comparisonResult, request]);

    if ((!_output && !sessionOutput) || loading) return (
        <div className='flex flex-col gap-4 p-4'>
            <div className='flex flex-row gap-2'>
                <div className="flex flex-col w-full">
                    <div className="flex justify-between items-center mb-2">
                        <span className={`font-medium text-gray-700 dark:text-gray-300`}>Current Output</span>
                    </div>
                    <textarea
                        name="output"
                        id="output"
                        rows={19}
                        className={`w-full px-4 py-2 border border-gray-300 dark:border-gray-700 bg-gray-100 dark:bg-gray-700 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500`}
                        readOnly
                        value={loading ? 'Loading..' : 'Please send a request to see the output here.'}
                    />
                </div>
            </div>
            <div className={`p-3 rounded-md text-center font-medium text-white dark:text-gray-800 select-none`}>
                BLANKTEXT
            </div>
            <div className='flex justify-between gap-2'>
                <Button
                    disabled
                    color='blue'>
                    {loading ? <Spinner color="info" size="sm" /> : 'Save as Recorded Output'}
                </Button>
                <Button
                    disabled
                    color="green">
                    {loading ? <Spinner color="info" size="sm" /> : 'Copy Output'}
                </Button>
            </div>
        </div>
    );

    if (sessionOutput || _output) return (
        <div className='flex flex-col gap-4 p-4'>
            <div className='flex flex-row gap-2'>
                {recordedOutput !== '' && <div className="flex flex-col w-full">
                    <div className="flex justify-between items-center mb-2">
                        <span className="font-medium text-gray-700 dark:text-gray-300">Recorded Output</span>
                    </div>
                    <textarea
                        name="recorded-output"
                        id="recorded-output"
                        rows={19}
                        className="w-full px-4 py-2 border border-gray-300 dark:border-gray-700 bg-gray-100 dark:bg-gray-700 rounded-md outline-none ring-2 ring-gray-500"
                        readOnly
                        value={recordedOutput}
                    />
                </div>}
                <div className="flex flex-col w-full">
                    <div className="flex justify-between items-center mb-2">
                        <span className={`font-medium text-gray-700 dark:text-gray-300 ${comparisonResult?.includes('Match') ? 'text-green-500' : comparisonResult?.includes('Mismatch') ? 'text-red-500' : ''}`}>Current Output</span>
                    </div>
                    <textarea
                        name="output"
                        id="output"
                        rows={19}
                        className={`w-full px-4 py-2 border border-gray-300 dark:border-gray-700 bg-gray-100 dark:bg-gray-700 rounded-md focus:outline-none ${comparisonResult?.includes('Match') ? 'ring-2 ring-green-500' : comparisonResult?.includes('Mismatch') ? 'ring-2 ring-red-500' : 'focus:ring-2 focus:ring-blue-500'}`}
                        readOnly
                        value={JSON.stringify(sessionOutput, null, 2)}
                    />
                </div>
            </div>
            {comparisonResult ? (
                <div className={`p-3 rounded-md text-center font-medium ${comparisonResult.includes('Match') ? 'bg-green-100 dark:bg-green-700 text-green-800 dark:text-green-200' : 'bg-red-100 dark:bg-red-700 text-red-800 dark:text-red-200'}`}>
                    {comparisonResult}
                </div>
            ) : (
                <div className={`p-3 rounded-md text-center font-medium text-white dark:text-gray-800 select-none`}>
                    BLANKTEXT
                </div>
            )}
            <div className='flex justify-between gap-2'>
                <Button
                    color='blue'
                    onClick={saveOutput}>
                    Save as Recorded Output
                </Button>
                <Button
                    color="green"
                    onClick={copyToClipboard}>
                    Copy Output
                </Button>
            </div>
        </div>
    );
};

export default OutputComponent;
