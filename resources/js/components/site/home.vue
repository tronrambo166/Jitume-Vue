<template>
  <div class="container-fluid px-0" style="overflow:hidden;">
    <div class="bg-white" style="">



      <div class="w-full ">



        <!--hero section-->
        <div class="bg-white relative my-8">
          <!-- Vector on the left -->
          <img src="images/left vector.png" class="absolute left-0 top-1/2 transform -translate-y-1/2 z-90"
            style="height: 100px; width: auto;">

          <!-- Vector on the right -->
          <img src="images/right vector.png" class="absolute right-0 top-1/3 transform -translate-y-1/2 z-10"
            style="height: 100px; width: auto;">

        <div class="my-4">
<div class="lg:flex justify-center items-center  mx-auto w-full lg:w-[832.55px] h-[406.54px] px-6 my-[20px]">
        <!-- Text on the left -->
        <div class="w-[338px] h-[371px] flex-wrap  flex-col gap-[24px] px-6">
            <h2 class="text-[20px] text-gray-500 font-bold mb-4">Welcome to Jitume</h2>
            <h3 class="text-[28px] text-black font-extrabold py-4">Real businesses, real  <br>solutions, <span
                    class="text-green-800 text-[30px]"> real change</span></h3>
            <h3 class="font-bold text-20px pb-6">Invest in a business you believe in with as little as $100</h3>

            <div>
                <button class="bg-green-800 w-[125px] h-[50px] text-slate-100 rounded-[14px] px-6 py-3">Join today</button>
            </div>

        </div>
<!-- Image on the right (hidden on small screens) -->
<div class="hidden md:block md:w-1/2 lg:block">
    <img src="images/Frame 859(1).png" alt="Your Image" class="w-[392.55px] h-auto rounded-lg">
</div>

    </div>
</div>




          <!-- HOW IT WORKS -->

          <!-- <div class="  border border-bottom-dark bg-white"></div> -->

          <!-- <div class="container-fluid row mx-auto my-5 bg-white pt-3">


            <div class="elementor-top-column elementor-element elementor-element-ce6f4c7 flex flex-col items-center"
              data-id="ce6f4c7" data-element_type="column">
              <div class="elementor-column-wrap elementor-element-populated flex flex-col items-center">

                <div class="elementor-widget-wrap row flex flex-col items-center">

                  <div
                    class="elementor-element elementor-element-ccc6233 elementor-widget elementor-widget-listeo-headline flex flex-col items-center"
                    data-id="ccc6233" data-element_type="widget" data-widget_type="listeo-headline.default">

                    <div class="text-dark mb-md-3" style="margin-bottom: 30px;">
                      <h3 style="text-align:center;"
                        class="pb-2 secondary_heading h2 headline headline-aligned-to-left headline-box py-4"> How
                        Jitume Works? </h3>
                    </div>

                  </div>

                  <div
                    class="elementor-element elementor-element-5df092b elementor-widget elementor-widget-listeo-iconbox"
                    data-id="5df092b" data-element_type="widget" data-widget_type="listeo-iconbox.default">
                    <div class="elementor-widget-container">

                      <div class="icon-box-v3 row mx-auto flex justify-center gap-6 my-6">

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
                          <p class="text-center mt-3 small">Get Results in Your Location</p>
                        </div>

                        <div class="ibv3-icon col-sm-2 text-center">
                          <img width="75px" height="75px" src="images/randomIcons/choose.png">
                          <p class="text-center mt-3 small">Choose Your Business</p>
                        </div>

                        <div class="ibv3-icon col-sm-2 text-center">
                          <img width="75px" height="75px" src="images/randomIcons/grow.png">
                          <p class="text-center mt-3 small">Grow Your Business Together</p>
                        </div>

                      </div>

                    </div>
                  </div>

                </div>

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
  <div class="w-full mt-8 ">

<h1 class="text-center font-bold py-4 text-[24px]">Your platform to invest in local businesses</h1>
<!--hero section Ends-->
<div class=" ">
  <div class="">

    <form id="form" @submit.prevent="search();" method="post">

      <!-- Search Options and Button Section -->
