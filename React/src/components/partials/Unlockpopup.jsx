import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

const UnlockPopup = ({ isOpen, onClose = () => {}, form, subscribed, tokenLeft, expire, plan }) => {
  const [showSmallFee, setShowSmallFee] = useState(false);
  const [showSubs, setShowSubs] = useState(false);
  const navigate = useNavigate();

  if (!isOpen) return null;

  const handleUnlockFee = () => {
    setShowSmallFee(true);
    setShowSubs(false);
  };

  const handleSubscribe = () => {
    if (subscribed) {
      setShowSubs(true);
      setShowSmallFee(false);
    } else {
      navigate(`/subscribe/${form.listing_id}`);
    }
  };

  const handlePayment = () => {
    console.log('Payment initiated');
  };

  const handleUseToken = () => {
    console.log('Token used');
  };

  const handleClose = () => {
    setShowSmallFee(false);
    setShowSubs(false);
    onClose();
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50 bg-gray-800 bg-opacity-50">
      <div className="bg-white rounded-lg shadow-lg p-6 max-w-sm w-full">
        {!showSubs && (
          <div className="flex gap-6 justify-center">
            <button
              onClick={handleUnlockFee}
              className="btn-primary rounded-md py-2 px-6 text-lg font-semibold mb-4"
            >
              Unlock Fee
            </button>
            <button
              onClick={handleSubscribe}
              className="text-lg border rounded-md border-black py-2 px-6 font-semibold mb-4"
            >
              {subscribed ? 'Subscription' : 'Subscribe'}
            </button>
          </div>
        )}

        {showSmallFee && (
          <>
            <p className="text-gray-700 mb-6">
              This business requests a small unlock fee of <b>${form.investors_fee}</b> to view their full business information.
            </p>
            <p className="text-gray-700 mb-6">Do you want to pay now?</p>
            <div className="flex justify-center space-x-4">
              <Link to={`/checkout/${form.investors_fee}/${form.listing_id}/fee`}>
                <button
                  onClick={() => {
                    handlePayment();
                    handleClose();
                  }}
                  className="btn-primary text-white py-2 px-6 rounded hover:bg-blue-600 transition"
                >
                  Ok
                </button>
              </Link>
              <button
                onClick={handleClose}
                className="bg-gray-300 text-gray-700 py-2 px-4 rounded hover:bg-gray-400 transition"
              >
                Cancel
              </button>
            </div>
          </>
        )}

        {showSubs && (
          <div>
            {tokenLeft > 0 && plan && (
              <p className="text-warning mb-3 text-center">
                Your <span>{plan}</span> expires in <b>{expire}</b> days.
                <span className="text-dark small d-block">Are you sure you want to use one of your {tokenLeft} business information tokens?</span>
              </p>
            )}
            {tokenLeft === 0 && (
              <p className="text-dark mb-3 text-center">
                Please use <b>'Small fee'</b> option to unlock
              </p>
            )}
            <div className="flex flex-wrap gap-4 justify-center">
              {['silver', 'silver-trial', 'gold', 'gold-trial', 'platinum', 'platinum-trial'].includes(plan) && (
                <button
                  onClick={handleUseToken}
                  className="btn-primary text-white py-2 px-6 rounded hover:bg-blue-600 transition"
                >
                  Use token <small>({tokenLeft} left)</small>
                </button>
              )}
              <button
                onClick={handleClose}
                className="bg-gray-300 text-gray-700 py-2 px-4 rounded hover:bg-gray-400 transition"
              >
                No
              </button>
            </div>
            <p className="text-danger text-center">The business is not in your range!</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default UnlockPopup;
