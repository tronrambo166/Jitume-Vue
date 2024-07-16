<template>
    <div class="container bg-white" id="">


        <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/4.7.0/css/font-awesome.min.css">

        <h3 class="text-center font-weight-bold"><b class="h5 text-success"> </b> </h3>


        <div class="clear"></div>




        <div class="clear"></div>






        <!-- <div class="content_bottom">
            <div class="heading">
                <h3 class="my-5 text-center secondary_heading">Services</h3>
            </div>
            <div class="clear"></div>
        </div> -->

<form id="form" @submit.prevent="search();" method="post">

      <!-- Search Options and Button Section -->
<div class="flex flex-col sm:flex-row lg:flex-row lg:justify-center sm:justify-start items-center gap-4 sm:gap-16 px-2">
    <div class="my-2">
        <div class="flex items-center">
        <input class="py-2 px-4 rounded-full border border-black w-[250px] focus:outline-none focus:ring-0 focus:border-transparent" type="text" name="listing_name" placeholder="What are you looking for?">
    </div>
    </div>

    <div class="my-2">
      <div class="relative">
    <input id="searchbox" onkeyup="suggest(this.value);" class="py-2 px-4 w-[250px] border border-gray-300 rounded-full focus:outline-none focus:ring-0 focus:border-transparent" type="text" name="search" value="" placeholder="Location">
    <div class="absolute inset-y-0 right-0 flex items-center pr-2 pointer-events-none">
        <svg class="h-4 w-4 fill-current text-gray-500" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
            <path d="M10 2a7 7 0 0 1 7 7c0 4.472-7 11-7 11S3 13.472 3 9a7 7 0 0 1 7-7zm0 2a5 5 0 0 0-5 5c0 2.142 3.094 6.333 5 8 1.906-1.667 5-5.858 5-8a5 5 0 0 0-5-5z"/>
        </svg>
    </div>
    <ul id="suggestion-list" class="absolute w-[250px] bg-white  border-t-0 rounded-b-md shadow-lg z-10 top-full">
        <!-- Suggestions will be dynamically added here -->
    </ul>
    <!-- Search Results Section -->
    <div id="result_list" class="absolute w-[250px] bg-white  border-gray-300 border-t-0 rounded-b-md shadow-lg z-10 top-full">
        <!-- Search results will be dynamically added here -->
    </div>
    <!-- End of Search Results Section -->
</div>




    </div>



<div class="w-[162px] my-2">
  <div class="relative">
    <select id="category" name="category"
      class="py-2 px-4 w-full border border-gray-300 rounded-full appearance-none">
      <option value="">Category</option>
<option value="Agriculture">Agriculture</option>
<option value="Arts/Culture">Arts/Culture</option>
<option value="Auto">Auto</option>
<option value="Domestic (Home Help etc)">Domestic (Home Help etc)</option>
<option value="Fashion">Fashion</option>
<option value="Finance/Accounting">Finance/Accounting</option>
<option value="Food">Food</option>
<option value="Legal">Legal</option>
<option value="Media/Internet">Media/Internet</option>
<option value="Other">Other</option>
<option value="Pets">Pets</option>
<option value="Real State">Real State</option>
<option value="Retail">Retail</option>
<option value="Security">Security</option>
<option value="Sports/Gaming">Sports/Gaming</option>
<option value="Technology/Communications">Technology/Communications</option>

    </select>
    <div class="absolute inset-y-0 right-0 flex items-center px-2 pointer-events-none">
      <svg class="h-4 w-4 fill-current text-gray-500" xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 20 20">
        <path
          d="M10 12a1 1 0 0 1-.7-.29l-4-4a1 1 0 1 1 1.4-1.42L10 9.58l3.3-3.3a1 1 0 1 1 1.4 1.42l-4 4a1 1 0 0 1-.7.3z" />
      </svg>
    </div>
  </div>
</div>


        <div class="w-12 h-12 my-2 bg-green-700 rounded-[50%] flex items-center justify-center">
          <button type="submit" class="py-2 px-6  text-white rounded-full"><i class="fa fa-search"></i></button>
        </div>
      </div>
      <!-- End of Search Options and Button Section -->


    <input type="text" name="lat" id="lat" hidden value="">
    <input type="text" name="lng" id="lng" hidden value="">    
    </form>