<div class="flex flex-col sm:flex-row lg:flex-row lg:justify-center sm:justify-start items-center gap-4 sm:gap-16 px-2">        <div class="w-[300px] my-2">
          <div class="flex items-center border border-black rounded-lg ">
            <input class="py-2 px-4 rounded-xl" type="text" name="listing_name"
              placeholder="What are you looking for?">
          
          </div>
        </div>

        <div class="w-[147px] my-2">
  <div class="relative">
    <input id="searchbox" onkeyup="suggest(this.value);"
      class="py-2 px-4 w-full border border-gray-300 rounded-full" type="text" name="search" value=""
      placeholder="Location">
    <div class="absolute inset-y-0 right-0 flex items-center pr-2 pointer-events-none">
      <svg class="h-4 w-4 fill-current text-gray-500" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
        <path
          d="M10 2a7 7 0 0 1 7 7c0 4.472-7 11-7 11S3 13.472 3 9a7 7 0 0 1 7-7zm0 2a5 5 0 0 0-5 5c0 2.142 3.094 6.333 5 8 1.906-1.667 5-5.858 5-8a5 5 0 0 0-5-5z" />
      </svg>
    </div>
  </div>
</div>


        <div class="w-[162px] my-2">
  <div class="relative">
    <select id="category" name="category"
      class="py-2 px-4 w-full border border-gray-300 rounded-full appearance-none">
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
    <div class="absolute inset-y-0 right-0 flex items-center px-2 pointer-events-none">
      <svg class="h-4 w-4 fill-current text-gray-500" xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 20 20">
        <path
          d="M10 12a1 1 0 0 1-.7-.29l-4-4a1 1 0 1 1 1.4-1.42L10 9.58l3.3-3.3a1 1 0 1 1 1.4 1.42l-4 4a1 1 0 0 1-.7.3z" />
      </svg>
    </div>
  </div>
</div>


        <div class="w-12 my-2 bg-green-700 rounded-full flex items-center justify-center">
          <button type="submit" class="py-2 px-6  text-white rounded-full"><i class="fa fa-search"></i></button>
        </div>
      </div>
      <!-- End of Search Options and Button Section -->


      
    </form>

    <div class="my-5 py-0">
  <ul class="nav justify-content-center">
    <li class="nav-item">
      <router-link class="nav-link btn btn-success text-light mx-2" to="category/Agriculture">
        <i class="bi bi-bag"></i> Agriculture
      </router-link>
    </li>
    <li class="nav-item">
      <router-link class="nav-link btn bg-black mx-2 text-light" to="category/Renewable-Energy">
        <i class="bi bi-lightning-charge"></i> Renewable Energy
      </router-link>
    </li>
  </ul>

