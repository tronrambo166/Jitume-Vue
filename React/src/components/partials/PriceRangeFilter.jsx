import React, { useState } from 'react';
import { Range, getTrackBackground } from 'react-range';

const PriceRangeFilter = ({ onChange }) => {
  const [values, setValues] = useState([0, 1000]);

  const handleRangeChange = (newValues) => {
    setValues(newValues);
    onChange(newValues); // Pass the new values to the parent component
  };

  return (
    <div className="p-4 w-full max-w-md mx-auto">
      <div className="flex justify-between mb-4">
        <span className="text-gray-700 font-medium">Price Range:</span>
        <span className="text-gray-700 font-medium">${values[0]} - ${values[1]}</span>
      </div>
      <Range
        values={values}
        step={10}
        min={0}
        max={1000}
        onChange={handleRangeChange}
        renderTrack={({ props, children }) => (
          <div
            {...props}
            className="h-1 w-full rounded-lg"
            style={{
              background: getTrackBackground({
                values,
                colors: ['#ccc', 'rgb(22, 163, 74)', '#ccc'],
                min: 0,
                max: 1000,
              }),
              display: 'flex',
              alignItems: 'center',
            }}
          >
            {children}
          </div>
        )}
        renderThumb={({ props, isDragged }) => (
          <div
            {...props}
            className={`h-4 w-4 mt-2 bg-black rounded-full ${isDragged ? 'shadow-lg' : ''}`}
          >
            <div className="h-full w-full flex justify-center items-center">
              <div className="h-2 w-2 bg-white rounded-full" />
            </div>
          </div>
        )}
      />
    </div>
  );
};

export default PriceRangeFilter;
