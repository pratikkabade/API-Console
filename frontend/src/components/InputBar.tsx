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
        className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
      />
    </div>
  );
};

export default InputBar;