<div class="w-full mt-8">
  <h1 class="text-center font-bold py-4 text-[24px]">Your platform to invest in local businesses</h1>
  <div class="">
    <form id="form" @submit.prevent="search();" method="post">
      <!-- Search Options and Button Section -->
      <div class="flex flex-col sm:flex-row lg:flex-row lg:justify-center sm:justify-start items-center gap-4 sm:gap-16 px-2">
        <div class="w-[300px] my-2">
          <div class="flex items-center border border-black rounded-lg ">
            <input class="py-2 px-4 rounded-xl" type="text" name="listing_name" placeholder="What are you looking for?">
          </div>
        </div>
        <div class="w-[147px] my-2">
          <div class="relative">
            <input id="searchbox" onkeyup="suggest(this.value);" class="py-2 px-4 w-full border border-gray-300 rounded-full" type="text" name="search" value="" placeholder="Location">
            <div class="absolute inset-y-0 right-0 flex items-center pr-2 pointer-events-none">
              <svg class="h-4 w-4 fill-current text-gray-500" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
                <path d="M10 12a1 1 0 0 1-.7-.29l-4-4a1 1 0 1 1 1.4-1.42L10 9.58l3.3-3.3a1 1 0 1 1 1.4 1.42l-4 4a1 1 0 0 1-.7.3z" />
              </svg>
            </div>
          </div>
        </div>
        <div class="w-[162px] my-2">
          <div class="relative">
            <select id="category" name="category" class="py-2 px-4 w-full border border-gray-300 rounded-full appearance-none">
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
            <div class="absolute inset-y-0 right-0 flex items-center px-2 pointer-events-none">
              <svg class="h-4 w-4 fill-current text-gray-500" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
                <path d="M10 12a1 1 0 0 1-.7-.29l-4-4a1 1 0 1 1 1.4-1.42L10 9.58l3.3-3.3a1 1 0 1 1 1.4 1.42l-4 4a1 1 0 0 1-.7.3z" />
              </svg>
            </div>
          </div>
        </div>
        <div class="w-12 my-2 bg-green-700 rounded-full flex items-center justify-center">
          <button type="submit" class="py-2 px-6  text-white rounded-full"><i class="fa fa-search"></i></button>
        </div>
      </div>
      <!-- End of Search Options and Button Section -->
    </form>

    <div class="my-8 overflow-x-auto relative" style="scrollbar-width: none; -ms-overflow-style: none;">
      <div id="linksCarousel" class="carousel slide" data-ride="carousel">
        <div class="carousel-inner">
          <div class="carousel-item active">
            <ul class="flex list-none justify-center gap-4 text-black font-bold mx-2 py-2">
              <!-- First 6 links -->
              <li class="nav-item"><router-link to="category/Arts-Culture" class="hover:text-green-700">Arts/Culture</router-link></li>
              <li class="nav-item"><router-link to="category/Auto" class="hover:text-green-700">Auto</router-link></li>
              <li class="nav-item"><router-link to="category/Domestic_Home" class="hover:text-green-700">Domestic (HomeHelp etc)</router-link></li>
              <li class="nav-item"><router-link to="category/Fashion" class="hover:text-green-700">Fashion</router-link></li>
              <li class="nav-item"><router-link to="category/Finance-Accounting" class="hover:text-green-700">Finance/Accounting</router-link></li>
              <li class="nav-item"><router-link to="category/Food" class="hover:text-green-700">Food</router-link></li>
            </ul>
          </div>
          <div class="carousel-item">
            <ul class="flex list-none justify-center gap-2 text-black font-bold mx-4 py-2">
              <!-- Next 6 links -->
              <li class="nav-item"><router-link to="category/Legal" class="hover:text-green-700">Legal</router-link></li>
              <li class="nav-item"><router-link to="category/Media-Internet" class="hover:text-green-700">Media/Internet</router-link></li>
              <li class="nav-item"><router-link to="category/Pets" class="hover:text-green-700">Pets</router-link></li>
              <li class="nav-item"><router-link to="category/Retail" class="hover:text-green-700">Retail</router-link></li>
              <li class="nav-item"><router-link to="category/Real State" class="hover:text-green-700">Real Estate</router-link></li>
              <li class="nav-item"><router-link to="category/Security" class="hover:text-green-700">Security</router-link></li>
            </ul>
          </div>
          <!-- Add more carousel items as needed -->
        </div>
        <a class="absolute left-0 top-1/2 transform -translate-y-1/2 carousel-control-prev text-black" href="#linksCarousel" role="button" data-slide="prev">
          <i class="fas fa-chevron-left text-black"></i>
        </a>
        <a class="absolute right-0 top-1/2 transform -translate-y-1/2 carousel-control-next text-black" href="#linksCarousel" role="button" data-slide="next">
          <i class="fas fa-chevron-right text-black"></i>
        </a>
      </div>
    </div>
  </div>
</div>



</div>





    <!-- Search Results Section -->
    <div id="result_list" class="text-left search_results"></div>
    <!-- End of Search Results Section -->

  </div>
</div>
</div>





          </div>
          <!-- How it works -->






        </div>






        <div class="py-5 d-md-flex  border-bottom-dark"></div>
        <!-- <div class="py-5 d-md-flex  border border-bottom-dark"></div> -->


      </div>

 



    <!-- <div class="mt-4">

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

