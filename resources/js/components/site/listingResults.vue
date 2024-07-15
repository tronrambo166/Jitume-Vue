<template>
    <div class="container  bg-white pb-2"  id="">
<div>

        <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/4.7.0/css/font-awesome.min.css">

        <h3 class="text-center font-weight-bold"><b class="h5 text-success"> </b> </h3>


        <div class="clear"></div>




        <div class="clear"></div>



<!-- top -->


<div class="pb-6 pt-0">
    
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


  
<!-- <div class="flex py-4  gap-4"> -->

                  <!--   <div class="col-sm-3"><span style="background:black;font-size: 11px;" class="btn text-light px-2 py-1 small rounded">Filter by
                            Turnover Range:</span>
                    </div>   -->


 

                <!-- </div> -->

</div>

<div class="row flex items-center">
  <div class="flex items-center col-sm-6">
                    <div class=""><span style="color:black;font-size: 11px;" class=" text-black  py-1 small rounded whitespace-nowrap font-bold">Filter by Turnover Range:</span>
                        <button @click="collapse2" id="colBut4" class="mr-4 my-2 py-0 border float-right collapse" name="min">Set range </button>
                         <button @click="collapse2" id="colBut3" class="mr-4 my-2 py-0 border float-right" name="min">Set range </button>
                    </div>  

                    <div id="" class="col-sm-9 "> 
                        <div id="slider" class=""> </div>
                        <div class="row mt-3">
                            <div class="col-6  mt-1">
                                <span id="price_low" class="py-0 btn btn-light" name="min"> </span>
                            </div>
                            <div class="col-6 mt-1 pr-0">
                                <span id="price_high" class="float-right py-0 btn btn-light" name="min"> </span>
                            </div>
                        </div>

                        <!-- COLLAPSE RANGE 2-->
                        <div class="row mt-3 collapse" id="collapseExample2">
                            <div class="col-6  mt-1">
                                <span class="d-inline">Min:</span><input  type="number"  v-model="min2" id="price_low4" class="d-inline w-75 py-0 border" name="min" value="" />
                            </div>
                            <div class="col-6 mt-1 pr-0">
                                <span class="d-inline">Max:</span><input type="number" v-model="max2" id="price_high4" class="d-inline w-75 float-right py-0 border" name="min" value="" />
                            </div>

                            <button class="border w-25 mt-3 mx-auto" @click="range();hide2();" >Set</button>
                        </div>
                        <!-- COLLAPSE RANGE -->
                        
                    </div>
                    </div>



                        <div class="flex items-center col-sm-6">
                    <div class=""><span style="color:black;font-size: 11px;" class=" text-black  font-bold my-3 small rounded">Filter by Amount :</span>
                         <button @click="collapse" id="colBut2" class="mr-4 my-2 mx-auto py-0 border float-right collapse" name="min">Set range </button>
                         <button @click="collapse" id="colBut" class=" my-2 py-0 border border ml-4" name="min">Set range </button>
                    </div>  
                    <div id="" class="col-sm-9 mt-1"> 
                        <div id="slider2" class=""> </div>
                        <div class="row mt-3">
                              
                            <div class="col-6  ">
                                <span id="price_low2" class="py-0 btn btn-light" name="min"> </span>
                            </div>
                            <div class="col-6 mt-1 pr-0">
                                <span id="price_high2" class="float-right py-0 btn btn-light" name="min"> </span>
                            </div>

                           
                            
                        </div>

                        <!-- COLLAPSE RANGE -->
                        <div class="row mt-3 collapse" id="collapseExample">
                            <div class="col-6  mt-1">
                                <span class="d-inline">Min:</span><input  type="number"  v-model="min" id="price_low3" class="d-inline w-75 py-0 border" name="min" value="" />
                            </div>
                            <div class="col-6 mt-1 pr-0">
                                <span class="d-inline">Max:</span><input type="number" v-model="max" id="price_high3" class="d-inline w-75 float-right py-0 border" name="min" value="" />
                            </div>

                            <button class="border w-25 mt-3 mx-auto" @click="range_amount();hide();" >Set</button>
                        </div>
                        <!-- COLLAPSE RANGE -->

                        


                    </div>
                    </div>

