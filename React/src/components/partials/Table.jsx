const Table = () => {
  // Example data for the table
  const data = [
    { name: 'Service 1', category: 'Category A', details: 'Details about Service 1', required: true, amount: '$100', contact: '123-456-7890' },
    { name: 'Service 2', category: 'Category B', details: 'Details about Service 2', required: false, amount: '$200', contact: '987-654-3210' },
    { name: 'Service 3', category: 'Category C', details: 'Details about Service 3', required: true, amount: '$150', contact: '555-555-5555' },
  ];

  return (
    <div className="bg-white shadow-md mt-[80px] rounded-xl w-[900px] h-auto pl-3 m-3 p-4">
      <h1 className="text-[#2D3748] font-semibold text-2xl mb-4">My Businesses</h1>
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-600 text-black">
          <thead className="bg-white">
            <tr className="text-gray-400">
              <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">Name</th>
              <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">Category</th>
              <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">Details</th>
              <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">Amount</th>
              <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">Action</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y">
            {data.map((item, index) => (
              <tr key={index}>
                <td className="px-6 py-4 flex items-center">
                  <img 
                    className="w-[50px] h-[50px] rounded-lg" 
                    src="https://plus.unsplash.com/premium_photo-1680859126164-ac4fd8f56625?q=80&w=2071&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D" 
                    alt="Service" 
                  />
                  <div className="ml-4">
                    <div className="text-sm font-medium">{item.name}</div>
                    <div className="text-sm">{item.contact}</div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm">{item.category}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm">{item.details}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm">{item.amount}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm">
                  <button className="text-green rounded-xl border py-2 px-5">View milestones</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default Table;