</div> -->










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




     <!-- <div class=" mt-4 border border-bottom-dark bg-white"></div>

 <div class="container-xl mx-auto my-5 bg-white pt-3">
    <div class="row">
        <div class="col-12">
            <h3  class="text-black py-6 font-bold mb-3 text-center text-2xl">How Jitume Works?</h3>
        </div>
    </div>
    <div class="row my-4">
        <div class="col-1"></div>
        <div class="col-2 text-center">
            <img src="images/randomIcons/loc.png" width="75px" height="75px" alt="">
            <p class="mt-8 small">Enter Your Location</p>
        </div>
        <div class="col-2 text-center">
            <img src="images/randomIcons/cat.png" width="75px" height="75px" alt="">
            <p class="mt-8 small">Choose a Category</p>
        </div>
        <div class="col-2 text-center">
            <img src="images/randomIcons/results.png" width="75px" height="75px" alt="">
            <p class="mt-8 small">Get Results in Your Location</p>
        </div>
        <div class="col-2 text-center">
            <img src="images/randomIcons/choose.png" width="75px" height="75px" alt="">
            <p class="mt-8 small">Choose Your Business</p>
        </div>
        <div class="col-2 text-center">
            <img src="images/randomIcons/grow.png" width="75px" height="75px" alt="">
            <p class="mt-8 small">Grow Your Business Together</p>
        </div>
        <div class="col-1"></div>
    </div>
</div>

    <!-- How it works --> 

<div id="myCarousel" class="carousel slide" data-ride="carousel">
  <!-- Indicators -->
  <ol class="carousel-indicators">
    <li data-target="#myCarousel" data-slide-to="0" class="active"></li>
    <li data-target="#myCarousel" data-slide-to="1"></li>
    <!-- Add more indicators as needed -->
  </ol>

  <!-- Wrapper for slides -->
  <div class="carousel-inner px-4 d-md-block">
    <!-- Loop through your results to generate carousel items -->
    <div v-for="(result, index) in Math.ceil(results.length / 3)" :key="index" :class="{ 'carousel-item': true, 'active': index === 0 }">
      <div class="flex flex-wrap justify-between rounded-full">
        <!-- Loop through three cards for each carousel item -->
        <div v-for="offset in [0, 1, 2]" :key="index * 3 + offset" v-if="results[index * 3 + offset]" class="max-w-sm rounded overflow-hidden shadow-lg mx-2 mb-4 sm:mb-0 md:w-1/2">
          <router-link :to="`/listingDetails/${results[index * 3 + offset].id}`" class="block">
            <img v-if="results[index * 3 + offset].file" :src="results[index * 3 + offset].file" alt="Placeholder Image" class="w-full h-48 object-cover rounded-xl">
            <img v-else-if="results[index * 3 + offset].image" :src="results[index * 3 + offset].image" alt="Placeholder Image" class="w-full h-48 object-cover rounded-lg">
            <img v-else src="https://via.placeholder.com/150" alt="Placeholder Image" class="w-full h-48 object-cover rounded-xl">
          </router-link>
          <div class="px-6 py-4">
            <div class="font-bold text-xl text-bold mb-2">{{ results[index * 3 + offset].name }}</div>
            <p class="text-gray-900 font-light text-base"><span class="text-gray-400 mr-2">
  <i class="fas fa-map-marker-alt"></i>
</span>
{{ results[index * 3 + offset].location }}</p>
            <p class="text-black text-base">{{ results[index * 3 + offset].contact }}</p>
            <p class="text-gray-900 text-base py-2">Amount: <span class="font-semibold text-green-600">${{ results[index * 3 + offset].investment_needed }}</span></p>
            <div class="flex justify-between items-center mt-4">
              <div>
                <span class="text-gray-400 mr-2">
                  <i class="fas fa-phone text-green-600"></i>
                </span>
                <span class="text-gray-700">{{ results[index * 3 + offset].contact }}</span>
              </div>
              <button class="bg-green-800 hover:bg-green-700 text-white font-bold py-2 px-4 rounded">
                View Details
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>

 <!-- Left and right controls -->
