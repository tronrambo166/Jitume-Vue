import React, { useState } from 'react';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const BusinessMilestone = () => {
  // Test data
  const [milestones, setMilestones] = useState([
    { id: 1, title: 'Milestone 1', amount: 30000, status: 'In Progress', document: '#', due: '3 days' },
    { id: 2, title: 'Milestone 2', amount: 30000, status: 'Done', document: '#', due: 'Completed' },
    { id: 3, title: 'Milestone 3', amount: 33000, status: 'To Do', document: '#', due: 'To be started' }
  ]);

  const noMilestone = milestones.length === 0;

  const handleDownload = (document) => {
    console.log(`Downloading document from: ${document}`);
    // Add download logic here
  };

  const handleStatusChange = (id, newStatus) => {
    setMilestones(milestones.map(milestone =>
      milestone.id === id ? { ...milestone, status: newStatus } : milestone
    ));
    toast.success(`Milestone ${id} marked as ${newStatus}`);
  };

  return (
    <div className="container mx-auto p-5">
      <ToastContainer />

      <div className="flex justify-start mb-5">
        <button
          onClick={() => window.history.back()}
          className="border px-4 py-2 font-bold rounded-md bg-gray-100 text-gray-800"
        >
          Back
        </button>
      </div>

      {noMilestone ? (
        <div className="w-3/4 mx-auto text-center py-5">
          <h5 className="bg-gray-200 py-3 text-gray-500 rounded">
            No Milestones Yet!
          </h5>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white border border-gray-200 rounded-md shadow-md">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="py-2 px-4 text-left text-gray-600">Milestone Name</th>
                <th className="py-2 px-4 text-left text-gray-600">Amount</th>
                <th className="py-2 px-4 text-left text-gray-600">Documentation</th>
                <th className="py-2 px-4 text-left text-gray-600">Status</th>
                <th className="py-2 px-4 text-left text-gray-600">Actions</th>
              </tr>
            </thead>
            <tbody>
              {milestones.map((milestone, index) => (
                <tr key={milestone.id} className="border-b border-gray-200">
                  <td className="py-2 px-4">{milestone.title}</td>
                  <td className="py-2 px-4">${milestone.amount}</td>
                  <td className="py-2 px-4">
                    <a
                      href={milestone.document}
                      className={`text-${milestone.status === 'Done' ? 'gray-500' : 'blue-500'} hover:underline`}
                      onClick={(e) => {
                        e.preventDefault();
                        handleDownload(milestone.document);
                      }}
                    >
                      Download
                    </a>
                  </td>
                  <td className="py-2 px-4">
                    <span
                      className={`inline-block py-1 px-3 rounded ${
                        milestone.status === 'Paid'
                          ? 'bg-green-500 text-white'
                          : milestone.status === 'Done'
                          ? 'bg-blue-500 text-white'
                          : 'bg-gray-400 text-white'
                      }`}
                    >
                      {milestone.status}
                    </span>
                  </td>
                  <td className="py-2 px-4 flex space-x-2">
                    {milestone.status === 'In Progress' && (
                      <button
                        onClick={() => handleStatusChange(milestone.id, 'Paid')}
                        className={`px-3 py-1 rounded bg-green-500 text-white hover:bg-green-600 ${
                          milestone.status === 'Paid' || milestone.status === 'Done' ? 'cursor-not-allowed' : ''
                        }`}
                        disabled={milestone.status === 'Paid' || milestone.status === 'Done'}
                      >
                        Mark as Paid
                      </button>
                    )}
                    {milestone.status === 'Paid' && (
                      <button
                        onClick={() => handleStatusChange(milestone.id, 'Done')}
                        className={`px-3 py-1 rounded bg-blue-500 text-white hover:bg-blue-600 ${
                          milestone.status === 'Done' ? 'cursor-not-allowed' : ''
                        }`}
                        disabled={milestone.status === 'Done'}
                      >
                        Mark as Done
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default BusinessMilestone;
