import React from 'react';

interface DropdownProps {
    method: string;
    setMethod: (method: string) => void;
}

const RequestMethodDropdown: React.FC<DropdownProps> = ({ method, setMethod }) => {
    const methods = ['GET', 'POST', 'PUT', 'DELETE'];

    return (
        <div className="mb-4">
            <select
                value={method}
                onChange={(e) => setMethod(e.target.value)}
                className="block w-full appearance-none border bg-arrow-down-icon bg-[length:0.75em_0.75em] bg-[position:right_12px_center] bg-no-repeat focus:outline-none focus:ring-1 disabled:cursor-not-allowed disabled:opacity-50 border-gray-300 bg-gray-50 text-gray-900 focus:border-primary-500 focus:ring-primary-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400 dark:focus:border-primary-500 dark:focus:ring-primary-500 p-2.5 text-sm rounded-lg"
            >
                {methods.map((m) => (
                    <option key={m} value={m}>
                        {m}
                    </option>
                ))}
            </select>
        </div>
    );
};

export default RequestMethodDropdown;