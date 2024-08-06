<template>
  <div class="container">


    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/4.7.0/css/font-awesome.min.css">


    <div class="heading row mx-auto my-3 pt-4">

      <div class="">

        <div class="row flex justify-center">

          <div class="col-md-4">


                 <div class="relative">
    <img style="width:100%; max-height: 400px;" class="shadow-sm rounded-[16px] " :src="form.image" alt="" />
    <div class="absolute bottom-0 left-0 w-full glass-bg rounded-b-[16px] text-white text-center py-2 ">
        <p class="text-center"><i class="mr-2 fa fa-map-marker"></i>{{ form.location }}</p>
    </div>
</div>

            <div class=" row mt-4">
              <div class="col-sm-6">
                <h5 class="text-left text-dark ">{{ form.name }}</h5>

                <p class="my-1 small">Amount${{ form.price }} </p>

                <div
      class="text-black flex gap-1 items-center font-bold"
    >
     <h2 class="whitespace-nowrap"> Amount Requested:</h2> <span class="font-semibold text-green-700">${{ form.price }}</span>
      <span class="text-xl"></span>
    </div>




                <div class="float-left flex" id="staticRating">

                </div> <br>

                <p class="text-dark d-block float-left text-[13px]" style="font-size:11px;">({{ form.rating_count }} reviews)</p>



              </div>



             <!--  <div class="col-sm-6 text-center">
                <p class="small text-left">{{ form.location }}</p>


              </div> -->

            </div>

           

     <div class="row rounded my-3 my-md-0 ">
            <div id="booked" v-if="!booked" class="p-2">
              <form @submit.prevent="serviceBook">

                <!-- <div class="d-flex p-2 justify-content-center justify-content-md-end">
                  <a class="w-50 my-3 btn header_buttons text-light float-right">Message</a>
                </div> -->

                <div class="flex flex-col gap-2  py-2 ">
                  <p class="d-inline  text-left text-gray-500 ">Desired start date: </p>
                  <span class="pl-0 d-inline  "><input required v-model="formBook.date" id="date" type="date" class="border border-gray-200 p-2" name="date"></span>
                </div>

                <div class=" ">
                  <div class="">
                    <p class="text-start text-black">Enter additional notes </p>
                    <textarea rows="10" cols="32" required v-model="formBook.note" name="note" class="rounded border border-slate-200 w-90 h-20"></textarea>
                  </div>

                   <div class="py-2">
                  <button v-if="auth_user"
                    class="mt-1 py-2 bg-green-800 w-50 rounded-lg text-light float-left">Book
                  </button>

                  <a v-else @click="make_session()" data-target="#loginModal" data-toggle="modal"
                    class="my-3 py-2 bg-green-800 w-50 rounded-lg text-light  float-left">Book</a>
                </div>

                </div>

                <input hidden type="number" name="service_id" v-model="formBook.service_id">

               


              </form>

            </div>

            <div id="booked" v-else class=" p-2">
              <p class="font-weight-bold text-center bg-light border border-dark py-3 text-dark"> You booked this service. </p>
            </div>

          </div>


          </div>

          <div class="col-md-4 col-lg-5 pt-8">


            <div class="Overview " id="Overview">
                <h2 class="text-black text-[15px] sm:text-[14px] md:text-[15px] lg:text-[16px] font-bold">More business information</h2>

                <p class="text-[14px] sm:text-[12px] md:text-[13px] py-6 lg:text-[14px]">
{{ form.details }} Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod
tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam,
quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo
consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse
cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non
proident, sunt in culpa qui officia deserunt mollit anim id est laborum. </p>

              <div class="cart text-center">
              <form class="text-center">
              <div class="row my-2">
              <div class="col-sm-12 ">
                <!-- <a class="btn border border-bottom-success">Overview</a> -->
                <!-- <a v-if="auth_user" data-toggle="modal" data-target="#reviewModal"
                  class="btn border border-gray-200 float-left">Add review</a>

                <a v-else @click="make_session();" data-target="#loginModal" data-toggle="modal"
                  class="btn border border-gray-200 float-left">Add review</a> -->

                
                <!-- <p> <span class="ml-2 font-weight-bold">Details:{{form.details}}</span></p> -->

              </div>
            </div>


                    <div class="flex items-center gap-2">

                  <a style="cursor:pointer;" v-if="auth_user" @click="service_milestones()"
                    class="border border-gray-200 w-50 mx-auto text-center convBtn rounded">Service Milestone
                    Breakdown</a>


                  <a style="cursor:pointer;" v-else @click="make_session()"
                    class="border border-gray-200 w-50 mx-auto text-center convBtn" data-target="#loginModal"
                    data-toggle="modal">Service Milestone Breakdown</a>

                    <!-- Message -->
                    <a style="cursor:pointer;color:#015601;" v-if="auth_user"
                    class="my-4 border border-gray-200 w-50 mx-auto text-center convBtn rounded" data-toggle="collapse" @click="contact">Contact Me</a>

                  <a style="cursor:pointer;color:#015601;" v-else @click="make_session()"
                    class="my-4 border border-gray-200 w-50 mx-auto text-center convBtn" data-target="#loginModal"
                    data-toggle="modal">Contact Me</a>

                  </div>


                     
                  <div class="collapse" id="collapseExample">
                    <div class="card card-body py-2 mx-auto" style="width: 90%;">
                      <div  class="p-0">
                        <form @submit.prevent="sendMessage" class="p-3">
                          <div class="d-flex p-2 justify-content-center">
                            <div class="">
                              <textarea placeholder="Enter message..." rows="2" cols="36" required v-model="formMsg.msg" name="msg" class="rounded"></textarea>
                            </div>

                          </div>

                          <input hidden type="number" name="service_id" v-model="formMsg.service_id">

                          <div class="p-0 d-flex justify-content-center">
                            <button v-if="auth_user"
                              class="my-3 py-1 primary_bg w-50 header_buttons text-light float-right">Send
                            </button>
                          </div>


                        </form>

            </div>
                    </div>
                  </div>
                    <!-- Message -->

                </form>
              </div>
              <!-- <p><span class="mt-1 rounded"><i class="mr-2 fa fa-category"></i>Category: {{form.category}}</span></p> -->
            </div>



          </div>

     

        </div>


        <!-- <div class="row my-5 card shadow p-3">
                <h3>Reviews</h3>
                <p class="text-secondary my-3">There are no reviews yet.</p>

                <button class="w-25 searchListing">Add Review</button>
            </div> -->

      </div>

      <div class="col-md-5">
        <!--  <div class="card bg-light w-75 mx-auto py-3">
             <h5 class="mx-4 text-secondary shadow border border-light py-2 d-block text-center">Seed investors spot open
                <i class="ml-1 fa fa-angle-up"></i></h5>
                <button class="buttonListing my-3">Login to book</button>
                <hr>

                <h5 class="border border-light py-2 d-block text-center">Commitment to invest fee <p class="d-inline text-success">2000</p>
                </h5>

                <div v-if="auth_user" class="eqp-invest">
                <router-link :to="`/invest_eqp/${form.listing_id}`" class="text-light buttonListing my-3">Invest with Equipment/Supplies</router-link>
                <router-link :to="`/donate_eqp/${form.listing_id}`" class="text-light buttonListing my-3">Donate with Equipment/Supplies</router-link>
                </div>

                <div v-else="auth_user" class="eqp-invest">
                <a @click="make_session(form.listing_id);" href="" data-target="#loginModal" data-toggle="modal" class="py-2 text-light buttonListing my-3">Invest with Equipment/Supplies</a>
                <a href="" data-target="#loginModal" data-toggle="modal" class="py-2 text-light buttonListing my-3">Donate with Equipment/Supplies</a>
                </div>

         </div> -->
      </div>

    </div>







    <!-- Review -->
    <div class="modal fade" id="reviewModal" tabindex="-1" role="dialog" aria-labelledby="exampleModalLabel"
      aria-hidden="true">
      <div class="modal-dialog" role="document">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title" id="exampleModalLabel">Submit a review</h5>
            <button type="button" class="close" data-dismiss="modal" aria-label="Close">
              <span aria-hidden="true">&times;</span>
            </button>
          </div>
          <div class="modal-body">
            <form>
              <h5 class="my-3 font-weight-bold">Service rating
                <div class="ml-5 d-inline-block" id="demo"></div>
              </h5>


              <h5 class="font-weight-bold">Leave a review</h5>
              <textarea name="reply" class="bg-light border border-none" cols="55" rows="3"></textarea>

              <a @click="rating()" class="font-weight-bold btn btn-light w-50 m-auto">Submit</a>
            </form>

          </div>
        </div>
      </div>
    </div>
    <!-- Review -->

    <!-- Body -->


  </div>
