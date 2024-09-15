import { useState, useRef, useEffect } from "react";
import { useParams, useNavigate } from 'react-router-dom';
import Select from "react-select";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faLocationDot, faSearch, faPhone } from "@fortawesome/free-solid-svg-icons";
import Footer from "./footer";
import PriceRangeFilter from "./PriceRangeFilter";
import Navbar from "./Navbar";
import axiosClient from "../../axiosClient";
import { Link } from 'react-router-dom';
import { useStateContext } from "../../contexts/contextProvider";
import {decode as base64_decode, encode as base64_encode} from 'base-64';

// import noUiSlider from 'nouislider';
// import 'nouislider/dist/nouislider.css';


// Dummy data
const ListingResults = () => {
  const categories = [
  { value: "Agriculture", label: "Agriculture" },
  { value: "Arts/Culture", label: "Arts/Culture" },
  { value: "Auto", label: "Auto" },
  { value: "Domestic (Home Help etc)", label: "Domestic (Home Help etc)" },
  { value: "Fashion", label: "Fashion" },
  { value: "Finance/Accounting", label: "Finance/Accounting" },
  { value: "Food", label: "Food" },
  { value: "Legal", label: "Legal" },
  { value: "Media/Internet", label: "Media/Internet" },
  { value: "Other", label: "Other" },
  { value: "Pets", label: "Pets" },
  { value: "Real Estate", label: "Real Estate" },
  { value: "Retail", label: "Retail" },
  { value: "Security", label: "Security" },
  { value: "Sports/Gaming", label: "Sports/Gaming" },
  { value: "Technology/Communications", label: "Technology/Communications" },
];

  const { resIds }  = useParams();
  const { loc } = useParams();

  const [selectedCategory, setSelectedCategory] = useState(null);
  const [results, setResults] = useState('');
  const [priceRange, setPriceRange] = useState([0, 1000]); // Initial range
  const locationInputRef = useRef(null);
  const sliderRef = useRef(null);
  const mapRef = useRef(null);

  var count = results.length;
  let res = [];
  var max = 1000000;
  var min = 0;
  var max2 = 1000000;
  var min2 = 0;

  const openInNewTab = (url) => {
    window.open(url, "_blank");
  };
  
//CORE METHODS
  useEffect(()=> {
    const getResults = () => { 
        axiosClient.get('/searchResults/'+base64_decode(resIds))
          .then(({ data }) => {
           setResults(data.data);
           res = data.data;
           console.log(data);
            var x = navigator.geolocation;

            //Confim Loc
            $.confirm({
                title: 'Allow access location?',
                content:'',
                buttons: {
                  confirm: function () {
                    x.watchPosition(success, failure);
                  },
                  cancel: function () {
                    //$.alert('Canceled!');
                  },
                }
              });
            //x.getCurrentPosition(success, failure);
            // document.querySelector('.permission-granted-button').addEventListener('click', () => {
            //   x.watchPosition(success, failure);
            // });
            //Confim Loc
              
          })
          .catch(err => {
            console.log(err); 
          })
      };
      getResults();
      //console.log(res);

      const onChangeSlider = () => { 
        alert('slider is moving');
      }

 
 
   //x.getCurrentPosition(success, failure);
   var slider = document.getElementById('slider');
   var slider2 = document.getElementById('slider2');

   if((slider && slider.noUiSlider) || (slider2 && slider2.noUiSlider))
   {
            slider.noUiSlider.destroy();
            slider2.noUiSlider.destroy();
   }

    const rangeSlider = () => { 
            //var slider = document.getElementById('slider');
            noUiSlider.create(slider, {
                start: [0, 1000000],
                connect: true,
                range: {
                    'min': parseFloat(min),
                    'max': parseFloat(max),
                },

                step: 10000,
                margin: 600,
                pips: {
                    //mode: 'steps',
                    stepped: true,
                    density: 6
                }
            });
            var skipValues = [
                document.getElementById('price_low'),
                document.getElementById('price_high')
            ];
            slider.noUiSlider.on('update', function (values, handle) {
                skipValues[handle].innerHTML = '$' + values[handle];
                //console.log(values[1] - values[0]);

                  // setTimeout(() => {
                    axiosClient.get('priceFilter/' + values[0] + '/' + values[1] + '/' + base64_decode(resIds)).then((data) => {
                    //count = data.data.length;
                    setResults('');
                    setResults(data.data.data);

                    console.log(data.data.data)

                    for (const [key, value] of Object.entries(data.data)) {
                    
                    value.id = btoa(value.id);
                    value.id = btoa(value.id);
                }
                    // t.queryLat = data.data.data[0].lat;
                    // t.queryLng = data.data.data[0].lng;  
                }).catch((error) => { })
                // }, 1000)
              });


    }

    const amountSlider = () => { 

       noUiSlider.create(slider2, {
                start: [0, 1000000],
                connect: true,
                range: {
                    'min': parseFloat(min2),
                    'max': parseFloat(max2),
                },

                step: 10000,
                margin: 600,
                pips: {
                    //mode: 'steps',
                    stepped: true,
                    density: 6
                }
            });
            var skipValues = [
                document.getElementById('price_low2'),
                document.getElementById('price_high2')
            ];
            slider2.noUiSlider.on('update', function (values, handle) {
                skipValues[handle].innerHTML = '$' + values[handle];
                //console.log(values[1] - values[0]);

                  // setTimeout(() => {
                    axiosClient.get('priceFilter_amount/' + values[0] + '/' + values[1] + '/' + base64_decode(resIds)).then((data) => {
                    //count = data.data.length;
                    setResults('');
                    setResults(data.data.data);
                    console.log(data.data.data)

                    for (const [key, value] of Object.entries(data.data)) {
                    
                    value.id = btoa(value.id);
                    value.id = btoa(value.id);
                }
                    // t.queryLat = data.data.data[0].lat;
                    // t.queryLng = data.data.data[0].lng;  
                }).catch((error) => { })
                // }, 1000)
              });

    }

    rangeSlider();
    amountSlider();
    


    }, [] )


  //MAP -- MAP

        const success = (position) => {
        if((loc == true || loc == "true") && res.length !=0){
            var myLat = sessionStorage.getItem('queryLat');// this.queryLat;
            var myLong = sessionStorage.getItem('queryLng');// this.queryLng;
        }

        else{
             var myLat = position.coords.latitude;
             var myLong = position.coords.longitude;
        } 

        

        var coords = ([myLat,myLong]);
        var mapOptions = {
        zoom:8,
        center:coords,
        //center:new google.maps.LatLng(51.508742,-0.120850),
        }

        //MAP CONTAINER
        let map = new L.map('map' , mapOptions);
        let layer = new L.TileLayer('http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png');
        map.addLayer(layer);
        
        
        Object.entries(res).map(([key, value]) => {
            //INFO
                const contentString = '<a className="info_map py-0 font-weight-bold  text-center" target="_blank" href="/listing/'+btoa(btoa(value.id))+'">'
                +value.name+'</a>';

            //INFO
              const investment_needed = (value.investment_needed/1000)+"K";
              //this.addMarker({lat:value.lat, lng:value.lng},map,value.name,investment_needed,infowindow);
              var coord = ([value.lat,value.lng]);
              addMarker(coord,map,contentString);
            })
        

            addMarkerHome(coords,map);
        }

        const addMarker = (coords,map,contentString) => {
        let customIcon = {
         iconUrl:'../../images/map/other_business.png',
         iconSize:[32,32]
        }; let myIcon = L.icon(customIcon);

        let iconOptions = {
         title:'Spurs',
         draggable:true,
         icon:myIcon
        }

        var marker = new L.Marker(coords, iconOptions);
        marker.addTo(map);
        marker.bindPopup(contentString).openPopup();
        }

        const addMarkerHome = (coords,map) => {
        let customIcon = {
         iconUrl:'../../images/map/myloc.png',
         iconSize:[32,32]
        }; let myIcon = L.icon(customIcon);

        let iconOptions = {
         title:'Spurs',
         draggable:true,
         icon:myIcon
        }

        var marker = new L.Marker(coords, iconOptions);
        marker.addTo(map);

        }

        const failure = () => {}
        //MAP -- MAP


  return (
    <div className="container mx-auto px-4">
      <div className="flex mb-6 flex-col md:flex-row gap-4 justify-center pt-8 px-2 sm:px-6 md:px-4 items-center w-full max-w-3xl mx-auto">
        <input
          type="text"
          className="border py-2 text-md px-4 border-[#666666]/30 rounded-xl focus:outline-none w-full md:flex-1"
          placeholder="What are you looking for?"
          style={{ textAlign: "center" }}
        />
        <div className="relative w-full md:flex-1">
          <input
            type="text"
            placeholder="Location"
            className="border border-[#666666]/30 w-full text-md rounded-xl py-2 px-10 focus:outline-none"
            style={{ textAlign: "center" }}
            ref={locationInputRef}
          />
          <FontAwesomeIcon
            icon={faLocationDot}
            className="absolute right-3 ml-2 top-1/2 transform -translate-y-1/2 text-black cursor-pointer"
          />
        </div>
        <Select
          className="w-full md:flex-1"
          options={categories}
          value={selectedCategory}
          onChange={setSelectedCategory}
          placeholder="Select a category"
          isClearable
          styles={{
            control: (provided) => ({
              ...provided,
              borderRadius: "12px",
              padding: "2px 0", // Adjust this value as needed
            }),
          }}
        />
        <button
          className="btn-primary w-full md:w-auto py-3 rounded-full px-4 focus:outline-none mt-4 md:mt-0"
          
        >
          <FontAwesomeIcon icon={faSearch} />
        </button>
      </div>

      {/* Price Range Slider */}
      <div className="flex justify-between gap-[10px] items-center my-6">
    <div id="turnover_slider" className="w-[45%]">
        <label className="text-gray-700 font-semibold mb-2">Turnover Range</label>
        <div id="slider" className=""></div>
        <div className="row mt-3">
            <div className="col-6 mt-1">
                <span id="price_low" className="py-0 btn-light" name="min"></span>
            </div>
            <div className="col-6 mt-1 pr-0">
                <span id="price_high" className="float-right py-0 btn-light" name="min"></span>
            </div>
        </div>
    </div>

    <div id="amount_slider" className="w-[45%] mr-[50px] mt-1">
        <label className="text-gray-700 font-semibold mb-2">Amount Range</label>
        <div id="slider2" className=""></div>
        <div className="row mt-3">
            <div className="col-6 mt-1">
                <span id="price_low2" className="py-0 btn-light" name="min"></span>
            </div>
            <div className="col-6 mt-1 pr-0">
                <span id="price_high2" className="float-right py-0 btn-light" name="min"></span>
            </div>
        </div>
    </div>
</div>
      {/* Price Range Slider */}

        {/*<PriceRangeFilter />
        <PriceRangeFilter />*/}


      <h5 className="py-3 text-gray-700 font-semibold mt-6">
        <b>{count} Results Found</b> 
       {/* <button className="permission-granted-button"> Allow location </button>*/}
      </h5>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="space-y-4 no-scrollbar overflow-y-auto">
          {count === 0 ? (
            <p className="text-center text-gray-500">No results found.</p>
          ) : (
            results.map((row, index) => (
              <Link to={`/listing/${btoa(btoa(row.id))}`} key={row.id} > <div
                className="border my-4 h-48 border-gray-300 rounded-lg  shadow-md flex"
                key={index}
              >
                {row.video ? (
                  <img
                    src={'../../' + row.image}
                    alt={row.name}
                    className="w-1/3 h-48 object-cover rounded-l-lg"
                  />
                ) : (
                  <img
                    src={'../../' + row.image}
                    alt={row.name}
                    className="w-1/3 h-48 object-cover rounded-l-lg"
                  />
                )}
                <div className="p-4 flex flex-col">
                  <p className="mb-1 text-lg whitespace-nowrap font-semibold">
                    {row.name}
                  </p>
                  <div className="inline-block py-2">
                    <p className="mb-1 rounded-full bg-black py-1 px-2 text-sm text-white inline-block">
                      {row.category}
                    </p>
                  </div>
                  <div className="pt-[10px]">
                    <div className="flex justify-evenly gap-6 items-end">
                      <div className="flex flex-wrap flex-col text-[13px] text-[#0A0A0A]/70 gap-2">
                      <p className=" text-ellipsis">
  <FontAwesomeIcon icon={faLocationDot} className="mr-2" />
  Location: {row.location}
</p>

                        <p className="float">
                          <FontAwesomeIcon
                            icon={faPhone}
                            className="mr-2"
                          />
                          +1791205437
                        </p>
                      </div>
                      <div>
                        <p className="pl-[70px] text-[15px] font-bold">
                          ${row.average_price}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div> </Link>

            ))
          )}
        </div>

        <div className="h-[500px] border border-gray-300 rounded-lg flex items-center justify-center">
          {/* Placeholder for the map */}
                <div className="m-auto map_style">
                     <div id="map" style={{ height: '95%' }}></div> 
                </div>

        </div>
      </div>

    </div>
  );
};

export default ListingResults;
