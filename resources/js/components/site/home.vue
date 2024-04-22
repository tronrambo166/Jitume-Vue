<template>
  <div class="container-fluid px-0" style="overflow:hidden;">
    <div class="home_bg" style="">



  <div class="w-full bg-light">
<!--hero section-->
<div class="bg-gray-100 relative">
    <!-- Vector on the left -->
    <img src="/images/left vector.png" class="absolute left-0 top-1/2 transform -translate-y-1/2 z-90" style="height: 100px; width: auto;">

    <!-- Vector on the right -->
    <img src="/images/right vector.png" class="absolute right-0 top-1/3 transform -translate-y-1/2 z-10" style="height: 100px; width: auto;">

    <div class="container mx-auto py-8 px-[250px]">
        <div class="flex flex-col gap-6 md:flex-row items-center justify-center space-y-8 md:space-y-0">
            <!-- Text on the left -->
            <div class="md:w-1/2">
                <h2 class="text-lg text-gray-800 text-gray-500 font-bold mb-4 py-[18px]">Welcome to Jitume</h2>
                <h3 class="text-[28px] text-black font-black ">Real business,real solutions,<span class="text-green-800 text-[30px]">realchange</span></h3>
                <h3 class="font-bold py-[20px]">Invest in a business you believe in with as little as $100</h3>

                <div>
                    <button class="bg-green-800 text-slate-100 rounded-[14px] px-6 py-3">Join today</button>
                </div>

            </div>

            <!-- Image on the right -->
            <div class="md:w-1/2">
                <img src="/images/Frame 859(1).png" alt="Your Image" class="w-full h-auto rounded-lg">
            </div>
        </div>
    </div>
</div>


  <div class="container">
   
    <div class="row justify-content-center">
    <div class="col-lg-8 col-md-10 text-center">
        

        <form id="form" @submit.prevent="search();" class="d-flex flex-wrap justify-content-center" method="post">

            <div class="input-group col-lg-5 col-md-6 my-2">
                <input style="border-radius: 35px 0 0 35px;" class="form-control border-right-0" type="text" name="listing_name" placeholder="What are you looking for?">
                <div class="input-group-append">
                    <span class="input-group-text bg-white border-left-0"><i class="fa fa-map-marker"></i></span>
                </div>
            </div>

            <div class="input-group col-lg-4 col-md-6 my-2">
                <input id="searchbox" onkeyup="suggest(this.value);" class="form-control" type="text" name="search" value="" placeholder="Location">
            </div>

            <input type="text" name="lat" id="lat" hidden value="">
            <input type="text" name="lng" id="lng" hidden value="">

            <div class="col-lg-3 col-md-6 my-2">
                <div class="dropdown">
                    <select id="category" name="category" class="form-control">
                        <option value="">Category</option>
                        <option value="Agriculture">Agriculture</option>
                        <option value="Arts / Culture">Arts/Culture</option>
                        <option value="Auto">Auto</option>
                        <option value="Sports/Gaming">Sports/Gaming</option>
                        <option value="Real State">Real State</option>
                        <option value="Food">Food</option>
                        <option value="Legal">Legal</option>
                        <option value="Security">Security</option>
                        <option value="Media / Internet">Media/Internet</option>
                        <option value="Fashion">Fashion</option>
                        <option value="Technology / Communications">Technology/Communications</option>
                        <option value="Retail">Retail</option>
                        <option value="Finance/Accounting">Finance/Accounting</option>
                        <option value="Pets">Pets</option>
                        <option value="Domestic (Home Help etc)">Domestic (Home Help etc)</option>
                        <option value="Other">Other</option>
                    </select>
                </div>
            </div>

            <div class="col-md-6 my-2">
                <button class="btn btn-success w-100" type="submit">Search</button>
            </div>

        </form>

        <div class="row">
            <div id="result_list" class="col-md-12 text-left search_results"></div>
        </div>
    </div>
