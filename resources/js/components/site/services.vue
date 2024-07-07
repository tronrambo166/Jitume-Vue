<template>
  <div>


<section class="bg-cover bg-center flex items-center relative w-full" style="background-image: url('images/heroimg.png');">
  <div class="container my-8 md:mx-8 px-4 sm:px-6 lg:px-8 flex items-center relative">
    <form id="form" class="bg-white w-[517px] sm:w-[517px] h-[369px] p-6 rounded-[28px]  ml-[75px] relative z-10" @submit.prevent="search()" method="post">
      <h2 class="text-[32px] font-semibold mb-4">Find the <span class="text-[#198754]">right services</span>,<br>for you</h2>
      <div class="flex flex-col">
        <div class="mb-4">
          <label for="listing_name" class="sr-only">Listing Name:</label>
          <input id="listing_name" class="bar bg-gray-100 form-control w-full sm:w-[453px] px-4 py-2 rounded-md" type="text" name="listing_name" placeholder="What are you looking for?" onchange="handleInputChange(event)">
        </div>
        <div class="flex flex-col sm:flex-row sm:items-center sm:gap-[28px]">
          <div class="mb-4 relative">
            <label for="location" class="sr-only">Location:</label>

            <div class="relative">
    <input id="searchbox" onkeyup="suggest(this.value);" class="py-2 px-4 w-[220px] border border-gray-300 rounded-full focus:outline-none focus:ring-0 focus:border-transparent" type="text" name="search" value="" placeholder="Location">
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
          <div class="mb-4 relative">
            <label for="category" class="sr-only">Category:</label>
            <select id="category" name="category" class="py-2 form-control w-full sm:w-[212.5px] px-4 rounded-md bg-gray-100" onchange="handleInputChange(event)">
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
            <div class="absolute inset-y-0 right-0 flex items-center pr-3">
              <i class="fa fa-chevron-down text-gray-400"></i>
            </div>
          </div>
        </div>
        <button class="bg-[#198754] rounded-[14px] text-white rounded-md py-2 px-4 mt-4 mb-4 w-full sm:w-[125px] h-auto" type="submit">Search</button>
      </div>
    </form>
  </div>
</section>


<section class="flex justify-center py-8 gap-6 px-6  items-center w-[[832.55px]">
  <div>
    <div class="w-[300px] md:w-[430px] md:mr-4 ]">
    <h1 class="pb-2 text-[18px] md:text-[20px] text-gray-900">Discover local services</h1>
    <h3 class="py-2 text-[24px] md:text-[32px] font-bold">Find the best <span class="text-green-800">local service</span> <br> in your area</h3>
    <p class="text-black text-[13px] md:text-[20px]">Explore categories to suit your needs. Connect with businesses offering top-notch services.</p>
  <button data-target="#loginModal" data-toggle="modal" class="bg-green-800 text-white px-4 py-2 mt-4 md:px-6 md:py-3 rounded-[14px]">Get started</button>
  </div>
  </div>
  <div>
    <img src="images/sideframe.png" alt="Your Image">
  </div>
</section>











    <hr>
 

<div id="resource-slider" class="carousel w-full mx-auto">
  <div class="carousel-inner w-[70%] mx-auto">
    <!-- Loop through your results to generate carousel items -->
    <div v-for="(result, index) in Math.ceil(results.length / 3)" :key="index" :class="{ 'carousel-item': true, 'active': index === 0 }">
      <div class="flex justify-center items-center w-full">
        <!-- Loop through three cards for each carousel item -->
        <div v-for="offset in [0, 1, 2]" :key="index * 3 + offset" v-if="results[index * 3 + offset]" class="w-full md:w-[calc(100% / 3 - 2rem)] px-2">
          <router-link :to="`/serviceDetails/${results[index * 3 + offset].id}`">
            <div class="bg-white mt-4 w-[250px] h-[350px] rounded-xl shadow-md p-3 mb-4 flex flex-col justify-center relative loading">
              <div class="relative">
                <video v-if="results[index * 3 + offset].file" controls class="w-full h-[215px] object-cover rounded-lg mb-4">
                  <source :src="results[index * 3 + offset].file" type="video/mp4">
                </video>
                <img v-else :src="results[index * 3 + offset].image" alt="Image" class="w-full h-[215px] object-cover rounded-lg mb-4">
                <p class="absolute inset-t-4 mb-4 ml-2 font-bold px-2 rounded-xl bottom-4 bg-white text-black text-center py-1 text-xs">
                  <i class="fa fa-map-marker pr-2"></i>{{ results[index * 3 + offset].location }}
                </p>
              </div>
              <footer class="text-sm text-gray-600">{{ results[index * 3 + offset].type }}</footer>
              <div class="flex justify-between items-center">
                <div>
                  <header>
                    <h4 class="text-lg mt-2 hover:no-underline hover:text-green-800">{{ results[index * 3 + offset].name }}</h4>
                  </header>
                  <p class="text-sm text-gray-700">{{ results[index * 3 + offset].description }}</p>
                  <p class="text-sm text-gray-700">Name: {{ results[index * 3 + offset].name }}</p>
                  <p class="text-sm text-gray-700">Contact: {{ results[index * 3 + offset].contact }}</p>
                </div>
                <div class="mt-auto flex justify-end">
                  <router-link :to="`/serviceDetails/${results[index * 3 + offset].id}`" class="btn-learn-more inline-block bg-green-800 hover:bg-green-700 text-white py-1 px-2 md:px-3 lg:px-4 rounded text-xs md:text-sm lg:text-base lg:py-2 lg:px-3">Learn More</router-link>
                </div>
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
