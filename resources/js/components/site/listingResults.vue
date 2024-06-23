<template>
    <div class="container bg-white pb-2" id="">


        <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/4.7.0/css/font-awesome.min.css">

        <h3 class="text-center font-weight-bold"><b class="h5 text-success"> </b> </h3>


        <div class="clear"></div>




        <div class="clear"></div>






        





        <div class="mt-4 row flex-column-reverse flex-md-row">

    <div class="w-full">
                <div class="m-auto map_style">
                     <div id="map" style="height: 90%;"></div> 
                </div>
            </div>

            <div class="w-full pr-4">
                <!-- Price Filter -->
                <div class="row">

                    <div class="col-sm-3"><span style="background:black;font-size: 11px;" class="btn text-light px-2 py-1 small rounded">Filter by
                            Turnover Range:</span>
                    </div>

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
                    <p class="ml-1 my-0 text-secondary small">{{ count }} businesses found<!-- in your location --></p>
                </div>
                <!-- Price Filter -->


                <div class="content_bottom">
            <div class="heading">
                <h3 class="my-5 text-center secondary_heading">Featured-Listings</h3>
            </div>
            <div class="clear"></div>
        </div>

                <div class="row py-8">
     <div id="resource-slider" class="carousel w-full mx-auto">
  <div class="carousel-inner w-[70%] mx-auto">
    <!-- Loop through your results to generate carousel items -->
    <div v-for="(result, index) in Math.ceil(results.length / 3)" :key="index" :class="{ 'carousel-item': true, 'active': index === 0 }">
      <div class="flex justify-center items-center w-full">
        <!-- Loop through three cards for each carousel item -->
        <div v-for="offset in [0, 1, 2]" :key="index * 3 + offset" v-if="results[index * 3 + offset]" class="w-full md:w-[calc(100% / 3 - 2rem)] px-2">
          <router-link :to="`/listingDetails/${results[index * 3 + offset].id}`">
            <div class="bg-white mt-4 w-full h-[90%] rounded-xl shadow-md p-3 mb-4 flex flex-col justify-center relative loading">
              <div class="relative">
                <video v-if="results[index * 3 + offset].file" controls class="w-full h-[215px] object-cover rounded-lg mb-4">
                  <source :src="results[index * 3 + offset].file" type="video/mp4">
                </video>
                <img v-else :src="results[index * 3 + offset].image" alt="Image" class="w-full h-[215px] object-cover rounded-lg mb-4">
                <p class="absolute inset-t-4 mb-4 ml-2 font-bold px-2 rounded-xl bottom-4 bg-white text-black text-center py-1 text-xs">
                  <i class="fa fa-map-marker pr-2"></i>{{ results[index * 3 + offset].location }}
                </p>
              </div>
              <footer class="text-sm text-gray-600">{{ results[index * 3 + offset].category }}</footer>
              <div class="flex justify-between items-center">
                <div>
                  <header>
                    <h4 class="text-lg mt-2 hover:no-underline hover:text-green-800">{{ results[index * 3 + offset].name }}</h4>
                  </header>
                  <p class="text-sm text-gray-700">{{ results[index * 3 + offset].description }}</p>
                  <p class="text-sm text-gray-700">Contact: {{ results[index * 3 + offset].contact }}</p>
                </div>
                <div class="mt-auto flex justify-end">
                  <router-link :to="`/listingDetails/${results[index * 3 + offset].id}`" class="btn-learn-more inline-block bg-green-800 hover:bg-green-700 text-white py-1 px-2 md:px-3 lg:px-4 rounded text-xs md:text-sm lg:text-base lg:py-2 lg:px-3">Learn More</router-link>
                </div>
              </div>
              <div class="amount float-right text-right w-100 py-0 my-0">
                <h6 class="amount font-weight-bold text_color_p">Amount: <span class="font-weight-normal">${{ results[index * 3 + offset].investment_needed }}</span></h6>
              </div>
            </div>
          </router-link>
        </div>
      </div>
    </div>
  </div>

  <!-- Carousel controls for manual scrolling -->
  <a class="carousel-control-prev flex items-center justify-center" href="#resource-slider" role="button" data-slide="prev">
    <div class="bg-black rounded-full p-1 w-6 h-6 flex items-center justify-center">
      <span class="carousel-control-prev-icon text-white" aria-hidden="true"></span>
    </div>
    <span class="sr-only">Previous</span>
  </a>
  <a class="carousel-control-next flex items-center justify-center" href="#resource-slider" role="button" data-slide="next">
    <div class="bg-black rounded-full p-1 w-6 h-6 flex items-center justify-center">
      <span class="carousel-control-next-icon text-white" aria-hidden="true"></span>
    </div>
    <span class="sr-only">Next</span>
  </a>
</div>

                </div>
            </div>

            

        </div>


        <div class="row mt-4" v-if="this.ids == '0'">
            <h3 class="text-center font-weight-bold btn-light btn py-3 d-block">No Results Found! </h3>
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
        queryLng:''
    }),

    
    methods: {
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

    },

    mounted() {
        this.loc = this.$route.params.loc;
        this.setRes()
        this.range()

        var x = navigator.geolocation;
        setTimeout(() => x.getCurrentPosition(this.success, this.failure), 1000);

        //return this.$store.dispatch("fetchpro")
    }

}
</script>