</div>



<!--hero section Ends-->




  <div class="row justify-content-center">

    <div class="col-lg-8 col-md-10 text-center">

      <div class="my-4">
        <h4 class="display-4">Invest in Agriculture | Sports/Gaming | Real State | Entertainment | Auto | Finance/Accounting Security | Pets | Domestic Help | Other .........</h4>
        <h4 class="h3 text-success py-3">Your platform to invest in local businesses</h4>
      </div>

      <form id="form" @submit.prevent="search();" class="d-flex flex-wrap justify-content-center" method="post">

        <div class="input-group col-lg-5 col-md-6 my-2">
          <input style="border-radius: 35px 0 0 35px;" class="form-control border-right-0" type="text" name="listing_name" placeholder="What are you looking for?">
          <div class="input-group-append">
            <span class="input-group-text bg-white border-left-0"><i class="fa fa-map-marker"></i></span>
          </div>
        </div>

        <div class="input-group col-lg-4 col-md-6 my-2">
          <input id="searchbox" onkeyup="suggest(this.value);" class="form-control" type="text" name="search" value="" placeholder="Location">
        </div>

        <input type="text" name="lat" id="lat" hidden value="">
        <input type="text" name="lng" id="lng" hidden value="">

        <div class="col-lg-3 col-md-6 my-2">
          <div class="dropdown">
            <select id="category" name="category" class="form-control">
              <option value="">Category</option>
              <option value="Agriculture">Agriculture</option>
              <option value="Arts / Culture">Arts/Culture</option>
              <option value="Auto">Auto</option>
              <option value="Sports/Gaming">Sports/Gaming</option>
              <option value="Real State">Real State</option>
              <option value="Food">Food</option>
              <option value="Legal">Legal</option>
              <option value="Security">Security</option>
              <option value="Media / Internet">Media/Internet</option>
              <option value="Fashion">Fashion</option>
              <option value="Technology / Communications">Technology/Communications</option>
              <option value="Retail">Retail</option>
              <option value="Finance/Accounting">Finance/Accounting</option>
              <option value="Pets">Pets</option>
              <option value="Domestic (Home Help etc)">Domestic (Home Help etc)</option>
              <option value="Other">Other</option>
            </select>
          </div>
        </div>

        <div class="col-md-6 my-2">
          <button class="btn btn-success w-100" type="submit">Search</button>
        </div>

      </form>

      <div class="row">
        <div id="result_list" class="col-md-12 text-left search_results"></div>
      </div>

    </div>

  </div>
</div>

</div>


      <div class="mt-4">

  <div class="text-center pb-0">

    <ul class="d-flex list-unstyled justify-content-center text-success mx-4 mx-lg-4 py-0 my-0">

      <li class="nav-item"><router-link to="category/Arts-Culture"><i class="fas fa-paint-brush" title="Arts/Culture"></i></router-link></li>
      <li class="nav-item"><router-link to="category/Auto"><i class="fas fa-car" title="Auto"></i></router-link></li>
      <li class="nav-item"><router-link to="category/Domestic_Home"><i class="fas fa-home" title="Domestic (HomeHelp etc)"></i></router-link></li>
      <li class="nav-item"><router-link to="category/Fashion"><i class="fas fa-tshirt" title="Fashion"></i></router-link></li>
      <li class="nav-item"><router-link to="category/Finance-Accounting"><i class="fas fa-money-bill-wave" title="Finance/Accounting"></i></router-link></li>
      <li class="nav-item"><router-link to="category/Food"><i class="fas fa-utensils" title="Food"></i></router-link></li>
      <li class="nav-item"><router-link to="category/Legal"><i class="fas fa-balance-scale" title="Legal"></i></router-link></li>
      <li class="nav-item"><router-link to="category/Media-Internet"><i class="fas fa-globe" title="Media/Internet"></i></router-link></li>
      <li class="nav-item"><router-link to="category/Pets"><i class="fas fa-paw" title="Pets"></i></router-link></li>
      <li class="nav-item"><router-link to="category/Retail"><i class="fas fa-shopping-bag" title="Retail"></i></router-link></li>
      <li class="nav-item"><router-link to="category/Real State"><i class="fas fa-home" title="Real Estate"></i></router-link></li>
      <li class="nav-item"><router-link to="category/Security"><i class="fas fa-shield-alt" title="Security"></i></router-link></li>
      <li class="nav-item"><router-link to="category/Sports-Gaming"><i class="fas fa-gamepad" title="Sports/Gaming"></i></router-link></li>
      <li class="nav-item"><router-link to="category/Technology-Communications"><i class="fas fa-mobile-alt" title="Technology/Communications"></i></router-link></li>
      <li class="nav-item"><router-link to="category/Other"><i class="fas fa-question-circle" title="Other"></i></router-link></li>

    </ul>

  </div>

