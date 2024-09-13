import React, { useState } from 'react';

const Mile = () => {
  const milestones = [
    {
      name: 'Mile2',
      amount: '10000',
      documentLink: '#',
      status: 'DONE',
    },
    {
      name: 'Mile3',
      amount: '1000',
      documentLink: '#',
      status: 'DONE',
    },
    {
      name: 'Mile4',
      amount: '13000',
      documentLink: '#',
      status: 'In Progress',
      due: 'L A T E !',
    },
    {
      name: 'Mile5',
      amount: '6000',
      documentLink: '#',
      status: 'To Do',
    },
  ];

  const statusOptions = [
    { value: 'Paid', label: 'Paid' },
    { value: 'Done', label: 'Done' },
    { value: 'In Progress', label: 'In Progress' },
    { value: 'To Do', label: 'To Do' },
  ];

  const [selectedStatus, setSelectedStatus] = useState(
    milestones.reduce((acc, milestone) => {
      acc[milestone.name] = milestone.status;
      return acc;
    }, {})
  );

  const handleStatusChange = (milestoneName, newStatus) => {
    setSelectedStatus(prevStatus => ({
      ...prevStatus,
      [milestoneName]: newStatus,
    }));
  };

  return (
    <div className="container mx-auto p-5">
      <h3 className="text-left my-5 text-2xl font-bold">Milestones</h3>

      <div className="flex justify-center items-center mb-8">
        {['Step 1', 'Step 2', 'Step 3', 'Step 4'].map((step, index) => (
          <React.Fragment key={index}>
            <div className="flex flex-col items-center">
              <div
                className={`w-10 h-10 rounded-full flex items-center justify-center font-semibold ${
                  index === 2
                    ? 'bg-blue-500 text-white' // Highlight Step 3 as active
                    : 'bg-gray-200 text-gray-700'
                }`}
              >
                {index + 1}
              </div>
              <span className="mt-2 text-sm">{step}</span>
            </div>
            {index < 3 && (
              <div className="w-12 border-t-2 border-gray-300"></div>
            )}
          </React.Fragment>
        ))}
      </div>

      <div className="w-full flex justify-end mb-4">
        <div className="relative inline-block w-1/4">
          <button className="w-full bg-gray-200 border py-2 px-4 rounded inline-flex items-center justify-between">
            Select Business
            <svg className="w-4 h-4 ml-2" fill="currentColor" viewBox="0 0 20 20">
              <path d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" />
            </svg>
          </button>
          <ul className="dropdown-menu absolute hidden text-gray-700 pt-1">
            <li className="bg-gray-200 hover:bg-gray-400 py-2 px-4 block whitespace-no-wrap">Business 1</li>
            <li className="bg-gray-200 hover:bg-gray-400 py-2 px-4 block whitespace-no-wrap">Business 2</li>
          </ul>
        </div>
      </div>

      <table className="table-auto w-full border-collapse border border-gray-300">
        <thead>
          <tr className="bg-gray-200">
            <th className="border border-gray-300 px-4 py-2 text-left">Milestone Name</th>
            <th className="border border-gray-300 px-4 py-2 text-left">Amount</th>
            <th className="border border-gray-300 px-4 py-2 text-left">Documentation</th>
            <th className="border border-gray-300 px-4 py-2 text-left">Status</th>
          </tr>
        </thead>
        <tbody>
          {milestones.map((milestone, index) => (
            <tr key={index} className="hover:bg-gray-100">
              <td className="border border-gray-300 px-4 py-2">{milestone.name}</td>
              <td className="border border-gray-300 px-4 py-2">{milestone.amount}</td>
              <td className="border border-gray-300 px-4 py-2">
                <a href={milestone.documentLink} className="text-blue-500 hover:underline">Download Milestone Documentation</a>
              </td>
              <td className="border border-gray-300 px-4 py-2">
                <select
                  value={selectedStatus[milestone.name]}
                  onChange={e => handleStatusChange(milestone.name, e.target.value)}
                  className="px-3 py-1 rounded bg-gray-200 text-gray-700"
                >
                  {statusOptions.map(option => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Mile;
