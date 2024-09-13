import React, { useState } from 'react';

const UserRegistrationForm = () => {
  const [formData, setFormData] = useState({
    fname: '',
    mname: '',
    lname: '',
    email: '',
    id_no: '',
    tax_pin: '',
    id_passport: null,
    pin: null,
    password: '',
    password_confirmation: '',
    inv_range: [],
    interested_cats: [],
    past_investment: '',
    website: '',
    terms: false,
  });

  const handleChange = (e) => {
    const { name, value, type, checked, files } = e.target;
    setFormData(prevState => ({
      ...prevState,
      [name]: type === 'checkbox' ? checked : type === 'file' ? files[0] : value,
    }));
  };

  const handleCheckboxChange = (e) => {
    const { name, value, checked } = e.target;
    setFormData(prevState => {
      const updatedValues = checked
        ? [...prevState[name], value]
        : prevState[name].filter(v => v !== value);
      return { ...prevState, [name]: updatedValues };
    });
  };

  return (
    <div id="user_regs" className="mx-auto w-full collapse card-body">
      <form method="POST" action="/register" encType="multipart/form-data">
        {/* Hidden inputs */}
        <input type="hidden" name="investor" value="1" />
        <input type="hidden" name="c_to_listing_reg" id="c_to_listing_reg" value="" />

        <div className="flex space-x-4">
          {/* First Name */}
          <div className="flex-1">
            <label htmlFor="fname" className="block text-left text-md">
              First Name <span className="text-red-600">*</span>
            </label>
            <input
              id="fname"
              type="text"
              className="form-control pl-2 w-full border border-gray-300 rounded"
              name="fname"
              value={formData.fname}
              onChange={handleChange}
              required
              autoComplete="name"
              autoFocus
            />
          </div>

          {/* Middle Name */}
          <div className="flex-1">
            <label htmlFor="mname" className="block text-left text-md">
              Middle Name
            </label>
            <input
              id="mname"
              type="text"
              className="form-control pl-2 w-full border border-gray-300 rounded"
              name="mname"
              value={formData.mname}
              onChange={handleChange}
              autoComplete="name"
            />
          </div>
        </div>

        {/* Last Name and Email */}
        <div className="flex space-x-4 mt-4">
          {/* Last Name */}
          <div className="flex-1">
            <label htmlFor="lname" className="block text-left text-md">
              Last Name <span className="text-red-600">*</span>
            </label>
            <input
              id="lname"
              type="text"
              className="form-control pl-2 w-full border border-gray-300 rounded"
              name="lname"
              value={formData.lname}
              onChange={handleChange}
              required
              autoComplete="name"
            />
          </div>

          {/* E-Mail */}
          <div className="flex-1">
            <label htmlFor="email" className="block text-left text-md">
              E-Mail <span className="text-red-600">*</span>
            </label>
            <input
              id="email"
              type="email"
              className="form-control pl-2 w-full border border-gray-300 rounded"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
              autoComplete="email"
            />
          </div>
        </div>

        {/* ID No and Company Tax Pin */}
        <div className="flex space-x-4 mt-4">
          {/* Passport/ID No */}
          <div className="flex-1">
            <label htmlFor="id_no" className="block text-left text-md">
              Enter your passport/ID no <span className="text-red-600">*</span>
            </label>
            <input
              id="id_no"
              type="text"
              className="form-control pl-2 w-full border border-gray-300 rounded"
              name="id_no"
              value={formData.id_no}
              onChange={handleChange}
              required
            />
          </div>

          {/* Individual/Company Tax Pin */}
          <div className="flex-1">
            <label htmlFor="tax_pin" className="block text-left text-md">
              Enter your individual/company tax pin <span className="text-red-600">*</span>
            </label>
            <input
              id="tax_pin"
              type="text"
              className="form-control pl-2 w-full border border-gray-300 rounded"
              name="tax_pin"
              value={formData.tax_pin}
              onChange={handleChange}
              required
            />
          </div>
        </div>

        {/* Upload Passport and Upload Pin */}
        <div className="flex space-x-4 mt-4">
          {/* Upload Id/Passport */}
          <div className="flex-1">
            <label htmlFor="id_passport" className="block text-left text-md">
              Upload Id/Passport <span className="text-red-600">*</span>
            </label>
            <div className="border border-gray-300 py-2 rounded-lg">
              <div className="upload-btn-wrapper ml-2">
                <button type="button" className="flex gap-4 mr-2">
                  Id / Passport
                  <img src="images/up.svg" alt="Upload Icon" width="24" />
                </button>
                <input
                  required
                  type="file"
                  id="id_passport"
                  name="id_passport"
                  className="form-control pl-2 w-full"
                  onChange={handleChange}
                />
              </div>
            </div>
          </div>

          {/* Upload Pin */}
          <div className="flex-1">
            <label htmlFor="pin" className="block text-left text-md">
              Upload Pin
            </label>
            <div className="border border-gray-300 py-2 rounded-lg">
              <div className="upload-btn-wrapper ml-2">
                <button type="button" className="flex gap-4 mr-2">
                  Pin
                  <img src="images/up.svg" alt="Upload Icon" width="24" />
                </button>
                <input
                  type="file"
                  id="pin"
                  name="pin"
                  className="form-control pl-2 w-full"
                  onChange={handleChange}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Password and Confirm Password */}
        <div className="flex flex-col mt-4">
          <label htmlFor="password" className="block text-left text-md">
            Password <span className="text-red-600">*</span>
          </label>
          <input
            id="password"
            type="password"
            className="form-control w-full border border-gray-300 rounded"
            name="password"
            value={formData.password}
            onChange={handleChange}
            required
            autoComplete="new-password"
          />
        </div>

        <div className="flex flex-col mt-4">
          <label htmlFor="password_confirmation" className="block text-left text-md">
            Confirm Password <span className="text-red-600">*</span>
          </label>
          <input
            id="password_confirmation"
            type="password"
            className="form-control w-full border border-gray-300 rounded"
            name="password_confirmation"
            value={formData.password_confirmation}
            onChange={handleChange}
            required
            autoComplete="new-password"
          />
        </div>

        {/* Potential Investment Range */}
        <div className="flex flex-col mt-4">
          <label htmlFor="inv_range" className="block text-left text-md">
            Potential Investment Range
          </label>
          <div className="relative">
            <button type="button" className="mile btn mt-2 py-1 w-3/4 bg-gray-200 rounded">
              Select
            </button>
            <div className="dropdown-menu absolute bg-white border border-gray-300 mt-2 w-full rounded shadow-lg">
              <label className="block text-gray-600">
                <input
                  type="checkbox"
                  name="inv_range"
                  value="0-10000"
                  checked={formData.inv_range.includes('0-10000')}
                  onChange={handleCheckboxChange}
                  className="mr-2"
                />
                $0-$10000
              </label>
              <label className="block text-gray-600">
                <input
                  type="checkbox"
                  name="inv_range"
                  value="10000-100000"
                  checked={formData.inv_range.includes('10000-100000')}
                  onChange={handleCheckboxChange}
                  className="mr-2"
                />
                $10000-$100000
              </label>
              <label className="block text-gray-600">
                <input
                  type="checkbox"
                  name="inv_range"
                  value="100000-1000000"
                  checked={formData.inv_range.includes('100000-1000000')}
                  onChange={handleCheckboxChange}
                  className="mr-2"
                />
                $100000-$1000000
              </label>
            </div>
          </div>
        </div>

        {/* Interested Categories */}
        <div className="flex flex-col mt-4">
          <label htmlFor="interested_cats" className="block text-left text-md">
            Interested Categories
          </label>
          <div className="relative">
            <button type="button" className="mile btn mt-2 py-1 w-3/4 bg-gray-200 rounded">
              Select
            </button>
            <div className="dropdown-menu absolute bg-white border border-gray-300 mt-2 w-full rounded shadow-lg">
              <label className="block text-gray-600">
                <input
                  type="checkbox"
                  name="interested_cats"
                  value="real_estate"
                  checked={formData.interested_cats.includes('real_estate')}
                  onChange={handleCheckboxChange}
                  className="mr-2"
                />
                Real Estate
              </label>
              <label className="block text-gray-600">
                <input
                  type="checkbox"
                  name="interested_cats"
                  value="stocks"
                  checked={formData.interested_cats.includes('stocks')}
                  onChange={handleCheckboxChange}
                  className="mr-2"
                />
                Stocks
              </label>
              <label className="block text-gray-600">
                <input
                  type="checkbox"
                  name="interested_cats"
                  value="crypto"
                  checked={formData.interested_cats.includes('crypto')}
                  onChange={handleCheckboxChange}
                  className="mr-2"
                />
                Cryptocurrency
              </label>
            </div>
          </div>
        </div>

        {/* Past Investment Experience */}
        <div className="flex flex-col mt-4">
          <label htmlFor="past_investment" className="block text-left text-md">
            Past Investment Experience
          </label>
          <textarea
            id="past_investment"
            className="form-control w-full border border-gray-300 rounded"
            name="past_investment"
            value={formData.past_investment}
            onChange={handleChange}
            rows="4"
          />
        </div>

        {/* Website */}
        <div className="flex flex-col mt-4">
          <label htmlFor="website" className="block text-left text-md">
            Website
          </label>
          <input
            id="website"
            type="url"
            className="form-control w-full border border-gray-300 rounded"
            name="website"
            value={formData.website}
            onChange={handleChange}
          />
        </div>

        {/* Terms and Conditions */}
        <div className="flex items-center mt-4">
          <input
            type="checkbox"
            id="terms"
            name="terms"
            className="form-checkbox"
            checked={formData.terms}
            onChange={handleChange}
            required
          />
          <label htmlFor="terms" className="ml-2 text-left text-md">
            I accept the <a href="/terms" className="text-blue-500">Terms and Conditions</a>
            <span className="text-red-600">*</span>
          </label>
        </div>

        {/* Submit Button */}
        <div className="flex flex-col mt-6">
          <button
            type="submit"
            className="bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600"
          >
            Register
          </button>
        </div>
      </form>
    </div>
  );
};

export default UserRegistrationForm;
