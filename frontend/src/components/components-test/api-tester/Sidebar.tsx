import { Button, Dropdown, DropdownItem } from 'flowbite-react';
import React, { SetStateAction, useEffect, useRef, useState } from 'react';
import { ApiRequest } from '../../../interfaces/iApiTester';
import { HiOutlineDownload, HiOutlineExternalLink, HiOutlineTrash, HiTrash } from 'react-icons/hi';
import { CARD_CONTAINER, DEV_HEADER_CLASSES, SCRIPT_ITEM } from '../../../constants/TAILWING_CLASSES';

interface SidebarProps {
    apiUrl: string;
    method: string;
    savedRequests: ApiRequest[];
    setSavedRequests: React.Dispatch<SetStateAction<ApiRequest[]>>;
    onSelectRequest: (request: ApiRequest) => void;
    handleRequest: () => void;
}

// Helper function to get status for a request
const getRequestStatus = (url: string, method: string): 'success' | 'failure' | 'pending' => {
    try {
        const sessionData = localStorage.getItem('sessionrequests');
        if (!sessionData) return 'pending';

        const sessionRequests = JSON.parse(sessionData);
        const comparisonKey = `${url}|${method}|comparisonResults`;

        if (sessionRequests[comparisonKey] === true) return 'success';
        if (sessionRequests[comparisonKey] === false) return 'failure';
        return 'pending';
    } catch (error) {
        console.error('Error getting request status:', error);
        return 'pending';
    }
};

const Sidebar: React.FC<SidebarProps> = ({ apiUrl, method, savedRequests, onSelectRequest, setSavedRequests, handleRequest }) => {
    const fileInputRef = useRef<HTMLInputElement>(null);
    const [requestStatuses, setRequestStatuses] = useState<Record<string, 'success' | 'failure' | 'pending'>>({});

    // Update statuses whenever savedRequests changes or when sessionStorage might have changed
    useEffect(() => {
        updateAllStatuses();
    }, [savedRequests]);

    // Function to update all request statuses at once
    const updateAllStatuses = () => {
        const newStatuses: Record<string, 'success' | 'failure' | 'pending'> = {};

        savedRequests.forEach(request => {
            const key = `${request.url}|${request.method}`;
            newStatuses[key] = getRequestStatus(request.url, request.method);
        });

        setRequestStatuses(newStatuses);
    };

    // Custom select handler that updates statuses after selection
    const handleSelectRequest = (request: ApiRequest) => {
        onSelectRequest(request);
        // Force refresh statuses after selection
        setTimeout(updateAllStatuses, 50);
    };

    const handleClear = () => {
        const userConfirmed = window.confirm('Are you sure you want to clear the history?');
        if (userConfirmed) {
            setSavedRequests([]);
            localStorage.removeItem('savedRequests');
            setRequestStatuses({});
        }
    };

    const clearSession = () => {
        const userConfirmed = window.confirm('Are you sure you want to clear the session data?');
        if (userConfirmed) {
            localStorage.removeItem('sessionrequests');
            updateAllStatuses(); // Update UI after clearing
            alert('Session data cleared successfully');
        }
    };

    const exportToJson = () => {
        // Get the saved requests from localStorage
        const savedRequests = localStorage.getItem('savedRequests');

        const userConfirmed = window.confirm('Do you want to download the history?');
        if (userConfirmed) {
            if (savedRequests) {
                // Create a Blob with the saved requests
                const blob = new Blob([savedRequests], { type: 'application/json' });

                // Create a link element to trigger the download
                const link = document.createElement('a');
                link.href = URL.createObjectURL(blob);
                link.download = 'savedRequests.json';  // Set the filename

                // Trigger the download by programmatically clicking the link
                link.click();
            } else {
                alert('No data to export.');
            }
        }
    };

    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onload = (e) => {
            try {
                const content = e.target?.result as string;
                const data = JSON.parse(content);

                // Validate the data is an array
                if (Array.isArray(data)) {
                    localStorage.setItem('savedRequests', JSON.stringify(data));
                    setSavedRequests(data); // Update the state with the imported data
                    alert('Data successfully imported from the file!');
                } else {
                    alert('Invalid data format in the file. Expected an array of requests.');
                }
            } catch (error) {
                console.error('Error parsing JSON file:', error);
                alert('Failed to parse the JSON file. Please ensure it\'s a valid JSON format.');
            }
        };

        reader.onerror = () => {
            alert('Error reading the file.');
        };

        reader.readAsText(file);
    };

    const handleImportClick = () => {
        fileInputRef.current?.click();
    };

    // Function to get color class based on status
    const getStatusColorClass = (status: 'success' | 'failure' | 'pending', hasRecordedOutput: boolean): string => {
        if (!hasRecordedOutput) return 'bg-blue-500';

        switch (status) {
            case 'success': return 'bg-green-500';
            case 'failure': return 'bg-red-500';
            default: return 'bg-blue-500';
        }
    };

    return (
        <div className={`${CARD_CONTAINER} !p-0 flex flex-col`}>
            <div className={`${DEV_HEADER_CLASSES} flex flex-row justify-between p-2`}>
                <div className={''}>History</div>
                <input
                    type="file"
                    ref={fileInputRef}
                    onChange={handleFileChange}
                    accept=".json"
                    style={{ display: 'none' }}
                />
                <Dropdown size='xs' label="Manage" color='blue' dismissOnClick={true}>
                    <DropdownItem
                        icon={HiOutlineDownload}
                        onClick={handleImportClick}>
                        Import
                    </DropdownItem>
                    <DropdownItem
                        icon={HiOutlineExternalLink}
                        onClick={exportToJson}>
                        Export
                    </DropdownItem>
                    <DropdownItem
                        icon={HiOutlineTrash}
                        onClick={clearSession}>
                        Clear Session
                    </DropdownItem>
                    <DropdownItem
                        icon={HiTrash}
                        onClick={handleClear}>
                        Clear History
                    </DropdownItem>
                </Dropdown>
            </div>
            <ul className='p-4 h-72 overflow-y-auto'>
                {savedRequests.map((request, index) => {
                    const requestKey = `${request.url}|${request.method}`;
                    const status = requestStatuses[requestKey] || 'pending';
                    const colorClass = getStatusColorClass(status, !!request.recordedOutput);

                    return (
                        <li
                            key={index}
                            className={`${SCRIPT_ITEM} ${request.url === apiUrl && request.method === method ? 'border-gray-600 dark:border-gray-700 text-black dark:text-white hover:!bg-white bg-white dark:bg-gray-800 dark:hover:!bg-gray-800' : 'border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-600 dark:hover:!bg-gray-700'}`}
                            onClick={() => handleSelectRequest(request)}
                        >
                            <div className='flex flex-row items-center'>
                                <span className={`w-2 h-2 rounded-full ${colorClass} block mr-2`}></span>
                                <div className="text-sm font-bold break-words w-64">
                                    {request.url}
                                </div>
                            </div>
                            <Button
                                size='xs'
                                disabled={request.url !== apiUrl || request.method !== method}
                                color={request.method === 'GET' ? 'blue' :
                                    request.method === 'POST' ? 'green' :
                                        request.method === 'PUT' ? 'yellow' :
                                            request.method === 'DELETE' ? 'red' :
                                                'alternative'}
                                onClick={handleRequest}>
                                {request.method}
                            </Button>
                        </li>
                    );
                })}
            </ul>
        </div>
    );
};

export default Sidebar;