<template>
    <!-- <div class="container" id=""> -->



 <!-- PAGE CONTENT -->
<div class="row mx-auto text-center " style="overflow:hidden;">

    <div class="container-xl service_img mx-auto col-sm-12 text-center p-md-5" style="min-height: 600px;">

        <div class="py-5"></div>
        <div class="mt-5 mb-5 pb-2 mx-auto text-center">
            <h2 style="font-size: 60px; font-weight: bold; font-style: normal; text-shadow: 3px 3px #2a2a2c;"
                class="text-light">
                Looking for...
            </h2>
        </div>

        <form id="form" @submit.prevent="search();"
            class="container w-100 mb-5 pb-5 d-flex justify-content-center align-items-center" method="post">

            <div
                class="w-100 text-center py-1 rounded text-center row justify-content-between bg-white mr-2 mr-sm-0">

                <div style="border-radius: 35px 0 0 35px;"
                    class="px-2 py-2 bg-white col-12 col-sm-4 d-flex align-items-center justify-content-center">
                    <input style="border: none;height: 42px;" class="bar bg-white form-control d-inline" type="text"
                        name="listing_name" placeholder="What are you looking for?">
                </div>

                <div class="px-2 py-2 bg-white col-12 col-sm-4 d-flex align-items-center">
                    <i style="width: 6%;" class="d-inline fa fa-map-marker"></i>
                    <input id="searchbox" onkeyup="suggest(this.value);"
                        style="width: 94%;border: none;height: 42px;" class="border-none bar bg-white form-control d-inline px-1"
                        type="text" name="search" value="" placeholder="Location">

            
            


                    <div class="px-2 py-2 bg-white col-12 col-sm-4 d-flex align-items-center">

                        <div class="w-100 row">

                            <div class="dropdown col-8 ">
                                <select id="category" name="category" class="py-2">
                                    <option hidden value="" class="form-control">Services</option>
                                    <option class="form-control" value="Business Planning">Business Planning</option>
                                    <option value="IT">IT</option>
                                    <option value="Legal Project Management">Legal Project Management</option>
                                    <option value="Branding and Design">Branding and Design </option>
                                    <option value="Auto">Auto</option>
                                    <option value="Finance, Accounting & Tax Marketing">Finance, Accounting &
                                        Tax Marketing</option>
                                    <option value="Tax Marketing">Tax Marketing</option>
                                    <option value="Public Relations">Public Relations</option>
                                    <option value="Other">Other</option>

                                </select>

                            </div>

                            <div class="bg-white px-1 px-md-2 col-4">
                                <button class=" searchListing py-1 w-100" type="submit">Search</button>
                            </div>

                        </div>

                    </div>



                </div>

                <div class="row" style="">
                    <div id="result_list" class="text-left search_resultsS"
                        style="">
                    </div>
                </div>


</div>
            </form>
        </div>

        <br>

        <!-- SLider test -->
        <hr>
        <div class="container-xl col-sm-12 text-center py-5">
            <div style="overflow:hidden;" class="row card-group px-3 w-75 mx-auto d-md-flex justify-content-center">
                <hooper :settings="hooperSettings" :itemsToShow="4" :centerMode="true" pagination="no">
                    <slide class="listing text-center col-sm-4 px-3" v-for="( result, index ) in results" :key="index"
                        :index="index">
                        <!-- Loop -->
                        <div class="mx-auto mt-5">
                            <router-link :to="`/serviceDetails/${result.id}`" class="shadow card border px-2 pt-3">

                                <video v-if="result.file" controls style="width:90%; height:114px;" alt="">
                                    <source :src="result.file" type="video/mp4">
                                </video>

                                <img v-else :src="result.image" style="width:90%; height:114px;" class="card-img-top mx-auto"
                                    alt="" />

                                <div class="px-3 py-2">

                                    <h5 class="card_heading text-left mb-0 py-2">{{ result.name }} </h5>

                                    <p class="loc_p card_text pt-1 text-left"><i class="mr-2 fa fa-map-marker"></i>{{
                                        result.location }}</p>

                                </div>



                            </router-link>
                        </div>
                        <!-- Loop -->

                    </slide>

                    <hooper-navigation slot="hooper-addons"></hooper-navigation>
                </hooper>

            </div>
        </div>
        <!--Slider-->

    </div>

    <!-- PAGE CONTENT -->



    <!-- </div> -->
</template>

<script>
import { Hooper, Slide, Navigation as HooperNavigation } from 'hooper';
import 'hooper/dist/hooper.css';

export default {
    components: {
        Hooper,
        Slide,
        HooperNavigation
    },

    props: ['auth_user'],
    data: () => ({
        //Hooper
        hooperSettings: {
            itemsToShow: 1,
            centerMode: false,
            breakpoints: {
                800: {
                    centerMode: false,
                    itemsToShow: 2
                },
                1000: {
                    itemsToShow: 4,
                    pagination: 'fraction'
                }
            }
        },
        //Hooper
        res: [],
        results: [],
        emptyCat: false
    }),

    created() {
        var button = $('#c_to_ac').length;
        //console.log(button);
        if(button != 0)
        document.getElementById('c_to_ac').innerHTML = 'Add Your Service';

        $('#call_to').html('');
        $('#call_to').html('<a style="color:black;" onclick="c_to_actionS();" data-target="#loginModal" data-toggle="modal" class="header_buttons px-sm-3 my-1 px-1 py-1 mx-1 d-inline-block small text-center" ><span  id="c_to_ac">Add Your Service</span></a> ');



    },
    methods: {

        search() {
            const form = $('#form');
            var thiss = this;
            var ids = '';
            var lat = $('#lat').val();
            var lng = $('#lng').val();

            $.ajax({
                url: 'searchService',
                method: 'POST',
                headers: { 'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content') },
                dataType: 'json',
                data: form.serialize(),
                success: function (response) {
                    console.log(response);

                    Object.entries(response.results).forEach(entry => {
                        const [index, row] = entry;
                        ids = ids + row.id + ',';
                    });//console.log(ids);

                    if (ids == '')
                        ids = 'no-results'
                    //thiss.$router.push({ path: '/listingResults', query: { result: response } })

                    sessionStorage.setItem('SqueryLat',lat);
                    sessionStorage.setItem('SqueryLng',lng);
                    thiss.$router.push({ name: 'serviceResults', params: { results: btoa(ids), loc:response.loc } })
                },
                error: function (response) {
                    console.log(response);
                }
            });
        },

        replaceText() {
            if (this.$router.currentRoute.path == '/services' ||
                this.$router.currentRoute.path == '/serviceResults') {
                $('#call_to').html('');
                $('#call_to').html('<a onclick="c_to_actionS();" data-target="#loginModal" data-toggle="modal" style="color:black;" class="header_buttons px-sm-3 my-1 px-1 py-1 mx-1 d-inline-block small text-center" ><span id="c_to_ac">Add Your Service</span></a> ');
            }
        },

        latBusiness: function () {
            let t = this;
            axios.get('latServices').then((data) => {
                t.results = data.data.data;

                for (const [key, value] of Object.entries(t.results)) {
                    
                    value.id = btoa(value.id);
                    value.id = btoa(value.id);
                    console.log(value.id);
                }
                //console.log(data);
            }).catch((error) => { })
        },

    },

    mounted() {
        //return this.$store.dispatch("fetchpro")
        this.replaceText();
        this.latBusiness();
    }

}
</script>
