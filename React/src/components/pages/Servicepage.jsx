import { useParams, useNavigate } from 'react-router-dom';
import { useRef } from 'react';
import { useState } from 'react';
import { useEffect } from 'react';
import axiosClient from "../../axiosClient";

import Footer from "../partials/footer";
import Navbar from "../partials/Navbar";
import Servicecards from "../partials/Service-cards";
import banner from "../../images/banner.png";
import Localservicesection from "./Localservicesection";
import { Link } from "react-router-dom";
import {decode as base64_decode, encode as base64_encode} from 'base-64';

const Servicepage = () => {
  const handleInputChange = (event) => {
    // Handle input changes
  };

  const locationInputRef = useRef(null);
  const categoryRef = useRef(null);
  const nameRef = useRef(null);
  const latRef = useRef(null);
  const lngRef = useRef(null);

  const navigate = useNavigate();
  const [results, setResults] = useState('');
  const [rangeResults, setRangeResults] = useState('');

    const Search = (e) =>{
    e.preventDefault();
        let ids = '';
        const payload = {
            search: locationInputRef.current.value,
            category: categoryRef.current.value,
            listing_name: nameRef.current.value,
            lat: $('#lat').val(),
            lng: $('#lng').val(),
        } 
        console.log(payload);
        axiosClient.post("/searchService",payload).then(({data})=>{
            console.log(data);
            Object.entries(data.results).forEach(entry => {
            const [index, row] = entry;
            ids = ids + row.id + ',';
          }); console.log(ids);
          if (!ids) ids = 0;

          sessionStorage.setItem('queryLat', payload.lat);
          sessionStorage.setItem('queryLng', payload.lng);
          navigate('/serviceResults/'
              +base64_encode(ids)+ '/'+ data.loc
            ); 
            
      }).catch(err => { console.log(err);
          const response = err.response;
          if(response && response.status === 422){
              console.log(response.data.errors);
          }
          console.log(err);

      });
  }

  const getPlaces = (e) => { 
    e.preventDefault();
    $("#result_list2").html('');
    const searchText = locationInputRef.current.value;

        $.ajax({
                url: 'https://photon.komoot.io/api/?q=' + encodeURIComponent(searchText),
                method: 'get',
                dataType: 'json',
                success: function(response) {
                  var i;  console.log(response.features);
                
                    for (i = 0; i < 10; i++) { //console.log(response.features[i].name);
                        var name = response.features[i].properties.name;
                        var city = response.features[i].properties.city;
                        if(city == null || city == 'undefined')
                        city = '';
                        var country = response.features[i].properties.country;
                        var lng = response.features[i].geometry.coordinates[0];
                        var lat = response.features[i].geometry.coordinates[1];

                        $("#result_list2").show();
                            if(i<10)

                            if(city == '')
                            $("#result_list2").append(' <div onclick="address(\'' + name + ','  + country + '\', \'' + lat + '\', \'' + lng + '\');" style="" data-id="' + name + '" class="address  py-1 px-1 my-0 border-top bg-white single_comms">  <p class="h6 small text-dark d-inline" ><i class="fa fa-map-marker mr-1 text-dark" aria-hidden="true"></i> ' + name + '</p> <p  class="d-inline text-dark"><small>, ' + country + '</small> </p> </div>');
                            else
                            $("#result_list2").append(' <div onclick="address(\'' + name + ','+ city + ','  + country + '\', \'' + lat + '\', \'' + lng + '\');" style="" data-id="' + name + '" class="address  py-1 px-1 my-0 border-top bg-white single_comms">  <p class="small h6 text-dark d-inline" ><i class="fa fa-map-marker mr-1 text-dark" aria-hidden="true"></i> ' + name + '</p> <p  class="d-inline text-dark"><small>, ' + city + ',' + country + '</small> </p> </div>');


                        }
                        //document.getElementById('result_list2').style.overflowY="scroll";                      
                },
                error: function(error) {
                    console.log(error);
                }

            });
      }

  return (
    <div>
      <div className="lg:w-[1500px] md:w-[1000px] sm:w-[500px] mx-auto">
        <section
          className="bg-cover bg-center flex items-center relative w-full"
          style={{ backgroundImage: `url(${banner})` }}
        >
          <div className="container my-8 md:mx-8 px-4 sm:px-6 lg:px-8 flex items-center relative">
            <form
              id="form"
              className="bg-white w-[517px] h-auto p-6 rounded-[28px] lg:ml-[75px] relative z-10"
              
              method="post"
            >
              <h2 className="text-[32px] font-semibold mb-4">
                Find the <span className="text-[#198754]">right services</span>,
                <br />
                for you
              </h2>
              <div className="flex flex-col">
                <div className="mb-4">
                  <label htmlFor="listing_name" className="sr-only">
                    Listing Name:
                  </label>
                  <input ref={nameRef}
                    id="listing_name"
                    className="bar bg-gray-100 form-control w-full sm:w-[453px] px-4 py-2 rounded-md"
                    type="text"
                    name="listing_name"
                    placeholder="What are you looking for?"
                    onChange={handleInputChange}
                  />
                </div>
                <div className="flex flex-col sm:flex-row sm:items-center sm:gap-[28px]">
                  <div className="mb-4 relative">
                    <label htmlFor="location" className="sr-only">
                      Location:
                    </label>
                    <div className="relative">
                      <input ref={locationInputRef} 
                        id="searchbox"
                        onKeyUp={getPlaces}
                        className="py-2 px-4 w-[220px] border border-gray-300 rounded-full focus:outline-none focus:ring-0 focus:border-transparent"
                        type="text"
                        name="search"
                        placeholder="Location"
                      />
                      <div className="absolute inset-y-0 right-0 flex items-center pr-2 pointer-events-none">
                        <svg
                          className="h-4 w-4 fill-current text-gray-500"
                          xmlns="http://www.w3.org/2000/svg"
                          viewBox="0 0 20 20"
                        >
                          <path d="M10 2a7 7 0 0 1 7 7c0 4.472-7 11-7 11S3 13.472 3 9a7 7 0 0 1 7-7zm0 2a5 5 0 0 0-5 5c0 2.142 3.094 6.333 5 8 1.906-1.667 5-5.858 5-8a5 5 0 0 0-5-5z" />
                        </svg>
                      </div>
                      <ul
                        id="suggestion-list"
                        className="absolute w-[250px] bg-white border-t-0 rounded-b-md shadow-lg z-10 top-full"
                      >
                        {/* Suggestions will be dynamically added here */}
                      </ul>
                      <ul id="suggestion-list" className="absolute w-[250px] bg-white  border-t-0 rounded-b-md shadow-lg z-10 top-full">
                      </ul>
                      <div id="result_list2" className="absolute w-[250px] bg-white  border-gray-300 border-t-0 rounded-b-md shadow-lg z-10 top-full">

                      </div>
                      <input  type="text" name="lat" id="lat" hidden value=""/>
                      <input  type="text" name="lng" id="lng" hidden value=""/>
                    </div>
                  </div>
                  <div className="mb-4 relative">
                    <label htmlFor="category" className="sr-only">
                      Category:
                    </label>
                    <select ref={categoryRef} 
                      id="category"
                      name="category"
                      className="py-2 form-control w-full sm:w-[212.5px] px-4 rounded-md bg-gray-100"
                      onChange={handleInputChange}
                    >
                      <option hidden value="">
                        Services
                      </option>
                      <option value="Business Planning">
                        Business Planning
                      </option>
                      <option value="IT">IT</option>
                      <option value="Legal Project Management">
                        Legal Project Management
                      </option>
                      <option value="Branding and Design">
                        Branding and Design
                      </option>
                      <option value="Auto">Auto</option>
                      <option value="Finance, Accounting & Tax Marketing">
                        Finance, Accounting & Tax Marketing
                      </option>
                      <option value="Tax Marketing">Tax Marketing</option>
                      <option value="Public Relations">Public Relations</option>
                      <option value="Other">Other</option>
                    </select>
                    <div className="absolute inset-y-0 right-0 flex items-center pr-3">
                      <i className="fa fa-chevron-down text-gray-400"></i>
                    </div>
                  </div>
                </div>
                <Link to="/serviceresults">
                <button onClick = {Search}
                  className="bg-[#198754] rounded-[14px] text-white py-2 px-4 mt-4 mb-4 w-full sm:w-[125px]"
                  type="submit"
                >
                  Search
                </button>
                </Link>
              </div>
            </form>
          </div>
        </section>
      </div>
      <Localservicesection/>
      <h1 className="text-black text-center text-md font-bold mt-[100px]">Featured Listings</h1>
      <Servicecards/>
    </div>
  );
};

export default Servicepage;
