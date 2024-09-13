import  { useState,useEffect } from 'react';
import axiosClient from "../../axiosClient";

function Milestones() {
  const [milestones, setMilestones] = useState([]);
  const [business, setBusiness] = useState([]);
  const [businessName, setBusinessName] = useState([]);



  useEffect(() => {
    const getMilestones = (id) => {
      id = 'all'
        axiosClient.get('/business/bBQhdsfE_WWe4Q-_f7ieh7Hdhf7E_-'+id)
          .then(({ data }) => {
            setMilestones(data.milestones);
            setBusiness(data.business)
          })
          .catch(err => {
            console.log(err);
          });
    };
    getMilestones();
  }, []);

  console.log(milestones)
  // const [milestones, setMilestones] = useState([
  //   { id: 1, title: "M 1", business: "Spurs 17", amount: 30000, status: "Done" },
  //   { id: 2, title: "M 2", business: "Spurs 17", amount: 30000, status: "In Progress" },
  //   // Add more sample data if needed
  // ]);
  const getMilestones2 = (id) => {
      axiosClient.get('/business/bBQhdsfE_WWe4Q-_f7ieh7Hdhf7E_-'+id)
        .then(({ data }) => {
          setMilestones();
          setBusinessName(data.business_name)

          setMilestones(data.milestones);

        })
        .catch(err => {
          console.log(err);
        });
  };


  const [selectedBusiness, setSelectedBusiness] = useState('All');

  const handleStatusChange = (e, id) => {
    const updatedMilestones = milestones.map((milestone) =>
      milestone.id === id ? { ...milestone, status: e.target.value } : milestone
    );
    setMilestones(updatedMilestones);
  };

  const handleDelete = (id) => {
    axiosClient.get('/business/delete_milestone/'+id)
    .then(({ data }) => {
      setMilestones(milestones.filter((milestone) => milestone.id !== id));

    })
    .catch(err => {
      console.log(err);
    });
  };

  const handleSet = (id ,status) => {

    const payload = {
      id:id ,
      status:status,
  } 
  console.log(payload);
  axiosClient.post("/business/mile_status",payload).then(({data})=>{
  console.log(data);
      
}).catch(err => { console.log(err);
    const response = err.response;
    if(response && response.status === 422){
        console.log(response.data.errors);
    }
    console.log(err);

});    setMilestones(updatedMilestones);

    console.log(`Set action for milestone ${id}`);
  };

  const handleDropdownChange = (e) => {

    setSelectedBusiness(businessName);
  };

  // Filter milestones based on selected business
  const filteredMilestones = selectedBusiness === 'All'
    ? milestones
    : milestones.filter(milestone => milestone.business === selectedBusiness);

  return (
    <div className="container mx-auto p-6">
      <h3 className="text-left text-2xl font-semibold mb-6">Business Milestones</h3>
      
      {/* Dropdown for selecting business */}
      <div className="mb-4 flex gap-2">
  <select
    // value={selectedBusiness}
    onChange={(e) => getMilestones2(e.target.value)}
    className="border rounded-lg p-2 focus:outline-none text-sm focus:ring-2 focus:ring-blue-500"
  >
    {business.map((business) => (
      <option key={business.id} value={business.id}>
        {business.name}
      </option>
    ))}
  </select>
</div>

      
      <div className="overflow-x-auto shadow-md sm:rounded-lg">
        <table className="min-w-full bg-white">
          <thead className="bg-gray-100 border-b">
            <tr className='text-gray-500 text-[12px]'>
              <th className="text-left py-3 px-4 uppercase font-semibold text-[12px]">Milestone Name</th>
              <th className="text-left py-3 px-4 uppercase font-semibold text-[12px]">Business</th>
              <th className="text-left py-3 px-4 uppercase font-semibold text-[12px]">Amount</th>
              <th className="text-left py-3 px-4 uppercase font-semibold text-[12px]">Status</th>
              <th className="text-center py-3 px-4 uppercase font-semibold text-sm">Action</th>
            </tr>
          </thead>
          <tbody>
            {filteredMilestones.map((milestone) => (
              <tr key={milestone.id} className="text-gray-600 text-sm hover:bg-gray-50 transition-colors">
                <td className="py-3 px-4 border-b">{milestone.title}</td>
                <td className="py-3 px-4 border-b">{milestone.business_name}</td>
                <td className="py-3 px-4 border-b">${milestone.amount}</td>
                <td className="py-3 px-4 border-b">
                  <select
                    value={milestone.status}
                    onChange={(e) => handleStatusChange(e, milestone.id)}
                    className="border rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="To Do">To Do</option>
                    <option value="In Progress">In Progress</option>
                    <option value="Done">Done</option>
                  </select>
                </td>
                <td className="py-3 px-4 border-b text-center flex gap-2 items-center">
                <div>
      <button
        onClick={() => handleSet(milestone.id, milestone.status)}
        className="text-black px-4 py-2 rounded-lg hover:bg-green transition-colors"
      >
        Set
      </button>
    </div>
                  <button
                    onClick={() => handleDelete(milestone.id)}
                    className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition-colors"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default Milestones;