</div>

        <div class="mt-4 row flex-column-reverse flex-md-row">



            <div class="col-md-6 pr-4 element-class" style="height: 100vh; overflow-y: scroll;  overflow-anchor: auto;">
                <!-- Price Filter -->
                <div class="row">
                    <div class="content_bottom">

                  

                

            <div class="heading">
                <h3 class="my-5 text-2xl font-bold   " style="color:#198754;">Businesses</h3>
            </div>
            <div class="clear"></div>
        </div> 


                   

                    <div class="col-sm-4">
                        <!-- <a class="py-0 float-right border border-dark rounded pointer" style="width:70px; height:40px;">
                            <div class="row">
                                <div class="col-6 pr-0">
                                    <p style="font-size:12px;" class="text-dark">More Filters</p>
                                </div>
                                <div class="col-6 px-1"> <img src="images/randomIcons/filter.jpg" width="20px;"
                                        style="margin-left:5px;">
                                </div>
                            </div>
                        </a> -->

                    </div>

                </div>
                <div class="row">
                    <p class="ml-1 my-0 text-gray-600 small">{{ count }} businesses found<!-- in your location --></p>
                </div>
                <!-- Price Filter -->




                <div class="">
                    <div v-for="( result, index ) in results" class="listing row  my-3">
                <a :href="'./#/listingDetails/'+result.id" @click="openInNewTab('/listingDetails/' + result.id)" class="flex px-4">
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
    <div class="flex items-center gap-2">
        <i class="fa fa-phone"></i>
        <p class="card_text">
            <span class="rounded">{{ result.contact }}</span>
        </p>
    </div>

    <div class="whitespace-nowrap  mb-2">
        <p class="mt-2 font-bold text-black">Yearly Turnover: <span class="font-normal">${{ result.y_turnover }}</span></p>
        <p class="mt-1 font-bold text-black">Amount Requested: <span class="font-normal">${{ result.investment_needed }}</span></p>
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
                </div>
            </div>

           <!--  <div class="col-md-4">
                <div class="m-auto map_style" >
                     <div id="map" style="height: 100%; border: 30px;"></div> 
                </div>
            </div> -->

             <div class="col-md-6">
                <div class="m-auto map_style">
                     <div id="map" style="height: 95%;"></div> 
                </div>
            </div>

        </div>


        <div class="row mt-4" v-if="this.ids == '0'">
            <h3 class="text-center font-weight-bold btn-light btn py-3 d-block">No Results Found! </h3>
        </div>

</div>
    </div>
</div>

</div>

</template>



<script>

//import {myMap,success,failure,addMarker,addMarkerHome} from '../../../../public/js/map'

