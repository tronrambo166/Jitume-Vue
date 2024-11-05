import { useState, useRef } from "react";
import { useEffect } from 'react';
import Select from "react-select";
import { useParams, useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faLocationDot, faSearch, faPhone } from "@fortawesome/free-solid-svg-icons";
import Footer from "./footer";
import PriceRangeFilter from "./PriceRangeFilter";
import Navbar from "./Navbar";
import axiosClient from "../../axiosClient";
import { Link } from 'react-router-dom';
import { useStateContext } from "../../contexts/contextProvider";
import {decode as base64_decode, encode as base64_encode} from 'base-64';
import ServiceSearch from "../partials/ServiceSearch";

const ServiceResults = () => {
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
  const locationInputRef = useRef(null);
  const count = results.length;
  let res = [];

  const [cartRes, setCartRes] = useState('');
  var max = 1000000;
  var min = 0;

  //KEVIN
  useEffect(()=> {
    const getResults = () => { 
        axiosClient.get('/ServiceResults/'+base64_decode(resIds))
          .then(({ data }) => {
           setResults(data.data);
           res = data.data;
           console.log(data);
            var x = navigator.geolocation;
            x.getCurrentPosition(success, failure);
              
          })
          .catch(err => {
            console.log(err); 
          })
      };
      getResults();   


     var slider = document.getElementById('slider');
     if(slider && slider.noUiSlider)
     slider.noUiSlider.destroy();

      const amountSlider = () => { 
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
                    axiosClient.get('priceFilterS/' + values[0] + '/' + values[1] + '/' + base64_decode(resIds)).then((data) => {
                     //console.log(data)
                     setResults('');
                     setResults(data.data.data);
                    

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
            amountSlider(); 

  },[])

  const search = () => {
    // let filteredResults = dummyResults;
    // if (selectedCategory) {
    //   filteredResults = filteredResults.filter(
    //     (result) => result.category === selectedCategory.value
    //   );
    // }
    // setResults(filteredResults);
  };

  const openInNewTab = (url) => {
    window.open(url, "_blank");
  };

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
                const contentString = '<a class="info_map py-0 font-weight-bold  text-center" target="_blank" href="/service-details/'+btoa(btoa(value.id))+'">'
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
      <div className="w-full mx-auto px-24">
          <h1 className="text-3xl pt-4 md:text-[64px] mb-8 md:mb-16 font-semibold leading-tight md:leading-[79.36px] tracking-[0.02em] text-center font-sharp-grotesk text-[#00290F]">
              What Are You Looking For?
          </h1>
          <div className="">
              <ServiceSearch />
          </div>
          {/* <div className="flex mb-6 flex-col md:flex-row gap-4 justify-center pt-8 px-2 sm:px-6 md:px-4 items-center w-full max-w-3xl mx-auto">
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
                  onClick={search}
              >
                  <FontAwesomeIcon icon={faSearch} />
              </button>
          </div> */}

          <div className=" justify-center flex items-center gap-6    my-8">
              <div
                  id="turnover_slider"
                  className=" w-full jakarta  text-md border border-[#cbd5e1] rounded-lg space-y-2 px-6 py-4 "
              >
                  <label className="text-gray-700 font-semibold mb-2">
                      Price Range
                  </label>
                  <div id="slider" class="">
                      {" "}
                  </div>
                  <div className="row mt-3 jakarta">
                      <div className="col-6  mt-1">
                          <span id="price_low" className="py-0 " name="min">
                              {" "}
                          </span>
                      </div>
                      <div className="col-6 mt-1 pr-0">
                          <span
                              id="price_high"
                              className="float-right py-0 "
                              name="min"
                          >
                              {" "}
                          </span>
                      </div>
                  </div>
              </div>
              {/*<PriceRangeFilter />*/}
          </div>

          <h1 className=" text-gray-700 text-2xl mb-2   font-semibold ">
              <b>{count} Results Found</b>
          </h1>

          <div className="grid grid-cols-1 lg:grid-cols-[2fr_1fr] space-x-0">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                  {results.length === 0 ? (
                      <p className="text-center text-gray-400 italic">
                          No results found.
                      </p>
                  ) : (
                      results.map((row, index) => (
                          <Link
                              to={`/service-details/${btoa(btoa(row.id))}`}
                              key={row.id}
                              className=""
                          >
                              <div
                                  className="border p-5 border-[#0000001A]/10 shadow-sm bg-white h-[500px] rounded-2xl flex flex-col w-full max-w-[900px] mx-auto  "
                                  //   key={index}
                              >
                                  <div className="">
                                      {row.video ? (
                                          <img
                                              src={"../../" + row.image}
                                              alt={row.listing_name}
                                              className="w-full h-[250px] object-cover rounded-lg"
                                          />
                                      ) : (
                                          <img
                                              src={"../../" + row.image}
                                              alt={row.listing_name}
                                              className="w-full h-[250px] object-cover rounded-lg"
                                          />
                                      )}
                                  </div>
                                  <div className="flex flex-col pt-2 justify-between flex-grow ">
                                      <div className="flex flex-wrap gap-2 text-xs jakarta font-semibold text-[#1E293B]">
                                          {(
                                              row.tags || [
                                                  "example",
                                                  "dummy",
                                                  "placeholder",
                                                  "sample",
                                              ]
                                          ).map((tag) => (
                                              <span
                                                  key={tag}
                                                  className="  text-[#1E293B] jakarta font-semibold"
                                              >
                                                  #{tag}
                                              </span>
                                          ))}
                                      </div>
                                  </div>
                                  <div className="flex flex-col justify-between flex-grow">
                                      <p className="text-lg font-semibold text-slate-800">
                                          {row.name}
                                      </p>
                                      <p className="text-sm text-gray-600">
                                          {row.details ||
                                              "Lorem ipsum dolor sit amet consectetur..."}
                                      </p>
                                      <p className="text-sm text-gray-600 inline-block">
                                          {row.category}
                                      </p>
                                      <div className="">
                                          <div className="text-sm text-gray-500 flex flex-col gap-1">
                                              <p className="flex items-center ">
                                                  <FontAwesomeIcon
                                                      icon={faLocationDot}
                                                      className="mr-1 text-slate-500"
                                                  />
                                                  {row.location}
                                              </p>
                                              <p className="flex items-center truncate">
                                                  <FontAwesomeIcon
                                                      icon={faPhone}
                                                      className="mr-1 text-slate-500"
                                                  />
                                                  {row.contact || "+1791205437"}
                                              </p>
                                          </div>
                                      </div>
                                      <p className="text-green-600 font-bold mt-2">
                                          ${row.price}
                                          <span className="text-gray-500 ml-1 text-xs">
                                              / Price
                                          </span>
                                      </p>
                                  </div>
                              </div>
                          </Link>
                      ))
                  )}
              </div>

              <div className="h-[400px] rounded-m flex items-center justify-center mt-[-30px]">
                  {/* Placeholder for the map */}
                  <div
                      className="m-auto map_style"
                      style={{
                          borderRadius: "16px",
                          overflow: "hidden",
                          marginLeft: "20px",
                      }}
                  >
                      <div
                          id="map"
                          style={{ height: "100%", borderRadius: "16px" }}
                      ></div>
                  </div>
              </div>
          </div>
      </div>
  );
};

export default ServiceResults;
