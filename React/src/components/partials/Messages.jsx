import { useEffect, useState } from 'react';
import axiosClient from "../../axiosClient";

function Messages() {
  const [messages, setMessages] = useState([]);

  const [selectedMessage, setSelectedMessage] = useState(null);

  useEffect(() => {
    const getUser = () => { 
      axiosClient.get('/business/service_messages')
        .then(({ data }) => {
          setMessages(data.messages);           
          console.log(messages);    

        })
        .catch(err => {
          console.log(err); 
        });
    };
    getUser();
  }, []);

  const handleReply = (message) => {
    setSelectedMessage(message);
  };

  return (
    <div className="container mx-auto p-6">
      <h3 className="text-left text-2xl font-semibold mb-6">Messages</h3>
      <div className="overflow-x-auto shadow-md sm:rounded-lg">
        <table className="min-w-full bg-white border border-gray-200">
          <thead className="bg-gray-100 border-b border-gray-200">
            <tr className='text-gray-700'>
              <th className="text-left py-3 px-4 uppercase font-semibold text-sm">From</th>
              <th className="text-left py-3 px-4 uppercase font-semibold text-sm">Related Service</th>
              <th className="text-left py-3 px-4 uppercase font-semibold text-sm">Message</th>
              <th className="text-left py-3 px-4 uppercase font-semibold text-sm">Time</th>
              <th className="text-left py-3 px-4 uppercase font-semibold text-sm">Reply</th>
            </tr>
          </thead>
          <tbody>
            {messages.map((msg) => (
              <tr key={msg.id} className="text-gray-700 hover:bg-gray-50 transition-colors">
                <td className="py-3 px-4 border-b">{msg.sender}</td>
                <td className="py-3 px-4 border-b">{msg.service}</td>
                <td className="py-3 px-4 border-b">{msg.msg}</td>
                <td className="py-3 px-4 border-b">{msg.created_at}</td>
                <td className="py-3 px-4 border-b text-center">
                  <button
                    onClick={() => handleReply(msg)}
                    className="text-blue-600 hover:underline focus:outline-none"
                  >
                    Reply
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Modal for replying to a message */}
      {selectedMessage && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-60">
          <div className="bg-white p-8 rounded-lg shadow-xl max-w-lg mx-auto relative">
            <button
              onClick={() => setSelectedMessage(null)}
              className="absolute top-4 right-4 text-gray-500 hover:text-gray-700"
            >
              <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
              </svg>
            </button>
            <h4 className="text-2xl font-semibold mb-6">Reply to Message</h4>
            <p className="mb-4"><strong>From:</strong> {selectedMessage.from}</p>
            <p className="mb-4"><strong>Message:</strong> {selectedMessage.message}</p>
            <textarea
              rows="4"
              className="w-full border border-gray-300 rounded-lg p-2 mb-4 focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter your message..."
            ></textarea>
            <div className='flex justify-end'>
              <button
                onClick={() => setSelectedMessage(null)}
                className='btn-primary py-2 px-6 rounded-lg hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-300 transition-colors'
              >
                Send
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Messages;
