import React from 'react';

interface InputBarProps {
    apiUrl: string;
    setApiUrl: (url: string) => void;
}

const InputBar: React.FC<InputBarProps> = ({ apiUrl, setApiUrl }) => {
    return (
        <div className="mb-4">
            <input
                type="text"
                value={apiUrl}
                onChange={(e) => setApiUrl(e.target.value)}
                placeholder="Enter API URL"
                className="block w-full border focus:outline-none focus:ring-1 disabled:cursor-not-allowed disabled:opacity-50 border-gray-300 bg-gray-50 text-gray-900 placeholder-gray-500 focus:border-primary-500 focus:ring-primary-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400 dark:focus:border-primary-500 dark:focus:ring-primary-500 p-2.5 text-sm rounded-lg"
            />
        </div>
    );
};

export default InputBar;