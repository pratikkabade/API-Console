import React, { SetStateAction, useState, useEffect } from 'react';

interface SidebarProps {
    savedRequests: ApiRequest[];
    setSavedRequests: React.Dispatch<SetStateAction<ApiRequest[]>>;
    onSelectRequest: (request: ApiRequest) => void;
}

const Sidebar: React.FC<SidebarProps> = ({ savedRequests, onSelectRequest, setSavedRequests }) => {
    const [isApiRunning, setIsApiRunning] = useState<boolean>(false);
    const [showImportButton, setShowImportButton] = useState<boolean>(false);

    const handleClear = () => {
        const userConfirmed = window.confirm('Are you sure you want to clear the history?');
        if (userConfirmed) {
            setSavedRequests([]);
            localStorage.removeItem('savedRequests');
        }
    }

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
    }

    const fetchSavedData = async () => {
        try {
            // Make an API call to the backend to fetch the saved requests JSON file
            const response = await fetch('http://localhost:5000/api/getSavedRequests');

            // Check if the response is successful
            if (!response.ok) {
                throw new Error('Failed to fetch the file');
            }

            // Parse the JSON data
            const data = await response.json();

            // Store the fetched data in localStorage
            if (Array.isArray(data)) {
                localStorage.setItem('savedRequests', JSON.stringify(data));
                setSavedRequests(data); // Update the state with the fetched data
                setIsApiRunning(true);
                setShowImportButton(false);

                alert('Data successfully imported from the file!');
            } else {
                alert('Invalid data format in the file.');
            }
        } catch (error) {
            console.error('Error loading the file:', error);
            alert('Failed to load the file.');
        }
    }

    // Check if the API is running and savedRequests is empty
    useEffect(() => {
        const checkApiStatus = async () => {
            try {
                // Make a request to check if the API is running
                const response = await fetch('http://localhost:5000');
                if (response.ok) {
                    setIsApiRunning(true);
                    // Check if there are no saved requests in localStorage
                    const savedRequestsInStorage = localStorage.getItem('savedRequests');
                    if (!savedRequestsInStorage) {
                        setShowImportButton(true);
                    }
                }
            } catch (error) {
                console.error('Error checking API status:', error);
                setIsApiRunning(false);
            }
        };

        checkApiStatus();
    }, [showImportButton, isApiRunning, savedRequests]);

    return (
        <div className="w-1/4 max-md:hidden bg-gray-100 h-screen overflow-auto">
            <div className='flex flex-row justify-between items-center fixed w-1/4 max-md:hidden backdrop-blur-md p-4 shadow-md'>
                <button
                    onClick={exportToJson}
                    className="px-3 py-1 bg-emerald-500 text-white rounded-md hover:bg-emerald-600 text-xl font-bold"
                >
                    History
                </button>
                <div>
                    {isApiRunning && !showImportButton &&
                        <>
                            <button
                                onClick={handleClear}
                                className='px-3 py-0.5 bg-red-500 text-white rounded-full hover:bg-red-600 font-bold'
                            >
                                Clear
                            </button>
                        </>}

                    {isApiRunning && showImportButton && (
                        <button
                            onClick={fetchSavedData}
                            className="px-3 py-0.5 bg-yellow-500 text-white rounded-full hover:bg-yellow-600 font-bold"
                        >
                            Import from JSON
                        </button>
                    )}
                </div>
            </div>
            <ul className='pt-20 p-4'>
                {savedRequests.map((request, index) => (
                    <li
                        key={index}
                        className="mb-2 p-2 bg-white rounded-md shadow cursor-pointer hover:bg-gray-200 break-words"
                        onClick={() => onSelectRequest(request)}
                    >
                        <div className="text-sm font-bold">{request.url}</div>
                        <div className={`text-xs font-bold text-white w-fit px-1 py-0.5 rounded-sm
                            ${request.method === 'GET' ? 'bg-blue-500' :
                                request.method === 'POST' ? 'bg-green-500' :
                                    request.method === 'PUT' ? 'bg-yellow-500' :
                                        request.method === 'DELETE' ? 'bg-red-500' :
                                            'bg-slate-500'
                            }`}>{request.method}
                        </div>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default Sidebar; 