import React, { useState } from 'react';
import { useForm } from 'react-hook-form';

const InvestorRegistration = () => {
    const { register, handleSubmit, formState: { errors } } = useForm();
    const [fileIdPassport, setFileIdPassport] = useState(null);
    const [filePin, setFilePin] = useState(null);

    const onSubmit = (data) => {
        // Handle form submission
        console.log(data);
    };

    return (
        <div className="mx-auto w-full">
            <form onSubmit={handleSubmit(onSubmit)} encType="multipart/form-data">
                {/* Hidden Inputs */}
                <input type="hidden" name="investor" value="1" />
                <input type="hidden" name="c_to_listing_reg" id="c_to_listing_reg" value="" />

                <div className="flex gap-4 mb-4">
                    {/* First Name */}
                    <div className="flex-1">
                        <label htmlFor="fname" className="block text-left text-gray-700">
                            First Name <span className="text-red-500">*</span>
                        </label>
                        <input
                            id="fname"
                            type="text"
                            className="form-input mt-1 block w-full"
                            {...register('fname', { required: true })}
                        />
                        {errors.fname && <p className="text-red-500 text-sm">First name is required</p>}
                    </div>

                    {/* Middle Name */}
                    <div className="flex-1">
                        <label htmlFor="mname" className="block text-left text-gray-700">
                            Middle Name
                        </label>
                        <input
                            id="mname"
                            type="text"
                            className="form-input mt-1 block w-full"
                            {...register('mname')}
                        />
                    </div>
                </div>

                <div className="flex gap-4 mb-4">
                    {/* Last Name */}
                    <div className="flex-1">
                        <label htmlFor="lname" className="block text-left text-gray-700">
                            Last Name <span className="text-red-500">*</span>
                        </label>
                        <input
                            id="lname"
                            type="text"
                            className="form-input mt-1 block w-full"
                            {...register('lname', { required: true })}
                        />
                        {errors.lname && <p className="text-red-500 text-sm">Last name is required</p>}
                    </div>

                    {/* Email */}
                    <div className="flex-1">
                        <label htmlFor="email" className="block text-left text-gray-700">
                            E-Mail <span className="text-red-500">*</span>
                        </label>
                        <input
                            id="email"
                            type="email"
                            className="form-input mt-1 block w-full"
                            {...register('email', { required: true })}
                        />
                        {errors.email && <p className="text-red-500 text-sm">Email is required</p>}
                    </div>
                </div>

                <div className="flex gap-4 mb-4">
                    {/* Passport/ID No */}
                    <div className="flex-1">
                        <label htmlFor="id_no" className="block text-left text-gray-700">
                            Enter your passport/ID no <span className="text-red-500">*</span>
                        </label>
                        <input
                            id="id_no"
                            type="text"
                            className="form-input mt-1 block w-full"
                            {...register('id_no', { required: true })}
                        />
                        {errors.id_no && <p className="text-red-500 text-sm">ID No is required</p>}
                    </div>

                    {/* Individual/Company Tax Pin */}
                    <div className="flex-1">
                        <label htmlFor="tax_pin" className="block text-left text-gray-700">
                            Enter your individual/company tax pin <span className="text-red-500">*</span>
                        </label>
                        <input
                            id="tax_pin"
                            type="text"
                            className="form-input mt-1 block w-full"
                            {...register('tax_pin', { required: true })}
                        />
                        {errors.tax_pin && <p className="text-red-500 text-sm">Tax Pin is required</p>}
                    </div>
                </div>

                <div className="flex gap-4 mb-4">
                    {/* Upload ID/Passport */}
                    <div className="flex-1">
                        <label htmlFor="id_passport" className="block text-left text-gray-700">
                            Upload ID/Passport <span className="text-red-500">*</span>
                        </label>
                        <div className="border border-gray-300 p-2 rounded-lg">
                            <input
                                id="id_passport"
                                type="file"
                                className="form-input mt-1 block w-full"
                                onChange={(e) => setFileIdPassport(e.target.files[0])}
                                {...register('id_passport', { required: true })}
                            />
                        </div>
                    </div>

                    {/* Upload Pin */}
                    <div className="flex-1">
                        <label htmlFor="pin" className="block text-left text-gray-700">
                            Upload Pin
                        </label>
                        <div className="border border-gray-300 p-2 rounded-lg">
                            <input
                                id="pin"
                                type="file"
                                className="form-input mt-1 block w-full"
                                onChange={(e) => setFilePin(e.target.files[0])}
                                {...register('pin')}
                            />
                        </div>
                    </div>
                </div>

                <div className="flex flex-col mb-4">
                    {/* Password */}
                    <label htmlFor="password" className="block text-left text-gray-700">
                        Password <span className="text-red-500">*</span>
                    </label>
                    <input
                        id="password"
                        type="password"
                        className="form-input mt-1 block w-full"
                        {...register('password', { required: true })}
                    />
                    {errors.password && <p className="text-red-500 text-sm">Password is required</p>}
                </div>

                <div className="flex flex-col mb-4">
                    {/* Confirm Password */}
                    <label htmlFor="password_confirmation" className="block text-left text-gray-700">
                        Confirm Password <span className="text-red-500">*</span>
                    </label>
                    <input
                        id="password_confirmation"
                        type="password"
                        className="form-input mt-1 block w/full"
                        {...register('password_confirmation', { required: true })}
                    />
                    {errors.password_confirmation && <p className="text-red-500 text-sm">Confirmation password is required</p>}
                </div>

                <div className="flex gap-4 mb-4">
                    {/* Potential Investment Range */}
                    <div className="flex-1">
                        <label htmlFor="inv_range" className="block text-left text-gray-700">
                            Potential Investment Range
                        </label>
                        <select
                            id="inv_range"
                            className="form-select mt-1 block w-full"
                            {...register('inv_range')}
                        >
                            <option value="0-10000">$0-$10000</option>
                            <option value="10000-100000">$10000-$100000</option>
                            <option value="100000-250000">$100000-$250000</option>
                            <option value="250000-500000">$250000-$500000</option>
                            <option value="500000-">$500000+</option>
                        </select>
                    </div>
                </div>

                <div className="flex gap-4 mb-4">
                    {/* Interested Industries */}
                    <div className="flex-1">
                        <label htmlFor="interested_cats" className="block text-left text-gray-700">
                            Which industries are you interested in investing?
                        </label>
                        <select
                            id="interested_cats"
                            className="form-select mt-1 block w-full"
                            {...register('interested_cats')}
                            multiple
                        >
                            <option value="Agriculture">Agriculture</option>
                            <option value="Arts/Culture">Arts/Culture</option>
                            <option value="Auto">Auto</option>
                            <option value="Sports/Gaming">Sports/Gaming</option>
                            <option value="Real Estate">Real Estate</option>
                            <option value="Food">Food</option>
                            <option value="Legal">Legal</option>
                            <option value="Security">Security</option>
                            <option value="Media/Internet">Media/Internet</option>
                            <option value="Fashion">Fashion</option>
                            <option value="Technology/Communications">Technology/Communications</option>
                            <option value="Retail">Retail</option>
                            <option value="Finance/Accounting">Finance/Accounting</option>
                            <option value="Pets">Pets</option>
                            <option value="Domestic (Home Help etc)">Domestic (Home Help etc)</option>
                        </select>
                    </div>
                </div>

                <div className="flex flex-col mb-4">
                    <label htmlFor="portfolio" className="block text-left text-gray-700">
                        Provide your portfolio/website link
                    </label>
                    <input
                        id="portfolio"
                        type="url"
                        className="form-input mt-1 block w-full"
                        {...register('portfolio')}
                    />
                </div>

                <div className="flex justify-end">
                    <button type="submit" className="btn btn-primary">
                        Register
                    </button>
                </div>
            </form>
        </div>
    );
};

export default InvestorRegistration;
