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
            <input id="location" class="bar bg-gray-100 form-control w-full sm:w-[212.5px] px-4 py-2 rounded-md pl-10" type="text" name="location" placeholder="Location" onchange="handleInputChange(event)">
            <div class="absolute inset-y-0 right-0 flex items-center pr-3">
              <i class="fa fa-map-marker text-gray-400"></i>
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
    <button class="bg-green-800 text-white px-4 py-2 mt-4 md:px-6 md:py-3 rounded-[14px]">Get started</button>
  </div>
  </div>
  <div>
    <img src="images/sideframe.png" alt="Your Image">
  </div>
</section>











    <hr>
  <div class="py-5 h-full w-full">
    <h1 class="text-center text-gray-900 text-4xl">Featured Listings</h1>
    <div class="my-4 px-4 py-6 h-full">
        <div id="carouselExampleIndicators" class="carousel slide" data-bs-interval="false" data-bs-wrap="false">
            <ol class="carousel-indicators">
                <li data-bs-target="#carouselExampleIndicators" data-bs-slide-to="0" class="active"></li>
                <li data-bs-target="#carouselExampleIndicators" data-bs-slide-to="1"></li>
                <li data-bs-target="#carouselExampleIndicators" data-bs-slide-to="2"></li>
                <!-- Add more indicators as needed -->
            </ol>
            <div class="carousel-inner">
                <div class="carousel-item active">
                    <div class="flex justify-center lg:justify-center">
                        <div v-for="(result, index) in results.slice(0, 3)" :key="index" class="p-3">
                            <div class="bg-white h-[300px] w-[350px] rounded-xl shadow-lg mx-auto">
                                <router-link :to="`/serviceDetails/${result.id}`" class="rounded-lg overflow-hidden h-full flex flex-col">
                                    <div class="relative" style="height: 200px;">
                                        <video v-if="result.file" controls style="width:100%; height:100%;" alt="">
                                            <source :src="result.file" type="video/mp4">
                                        </video>
                                        <img v-else :src="result.image" class="object-cover w-full h-full rounded-t-xl" alt="" />
                                    </div>
                                    <div class="">
                                        <div>
                                            <h5 class="text-md text-success text-2xl mb-1 pt-4">{{ result.name }}</h5>
                                            <p class="text-black py-2">{{ result.location }}</p>
                                        </div>
                                    </div>
                                </router-link>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="carousel-item">
                    <div class="flex justify-center lg:justify-center">
                        <div v-for="(result, index) in results.slice(3, 6)" :key="index" class="p-3">
                            <div class="shadow-lg rounded-xl h-[300px] w-[350px] mx-auto">
                                <router-link :to="`/serviceDetails/${result.id}`" class="rounded-lg overflow-hidden h-full flex flex-col">
                                    <div class="relative" style="height: 200px;">
                                        <video v-if="result.file" controls style="width:100%; height:100%;" alt="">
                                            <source :src="result.file" type="video/mp4">
                                        </video>
                                        <img v-else :src="result.image" class="object-cover rounded-t-xl w-full h-full" alt="" />
                                    </div>
                                    <div class="">
                                        <div>
                                            <h5 class="text-md text-success text-2xl mb-1 pt-4">{{ result.name }}</h5>
                                            <p class="text-black py-2">{{ result.location }}</p>
                                        </div>
                                    </div>
                                </router-link>
                            </div>
                        </div>
                    </div>
                </div>
                <!-- Add more carousel items as needed -->
            </div>
            <button class="carousel-control-prev" type="button" data-bs-target="#carouselExampleIndicators" data-bs-slide="prev">
                <span class="carousel-control-prev-icon bg-black" aria-hidden="true"></span>
                <span class="visually-hidden">Previous</span>
            </button>
            <button class="carousel-control-next" type="button" data-bs-target="#carouselExampleIndicators" data-bs-slide="next">
                <span class="carousel-control-next-icon bg-black" aria-hidden="true"></span>
                <span class="visually-hidden">Next</span>
            </button>
        </div>
    </div>
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