<a class="carousel-control-prev" href="#myCarousel" role="button" data-slide="prev">
  <div class="bg-black px-8 rounded-full">
  <i class="fas fa-chevron-left custom-icon text-green-700"></i>
  <span class="sr-only">Previous</span>
</div>

 
</a>
<a class="carousel-control-next" href="#myCarousel" role="button" data-slide="next">
  <div class="bg-black px-8 rounded-full">
    <i class="fas fa-chevron-right custom-icon text-green-700"></i>
    <span class="sr-only">Next</span>
  </div>
</a>



</div>









    











 

<section class="w- flex flex-col items-center  space-y-8 pb-6 my-6">
    <div class="how-it-works-header">
        <h3 class="text-[24px] font-bold">How Jitume Works</h3>
    </div>
   <div class="flex flex-col gap-4 lg:flex-row lg:justify-between px-[60px]">
    <div class="flex flex-col items-center">
        <div class="w-20 h-20 flex items-center justify-center rounded-full bg-[#EAF7EE;] mb-2 mx-auto">
            <img src="images/location.png" alt="Location Icon" class="w-[32px] h-[42.18px]">
        </div>
        <p class="text-center text-[16px] text-[#000000] font-500">Enter Your Location</p>
    </div>
    <div class="flex flex-col items-center">
        <div class="w-20 h-20 flex items-center justify-center rounded-full bg-[#EAF7EE;] mb-2 mx-auto">
            <img src="images/category.png" alt="Location Icon" class="w-[32px] h-[32px]">
        </div>
        <p class="text-center text-[16px] text-[#000000] font-500">Choose a category</p>
    </div>
    <div class="flex flex-col items-center">
        <div class="w-20 h-20 flex items-center justify-center rounded-full bg-[#EAF7EE;] mb-2 mx-auto">
            <img src="images/locresults.png" alt="Location Icon" class="w-[32px] h-[32px]">
        </div>
        <p class="text-center text-[16px] text-[#000000] font-500">Get location results</p>
    </div>
    <div class="flex flex-col items-center">
        <div class="w-20 h-20 flex items-center justify-center rounded-full bg-[#EAF7EE;] mb-2 mx-auto">
            <img src="images/choose.png" alt="Location Icon" class="w-[32px] h-[42.01px]">
        </div>
        <p class="text-center text-[16px] text-[#000000] font-500">Choose your business</p>
    </div>
    <div class="flex flex-col items-center">
        <div class="w-20 h-20 flex items-center justify-center rounded-full bg-[#EAF7EE;] mb-2 mx-auto">
            <img src="images/grow.png" alt="Location Icon" class="w-[32px] h-[32px]">
        </div>
        <p class="text-center text-[16px] text-[#000000] font-500">Grow your business</p>
    </div>
</div>

</section>



<div class="flex flex-col md:flex-row mx-auto w-full md:w-auto justify-center items-center my-8">

  <div class="w-[376px] p-8 text-md ">
    <p class="text-black p-4 font-bold  text-xl">
        <span class="text-[#198754] ">100%</span> of your investment <br>goes to<span class="text-[#198754]">selected business.</span>
    </p>
</div>



    <div class="md:w-1/2 p-4">
      <img src="images/imageFrame.png" alt="Placeholder Image" class="w-[368px] h-[211px] md:max-w-md mx-auto">
    </div>
  </div>







<div class="flex bg-[#F4FBF7] justify-center items-center flex-col py-[40px] max-w-[1440px] mx-auto">
  <div class="w-[334px] pt-6">
    
         <h2 class="text-[40px] font-bold text-black">Get started today!</h2>

  </div>

<button class="bg-[#198754] font-bold my-6 text-white rounded-[14px] w-[136px] h-[40px] py-[7px] text-sm text-center">
  Find a business
</button>



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
    service_milestone: '',
    commit: '',
    projectManagers: ''

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

          sessionStorage.setItem('queryLat', lat);
          sessionStorage.setItem('queryLng', lng);
          thiss.$router.push({ name: 'listingResults', params: { results: btoa(ids), loc: response.loc } })
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