<div class="flex  gap-1 ">
                    <div class=""><span style="" class=" text-black px-2 py-1 rounded">Filter by
                            Price:</span></div>
                    <div id="" class="col-sm-5  mt-1">
                        <div id="slider" class=""> </div>
                        <div class="row mt-3">
                            <div class="col-6  mt-1">
                                <span id="price_low" class="py-0 btn btn-light" name="min"> </span>
                            </div>
                            <div class="col-6 mt-1 pr-0">
                                <span id="price_high" class="float-right py-0 btn btn-light" name="min"> </span>
                            </div>
                        </div>
                    </div>

                    <div class="col-sm-4">
                        <!-- <a class="py-0 float-right border border-dark rounded" style="width:70px; height:40px;">
                            <div class="row">
                                <div class="col-6 pr-0">
                                    <p style="font-size:12px;" class="text-dark">More Filters</p>
                                </div>
                                <div class="col-6 px-1"> <img src="images/randomIcons/filter.jpg" width="20px;"
                                        style="margin-left:5px;">
                                </div>
                            </div>
                        </a>
 -->
                    </div>

                </div>

        <div class="row mt-4 row flex-column-reverse flex-md-row">

            <div class="col-md-6 " style="height: 100vh; overflow-y: scroll;  overflow-anchor: auto;">
                <!-- Price Filter -->
                <div class="row hidden">
                    <div class="col-sm-3"><span style="background:black;" class="btn text-light px-2 py-1 rounded">Filter by
                            Price:</span></div>
                    <div id="" class="col-sm-5  mt-1">
                        <div id="slider" class=""> </div>
                        <div class="row mt-3">
                            <div class="col-6  mt-1">
                                <span id="price_low" class="py-0 btn btn-light" name="min"> </span>
                            </div>
                            <div class="col-6 mt-1 pr-0">
                                <span id="price_high" class="float-right py-0 btn btn-light" name="min"> </span>
                            </div>
                        </div>
                    </div>

                    <div class="col-sm-4">
                        <!-- <a class="py-0 float-right border border-dark rounded" style="width:70px; height:40px;">
                            <div class="row">
                                <div class="col-6 pr-0">
                                    <p style="font-size:12px;" class="text-dark">More Filters</p>
                                </div>
                                <div class="col-6 px-1"> <img src="images/randomIcons/filter.jpg" width="20px;"
                                        style="margin-left:5px;">
                                </div>
                            </div>
                        </a>
 -->
                    </div>

                </div>
                <div class="row">
                    <p class="ml-1 my-0 text-secondary small">{{ count }} Services in found<!-- your location --></p>
                </div>
                <!-- Price Filter -->

                <div class="row" v-if="count != 0">
                    <div v-for="( result, index ) in results" class="listing row  my-3">
                       <router-link :to="`/listingDetails/${result.id}`" @click="openInNewTab('/listingDetails/' + result.id)" class="flex px-4">
                            <div class="flex items-center gap-[30px] mb-5 w-full rounded-[30px] h-[200px]" style="box-shadow: rgba(0, 0, 0, 0.05) 0px 6px 24px 0px, rgba(0, 0, 0, 0.08) 0px 0px 0px 1px;">
                            <!-- image or video -->


                      <div class="rounded-l-lg">
    <video v-if="result.file" controls style="width: 200px !important; height: 200px !important; border-left: 2px solid white; border-radius: 30px; object-fit: cover !important;" alt="">
        <source :src="result.file" type="video/mp4">
    </video>
    <img class="rounded-l-lg" v-else :src="result.image" style="width: 200px !important; height: 200px !important; border-left: 2px solid white; border-radius: 30px; object-fit: cover !important;" alt="" />
</div>

<div class="pt-2 pb-2">
    <h5 class="card_heading mb-0 py-2">{{ result.name }}</h5>
    <div class="rounded-full">
    <p class="my-1 text-center bg-black text-white rounded-full inline-block py-1 px-2">
        <b>{{ result.category }}</b>
    </p>
</div>

    <div class="pt-1">
        <div class="flex justify-between gap-[50px]">
            <div class="flex justify-between items-center gap-[40px]">
                <div class="flex flex-col gap-2">
                    <p class="text-gray-900 pt-1 text-left ">
                        <i class="mr-2 text-black fa fa-map-marker"></i>{{ result.location }}
                    </p>
                    <div class="flex flex-col  gap-1">
   <!--  <div class="flex items-center gap-2">
        <i class="fa fa-phone"></i>
        <p class="card_text">
            <span class="rounded">{{ result.contact }}</span>
        </p>
    </div> -->

    <div class="whitespace-nowrap  mb-2">
        <p class="mt-2 font-bold text-black">Yearly Turnover: <span class="font-normal">${{ result.y_turnover }}</span></p>
        <p class="mt-1 font-bold text-black">Amount Requested: <span class="font-normal">${{ result.price }}</span></p>
    </div>
</div>

                </div>
               
            </div>
        </div>
    </div>
