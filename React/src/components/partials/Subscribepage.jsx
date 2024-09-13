import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import axiosClient from "../../axiosClient";
//import { useParams } from 'react-router-dom';

const Subscribepage = () => {
    const [selectedPackage, setSelectedPackage] = useState(null);
    const [showConfirmation, setShowConfirmation] = useState(false);
    const [showAlert, setShowAlert] = useState(false);
    const [subscribed, setSubscribed] = useState(true);
    const [plan, setPlan] = useState('silver');
    const [tokenLeft, setTokenLeft] = useState(5);
    const [expire, setExpire] = useState(5);
    const [frequency, setFrequency] = useState('monthly');
    const navigate = useNavigate();
    const { id } = useParams();

      const [u_id, setid] = useState('');

    const [amount, setAmount] = useState('0');
    const [range, setRange] = useState('all');
    const [days, setDays] = useState('');
    const form = {
        business_id: atob(atob(id))
    };

    const packagePrices = {
        silver: {
            monthly: '9.99',
            annual: '95.99',
        },
        gold: {
            monthly: '29.99',
            annual: '287.99',
        },
        platinum: {
            monthly: '69.99',
            annual: '671.99',
        },
    };

    const handlePackageSelect = (pkg) => {
        setSelectedPackage(pkg);
        setAmount(pkg);

        if(pkg == '9.99'){
            setPlan('silver');
            setDays(30);
        }
        if(pkg == '29.99'){
            setPlan('gold');
            setDays(30);
        }
        if(pkg == '69.99'){
            setPlan('platinum');
            setDays(30);
        }
        if(pkg == '95.99'){
            setPlan('silver');
            setDays(365);
        }
        if(pkg == '287.99'){
            setPlan('gold');
            setDays(365);
        }
        if(pkg == '671.99'){
            setPlan('platinum');
            setDays(365);
        }

        if(pkg == 'platinum-trial' || pkg == 'gold-trial' || pkg == 'silver-trial'){
            setPlan(pkg);
            setDays(7);
            setAmount(0);
        }     

    };

    const handleFrequencyChange = (freq) => {
        setFrequency(freq);
    };

   
    const Checkout = () => {
    //alert(amount+plan+days)

    if(!plan)
        alert('Please select a plan!');

    else {
        if (selectedPackage){
        const range_e = btoa(form.range);
        const amount_e = btoa(amount);
        const business_id_e = btoa(form.business_id);
        const plan_e = btoa(plan);
        const days_e = btoa(days);
        const inv = u_id;


        $.confirm({
          title: 'Are you sure?',
          content: 'Are you sure to pay?',
          buttons: {
            confirm: function () {
              window.location.href = 'http://127.0.0.1:8000/stripeSubscribe/' + amount_e+'/'+plan_e+'/'+days_e+'/'+range_e+'/'+inv;
             //navigate('/stripeSubscribe/' + amount_e+'/'+plan_e+'/'+days_e+'/'+range_e);
            },
            cancel: function () {
              $.alert('Canceled!');
            },
          }
        });
    }
    else setShowAlert(true);
    }

    }

    const confirmCheckout = () => {
        setShowConfirmation(false);
        navigate('/checkout');
    };

    const closeAlert = () => {
        setShowAlert(false);
    };

    const goBack = () => {
        navigate(-1);
    };

    useEffect(() => {
    const getUser = () => { 
      axiosClient.get('/checkAuth')
        .then(({ data }) => {            
          setid(data.user.id);   
          console.log(data.user.id);     
        })
        .catch(err => {
          console.log(err); 
        });
    };
    getUser();
  }, []);

    return (
        <div>
            <div className="flex py-5 justify-center items-center">
                <div className="flex flex-col gap-3 items-center">
                    <h1 className="font-bold text-center">Let's get you started!</h1>
                    <h2 className="text-center">All plans start with a 7 days free trial.</h2>

                    <div>
                        <div className="flex flex-col sm:flex-row gap-6 justify-center">
                            <label className="flex items-center">
                                <input
                                    type="radio"
                                    name="subscription"
                                    value="monthly"
                                    checked={frequency === 'monthly'}
                                    onChange={() => handleFrequencyChange('monthly')}
                                />
                                <span className="px-1">Monthly</span>
                            </label>
                            <label className="flex items-center">
                                <input
                                    type="radio"
                                    name="subscription"
                                    value="annual"
                                    checked={frequency === 'annual'}
                                    onChange={() => handleFrequencyChange('annual')}
                                />
                                <span className="px-1">Annually (save 20%)</span>
                            </label>
                        </div>
                    </div>

                    <div className="flex flex-col lg:flex-row gap-6 items-center justify-center w-full max-w-4xl mb-12">
                        <div className="flex flex-col items-center w-full sm:w-1/3">
                            <h1 className="text-xl mb-4">Silver</h1>
                            <div
                                className={`border rounded-xl p-4 text-center shadow-sm w-full sm:w-[300px] cursor-pointer 
                                ${plan === 'silver' ? 'bg-green-100 border-green' : ''}`}
                                onClick={() => handlePackageSelect(packagePrices.silver[frequency])}
                            >
                                <h1>{packagePrices.silver[frequency]}</h1>
                                <p className="whitespace-nowrap">
                                    10 free "Unlock tokens" per<br /> month from any range.
                                </p>
                                
                            </div>

                            <button onClick={() => handlePackageSelect('silver-trial')}
                                    className={`w-full sm:w-[250px] border rounded-md py-2 my-2 
                                    ${frequency === 'annual' ? 'bg-gray-400 text-gray-700 cursor-not-allowed' : 'bg-green hover:bg-green-700 text-white'}`}
                                    disabled={frequency === 'annual'}
                                >
                                    Try free for 7 days
                                </button>
                        </div>

                        <div className="flex flex-col items-center w-full sm:w-1/3">
                            <h1 className="text-xl mb-4">Gold</h1>
                            <div
                                className={`border text-center p-4 rounded-md shadow-sm w-full sm:w-[300px] cursor-pointer 
                                ${plan === 'gold' ? 'bg-green-100 border-green' : ''}`}
                                onClick={() => handlePackageSelect(packagePrices.gold[frequency])}
                            >
                                <h1>{packagePrices.gold[frequency]}</h1>
                                <p className="whitespace-nowrap">
                                     30 free "Unlock tokens" per<br /> month for any range.
                                </p>
                                
                            </div>
                            <button onClick={() => handlePackageSelect('gold-trial')}
                                    className={`w-full sm:w-[250px] border rounded-md py-2 my-2 
                                    ${frequency === 'annual' ? 'bg-gray-400 text-gray-700 cursor-not-allowed' : 'bg-green hover:bg-green-700 text-white'}`}
                                    disabled={frequency === 'annual'}
                                >
                                    Try free for 7 days
                                </button>
                        </div>

                        <div className="flex flex-col items-center w-full sm:w-1/3">
                            <h1 className="text-xl mb-4">Platinum</h1>
                            <div
                                className={`border text-center p-4 rounded-md shadow-sm w-full sm:w-[300px] cursor-pointer 
                                ${plan === 'platinum' ? 'bg-green-100 border-green' : ''}`}
                                onClick={() => handlePackageSelect(packagePrices.platinum[frequency])}
                            >
                                <h1>{packagePrices.platinum[frequency]}</h1>
                                <p className="whitespace-nowrap">
                                    Silver access + Gold access to all data.
                                </p>
                               
                            </div>
                             <button onClick={() => handlePackageSelect('platinum-trial')}
                                    className={`w-full sm:w-[250px] border rounded-md py-2 my-2 
                                    ${frequency === 'annual' ? 'bg-gray-400 text-gray-700 cursor-not-allowed' : 'bg-green hover:bg-green-700 text-white'}`}
                                    disabled={frequency === 'annual'}
                                >
                                    Try free for 7 days
                                </button>
                        </div>
                    </div>

                    <div>
                        <div className="flex flex-col lg:flex-row gap-6 lg:gap-[200px] justify-between items-center">
                            <div className="flex flex-col text-center lg:text-left">
                                <h1>Turnover ranges</h1>
                                <h2>$0-$10,000</h2>
                                <h2>$10,000-$100,000</h2>
                                <h2>$100,000-$250,000</h2>
                                <h2>$250,000-$500,000</h2>
                                <h2>$500,000+</h2>
                            </div>
                            <div className="mt-6 lg:mt-0 flex flex-col gap-4 items-center">
                                <button
                                    className="btn-primary px-6 py-2 rounded-full text-white"
                                    onClick={Checkout}
                                >
                                    Checkout
                                </button>
                                <button
                                    className="bg-black  px-6 py-2 rounded-full text-gray-100 border-gray-400"
                                    onClick={goBack}
                                >
                                    Back
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {showConfirmation && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white rounded-lg p-8 max-w-md mx-auto shadow-lg">
                        <h2 className="text-xl font-semibold mb-4">Confirm Your Selection</h2>
                        <p>
                            You have selected the <b>{selectedPackage.charAt(0).toUpperCase() + selectedPackage.slice(1)}</b> package.
                        </p>
                        <p>
                            {selectedPackage === 'silver' ? (
                                <>
                                    <p>Your plan expires in <b>{expire}</b> days.</p>
                                    <p className="text-dark small d-block">Are you sure you want to use one of your {tokenLeft} business information tokens?</p>
                                </>
                            ) : (
                                <p>Please use <b>'Small fee'</b> option to unlock</p>
                            )}
                        </p>
                        <div className="flex flex-col">
                            {selectedPackage === 'silver' ? (
                                <div className="flex gap-3">
                                    <button
                                        className="modal_ok_btn w-75 m-auto d-inline btn rounded mr-3 px-3"
                                        onClick={confirmCheckout}
                                    >
                                        Yes
                                    </button>
                                    <button
                                        className="modal_cancel_btn w-75 m-auto d-inline btn rounded mr-3 px-3"
                                        onClick={() => setShowConfirmation(false)}
                                    >
                                        No
                                    </button>
                                </div>
                            ) : (
                                <div className="flex gap-3">
                                    <button
                                        className="modal_ok_btn w-75 m-auto d-inline btn rounded mr-3 px-3"
                                        onClick={() => setShowConfirmation(false)}
                                    >
                                        Close
                                    </button>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            )}

            {showAlert && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white rounded-lg p-8 max-w-md mx-auto shadow-lg">
                        <h2 className="text-xl font-semibold mb-4">Alert</h2>
                        <p>Please select a package before proceeding.</p>
                        <button
                            className="btn-primary px-6 py-2 rounded-full text-white"
                            onClick={closeAlert}
                        >
                            Close
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Subscribepage;
