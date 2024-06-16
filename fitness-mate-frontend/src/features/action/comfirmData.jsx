import { DateTime } from 'luxon';
import React, { useState } from 'react';

const ConfirmForm = ({ data,table }) => {
  const [formData, setFormData] = useState(data);
  let tableName='';
  if(table==='health/water_log'){
    tableName='water';
  }else if(table==="activity_records"){
    tableName="health/activity";
  }else if(table==="weight_records"){
    tableName='health/weight';
  }else if(table==='reminders'){
    tableName='reminder';
  }else if(table==="blood_glucose_records"){
    tableName='health/glucose'
  }else if(table==="height_records"){
    tableName="health/height"
  }else if(table==="height_records"){
    tableName="health/height"
  }
  const handleChange = (key, value) => {
    
    setFormData({
      ...formData,
      [key]: value
    });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    const bd= JSON.stringify({...formData,'timestamp':new Date().toISOString().replace('T',' ').replace('Z','')});
    console.log(bd);
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('https://fitness-mate-backend.onrender.com/'+tableName, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body:bd
          });

      if (response.ok) {
        const result = await response.json();
        console.log('Response:', result);
      } else {
        console.log(response);
        console.error('Error:', response.statusText);
      }
    } catch (error) {
      console.error('Error:', error);
    }
  };

  const isDateKey = (key) => {
    if(key==='timestamp'){
      return true;
    }
    return false;
  };

  return (
    <div className="flex justify-start items-start bg-main p-0 lg:w-5/6">
      <form onSubmit={handleSubmit} className="bg-main-faint p-6 rounded-lg shadow-lg w-5/6">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-700">
            <thead>
              <tr>
                <th className="px-4 py-2 text-left text-xs font-mono text-txt uppercase tracking-wider">Key</th>
                <th className="px-4 py-2 text-left text-xs font-mono text-txt uppercase tracking-wider">Value</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-700">
              {Object.keys(formData).map((key) => (
                <tr key={key}>
                  <td className="px-4 py-2 text-sm text-txt">{key}</td>
                  <td className="px-4 py-2">
                    {isDateKey(key)  ? ""
                  : (
                      <input
                        type="text"
                        value={formData[key]}
                        onChange={(e) => handleChange(key, e.target.value)}
                        className="w-full px-2 py-1 text-sm bg-main text-txt border border-gray-600 rounded"
                      />
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="mt-4 flex justify-end">
          <button
            type="submit"
            className="px-4 py-2 text-sm bg-rare text-main rounded"
          >
            Confirm
          </button>
        </div>
      </form>
    </div>
  );
};

export default ConfirmForm;