</div>


                            </div>
                        </a>
                    </div>
                    <div v-for="( result, index ) in results" class="listing col-md-6 my-3 hidden">
                        <router-link :to="`/serviceDetails/${result.id}`" class="shadow card border px-4">

                            <video v-if="result.file" controls style="width:100%; height:230px" alt="">
                                <source :src="result.file" type="video/mp4">
                            </video>

                            <img class="pt-2" v-else :src="result.image" style="width:100%; height:200px" alt="" />

                            <div class="p-1 pb-2">
                                <h5 class="card_heading mb-0 py-2">{{ result.name }} </h5>
                                <p class="my-1 text_color_p font-weight-bold"><i class="mr-2 fa fa-dollar"></i>{{
                                    result.price }}</p>

                                <p class="loc_p card_text pt-1 text-left"><i class="mr-2 fa fa-map-marker"></i>{{ result.location
                                }}</p>

                                <p><span class="mt-1 rounded small"><i class="mr-2 fa fa-category"></i>Category:
                                        {{ result.category }}</span></p>
                            </div>

                        </router-link>
                    </div>
                </div>
            </div>

            <div class="col-md-6">
                <div class="map_style m-auto">
                    <div id="map" style="height: 95%;"></div> 
                </div>
            </div>

        </div>


        <div class="row mt-4" v-if="this.ids == '0'">
            <h3 class="text-center font-weight-bold btn-light btn py-3 d-block">No Results Found! </h3>
        </div>


    </div>
</div></div></template>

<script>

export default {
    props: ['auth_user'],
    data: () => ({
        results: [],
        ids: '',
        empty: false,
        count: 0,
         loc:'',
        queryLat:'',
        queryLng:''
    }),
    methods: {
        setRes: function () {
            let t = this;
            this.ids = atob(this.$route.params.results);
            //this.results = this.ids.split(",");
            axios.get('ServiceResults/' + t.ids).then((data) => {            
                if(data.data.count != 0){
                t.count = data.data.count;
                t.results = data.data.data;

                 for (const [key, value] of Object.entries(t.results)) {  
                    value.id = btoa(value.id);
                    value.id = btoa(value.id);
                    //console.log(value.id);
                }
                //console.log(data);
                //Setting Curr LatLng
                t.queryLat = data.data.data[0].lat;
                t.queryLng = data.data.data[0].lng;
            }
            }).catch((error) => { console.log(error); })
        },


        range() {
            this.ids = atob(this.$route.params.results);
            let t = this;

            if(t.ids != 'no-results')
            {
            var slider = document.getElementById('slider');
            noUiSlider.create(slider, {
                start: [0, 500000],
                connect: true,
                range: {
                    'min': 0,
                    'max': 500000
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

                axios.get('priceFilterS/' + values[0] + '/' + values[1] + '/' + t.ids).then((data) => {
                    t.results = '';
                    t.results = data.data.data;

                    for (const [key, value] of Object.entries(t.results)) {  
                    value.id = btoa(value.id);
                    value.id = btoa(value.id);
                    //console.log(value.id);
                }

                    //Setting Curr LatLng
                    t.queryLat = data.data.data[0].lat;
                    t.queryLng = data.data.data[0].lng;

                    //console.log(data);
                }).catch((error) => { })

            });
        }

        },

        getPhoto() {

            return '../';

        },
        cart() {
            //axios.get('cart').then((data) => {
               // document.getElementById('cart').innerHTML = data.data.cart;});
        },

        replaceText() {
            $('#call_to').html('');
            $('#call_to').html('<a onclick="c_to_actionS();" data-target="#loginModal" data-toggle="modal" class="header_buttons px-sm-3 my-1 px-1 py-1 mx-1 d-inline-block small text-center" ><span style="color:black;" id="c_to_ac">Add Your Service</span></a> ');
        },

        //MAP -- MAP

        success(position){
        var loc = this.loc;
        if((loc == true || loc == "true") && this.count !=0){
            var myLat = sessionStorage.getItem('SqueryLat');// this.queryLat;
            var myLong = sessionStorage.getItem('SqueryLng');// this.queryLng;
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
 
        //console.log(this.results);
        for (const [key, value] of Object.entries(this.results)) {
            //INFO

                const contentString = '<a class="info_map py-0 font-weight-bold  text-center" target="_blank" href="https://test.jitume.com/#/serviceDetails/'+value.id+'">'
                +value.name+'</a>';

            //INFO
              const investment_needed = (value.investment_needed/1000)+"K";
              //this.addMarker({lat:value.lat, lng:value.lng},map,value.name,investment_needed,infowindow);
              var coord = ([value.lat,value.lng]);
              this.addMarker(coord,map,contentString);
            }
        

            this.addMarkerHome(coords,map);
        },

        addMarker(coords,map,contentString){
        let customIcon = {
         iconUrl:'images/map/other_business.png',
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
        },

        addMarkerHome(coords,map){
        let customIcon = {
         iconUrl:'images/map/myloc.png',
         iconSize:[32,32]
        }; let myIcon = L.icon(customIcon);

        let iconOptions = {
         title:'Spurs',
         draggable:true,
         icon:myIcon
        }

        var marker = new L.Marker(coords, iconOptions);
        marker.addTo(map);

        },
         failure(){},
        //MAP -- MAP

    },

    mounted() {
        this.loc = this.$route.params.loc;
        this.replaceText();
        this.setRes()
        this.range()
        //this.cart()

        //MAP -- MAP
        var x = navigator.geolocation;
        setTimeout(() => x.getCurrentPosition(this.success, this.failure), 1000);
        //MAP -- MAP

        //return this.$store.dispatch("fetchpro")
    }

}
</script>