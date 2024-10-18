import axios from "axios";
import { Link } from 'react-router-dom';
import axiosClient from "../../../axiosClient";
import { useState, useRef, useEffect } from 'react';
import { FaChevronLeft, FaChevronRight ,FaMapPin} from 'react-icons/fa';

const CardList = () => {
  const [cards, setCards] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const getCards = () => {
      setLoading(true);
      axiosClient.get('/latBusiness')
        .then(({ data }) => {
          setLoading(false);
          setCards(data.data);
          console.log(data)
          
        })
        .catch(err => {
          console.log(err);
          setLoading(false);
        });
    };
    getCards();
  }, []);
  const containerRef = useRef(null);

  const scrollLeft = () => {
    containerRef.current.scrollBy({ left: -containerRef.current.offsetWidth / 3, behavior: 'smooth' });
  };

  const scrollRight = () => {
    containerRef.current.scrollBy({ left: containerRef.current.offsetWidth / 3, behavior: 'smooth' });
  };

  return (
    <div className="relative flex justify-center my-7 mt-6 items-center group">
      <button
        onClick={scrollLeft}
        className="absolute left-0 sm:left-4 md:left-6 transform -translate-y-1/2 z-10 bg-white p-3 rounded-full shadow-lg opacity-0 group-hover:opacity-100 transition-opacity"
        style={{ top: '50%' }}
      >
        <FaChevronLeft size={24} />
      </button>
      <div
        ref={containerRef}
        className="flex gap-6 py-2"
        style={{
          overflowX: 'auto',
          scrollSnapType: 'x mandatory',
          scrollBehavior: 'smooth',
          maxWidth: 'calc(300px * 3 + 32px * 2)',
          scrollbarWidth: 'none', /* For Firefox */
          msOverflowStyle: 'none', /* For Internet Explorer and Edge */
        }}
      >
        <style>
          {`
            .no-scrollbar::-webkit-scrollbar {
              display: none; /* For Chrome, Safari, and Opera */
            }
          `}
        </style>
        {cards.map((card) => (
          <Link to={`/listing/${btoa(btoa(card.id))}`} key={card.id} className="bg-white w-[300px] rounded-xl shadow-lg flex-shrink-0">
           <div className="relative">
  <img
    src={card.image}
    alt={card.name}
    className="w-full h-48 object-cover rounded-t-xl"
  />
  <div className="absolute bottom-0 left-0 bg-black bg-opacity-60 text-white text-[12px] p-2 mx-3 my-2 ">
    <span className="flex items-center"><FaMapPin/>{card.location}</span>
  </div>
</div>

            <div className="p-4">
              <h2 className="text-xl font-semibold mb-2">{card.name}</h2>
              <p className="text-gray-700 text-md ">Contact:{card.contact}</p>
              <p className="text-black ">Amount Requested:$5000</p>
              
              <div className='flex text-black hover:text-green  font-bold gap-1 items-center'>
                <button>Learn more</button>
                <FaChevronRight size={15} />
              </div>
            </div>
          </Link>
        ))}
      </div>
      <button
        onClick={scrollRight}
        className="absolute right-0 sm:right-4 md:right-6 transform -translate-y-1/2 z-10 bg-white p-3 rounded-full shadow-lg opacity-0 group-hover:opacity-100 transition-opacity"
        style={{ top: '50%' }}
      >
        <FaChevronRight size={24} />
      </button>
    </div>
  );
};

export default CardList;
