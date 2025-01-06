import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const AddBusiness = ({ connected, userId }) => {
  const [formData, setFormData] = useState({
    title: '',
    price: '',
    category: '',
    location: '',
    lat: '',
    lng: '',
    details: '',
    image: null,
    pin: null,
    identification: null,
    video: null,
    document: null,
    link: ''
  });
  const [messages, setMessages] = useState({ success: '', error: '' });
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    setFormData({
      ...formData,
      [name]: files ? files[0] : value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const data = new FormData();
    Object.keys(formData).forEach(key => {
      if (formData[key]) data.append(key, formData[key]);
    });

    try {
      const response = await axios.post('/create-business', data);
      setMessages({ success: response.data.success || '', error: '' });
      navigate('/some-page'); // Replace '/some-page' with the desired path
    } catch (error) {
      setMessages({ success: '', error: error.response?.data?.error || 'An error occurred' });
    }
  };

  return (
    <div className="container mx-auto px-4 py-6">
      {/* Success Message */}
      {messages.success && (
        <div className="bg-blue-100 text-blue-700 border border-blue-300 rounded-lg px-4 py-3 mb-4">
          <p className="font-semibold">{messages.success}</p>
          <button
            type="button"
            className="float-right text-blue-500 hover:text-blue-700"
            onClick={() => setMessages({ ...messages, success: '' })}
          >
            &times;
          </button>
        </div>
      )}

      {/* Error Message */}
      {messages.error && (
        <div className="bg-red-100 text-red-700 border border-red-300 rounded-lg px-4 py-3 mb-4">
          <p className="font-semibold">{messages.error}</p>
          <button
            type="button"
            className="float-right text-red-500 hover:text-red-700"
            onClick={() => setMessages({ ...messages, error: '' })}
          >
            &times;
          </button>
        </div>
      )}

      <h3 className="text-2xl font-bold mb-4 text-center">Add Business</h3>

      {connected === 0 ? (
        <div className="w-full max-w-lg mx-auto bg-gray-100 p-4 rounded-lg shadow-md mb-6">
          <p className="text-center text-gray-700 mb-4">
            Before adding a business, you must onboard to Tujitume Stripe platform to receive business milestone payments.
          </p>
          <a
            href={`/connect-stripe/${userId}`}
            className="block text-center bg-gray-200 border border-gray-400 rounded py-2 px-4 hover:bg-gray-300"
          >
            Connect to Stripe
          </a>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="w-full max-w-3xl mx-auto space-y-6">
          {/* Form Fields */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block mb-2 text-sm font-semibold">Business Title*</label>
              <input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleChange}
                required
                className="border border-gray-300 rounded px-3 py-2 w-full"
                placeholder="Business Title"
              />
            </div>
            <div>
              <label className="block mb-2 text-sm font-semibold">Price*</label>
              <input
                type="number"
                name="price"
                value={formData.price}
                onChange={handleChange}
                required
                className="border border-gray-300 rounded px-3 py-2 w-full"
                placeholder="Price"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block mb-2 text-sm font-semibold">Category*</label>
              <select
                name="category"
                value={formData.category}
                onChange={handleChange}
                className="border border-gray-300 rounded px-3 py-2 w-full"
              >
                <option value="" disabled hidden>Select a category</option>
                <option value="Business Planning">Business Planning</option>
                <option value="IT">IT</option>
                <option value="Legal Project Management">Legal Project Management</option>
                <option value="Branding and Design">Branding and Design</option>
                <option value="Auto">Auto</option>
                <option value="Finance, Accounting & Tax Marketing">Finance, Accounting & Tax Marketing</option>
                <option value="Tax Marketing">Tax Marketing</option>
                <option value="Public Relations">Public Relations</option>
                <option value="Project/Asset Management">Project/Asset Management</option>
                <option value="Other">Other</option>
              </select>
            </div>
            <div>
              <label className="block mb-2 text-sm font-semibold">Location*</label>
              <input
                type="text"
                name="location"
                value={formData.location}
                onChange={handleChange}
                required
                className="border border-gray-300 rounded px-3 py-2 w-full"
                placeholder="Enter a location..."
              />
              <input type="hidden" name="lat" value={formData.lat} />
              <input type="hidden" name="lng" value={formData.lng} />
            </div>
          </div>

          <div>
            <label className="block mb-2 text-sm font-semibold">Details*</label>
            <textarea
              name="details"
              value={formData.details}
              onChange={handleChange}
              required
              className="border border-gray-300 rounded px-3 py-2 w-full"
              rows="4"
              placeholder="Details..."
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block mb-2 text-sm font-semibold">Cover Image*</label>
              <label className="block cursor-pointer bg-gray-200 border border-gray-400 rounded text-center py-2 px-4 hover:bg-gray-300">
                Upload
                <input
                  type="file"
                  name="image"
                  onChange={handleChange}
                  className="hidden"
                  required
                />
              </label>
            </div>
            <div>
              <label className="block mb-2 text-sm font-semibold">Company/Individual Pin*</label>
              <label className="block cursor-pointer bg-gray-200 border border-gray-400 rounded text-center py-2 px-4 hover:bg-gray-300">
                Upload
                <input
                  type="file"
                  name="pin"
                  onChange={handleChange}
                  className="hidden"
                  required
                />
                <span className="block text-green-600 mt-1 text-xs">Only docs & pdfs</span>
              </label>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block mb-2 text-sm font-semibold">Directors Identification (Id/Passport)*</label>
              <label className="block cursor-pointer bg-gray-200 border border-gray-400 rounded text-center py-2 px-4 hover:bg-gray-300">
                Upload
                <input
                  type="file"
                  name="identification"
                  onChange={handleChange}
                  className="hidden"
                  required
                />
                <span className="block text-green-600 mt-1 text-xs">Only docs & pdfs</span>
              </label>
            </div>
            <div>
              <label className="block mb-2 text-sm font-semibold">Supportive Video*</label>
              <label className="block cursor-pointer bg-gray-200 border border-gray-400 rounded text-center py-2 px-4 hover:bg-gray-300">
                Upload
                <input
                  type="file"
                  name="video"
                  onChange={handleChange}
                  className="hidden"
                  required
                />
              </label>
              <div className="my-3 text-center">
                <span className="font-semibold">OR</span>
              </div>
              <input
                type="text"
                name="link"
                value={formData.link}
                onChange={handleChange}
                className="border border-gray-300 rounded px-3 py-2 w-full"
                placeholder="YouTube Video Link"
              />
            </div>
          </div>

          <div>
            <label className="block mb-2 text-sm font-semibold">Document*</label>
            <label className="block cursor-pointer bg-gray-200 border border-gray-400 rounded text-center py-2 px-4 hover:bg-gray-300">
              Upload
              <input
                type="file"
                name="document"
                onChange={handleChange}
                className="hidden"
                required
              />
            </label>
          </div>

          <div className="flex justify-end">
            <button
              type="submit"
              className="btn-primary text-white font-bold py-2 px-6 rounded  focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              Add Business
            </button>
          </div>
        </form>
      )}
    </div>
  );
};

export default AddBusiness;
