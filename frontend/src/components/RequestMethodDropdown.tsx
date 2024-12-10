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
        className="w-28 px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
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
