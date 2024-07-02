<template>
    <div class="container fixed bg-white pb-2"  id="">
<div style="overflow-y: scroll;"s>

        <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/4.7.0/css/font-awesome.min.css">

        <h3 class="text-center font-weight-bold"><b class="h5 text-success"> </b> </h3>


        <div class="clear"></div>




        <div class="clear"></div>





  





        <div class="mt-4 row flex-column-reverse flex-md-row">

            <div class="col-md-8 pr-4 element-class" style="height: 100vh; overflow-y: scroll;  overflow-anchor: auto;">
                <!-- Price Filter -->
                <div class="row">

                    <div class="content_bottom">
            <div class="heading">
                <h3 class="my-5 text-2xl font-bold   " style="color:#198754;">Listings</h3>
            </div>
            <div class="clear"></div>
        </div> 

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
                    <p class="ml-1 my-0 text-gray-600 small">{{ count }} businesses found<!-- in your location --></p>
                </div>
                <!-- Price Filter -->

                <div class="">
                    <div v-for="( result, index ) in results" class="listing row  my-3">
                        <router-link :to="`/listingDetails/${result.id}`" class=" flex  px-4">

                            <div class="flex items-center gap-4 mb-5  shadow-sm rounded-[30px] h-[200px]" style="box-shadow: rgba(0, 0, 0, 0.16) 0px 1px 4px;">
                            <!-- image or video -->


                            <div class="rounded-l-lg">
                                
                                 <video v-if="result.file" controls style="width:100%; height:200px" alt="">
                                <source :src="result.file" type="video/mp4">
                            </video>

                            <img class="pt-2  rounded-l-lg" v-else :src="result.image" style="width:500px; border-left: 2px solid white; border-top-left-radius: 30px; border-bottom-left-radius: 30px; object-fit: cover !important; height:200px;" alt="" />

                            </div>

                           

                            <div class="p-1 pb-2">
                                <h5 class="card_heading mb-0 py-2">{{ result.name }} </h5>

                                <p class="card_text pt-0 text-left"><b>Category:</b> {{ result.category
                                }}</p>

                                <p class="loc_p card_text pt-1 text-left"><i class="mr-2 fa fa-map-marker"></i>{{ result.location
                                }}</p>

                                <p class="card_text"><span class="rounded"><i class="mr-2 fa fa-phone"></i>{{ result.contact
                                }}</span></p>
                            </div>

                            <div class="amount float-right text-right w-100 py-0 my-0 pr-2">
                                <h6 class="amount font-weight-bold text_color_p">Amount: <span
                                        class="font-weight-normal">${{
                                            result.investment_needed }}</span></h6>
                            </div>

                            </div>
                        </router-link>
                    </div>
                </div>
            </div>

            <div class="col-md-4 ">
                <div class="m-auto map_style" style=" position: fixed;" >
                     <div id="map" style="height: 100%; border: 30px; position: fixed;"></div> 
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