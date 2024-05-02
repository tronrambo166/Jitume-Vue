<template>
  <div class="container bg-white">

    <!-- PAGE CONTENT -->
    <div class="row mx-auto text-center">

      <div class="w-full  col-sm-12 text-center p-md-5" style="min-height: 600px;">

<section class="hero bg-gray-100 py-16 ">
    <div class="container mx-auto flex flex-col items-center justify-center text-center">
        <h2 class="text-4xl font-bold text-gray-800 mb-4">Find the Right Services for You</h2>
        <p class="text-lg text-gray-600 mb-8">Discover top-rated services in your area</p>
        <form id="form" @submit.prevent="search();" class="container mb-5 pb-5 d-flex justify-content-center my-6 align-items-center" method="post">
            <div class="w-full bg-white rounded text-center row justify-content-between mr-2 mr-sm-0">
                <div class="px-2 py-2 bg-white col-12 col-sm-4 d-flex align-items-center justify-content-center rounded-l-md">
                    <input class="bar bg-white form-control d-inline w-full sm:w-auto" type="text" name="listing_name" placeholder="What are you looking for?">
                </div>
                <div class="px-2 py-2 bg-white col-12 col-sm-4 d-flex align-items-center">
                    <i class="d-inline fa fa-map-marker mr-2"></i>
                    <input id="searchbox" onkeyup="suggest(this.value);" class="border-none bar bg-white form-control d-inline w-full sm:w-auto" type="text" name="search" value="" placeholder="Location">
                </div>
                <div class="px-2 py-2 bg-white col-12 col-sm-4 d-flex align-items-center rounded-r-md">
                    <div class="w-full row">
                        <div class="dropdown col-8">
                            <select id="category" name="category" class="py-2 form-control">
                                <option hidden value="">Services</option>
                                <option value="Business Planning">Business Planning</option>
                                <option value="IT">IT</option>
                                <option value="Legal Project Management">Legal Project Management</option>
                                <option value="Branding and Design">Branding and Design</option>
                                <option value="Auto">Auto</option>
                                <option value="Finance, Accounting & Tax Marketing">Finance, Accounting & Tax Marketing</option>
                                <option value="Tax Marketing">Tax Marketing</option>
                                <option value="Public Relations">Public Relations</option>
                                <option value="Other">Other</option>
                            </select>
                        </div>
                        <div class="bg-white px-1 px-md-2 col-4">
                            <button class="bg-black rounded-md text-slate-100 py-2 px-8 w-full sm:w-auto" type="submit">Search</button>
                        </div>
                    </div>
                </div>
            </div>
            <div class="row">
                <div id="result_list" class="text-left search_resultsS"></div>
            </div>
        </form>
        <p class="text-md text-green-900 mt-8">Choose Your Business</p>
        <p class="text-xl text-green-600 mb-8">Grow Your Business Together</p>
    </div>
</section>




        <div class="py-5"></div>
       

      </div>

      <br>

 <section class="py-16">
   <div class="container mx-auto flex flex-col lg:flex-row items-center justify-center">
    <div class="lg:w-1/2 lg:pr-12 mb-6 lg:mb-0">
        <img src="https://img.freepik.com/free-photo/person-with-adjustable-wrench_1048-1698.jpg?t=st=1714645387~exp=1714648987~hmac=59eae29dffaad37c23e681ed33fc0a8e99201646c09792c6b0f37d1d0c9d80b2&w=740" alt="Image" class="w-full h-auto object-cover rounded-lg">
    </div>
    <div class="lg:w-1/4">
        <h4 class="font-light text-3xl text-gray-800 mb-4">Discover Local Services</h4>
        <h4 class="text-gray-900 text-lg mb-4">Find the best local services in your area.</h4>
        <p class="text-gray-700 text-sm mb-8">
            Explore a variety of categories to suit your needs. Connect with businesses offering top-notch services.
            <br>
            Get quotes, compare options, and make informed decisions.
            <br>
            Experience seamless transactions and quality service.
        </p>
        <a href="#" class="bg-green-800 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded-full transition duration-300">Get Started</a>
    </div>
</div>

</section>








      <!-- Slider test -->
      <hr>
      <div class=" py-5">

        <h1 class="font-light text-gray-900 text-4xl">Featured Listings</h1>
        <div style="overflow:hidden;" class="my-4">
          <hooper :settings="hooperSettings" :itemsToShow="4" :centerMode="true" pagination="no">
            <slide class="listing text-center col-sm-4 px-3 " v-for="( result, index ) in results" :key="index"
              :index="index">
              <!-- Loop -->
             <div class="mx-auto mt-5 ">
  <router-link :to="`/serviceDetails/${result.id}`" class="rounded-lg overflow-hidden  h-full">

    <div class="relative py-8" style="height: 200px;">
      <video v-if="result.file" controls style="width:100%; height:100%;" alt="">
        <source :src="result.file" type="video/mp4">
      </video>

      <img v-else :src="result.image" style="width:100%; height:70%;" class="object-cover" alt="" />

      <div class="absolute top-0 left-0 p-2 bg-black text-white text-sm rounded-tr-md">
        Featured
      </div>

      <div class=" flex  flex-col items-center py-6 bg-slate-100/50" >
      <h5 class="text-md w-full font-bold mb-1">{{ result.name }}</h5>
      <p class="text-gray-600">{{ result.location }}</p>
    </div>
    </div>

    

  </router-link>
</div>



            </slide>

            <hooper-navigation slot="hooper-addons"></hooper-navigation>
          </hooper>

        </div>
      </div>
      <!-- Slider -->

    </div>

    <!-- PAGE CONTENT -->







   

  </div>
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