</div>

<div class="my-5 py-0">
  <ul class="nav justify-content-center">
    <li class="nav-item">
      <router-link class="nav-link btn btn-success text-light mx-2" to="category/Agriculture">
        <i class="bi bi-bag"></i> Agriculture
      </router-link>
    </li>
    <li class="nav-item">
      <router-link class="nav-link btn btn-dark mx-2 text-light" to="category/Renewable-Energy">
        <i class="bi bi-lightning-charge"></i> Renewable Energy
      </router-link>
    </li>
  </ul>
</div>



    </div>





    <!-- HOW IT WORKS 

    <div class=" mt-4 border border-bottom-dark bg-white"></div>

    <div class="container-xl row mx-auto my-5 bg-white pt-3">


      <div class="col-md-5 elementor-top-column elementor-element elementor-element-ce6f4c7" data-id="ce6f4c7"
        data-element_type="column">

        <div class="elementor-column-wrap elementor-element-populated">

          <div class="elementor-widget-wrap">


            <div class="elementor-element elementor-element-ccc6233 elementor-widget elementor-widget-listeo-headline"
              data-id="ccc6233" data-element_type="widget" data-widget_type="listeo-headline.default">

              <div class="text-dark mb-md-3">
                <h2 style="text-align:left;"
                  class="pb-2 secondary_heading h2 headline  headline-aligned-to-left  headline-box "> How It Works? </h2>
              </div>

            </div>

            <div class="elementor-element elementor-element-5df092b elementor-widget elementor-widget-listeo-iconbox"
              data-id="5df092b" data-element_type="widget" data-widget_type="listeo-iconbox.default">
              <div class="elementor-widget-container">

                <div class="icon-box-v3 row">

                  <div class="ibv3-icon col-sm-3">
                    <img width="60px" src="images/CreateAccountGreen.svg">
                  </div>


                  <div class="ibv3-content col-sm-9">
                    <h4>Create an Account</h4>
                    <p>Create an Account as as Investor or Business Owner</p>
                  </div>

                </div>

              </div>
            </div>

            <div class="elementor-element elementor-element-9169400 elementor-widget elementor-widget-listeo-iconbox"
              data-id="9169400" data-element_type="widget" data-widget_type="listeo-iconbox.default">
              <div class="elementor-widget-container">

                <div class="icon-box-v3 row">
                  <div class="ibv3-icon col-sm-3">
                    <img width="60px" src="images/AddInvestGreen.svg">
                  </div>
                  <div class="ibv3-content col-sm-9">
                    <h4>Add/Invest in a Listing</h4>
                    <p>Add a Listing( Your Business) or Invest in a listing</p>
                  </div>
                </div>
              </div>

            </div>


            <div class="elementor-element elementor-element-b9196ce elementor-widget elementor-widget-listeo-iconbox"
              data-id="b9196ce" data-element_type="widget" data-widget_type="listeo-iconbox.default">
              <div class="elementor-widget-container">
                <div class="icon-box-v3 row">
                  <div class="ibv3-icon col-sm-3">
                    <img width="60px" src="images/ApplyForJitumeGreen.svg">
                  </div>

                  <div class="ibv3-content col-sm-9">
                    <h4>Apply For Jitume Show</h4>
                    <p>You can a apply for a chance to get covered in the JITUME SHOW</p>
                  </div>
                </div>
              </div>
            </div>


          </div>

        </div>


      </div>


      <div class="col-md-7 mt-5 mt-md-0 pl-md-5">
        <div class="text-dark mb-md-3">
          <h2 style="text-align:left;" class="secondary_heading h2 headline  headline-aligned-to-left  headline-box pb-2">
            The Show </h2>
        </div>
        <video poster="images/video_preview.png" style="" class="video_player elementor-video" src="videos/Jitume.mp4"
          controls="" controlslist="nodownload"></video>
      </div>

    </div>
     How it works  -->

    <!--<div class="container-md-xl row mx-auto my-2 bg-white pt-3">
      <hr>
       <div class="pt-1  w-75 mx-auto">
        <h2 style="text-align:left;" class="container-xl secondary_heading"> Latest Businesses </h2>
      </div> -->

      <!--     <div class="card-group my-2 w-75 mx-auto d-md-flex justify-content-center">

        <div v-for="( result, index ) in results" class=" listing col-md-3">
          <router-link :to="`/listingDetails/${result.id}`" class="shadow card border px-2">

            <video v-if="result.file" controls style="width:100%; height:104px;" alt="">
              <source :src="result.file" type="video/mp4">
            </video>

            <img v-else :src="result.image" style="width:100%; height:104px" class="card-img-top" alt="" />

            <div class="p-1 pb-2">

              <h5 class="card_heading mb-0 py-2">{{ result.name }} </h5>

              <p class="card_text pt-1 text-left"><i class="mr-2 fa fa-map-marker"></i>{{ result.location }}</p>

              <p class="card_text"><span class="rounded"><i class="mr-2 fa fa-phone"></i>{{ result.contact }}</span></p>

            </div>

            <div class="amount p-1 pb-0">
              <p class="font-weight-bold">Amount: <span class="font-weight-light"><b>${{ result.investment_needed
              }}</b></span></p>
            </div>

          </router-link>

        </div>

      </div> -->

    
     <!--- <div style="overflow:hidden;" class="row card-group px-3 w-75 mx-auto d-md-flex justify-content-center">
        <hooper :settings="hooperSettings" :itemsToShow="4" :centerMode="true" pagination="no">
          <slide class="listing text-center col-md-4 px-4" v-for="( result, index ) in results" :key="index"
            :index="index">
            <!-- Loop 
            <div class="mx-auto mt-4">
              <router-link :to="`/listingDetails/${result.id}`" class="shadow card border px-2 pt-2">

                <video v-if="result.file" controls style="width:95%; height:114px;" alt="">
                  <source :src="result.file" type="video/mp4">
                </video>

                <img v-else :src="result.image" style="width:90%; height:118px;" class="card-img-top mx-auto" alt="" />

                <div class="px-3 pb-2">

                  <h5 class="card_heading text-left mb-0 py-2">{{ result.name }} </h5>

                  <p class="loc_p card_text pt-1 text-left"><i class="mr-2 fa fa-map-marker"></i>{{ result.location }}</p>

                  <p class="card_text"><span class="rounded"><i class="mr-2 fa fa-phone"></i>{{ result.contact }}</span>
                  </p>

                </div>

                <div class="amount px-3 pb-0">
                  <p class="font-weight-bold">Amount: <span class="font-weight-light"><b>${{ result.investment_needed
                  }}</b></span></p>
                </div>

              </router-link>
            </div>-->
            <!-- Loop 

          </slide>

          <hooper-navigation slot="hooper-addons"></hooper-navigation>
        </hooper>

      </div> 


    </div>-->

    <!-- HOW IT WORKS -->

    <div class=" mt-4 border border-bottom-dark bg-white"></div>

    <div class="container-xl row mx-auto my-5 bg-white pt-3">


      <div class="elementor-top-column elementor-element elementor-element-ce6f4c7" data-id="ce6f4c7"
        data-element_type="column">

        <div class=" elementor-column-wrap elementor-element-populated">

          <div class="elementor-widget-wrap row">

            <div class=" elementor-element elementor-element-ccc6233 elementor-widget elementor-widget-listeo-headline"
              data-id="ccc6233" data-element_type="widget" data-widget_type="listeo-headline.default">

              <div class="text-dark mb-md-3" style="margin-bottom: 30px;">
                <h3 style="text-align:center;"
                  class="pb-2 secondary_heading h2 headline  headline-aligned-to-left  headline-box "> How Jitume Works?
                </h3>
              </div>

            </div>

            <div class="elementor-element elementor-element-5df092b elementor-widget elementor-widget-listeo-iconbox"
              data-id="5df092b" data-element_type="widget" data-widget_type="listeo-iconbox.default">
              <div class="elementor-widget-container">

                <div class="icon-box-v3 row mx-auto">

                  <div class="col-sm-1"></div>

                  <div class="ibv3-icon col-sm-2 text-center">
                    <img width="75px" height="75px" src="images/randomIcons/loc.png">
                    <p class="text-center mt-3 small">Enter Your Location</p>
                  </div>


                  <div class="ibv3-icon col-sm-2 text-center">
                    <img width="75px" height="75px" src="images/randomIcons/cat.png">
                    <p class="text-center mt-3 small">Choose a Category</p>
                  </div>

                  <div class="ibv3-icon col-sm-2 text-center">
                    <img width="75px" height="75px" src="images/randomIcons/results.png">
                    <p class="text-center mt-3 small">Get Results in Your Yocation</p>
                  </div>

                  <div class="ibv3-icon col-sm-2 text-center">
                    <img width="75px" height="75px" src="images/randomIcons/choose.png">
                    <p class="text-center mt-3 small">Choose Your Business</p>
                  </div>

                  <div class="ibv3-icon col-sm-2 text-center">
                    <img width="75px" height="75px" src="images/randomIcons/grow.png">
                    <p class="text-center mt-3 small">Grow Your Business Together</p>
                  </div>

                  <div class="col-sm-1"></div>

                </div>

              </div>
            </div>


          </div>





  <section id="about-us" class="py-5  pt-3" style="margin-top: 40px;">

  <div class="container">
    <div class="row">
      <div class="col-md-6">
        <img src="https://img.freepik.com/free-photo/low-angle-man-with-sunglasses-taking-selfie_23-2148666533.jpg?t=st=1713210483~exp=1713214083~hmac=0bb6bbb572bb457373fff1c7deabfad09fcfe6e57920ec0b1e25c6dbb8f8aa2d&w=996" class="img-fluid" alt="About Us">
      </div>
      <div class="col-md-6 mt-4 mt-md-0">
        <h2>About Jitume</h2>
        <p>Jitume is more than just a business directory. We're a community-driven platform that connects local businesses with customers in a meaningful way. Our mission is to empower businesses and consumers alike by providing a platform that fosters growth, innovation, and collaboration.</p>
        <p>With Jitume, you can discover new businesses, read reviews, and find the perfect services for your needs. Whether you're a business owner looking to expand your reach or a customer seeking local services, Jitume is here to help you connect with your community.</p>
        <div>      <button class="btn btn-danger btn-rounded px-5 my-4">Explore</button></div>
      </div>

    </div>
  </div>
