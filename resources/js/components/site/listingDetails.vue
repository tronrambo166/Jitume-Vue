<template>
  <div class="container">

    <div class="heading row my-3 pt-3">
      <div class="col-md-6">
        <div class="grid images_3_of_2 rounded listing px-3">
          <img style="width:100%; max-height: 500px;" class="shadow card" :src="form.image" alt="" />


          <div class="pl-2 pt-4">
            <h3 class="mt-2 text-left text-dark font-weight-bold ">{{ form.name }}
              <div class="float-right text-rightpy-0 my-0" style="width:30%;">

                <h6 class="font-weight-bold">Amount: <span class="font-weight-light"><b>${{ form.investment_needed }} </b></span>

                   <span style="font-size:11px;" class="font-weight-light"><b>   (Required):${{ amount_required }}</b></span></h6>

                <div class="row ">
                  <div class="col-10" id="">
                    <div class="float-right" id="staticRating">

                </div> 
                </div>
                <div class="col-2"> <p class="rating-star text-dark d-inline float-right" >({{ form.rating }})</p></div>
                </div>
                 
                <p class="text-dark d-block float-right" style="font-size:13px;">({{ form.rating_count }} reviews)</p>
              </div>

            </h3>

            <p class="my-1 text-left"><i class="mr-2 fa fa-map-marker"></i>{{ form.location }}

            <div v-if="auth_user" class="float-right w-25">
              <div class="" style="background:#e5e5e9; height:19px;">
                <span id="progress" class="d-block"></span>
              </div>
              <span>{{ progress }}% Invested</span>
            </div>
            </p>
          </div>

          <div class="row my-4">
            <div class="col-md-12">
              <a class="btn border border-bottom-success">Overview</a>

              <a v-if="auth_user" data-toggle="modal" data-target="#reviewModal"
                class="btn border border-bottom-success">Add review</a>

              <a v-else @click="make_session(form.listing_id);" data-target="#loginmodal2" data-toggle="modal"
                class="btn border border-bottom-success">Add review</a>

              <hr>
            </div>


            <div class="Overview" id="Overview">

              <p><span class="mt-1 rounded"><i class="mr-2 fa fa-phone"></i>{{ form.contact }}</span></p>
            </div>


          </div>

        </div>

      </div>


      <div class="col-md-3">
        <div class=" eqp-invest my-4 text-left">
          <h3 class="secondary_heading my-3">About {{form.name}}</h3>
          <p class="text-justify-center  ">Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod
            tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco
            laboris nisi ut aliquip</p>
        </div>
      </div>

      <div class="col-md-3">

        <!--  <div class="card bg-light w-75 mx-auto py-3">
             <h5 class="mx-4 text-secondary shadow border border-light py-2 d-block text-center">Seed investors spot open
                <i class="ml-1 fa fa-angle-up"></i></h5>
                <button class="buttonListing my-3">Login to book</button><hr>
                <h5 class="border border-light py-2 d-block text-center">Commitment to invest fee <p class="d-inline text-success">2000</p>
                </h5>
               <div v-if="auth_user" class="eqp-invest">
                <router-link :to="`/invest_eqp/${form.listing_id}`" class="text-light buttonListing my-3 py-3">Invest with Equipment/Supplies</router-link>
                <router-link :to="`/donate_eqp/${form.listing_id}`" class="text-light buttonListing my-3 py-3">Donate with Equipment/Supplies</router-link>
                </div> 
                <div v-else="auth_user" class="eqp-invest">
                <a @click="make_session(form.listing_id);" href="" data-target="#loginModal" data-toggle="modal" class="py-2 text-light buttonListing my-3">Invest with Equipment/Supplies</a>
                <a href="" data-target="#loginModal" data-toggle="modal" class="py-2 text-light buttonListing my-3">Donate with Equipment/Supplies</a>
                </div>

         </div> -->


        <div v-if="!form.conv || !auth_user" class="card bg-light w-100 mx-auto py-3">

          <h4 class="secondary_heading ml-4 border border-light py-2 d-block ">Business Home Window <p class="d-inline ">
            </p>
          </h4>

          <div v-if="auth_user" class="eqp-invest">
            <a v-if="plan == 'platinum' || (plan == 'gold' && range == form.range)" @click="unlockBySubs(form.listing_id,subscrib_id,'platinum');"
              class=" business_btns py-2 text-center text-light buttonListing my-2">Unlock More Business
              Information To
              Invest</a>

              <a v-else data-target="#investModal" data-toggle="modal"
              class=" business_btns py-2 text-center text-light buttonListing my-2">Unlock More Business
              Information To
              Invest</a>

            <!-- <a style="background:grey;" 
             v-if="subscribed"
              class=" business_btns btn-secondary py-2 text-center text-light buttonListing my-2">Subscribe</a>

              <router-link :to="`/subscribe/${form.listing_id}`"
              v-else
              class=" business_btns py-2 text-center text-light buttonListing my-2">Subscribe</router-link> -->


            <!-- INVEST MODAL -->
         <!--    <div class="modal d-block" id="investModalShow" tabindex="-1" role="dialog"
              aria-labelledby="exampleModalLabel" aria-hidden="true">
              <div class="modal-dialog" role="document">
                <div class="modal-content">
                  <div class="modal-header">
                    <div class=" w-100">
                      <button @click="modal_hide()" type="button" class="m-0  close" data-dismiss="modal"
                        aria-label="Close">
                        <span aria-hidden="true">&times;</span>
                      </button>
                    </div>
                  </div>

                  <div class="modal-body">
                    <div class="row">
                      <div class="col-sm-12 w-100 mx-auto">
                        <div style="cursor:pointer;background:white;" class="p-3">

                          <p style="font-size:16px;" class="text-dark smalls">This business requests a small fee of
                            <b>${{ form.investors_fee }} </b> to view their full business information. Do you want to pay
                            now?
                          </p>

                        </div>
                      </div>

                    </div>
                  </div>
                  <div class="modal-footer">
                    <div class="card-header w-100 text-center">
                      <form action="stripe" method="get">

                        <input type="text" hidden id="price" name="price" :value="form.investors_fee">
                        <input type="number" hidden id="listing_id" name="listing_id" :value="form.listing_id">
                        <a @click="make_session(form.listing_id); stripeFee(form.listing_id, form.investors_fee);" type="submit"
                          class="modal_ok_btn btn rounded w-25 d-inline  px-3 text-white  mr-3">
                          Ok
                        </a>
                        <a @click="modal_hide()" type="button"
                          class="modal_cancel_btn w-25 btn rounded d-inline px-3 m-0 " data-dismiss="modal"
                          aria-label="Close">
                          <span aria-hidden="true">Cancel</span>
                        </a>

                      </form>

                    </div>
                  </div>

                </div>
              </div>
            </div> -->
            <!-- INVEST MODAL -->

          </div>


          <div v-else class="eqp-invest">
            <a @click="make_session(form.listing_id);" data-target="#loginModal" data-toggle="modal"
              class="business_btns py-2 text-center text-light buttonListing my-3">Unlock More Business Information To
              Invest</a>

            <!-- <a  @click="make_session(form.listing_id);" data-target="#loginmodal2" data-toggle="modal" class="py-2 text-center text-light buttonListing my-3"><b>Subscribe</b></a>

                <a  @click="make_session(form.listing_id);" data-target="#loginmodal2" data-toggle="modal" class="py-2 text-center text-light buttonListing my-3"><b>Donate</b></a> -->


          </div>

        </div>


        <div v-else class="bg-light w-100 mx-auto py-3 text-center">


          <div class="eqp-invest">



            <!-- <a @mouseleave="leave()" @mouseover="hover()" style="border: 1px solid black;" id="convBtn1"
              class="py-1 convBtn text-center mx-auto w-75 btn  px-2">Message Business Owner</a> -->

            <a @click="download_statement()" @mouseleave="leave()" @mouseover="hover2"
              style="border: 1px solid black;" id="convBtn2"
              class="py-1 convBtn my-3 text-center mx-auto w-75 btn  px-2">Download Financial Statements</a>
          </div>


          <div class="eqp-invest">
            <a style="border: 1px solid black;" @mouseleave="leave()" @mouseover="hover3()" @click="download_business()"
              id="convBtn3" class="py-1 convBtn text-center mx-auto w-75 btn mt-4 px-2">Download Business
              Documentation</a>


            <router-link :to="`/business-milestone/${form.raw_id}`" @mouseleave.native="leave()"
              @mouseover.native="hover4" style="border: 1px solid black;" id="convBtn4"
              class="py-1 convBtn my-3 text-center mx-auto w-75 btn  px-2">View Business Milestones</router-link>

            <div v-if="running && amount_required > 0" class="Invest-Payout">
              <div class="w-75 mx-auto row">
                <!-- <div class="col-sm-8 px-0"><p class="commitP text-left">Commit to invest in milestones:</p></div>
                    <div class="col-sm-4 px-1">
                    <div v-for="result in results" class="d-flex">
                    <input  v-if="result.investor_id == null" :value="result.id" type="checkbox" name="miles" class="float-left mr-2" > 
                    <span v-else style="font-size:10px;" class="font-weight-bold mt-2 float-left mr-2 small text-success">(Commited)</span> 
                    <label style="font-size:12px;" class="mt-2 float-left">{{result.title}}</label>
                    </div>
                    </div> -->

                <div class="col-sm-12 px-0">
                  <p class="text-center"><b>Enter A Bid To Invest</b></p>
                </div>
                <div class="col-sm-12 px-1">
                  <div class="row">
                    <div class="col-md-4">Amount:$</div>
                    <div class="col-md-8">
                      <input v-on:keyup="calculate($event.target.value);" value="" id="bid_amount" style="height:25px;"
                        type="number" name="bid_amount">
                    </div>
                  </div>

                  <div class="row mt-3">
                    <div class="col-sm-3">Represents:</div>
                    <div class="col-sm-2"></div>
                    <div class="col-sm-5">
                      <p id="bid_percent" class="text-center" > %</p>
                      <input step="0.01" hidden value="" id="bid_percent2" type="number">
                    </div>
                  </div>
                </div>

              </div>

              <a style="border: 1px solid black;" @mouseleave="leave()" @mouseover="hover5()" @click="make_session(form.listing_id);bidCommits()"
                id="convBtn5" class="py-1 convBtn text-center mx-auto w-75 btn mt-4 px-2">Invest</a>

              <div class="w-75 mx-auto row">
                <div class="col-sm-12 px-0 mt-3">
                  <p class="text-center"><b>Enter Equipment Equivalent Bid To Invest</b></p>
                </div>
                <div class="col-sm-12 px-1">
                  <div class="row">
                    <div class="col-md-4">Amount:$</div>
                    <div class="col-md-8">
                      <input v-on:keyup="calculate2($event.target.value);" value="" id="bid_amount_eqp"
                        style="height:25px;" type="number" name="bid_amount_eqp">
                    </div>
                  </div>

                  <div class="row mt-3">
                    <div class="col-sm-3">Represents:</div>
                    <div class="col-sm-2"></div>
                    <div class="col-sm-5">
                      <p id="bid_percent_eqp" class="text-center"> %</p>
                      <input step="0.01" hidden value="" id="bid_percent2_eqp" type="number">
                    </div>
                  </div>
                </div>
              </div>


              <a style="border: 1px solid black;" @mouseleave="leave()" @mouseover="hover6()" @click="bidCommitsEQP()"
                id="convBtn6" class="py-1 convBtn text-center mx-auto w-75 btn mt-4 px-2">Invest With Equpment</a>

            </div>

            <div v-else class="w-75 mx-auto row">
              <p class="bg-light">Milestone payout is currently off due to milestone completion process, please wait until
                next milestone is open.</p>
            </div>


          </div>

        </div>



      </div>

    </div>



    <!-- INVEST MODAL -->
    <div class="modal fade" id="investModal" tabindex="-1" role="dialog" aria-labelledby="exampleModalLabel"
      aria-hidden="true">
      <div class="modal-dialog" role="document">
        <div class="modal-content" style="border-radius:3px;">
          <div class="modal-header">

            <div class="card-header w-100">
              <a id="small_fee" @click="unlock_choose_button('a');"
                  class="border w-25 d-inline  btn rounded mr-3 px-3 font-weight-bold">
                  Small fee
                </a>

                <a v-if="subscribed" id="subs" @click="unlock_choose_button('b');"
                  class="border modal_ok_btn w-25 d-inline  btn rounded mr-3 px-3 font-weight-bold">
                  Subscription
                </a>

              <router-link :to="`/subscribe/${form.listing_id}`"
              v-else data-dismiss="modal" aria-label="Close"
              class="border w-25 d-inline  btn rounded mr-3 px-3 font-weight-bold">Subscribe</router-link>
          
            </div>

          </div>


          <div class="modal-body">

            <div class="row collapse" id="small_fee_div">
              <div class="col-sm-12 w-100 mx-auto">
                <div style="cursor:pointer;background:white;" class="p-3">

                  <p style="font-size:16px;" class="text-dark smalls">This business requests a small fee of
                    <b>${{ form.investors_fee }} </b> to view their full business information. Do you want to pay now?
                  </p>
                </div>
              </div>


              <div class="card-header w-100 text-center">
              <form action="stripe" method="get">
                <input type="text" hidden id="price" name="price" :value="form.investors_fee">
                <input type="number" hidden id="listing_id" name="listing_id" :value="form.listing_id">


                <a @click="make_session(form.listing_id);stripeFee(form.listing_id, form.investors_fee);" type="submit"
                  class="modal_ok_btn w-25 d-inline  btn rounded mr-3 px-3 font-weight-bold">
                  Ok
                </a>
                <a type="button" class="modal_cancel_btn btn rounded w-25 d-inline px-3 font-weight-bold m-0 "
                  data-dismiss="modal" aria-label="Close">
                  <span aria-hidden="true">Cancel</span>
                </a>
              </form>
            </div>

            </div>


            <!-- SUBSCRIBE DIV -->
              <div v-if="subscribed" class="row" id="subs_div">
              <div class="col-sm-12 w-100 mx-auto">
              <div style="cursor:pointer;background:white;" class="px-3 py-2">
                  
                <p id="range_error" style="font-size:14px;" class="system_ui collapse mb-3 py-1 text-danger smalls bg-light text-center"></p>

                  <p v-if="token_left > 0 && trial" style="font-size:16px;" class="mb-3 py-2 text-warning smalls bg-light text-center">Your 
                     <!-- v-if="trial">trial</span><span v-else> -->
                      <span>plan</span>
                    expires in <b>{{expire}} </b> days.
                    <span class="text-dark small d-block">Are you sure you want to use one of your {{token_left}} business information tokens?</span>
                  </p>

                  <p v-else style="font-size:16px;" class="mb-3 py-2 text-dark smalls bg-light text-center">Please use <b>'Small fee'</b> option to unlock</p>

                  <div class="row" v-if="plan == 'silver' || plan == 'silver-trial'">

                  <div v-if="token_left > 0" class="col-md-6">
                  <a   @click="make_session(form.listing_id);unlockBySubs(form.listing_id,subscrib_id,'token');" type="submit"
                  class="modal_ok_btn w-75 m-auto d-inline  btn rounded mr-3 px-3">
                  Use token <small>({{token_left}} left)</small>
                </a>
                </div>

                <div v-else class="col-md-6">
                <a class="modal_ok_btn w-75 m-auto d-inline  btn rounded mr-3 px-3">
                   <small><b>({{token_left}} token left)</b></small>
                </a>
                </div>

                

                <div class="col-md-6"> 
                <a type="submit" class="close border border-dark w-100 d-inline  btn rounded mr-3 px-3" data-dismiss="modal" aria-label="Close">
                <span class="text-dark" aria-hidden="true">No</span>
                </a>

                </div>
                </div>

                
                <div class="row" v-if="plan == 'gold' || plan == 'gold-trial'">
                <div v-if="token_left > 0" class="col-md-6">
                  <a   @click="make_session(form.listing_id);unlockBySubs(form.listing_id,subscrib_id,'token');" type="submit"
                  class="modal_ok_btn w-75 m-auto d-inline  btn rounded mr-3 px-3">
                  Use token <small>({{token_left}} left)</small>
                </a>
                </div>

                <div v-else class="col-md-6">
                <a class="modal_ok_btn w-75 mx-auto d-block  btn rounded mr-3 px-3">
                   <small><b>({{token_left}} token left)</b></small>
                </a>
                </div>

                <div class="col-md-6"> 
                <!-- <a type="submit" 
                  class=" modal_ok_btn w-100 d-inline  btn rounded mr-3 px-3">
                  No
                </a> -->
                <a type="submit" class="close border border-dark w-100 d-inline  btn rounded mr-3 px-3" data-dismiss="modal" aria-label="Close">
                <span class="text-dark" aria-hidden="true">No</span>
                </a>

                </div>

                <div class="w-75 mx-auto my-1"><p id="range_error" style="font-size:14px;" class="system_ui  py-1 text-danger smalls bg-light text-center"></p>The business is not in your range!</div>
                </div>

                <div class="row" v-if="plan == 'platinum'">
                <a @click="make_session(form.listing_id);unlockBySubs(form.listing_id,subscrib_id,'platinum');" type="submit"
                  class="modal_ok_btn w-75 m-auto btn rounded mr-3 px-3">
                  Use platinum package
                </a>
                </div>

                <div class="row" v-if="plan == 'platinum-trial'">
                <a @click="make_session(form.listing_id);unlockBySubs(form.listing_id,subscrib_id,plan);" type="submit"
                  class="modal_ok_btn w-75 m-auto btn rounded mr-3 px-3">
                  Use trial package
                </a>
                </div>


                </div>
              </div>

            </div>

          </div>

          <div class="modal-footer">



          </div>

        </div>
      </div>
    </div>


    <!-- INVEST MODAL -->

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

  props: ['auth_user', 'business'],
  data: () => ({
    form: new Form({
      name: '',
      range:'',
      listing_id: '',
      details: '',
      location: '',
      contact: '',
      category: '',
      image: '',
      investment_needed: '',
      investors_fee: '',
      rating: '',
      rating_count: '',
      conv: '',
      raw_id:''
    }),

    results: [],
    details: [],
    progress: '',
    share: '',
    amount_required: '',
    running: 0,

    subscrib_id:'',
    subscribed:'',
    trial:'',
    token_left:'',
    range:'',
    plan:'',
    expire:''
  }),

  created() {


    if (sessionStorage.getItem('invest') != null)
      sessionStorage.clear();

    this.form.raw_id = this.$route.params.id;

  },
  methods: {

    isSubscribed: function () {
      var id = this.$route.params.id; var t = this;
      id = atob(id); id = atob(id);

      axios.get('isSubscribed/'+id).then((data) => {
        //console.log(data.data.data);
        if(data.data.count > 0){
        t.subscribed = data.data.data.subscribed;
        t.trial = data.data.data.trial;
        t.token_left = data.data.data.token_left;
        t.range = data.data.data.range;
        t.plan = data.data.data.plan;
        t.expire = data.data.data.expire;
        t.subscrib_id = data.data.data.sub_id;

        if(t.subscribed == 0)
          $('#small_fee_div').removeClass('collapse');
      }
      else {
        $('#small_fee_div').removeClass('collapse');
        $('#small_fee').addClass('modal_ok_btn');
      } 

        });
      },

    getDetails: function () {
      var id = this.$route.params.id; var t = this;
      id = atob(id); id = atob(id); 

      document.getElementById('listing_id').value = id;

      axios.get('searchResults/' + id).then((data) => {
        //console.log(data);
        t.form.conv = data.data.conv;
        t.form.range = data.data.data[0].y_turnover;
        t.form.name = data.data.data[0].name;
        t.form.details = data.data.data[0].details;
        t.form.location = data.data.data[0].location;
        t.form.contact = data.data.data[0].contact;
        t.form.image = data.data.data[0].image;
        t.form.category = data.data.data[0].category;
        t.form.listing_id = data.data.data[0].id;
        t.form.investment_needed = data.data.data[0].investment_needed;
        t.form.investors_fee = data.data.data[0].investors_fee;
        if(t.form.investors_fee == null)
          t.form.conv = true;
        
        t.form.rating = parseFloat(data.data.data[0].rating) / parseFloat(data.data.data[0].rating_count);
        t.form.rating = t.form.rating.toFixed(2);
        t.form.rating_count = data.data.data[0].rating_count;
        if(t.form.rating_count == 0) t.form.rating = 0;

        var i;
        for (i = 1; i < 6; i++) {
          //console.log(parseInt(t.form.rating));
          if (i <= parseInt(t.form.rating))
            $('#staticRating').append('<img src="rating/images/g-star.svg" style="height: 15px;color:green" class="">');
          else
            $('#staticRating').append('<img src="rating/images/white.png" style="height: 15px;" class="">');
        }

      });

    },

    select() {
      $('.single').css('background', '#72c537');
      $('.multiple').css('background', '');
    },

    select2() {
      $('.single').css('background', '');
      $('.multiple').css('background', '#72c537');
    },
    price(ev) {
      document.getElementById('price').value = ev.target.value;
    },

    getPhoto() {

      return '../';

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
      axios.get('ratingListing/' + id + '/' + rating).then((data) => {
        sessionStorage.setItem('alert', 'Rating submitted successfully!');
        location.reload();;
      });
     }
    },

    make_session(id) {
      id = btoa(id); id = btoa(id);
      sessionStorage.setItem('invest', id);
      document.getElementById('c_to_action').value = 'loginFromService';
      document.getElementById('c_to_action_login').value = 'loginFromService';
      document.getElementById('c_to_action_login2').value = 'loginFromService';
      document.getElementById('c_to_listing_reg').value = 'True';
    },

    hover() {
      $('#convBtn1').css('background', '#083608');
      //$('#convBtn1').css('color', '#ffffffe3');
    },
    hover2() {
      $('#convBtn2').css('background', '#083608');
      $('#convBtn2').css('color', '#ffffffe3');
    },
    hover3() {
      $('#convBtn3').css('background', '#083608');
      $('#convBtn3').css('color', '#ffffffe3');
    },
    hover4() {
      $('#convBtn4').css('background', '#083608');
      $('#convBtn4').css('color', '#ffffffe3');
    },
    hover5() {
      $('#convBtn5').css('background', '#083608');
      $('#convBtn5').css('color', '#ffffffe3');
    },
    hover6() {
      $('#convBtn6').css('background', '#083608');
      $('#convBtn6').css('color', '#ffffffe3');
    },
    leave() {
      $('.convBtn').css('background', '');
      $('.convBtn').css('color', '#333333');
    },

    download_business() {
      var id = this.$route.params.id; var t = this;
      id = atob(id); id = atob(id);

      axios.get('download_business/' + id).then((data) => {
        //console.log(data);
        if(data.data.status == 404){
           $.alert({
          title: 'Alert!',
          content: 'The business has no such document or the file not found!',
           type: 'red',
            buttons: {
            tryAgain: {
            text: 'Close',
            btnClass: 'btn-red',
            action: function(){
            }
        }}  
        });
        }

      });
    },

    download_statement() {
      var id = this.$route.params.id; var t = this;
      id = atob(id); id = atob(id);

      axios.get('download_statement/' + id).then((data) => {
        if(data.data.status == 404){
          $.alert({
          title: 'Alert!',
          content: 'The business has no such document or the file not found!',
           type: 'red',
            buttons: {
            tryAgain: {
            text: 'Close',
            btnClass: 'btn-red',
            action: function(){
            }
        }}  
        });
        }
        //console.log(data);

      });
    },
    
    getMilestones: function () {
      var id = this.$route.params.id; var t = this;
      id = atob(id); id = atob(id);

      axios.get('getMilestones/' + id).then((data) => {
        //console.log(data);
        t.results = data.data.data;
        t.progress = data.data.progress;
        $('#progress').css('width', t.progress + '%');

        if(t.progress != 0)
        t.progress = t.progress.toFixed(2);
        t.share = data.data.share;
        t.amount_required = data.data.amount_required;
        t.running = data.data.running;
        if(data.data.data == "Failed!")
          t.progress = 0;
      });

    },


    bidCommits: function () {
      var checked = '';
      //[...document.querySelectorAll('input[name="miles"]:checked')]
      //.forEach((cb) => checked = checked+cb.value+',');

      var amount = $('#bid_amount').val();
      var percent = $('#bid_percent2').val();
      var business_id = this.$route.params.id;
      business_id = atob(business_id); business_id = atob(business_id);

      if (amount == '' || amount == 0)
        $.alert({
          title: 'Alert!',
          content: 'Please enter a bid to invest!',
        });
      else {
        var amount = btoa(amount);
        var business_id = btoa(business_id)
        var percent = btoa(percent)
        $.confirm({
          title: 'Are you sure?',
          content: 'Are you sure to bid?',
          buttons: {
            confirm: function () {
              window.location.href = './bidCommits/' + amount + '/' + business_id + '/' + percent;
            },
            cancel: function () {
              $.alert('Canceled!');
            },
          }
        });

        //$('#convBtn4 a').trigger('click');
      }

    },


    bidCommitsEQP: function () {
      var amount = $('#bid_amount_eqp').val();
      var percent = $('#bid_percent2_eqp').val();
      var business_id = this.$route.params.id;
      business_id = atob(business_id); business_id = atob(business_id);

      if (amount == '' || amount == 0)
        $.alert({
          title: 'Alert!',
          content: 'Please enter a bid to invest!',
        });
      else {
        var amount = btoa(amount);
        var id = btoa(business_id);
        var percent = btoa(percent);
        let t = this;
        $.confirm({
          title: 'Are you sure?',
          content: 'Are you sure to bid?',
          buttons: {
            confirm: function () {
              t.$router.push(`../investEQUIP/${amount}/${id}/${percent}`);
            },
            cancel: function () {
              $.alert('Canceled!');
            },
          }
        });
      }

    },

      stripeFee: function (business_id,amount) {
        var amount = btoa(amount);
        var business_id = btoa(business_id)
        $.confirm({
          title: 'Are you sure?',
          content: 'Are you sure?',
          buttons: {
            confirm: function () {
              window.location.href = './stripe/' + amount + '/' + business_id;
            },
            cancel: function () {
              $.alert('Canceled!');
            },
          }
        });

    },

    modal_hide: function () {
      $('#investModalShow').removeClass('d-block');
    },

    calculate: function (bid) {
      var total = this.form.investment_needed;
      var share = this.share * 100;
      var percent = (bid / total) * share;
      var percent = percent.toFixed(2);
      if (bid > this.amount_required) {
        document.getElementById('bid_amount').value = 0;
        document.getElementById('bid_percent').innerHTML = '<b class="text-danger">Amount exceeds the investment required!</b>';
      }
      else
        document.getElementById('bid_percent').innerHTML = percent + '%';
      document.getElementById('bid_percent2').value = percent;
    },

    calculate2: function (bid) {
      var total = this.form.investment_needed;
      var share = this.share * 100;
      var percent = (bid / total) * share;
      var percent = percent.toFixed(2);
      if (bid > this.amount_required) {
        document.getElementById('bid_amount_eqp').value = 0;
        document.getElementById('bid_percent_eqp').innerHTML = '<b class="text-danger">Amount exceeds the investment required!</b>';
      }
      else
        document.getElementById('bid_percent_eqp').innerHTML = percent + '%';
      document.getElementById('bid_percent2_eqp').value = percent;
    },

    unlock_choose_button: function (button) {
      if(button == 'a'){
        $('#small_fee').addClass('modal_ok_btn');
        $('#subs').removeClass('modal_ok_btn');
        $('#small_fee_div').show();
        $('#subs_div').hide();
      }
      else{
        $('#subs').addClass('modal_ok_btn');
        $('#small_fee').removeClass('modal_ok_btn');
        $('#subs_div').show();
        $('#small_fee_div').hide();
      }

    },

    unlockBySubs: function (listing_id,sub_id,plan) {
      //alert(sub_id);
      let t = this;
              axios.get('unlockBySubs/' + listing_id+'/'+sub_id+'/'+plan).then((data) => {

                  if(data.data.success){
                    if(plan == 'token'){
                    $.alert({
                      title: 'Alert!',
                      content: 'Thanks, '+(t.token_left-1)+' more tokens to go!',
                    });
                    setTimeout(() => location.reload(), 3000);
                  }

                    else location.reload();
                  }

                  if(data.data.error){
                  $('#range_error').show();
                  $('#range_error').html(data.data.error);
                  }
               });  
    }

  },


  mounted() {
    this.getDetails();
    this.getMilestones();
    this.isSubscribed();

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