export default {
    props: ['auth_user', 'app_url'],
    data: () => ({
        results: [],
        results2: [],
        ids: '',
        empty: false,
        count: 0,
        loc:'',
        queryLat:'',
        queryLng:'',
        max:1000000,
        min:0,
        max2:1000000,
        min2:0
    }),

    
    methods: {

        //Range Func.
        collapse: function() {
            var slider = document.getElementById('slider2');

            if(slider && slider.noUiSlider){
            slider.noUiSlider.destroy();
            }
            $('#collapseExample').removeClass('collapse');
            $('#colBut').addClass('collapse');
            $('#colBut2').removeClass('collapse');
        },
        hide: function() {
            $('#collapseExample2').addClass('collapse');

        },
        collapse2: function() {
            var slider = document.getElementById('slider');

            if(slider && slider.noUiSlider){
            slider.noUiSlider.destroy();
            }
            $('#collapseExample2').removeClass('collapse');
            $('#colBut3').addClass('collapse');
            $('#colBut4').removeClass('collapse');
        },
        hide2: function() {
            $('#collapseExample2').addClass('collapse');

        },
        //Range Func.

        setRes: function () {
            let t = this;
            this.ids = atob(this.$route.params.results);
            //this.results = this.ids.split(",");
            if(t.ids != 0) {
            axios.get('searchResults/' + t.ids).then((data) => {
                //t.results2 = data.data.data;
                t.results = data.data.data;

                for (const [key, value] of Object.entries(t.results)) {
                    
                    value.id = btoa(value.id);
                    value.id = btoa(value.id);
                    //console.log(value.id);
                }

                t.count = data.data.count;
                
                //Setting Curr LatLng
                t.queryLat = data.data.data[0].lat;
                t.queryLng = data.data.data[0].lng;
                //console.log(t.results);
            }).catch((error) => { })
        }
        },

        getPhoto() {

            return '../';

        },

        range() {
            this.ids = atob(this.$route.params.results);
            let t = this;

            if(t.ids != 0) {
            var slider = document.getElementById('slider');
            noUiSlider.create(slider, {
                start: [0, 1000000],
                connect: true,
                range: {
                    'min': parseFloat(t.min2),
                    'max': parseFloat(t.max2),
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

                axios.get('priceFilter/' + values[0] + '/' + values[1] + '/' + t.ids).then((data) => {

                    // if(values[0]==0.00 && values[1]==500000.00){}
                    //else{ 

                    t.count = data.data.data.length;
                    t.results = '';
                    t.results = data.data.data;

                    for (const [key, value] of Object.entries(t.results)) {
                    
                    value.id = btoa(value.id);
                    value.id = btoa(value.id);
                }

                    t.queryLat = data.data.data[0].lat;
                    t.queryLng = data.data.data[0].lng;
                        

                    //}
                    //console.log(t.results);
                }).catch((error) => { })

            });
        }

        },

       range_amount() {
            this.ids = atob(this.$route.params.results);
            let t = this;
            if(t.ids != 0) {
            var slider = document.getElementById('slider2');
            noUiSlider.create(slider, {
                start: [0, 15000000],
                connect: true,
                range: {
                    'min': parseFloat(t.min),
                    'max': parseFloat(t.max)
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
            slider.noUiSlider.on('update', function (values, handle) {
                skipValues[handle].innerHTML = values[handle];
                //console.log(values[1] - values[0]);

                axios.get('priceFilter_amount/' + values[0] + '/' + values[1] + '/' + t.ids).then((data) => {

                    // if(values[0]==0.00 && values[1]==500000.00){}
                    //else{ 

                    t.count = data.data.data.length;
                    t.results = '';
                    t.results = data.data.data;

                    for (const [key, value] of Object.entries(t.results)) {
                    
                    value.id = btoa(value.id);
                    value.id = btoa(value.id);
                }

                    t.queryLat = data.data.data[0].lat;
                    t.queryLng = data.data.data[0].lng;
                        

                    //}
                    //console.log(t.results);
                }).catch((error) => { })

            });
        }

        },

        //MAP -- MAP

        success(position){
        var loc = this.loc;
        if((loc == true || loc == "true") && this.count !=0){
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
 
        //console.log(this.results);
        for (const [key, value] of Object.entries(this.results)) {
            //INFO

                const contentString = '<a class="info_map py-0 font-weight-bold  text-center" target="_blank" href="https://test.jitume.com/#/listingDetails/'+value.id+'">'
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

            search() {
      const form = $('#form');
      var thiss = this;
      var ids = '';
      var lat = $('#lat').val();
      var lng = $('#lng').val();

      $.ajax({
        url: 'search',
        method: 'POST',
        headers: { 'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content') },
        dataType: 'json',
        data: form.serialize(),
        success: function (response) {
          //console.log(response);

          Object.entries(response.results).forEach(entry => {
            const [index, row] = entry;
            ids = ids + row.id + ',';
          }); //console.log(ids);

          if (!ids) ids = 0;

          //thiss.$router.push({ path: '/listingResults', query: { result: response } })

          sessionStorage.setItem('queryLat', lat);
          sessionStorage.setItem('queryLng', lng);
          thiss.$router.push({ name: 'listingResults', params: { results: btoa(ids), loc: response.loc } })
        },
        error: function (response) {
          //console.log(response);
        }
      });

      setTimeout(() => window.location.reload(), 500);
    }

    },

    mounted() {
        this.loc = this.$route.params.loc;
        this.setRes()
        this.range()
        this.range_amount()

        var x = navigator.geolocation;
        setTimeout(() => x.getCurrentPosition(this.success, this.failure), 1000);

        //return this.$store.dispatch("fetchpro")
    }

}
</script>