</section>


<section class="bg-light py-5">
  <div class="container">
    <h2 class="text-center mb-5">Unlock Your Organization's Impact Potential</h2>
    <div class="row">
      <div class="col-md-6">
        <h3>Jitume Partnerships</h3>
        <p>Jitume partners with businesses and organizations to make an even greater impact on communities around the world. By partnering with Jitume, you can create a more connected and efficient business ecosystem, empowering communities and driving growth.</p>
        <p><strong>Join Jitume today to unlock your organization's impact potential!</strong></p>
      </div>
      <div class="col-md-6">
        <img src="https://img.freepik.com/premium-photo/symbol-business-goal-business-target-icon-goal-achievement-symbol-business-vision-corporate-o_980716-77129.jpg?w=740" alt="Partner with Jitume" class="img-fluid rounded">
      </div>
    </div>
  </div>
</section>



<section class="bg-dark text-white py-5" style="margin-right: 40px;">
  <div class="container d-flex-col justify-content-center align-items center">
    <h2 class="text-center mb-5 text-success">Testimonials</h2>
    <div class="row py-4">
      <div class="col-md-4">
        <div class="text-center">
          <h4>Maria Rodriguez</h4>
          <p>"Working with Jitume has been a game-changer for my business. The platform helped me connect with new customers and grow my revenue."</p>
        </div>
      </div>
      <div class="col-md-4">
        <div class="text-center">
          <img src="https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTl8fG1hbiUyMHByb2ZpbGV8ZW58MHx8MHx8fDA%3D" alt="User 2" class="rounded-circle mb-3" style="width: 100px;">
          <h4>Jamal Washington</h4>
          <p>"I've been using Jitume for a while now, and I'm impressed by the quality of service and the range of businesses available. Highly recommended!"</p>
        </div>
      </div>
      <div class="col-md-4">
        <div class="text-center">
          <h4>Ling Wong</h4>
          <p>"Jitume has made it easy for me to find local businesses that meet my needs. I love supporting my community through this platform."</p>
        </div>
      </div>
    </div>
  </div>
