import { useRef, useState, useEffect } from 'react';
import { FaChevronLeft, FaChevronRight } from 'react-icons/fa';
import axiosClient from "../../axiosClient";
import { Link } from 'react-router-dom';

const Servicecards = () => {

  const [cards, setCards] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const getCards = () => {
      setLoading(true);
      axiosClient.get('/latServices')
        .then(({ data }) => {
          setLoading(false);
          setCards(data.data);
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
    <div className="relative flex justify-center my-10 items-center group">
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
          <Link to={`/service-details/${btoa(btoa(card.id))}`} key={card.id} className="bg-white w-[300px] rounded-xl shadow-lg flex-shrink-0">
            <img
              src={card.image}
              alt={card.name}
              className="w-full h-48 object-cover rounded-t-xl"
            />
            <div className="p-4">
              <h2 className="text-xl font-semibold mb-2">{card.name}</h2>
              <p className="text-gray-700 hidden">{card.category}</p>
              {/*<p>Contact: {card.contact}</p>*/}
              <p className="text-black font-semibold">Price: ${card.price}</p>
              <div className='flex text-black font-bold gap-1 items-center'>
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

export default Servicecards;
