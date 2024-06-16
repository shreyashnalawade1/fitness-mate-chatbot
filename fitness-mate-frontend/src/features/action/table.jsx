import React from 'react';

const TableComponent = ({ data }) => {
  return (
    <div className="p-4  bg-main faint text-txt text-xs w-5/6">
      <table className="divide-y divide-rare overflow-scroll w-full">
        <thead >
          <tr className="bg-main">
            {data[0].map((header, index) => (
              <th key={index} className="px-6 py-3 text-left text-xs font-sm text-txt uppercase tracking-wider">
                {header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="bg-main-faint divide-y font-sm divide-main max-w-full">
          {data.slice(1).map((row, rowIndex) => (
            <tr key={rowIndex}>
              {row.map((cell, cellIndex) => (
                <td key={cellIndex} className="px-6 py-4 whitespace-nowrap">
                  {cell}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default TableComponent;