</section>



<section class="text-center py-5" style="background-color: #f8f9fa; ">
    <div class="container-fluid">
        <h2 class="display-4 mb-4">Grow Your Business with Jitume</h2>
        <p class="lead mb-4">Jitume offers innovative solutions to help your business thrive. Join us today and experience the difference.</p>
        <a href="#" class="btn btn-success btn-lg">Start Growing</a>
    </div>
</section>

<section class="bg-light py-5"style="margin-top:30px;">
  <div class="container-fluid text-center">
    <h2>Subscribe to Our Newsletter</h2>
    <p class="text-center">Get the latest updates and offers delivered straight to your inbox.</p>
    <form class="mt-4">
      <div class="input-group mx-auto" style="max-width: 400px;">
        <input type="email" class="form-control" placeholder="Your Email Address" aria-label="Your Email Address" aria-describedby="button-addon2">
        <button class="btn btn-primary" type="button" id="button-addon2">Subscribe</button>
      </div>
    </form>
  </div>
</section>



  </div>


      </div>




      <!-- <div class="row w-75 mx-auto my-5  pl-md-5">
        <div class="text-dark mb-md-3">
          <h2 style="text-align:center;" class="secondary_heading h2 headline  headline-aligned-to-left  headline-box pb-2">
            The Show </h2>
        </div>
        <video poster="images/video_preview.png" style="" class="video_player elementor-video" src="videos/Jitume.mp4"
          controls="" controlslist="nodownload"></video>
      </div> -->

    </div>
    <!-- How it works -->



    <div class="py-5 d-md-flex  border-bottom-dark"></div>
    <div class="py-5 d-md-flex  border border-bottom-dark"></div>


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
  props: ['auth_user', 'business'],
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
    results: [],
    form: new Form({
      listing_name: '',
      search: '',
      categories: '',

    }),
    checkListing: '',
    serviceDetails: '',
    milestone: '',
    service_milestone:'',
    commit: '',
    projectManagers:''

  }),


  created() {
    //console.log(this.auth_user);
    this.checkListing = sessionStorage.getItem('invest');
    if (this.checkListing != null)
      this.$router.push(`listingDetails/${this.checkListing}`)

    this.serviceDetails = sessionStorage.getItem('serviceDetails');
    if (this.serviceDetails != null)
      this.$router.push(`serviceDetails/${this.serviceDetails}`)

    this.milestone = sessionStorage.getItem('milestone');
    this.milestoneS = sessionStorage.getItem('milestoneS');
    this.projectManagers = sessionStorage.getItem('projectManagers');
    if (this.milestone != null)
      this.$router.push(`business-milestone/${this.milestone}`);

     if (this.projectManagers != null || this.projectManagers)
      this.$router.push(`projectManagers/${this.projectManagers}`);

    else if (this.milestoneS != null)
      this.$router.push(`service-milestone/${this.milestoneS}`);


    //CALL ACTION
    $('#call_to').html('');
    $('#call_to').html('<a onclick="c_to_action();" data-target="#loginModal" data-toggle="modal" style="color:black;" class="header_buttons px-sm-3 my-1 px-1 py-1 mx-1 d-inline-block small text-center" ><span id="c_to_ac">Add Your Business</span></a> ');
  },


  methods: {

    async search() {
      const response = await this.form.post('search');
      console.log(response.data);
      toastr.success(response.data.success, { timeout: 5000 });
      //this.$router.push('/manage-category');
      //this.$router.push({name: 'listingSearch', params: { id: 1 }})

    },

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

          sessionStorage.setItem('queryLat',lat);
          sessionStorage.setItem('queryLng',lng);
          thiss.$router.push({ name: 'listingResults', params: { results: btoa(ids),loc:response.loc } })
        },
        error: function (response) {
          //console.log(response);
        }
      });
    },

    latBusiness: function () {
      let t = this;
      axios.get('latBusiness').then((data) => {
        t.results = data.data.data;
        for (const [key, value] of Object.entries(t.results)) {                   
                    value.id = btoa(value.id);
                    value.id = btoa(value.id);
                   //console.log(value.id);
                }

        //console.log(data);
      }).catch((error) => { })
    },

    routerPush: function () {
      this.commit = sessionStorage.getItem('commit');
      if (this.commit != null)
        this.$router.push(`business-milestone/${this.commit}`);
    }

    // initAutocomplete: function(){
    //   const input = document.getElementById("pac-input");
    //   const searchBox = new google.maps.places.SearchBox(input);
    //   searchBox.addListener("places_changed", () => {
    //   const places = searchBox.getPlaces();
    //   if (places.length == 0) { return; }
    //   const bounds = new google.maps.LatLngBounds();

    //   places.forEach((place) => {
    //     if (!place.geometry || !place.geometry.location) {
    //     console.log("Returned place contains no geometry");return; }
    //      console.log(place); 
    //   const lat = document.getElementById('lat');
    //   const lng = document.getElementById('lng');
    //   //lat.value = place.geometry.viewport.mb.hi;
    //   //lng.value = place.geometry.viewport.Oa.hi;

    //   lat.value = place.geometry.location.lat();
    //   lng.value = place.geometry.location.lng();

    //    }); });
    // }

  },

  mounted() {
    this.latBusiness();
    this.routerPush();
    
    //GOOGLE VAR
  //   let initializeWhenGoogleIsAvailable = () => {
  //     if (google) { // test if google is available
  //       this.initAutocomplete(); // if it is, then initalize
  //     } else {
  //       setTimeout(initializeWhenGoogleIsAvailable, 2000) // if it isn't, wait a bit
  //      }
  //    };
  // initializeWhenGoogleIsAvailable();
   //GOOGLE VAR

    //this.initAutocomplete();
    


  }


}
</script>