</template>

<script>

export default {

  props: ['auth_user'],
  data: () => ({
    form: new Form({
      name: '',
      shop_id: '',
      details: '',
      price: '',
      contact: '',
      category: '',
      image: '',
      rating_count: '',
    }),
    formBook: new Form({
      date: '',
      service_id: '',
      note: '',
      business_bid_id:''
    }),
    formMsg: new Form({
    msg: '',
    service_id: ''
    }),
    details: [],
    service_id: '',
    booked:false
  }),

  created() {
    if (sessionStorage.getItem('serviceDetails') != null)
      sessionStorage.clear();
  },
  methods: {

    contact: function () {
      $('#collapseExample').removeClass('collapse');
    },

    getDetails: function () {
      var id = this.$route.params.id;
      id = atob(id); id = atob(id);

      this.formBook.service_id = id; //this.$route.params.id;
      this.formMsg.service_id = id; //this.$route.params.id;

      if(this.$route.params.business_bid_id){
        //id2 = atob(this.$route.params.business_bid_id); id2 = atob(id2);
        this.formBook.business_bid_id = this.$route.params.business_bid_id;
      }

      var t = this;
      axios.get('ServiceResults/' + id).then((data) => {
        //t.details = data.data.data;
        t.form.price = data.data.data[0].price;
        t.form.name = data.data.data[0].name;
        t.form.details = data.data.data[0].details;
        t.form.location = data.data.data[0].location;
        //t.form.contact = data.data.data[0].contact;
        t.form.image = data.data.data[0].image;
        t.form.category = data.data.data[0].category;
        t.form.shop_id = data.data.data[0].shop_id;
        t.form.rating = data.data.data[0].rating / data.data.data[0].rating_count;
        t.form.rating = t.form.rating.toFixed();

        t.form.rating_count = data.data.data[0].rating_count;
        t.booked = data.data.data[0].booked;


        var i;
        for (i = 1; i < 6; i++) {
          console.log(parseInt(t.form.rating));
          if (i <= parseInt(t.form.rating))
            $('#staticRating').append('<img src="rating/images/g-star.svg" style="height: 15px;color:green" class="">');
          else
            $('#staticRating').append('<img src="rating/images/white.png" style="height: 15px;" class="">');
        }

      });

      //Calendar Min Date
      const date = new Date();
      let day = date.getDate();
      let month = date.getMonth() + 1;
      let year = date.getFullYear(); 
      let currentDate = `${year}-${month}-${day}`;
      document.getElementById('date').setAttribute("min", currentDate);

    },

    addToCart(id) {
      var qty = $('#qty').val();
      var id = this.$route.params.id; 
      var t = this;
      axios.get('addToCart/' + id + '-' + qty).then((data) => {
        console.log(data);
        toastr.success(data.data.response)
        this.$router.push('/cart')
      });
    },

    service_milestones(id) {
      var id = this.$route.params.id;
      //id = atob(id); id = atob(id);
      var t = this;
      this.$router.push('/service-milestone/' + id);
    },

    rating() {
      var id = this.$route.params.id;
      id = atob(id); id = atob(id);

      var rating = $('#demoRating').val();
      if(rating == 0){
        $.alert({
          title: 'Alert!',
          content: 'A rating cannot be 0!',
        });
      }
      else{
      axios.get('ratingService/' + id + '/' + rating).then((data) => {
        //console.log(data);
        sessionStorage.setItem('alert', 'Rating submitted successfully!');
        location.reload();
      });
     }
    },

    getPhoto() {

      return '../';

    },


    make_session() {
      var id = this.$route.params.id;
      //id = atob(id); id = atob(id);

      sessionStorage.setItem('serviceDetails', id);
      document.getElementById('c_to_action').value = 'loginFromService';
      document.getElementById('c_to_action_login').value = 'loginFromService';
    },

    replaceText() {
      $('#call_to').html('');
      $('#call_to').html('<a onclick="c_to_actionS();" data-target="#loginModal" data-toggle="modal" class="header_buttons px-sm-3 my-1 px-1 py-1 mx-1 d-inline-block small text-center" ><span style="color:black;" id="c_to_ac">Add Your Service</span></a> ');
    },

    async serviceBook() {
      const response = await this.formBook.post('serviceBook');
      console.log(response.data);
      if (response.data.success) {
        $.alert({
          title: 'Alert!',
          content: response.data.success,
        });
        this.booked = 1;
      }
      else
        $.alert({
          title: 'Alert!',
          content: response.data.failed,
           type: 'red',
            buttons: {
            tryAgain: {
            text: 'Close',
            btnClass: 'btn-red',
            action: function(){
            }
        }}  
        });


      // this.$router.push('/manage-category');

    },

     async sendMessage() {
      const response = await this.formMsg.post('serviceMsg');
      //console.log(response.data);
      if (response.data.success) {
        $.alert({
          title: 'Alert!',
          content: response.data.success,
        });
        $('#collapseExample').addClass('collapse');
      }
      else
        $.alert({
          title: 'Alert!',
          content: response.data.failed,
           type: 'red',
            buttons: {
            tryAgain: {
            text: 'Close',
            btnClass: 'btn-red',
            action: function(){
            }
        }}  
        });


      // this.$router.push('/manage-category');

    }

  },


  mounted() {
    this.replaceText();
    this.getDetails();

    if (sessionStorage.getItem('alert') != null) {
      alert('Review successfully taken!');
      sessionStorage.clear();
    }

    // SCRIPT

    (function ($) {
      $.fn.rates = function (options) {
        // Default settings for the plugin if none are provided by the user
        const settings = $.extend({
          shadeColor: 'rates-yellow',
          shapeHeight: '25px',
          shapeCount: 5,
          shape: 'white-star',
          imagesFolderLocation: '',

        }, options);

        return this.each(function () {
          const container = this;
          $(container).addClass('rates-container');
          const $containerName = $(this).attr('id');

          const score = {
            value: 0,
          };

          createStars(settings.shapeCount);
          setSize();

          const $eachStar = $(this).find('img');

          // Colors in the rating shape on hover
          // Removes the color from above the selected rating on mouse out
          $(this).find('img').hover(function () {
            const starIndex = $eachStar.index(this);
            colorShapesToIndex(starIndex);
          }, () => {
            colorShapesToScore();
          });

          // Sets the score rating based on which rating shape was clicked
          $(this).find('img').on('click', function () {
            const starIndex = $eachStar.index(this);
            colorShapesToIndex(starIndex);
            score.value = starIndex + 1;
            $(`#${$containerName}Rating`).val(score.value);
          });

          // Sets the size of stars indicated in the settings
          function setSize() {
            $(container).find('img').css('height', settings.shapeHeight);
          }

          // Dynamically creates the html markup based on the number of stars indicated
          function createStars(count) {
            const starInput = $(`<input type="hidden" id = "${$containerName}Rating" name="${$containerName}Rating" value="0" >`);
            $(container).append(starInput);
            for (let i = 0; i < count; i++) {
              const $imageStar = $('<img>');
              $imageStar.attr('src', `${settings.imagesFolderLocation}images/${settings.shape}.png`);
              $(container).append($imageStar);
            }
          }

          // Resets the shading class on the shapes to color only those up until a designated index
          function colorShapesToIndex(starIndexValue) {
            $eachStar.removeClass(settings.shadeColor);
            for (let i = 0; i <= starIndexValue; i++) {
              const star = $eachStar.get(i);
              $(star).toggleClass(settings.shadeColor);
            }
          }

          // Resets the shading class on the shapes to color only those up to and including the selected score
          function colorShapesToScore() {
            $eachStar.removeClass(settings.shadeColor);
            for (let j = 0; j < score.value; j++) {
              const star = $eachStar.get(j);
              $(star).toggleClass(settings.shadeColor);
            }
          }
        });
      };
    }(jQuery));

    // SCRIPT

    $('#demo').rates({
      shape: 'black-star',
      imagesFolderLocation: 'rating/',
      shapeHeight: '20px',
      shadeColor: 'rates-green',
    });

  }





}
</script>
