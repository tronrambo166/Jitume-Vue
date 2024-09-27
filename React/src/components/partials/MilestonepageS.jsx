import { useState, useEffect } from "react";
import { useParams } from 'react-router-dom';
import axiosClient from "../../axiosClient";
import React from 'react';
import { useStateContext } from '../../contexts/contextProvider';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';


const MilestonePage = () => {
  const { id } = useParams();
  const listing_id = atob(atob(id));
  const [miles, setMiles] = useState([]); 
  const [no_mile, setNo_mile] = useState(false);
  const [isDone, setIsDone] = useState(false);
  const [booked, setbooked] = useState(false);
  const [allow, setallow] = useState(false);
  const [reviews, setReviews] = useState([]);
  const [curr_step, setCurrStep] = useState(0);
  const { token } = useStateContext();
  
  // const [miles, setMiles] = useState([]);
  const total_steps = miles.length;
  //const curr_step = 0;
  
  useEffect(() => {
    const getMilestones = () => {
      axiosClient.get('/getMilestonesS_Auth/' + listing_id, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      })
        .then(({ data }) => {

          if (Array.isArray(data.data)) {
            console.log(data.data);
            setMiles(data.data);
            if (data.data.length !== 0) {
              for (let i = 0; i < data.data.length; i++) {
                  if(data.data[i].active == 1)
                    setCurrStep(i+1);
              } 
              alert(curr_step);
              // const activeIndex = data.data.findIndex(mile => mile.active === 1);
              // if (activeIndex !== -1) {
              //   setCurrStep(activeIndex);
              // }
              // 
            }
          } else {
            setMiles([]);
          }
          setIsDone(data.done_msg);
          setbooked(data.booked);
          setallow(data.allow);
        })
        .catch(err => {
          setMiles([]);
          console.log(err);
          toast.error('An error occurred while fetching the data!');
        });
    };
  
    getMilestones();
  }, [listing_id, token]);
  
  const handleStatusChange = (milestoneName, status) => {
    //console.log(Milestone ${milestoneName} status changed to: ${status});
    // Update milestone status logic here
  };




  const handlePay = (mile_id,amount) => {
    //alert(mile_id+ amount)
        var amount = btoa(amount);
        var mile_id = btoa(mile_id)
        var purpose = btoa('s_mile');
        $.confirm({
          title: 'Please Confirm',
          content: 'Are you sure?',
          buttons: {
            confirm: function () {
              window.location.href = '/checkoutS/' + mile_id + '/' + amount+'/'+purpose+'/'+btoa('null');
            },
            cancel: function () {
              $.alert('Canceled!');
            },
          }
        });

    }

    //DOWNLOAD
  const download_doc = mile_id => e => {
      axiosClient({
          url: 'download_milestoneDocS/' + listing_id + '/' + mile_id, //your url
          method: 'GET',
          //responseType: 'blob',
        }).then((data) => {
        console.log(data);
        if((data.data.size == 3)){
          $.alert({
          title: 'Alert!',
          content: 'The business has no such document or the file not found!',
           type: 'red',
            buttons: {
            tryAgain: {
            text: 'Close',
            btnClass: 'btn-red',
            action: function(){
            }
        }}  
        });
        } //console.log(data);
        else{
          const href = URL.createObjectURL(data.data);
          const link = document.createElement('a');
          link.href = href;

          if(data.data.type == 'application/vnd.openxmlformats-officedocument.wordprocessingml.document')
          link.setAttribute('download', 'milestone.docx'); //or any other extension
          else
           link.setAttribute('download', 'milestone.pdf');
            
          document.body.appendChild(link);
          link.click();
        }

      });
    }


  return (
    <div className="container mx-auto p-5">
      <h3 className="text-left my-5 text-2xl font-bold">Milestones</h3>

        { !token &&
            <div class="w-75 h-100 py-5 my-5 my-auto justify-content-center my-2 text-center mx-auto">
                <a style={{cursor:'pointer', width:'40%'}} 
                    class="searchListing mx-auto text-center py-1 text-light font-weight-bold" data-target="#loginModal"
                    data-toggle="modal">Login to pay</a>
            </div>
          }

            { no_mile && <div  class="w-75 h-100 py-5 my-5 my-auto justify-content-center my-2 text-center mx-auto">
                <h5 class="w-75 mx-auto bg-light py-3 my-3 text-secondary">No Milestones Yet!</h5>
            </div> }

            { isDone &&
              <div  class="w-75 my-5 h-100 text-center mx-auto">
                <h5 class="w-75 mx-auto bg-light py-3 my-3 text-secondary">Milestones completed, Service delivered!</h5>
              </div>
            }

      {/* Steps 1-4 */}
      <div className="flex justify-center items-center mb-8">
      {Array.from({ length: total_steps }, (_, index) => (
            <React.Fragment key={index}>
      <div className="flex flex-col items-center">
        <div
          className={`w-10 h-10 rounded-full flex items-center justify-center font-semibold ${
            index < curr_step
              ? 'bg-green text-white' // Steps that are greened out (completed)
              : 'bg-gray-200 text-gray-700' // Inactive steps
          }`}
        >
          {index + 1}
        </div>
        <span className="mt-2 text-sm">Step {index + 1}</span>
      </div>
      {index < total_steps - 1 && (
        <div className="w-12 border-t-2 border-gray-300"></div> // Line between steps
      )}
    </React.Fragment>
  ))}
</div>

      <table className="table-auto w-full border-collapse border border-gray-300">
        <thead>
          <tr className="bg-gray-200">
            <th className="border border-gray-300 px-4 py-2 text-left">Milestone Name</th>
            <th className="border border-gray-300 px-4 py-2 text-left">Amount</th>
            <th className="border border-gray-300 px-4 py-2 text-left">Document</th>
            <th className="border border-gray-300 px-4 py-2 text-left">Status</th>
            <th className="border border-gray-300 px-4 py-2 text-left">Action</th>
            <th className="border border-gray-300 px-4 py-2 text-left">Time left</th>
          </tr>
        </thead>
        <tbody>

          {miles.filter(milestone => milestone.status === 'Done').map((milestone, index) => (
            <tr key={index} className="hover:bg-gray-100">
              <td className="border border-gray-300 px-4 py-2">{milestone.title}</td>
              <td className="border border-gray-300 px-4 py-2">{milestone.amount}</td>
              <td className="border border-gray-300 px-4 py-2">
                <button
                onClick={ download_doc(milestone.mile_id) } className="text-black hover:underline">Download Milestone Documentation
               </button>
              </td>
              <td className="border border-gray-300 px-4 py-2">
                <div className="flex space-x-2">
                  <button
                    onClick={() => handleStatusChange(milestone.title, 'Paid')}
                    className={`px-3 py-1 rounded ${
                      milestone.status === 'Paid'
                        ? 'bg-green-500 text-white'
                        : 'bg-gray-200 text-gray-700'
                    }`}
                  >
                    Done
                  </button>
                  </div>

                {/*</div>
                {milestone.status === 'Done' && (
                  <div className="text-green-500 mt-2">Done</div>
                */}

              </td>

            </tr>
          ))}

          
          {miles.filter(milestone => milestone.status === 'In Progress' ||
           milestone.status === 'To Do').map((milestone, index) => (
            <tr key={index} className="hover:bg-gray-100">
              <td className="border border-gray-300 px-4 py-2">{milestone.title}</td>
              <td className="border border-gray-300 px-4 py-2">{milestone.amount}</td>
              <td className="border border-gray-300 px-4 py-2">
                <button
                onClick={ download_doc(milestone.mile_id) } className="text-black hover:underline">Download Milestone Documentation
               </button>
              </td>
              <td className="border border-gray-300 px-4 py-2">
                <div className="flex space-x-2">
                  {booked && milestone.status === 'To Do' &&  
                    <button
                    onClick={() => handlePay(milestone.id, milestone.amount)}> 
                  To Do  </button>
                }

                {booked && milestone.status === 'In Progress' &&  
                    <button
                    // onClick={() => handleStatusChange(milestone.title, 'Paid')}
                    className={`px-3 py-1 rounded ${
                      milestone.status === 'In Progress'
                        ? 'bg-green text-white'
                        : 'bg-gray-200 text-gray-700'
                    }`}
                  >
                    In Progress
                  </button> 
                }

                {!booked  &&  
                    <button 
                    className="px-3 py-1 rounded bg-gray-200 text-gray-700" >
                   {milestone.status}
                  </button> 
                }
                  
                </div>
                {/*{milestone.status === 'In Progress' && (
                  <div className="text-red-500 mt-2">{milestone.due}</div>
                */}
              </td>

              {booked && milestone.status === 'To Do' && milestone.active ?( 
               <td className="border border-gray-300 px-4 py-2"> 
               
               <button
                    onClick={() => handlePay(milestone.id, milestone.amount)}
                    className={`px-3 py-1 rounded ${
                      milestone.status === 'To Do'
                        ? 'bg-green text-white'
                        : 'bg-gray-200 text-gray-700'
                    }`}
                  >
                    PAY
                  </button> 
               </td>
               ): (
                <td className="border border-gray-300 px-4 py-2"> - </td>
               ) }

              <td className="border border-gray-300 px-4 py-2">{milestone.time_left} </td>

            </tr>
          ))}

          
{/*
          {miles.filter(milestone => milestone.status === 'To Do').map((milestone, index) => (
            <tr key={index} className="hover:bg-gray-100">
              <td className="border border-gray-300 px-4 py-2">{milestone.title}</td>
              <td className="border border-gray-300 px-4 py-2">{milestone.amount}</td>
              <td className="border border-gray-300 px-4 py-2">
                <a href={milestone.document} className="text-blue-500 hover:underline">Download Milestone Documentation</a>
              </td>
              <td className="border border-gray-300 px-4 py-2">
                <div className="flex space-x-2">
                  <button
                    onClick={() => handleStatusChange(milestone.title, 'Paid')}
                    className={`px-3 py-1 rounded ${
                      milestone.status === 'To Do'
                        ? 'bg-green-500 text-white'
                        : 'bg-gray-200 text-gray-700'
                    }`}
                  >
                    To Do
                  </button>
                  
                </div>
                {/*{milestone.status === 'To Do' && (
                  <div className="text-gray-500 mt-2">PAY</div>
                )}*/}
           {/*   </td>
              <td className="border border-gray-300 px-4 py-2">{milestone.time_left}  </td>*/}

         {/*   </tr>
          ))}*/}

        </tbody>
      </table>
      <ToastContainer />
    </div>
  );
};

export default MilestonePage;