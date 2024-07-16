<template>
  <div class="w-full px-0" style="overflow:hidden;">
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
<div class="lg:flex justify-center items-center mx-auto w-full lg:w-[832.55px] h-[406.54px] my-[20px]">
  <!-- Text on the left -->
  <div class="w-[338px] h-[371px] flex flex-col gap-[24px] px-6">
    <h2 class="text-[25px] text-black font-bold mb-4">Welcome to Jitume</h2>
    <h3 class="text-[28px] text-black font-extrabold py-4">Real businesses, real <br>solutions, <span class="text-green-800 text-[30px]">real change</span></h3>
    <h3 class="font-bold text-[20px] pb-6">Invest in a business you believe in with as little as $100</h3>
    <div>
      <button data-target="#loginModal" data-toggle="modal" class="join w-[125px] h-[50px] font-bold text-slate-100 rounded-[14px] px-6 py-3">Join today</button>
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
<div class="flex flex-col sm:flex-row lg:flex-row lg:justify-center sm:justify-start items-center gap-4 sm:gap-16 px-2">
    <div class="my-2">
        <div class="flex items-center">
        <input class="py-2 px-4 rounded-full border border-black w-[250px] focus:outline-none focus:ring-0 focus:border-transparent" type="text" name="listing_name" placeholder="What are you looking for?">
    </div>
    </div>

    <div class="my-2">
      <div class="relative">
    <input id="searchbox" onkeyup="suggest(this.value);" class="py-2 px-4 w-[250px] border border-gray-300 rounded-full focus:outline-none focus:ring-0 focus:border-transparent" type="text" name="search" value="" placeholder="Location">
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



        <div class="w-[162px] my-2">
  <div class="relative">
    <select id="category" name="category"
      class="py-2 px-4 w-full border border-gray-300 rounded-full appearance-none">
      <option value="">Category</option>
<option value="Agriculture">Agriculture</option>
<option value="Arts/Culture">Arts/Culture</option>
<option value="Auto">Auto</option>
<option value="Domestic (Home Help etc)">Domestic (Home Help etc)</option>
<option value="Fashion">Fashion</option>
<option value="Finance/Accounting">Finance/Accounting</option>
<option value="Food">Food</option>
<option value="Legal">Legal</option>
<option value="Media/Internet">Media/Internet</option>
<option value="Other">Other</option>
<option value="Pets">Pets</option>
<option value="Real State">Real State</option>
<option value="Retail">Retail</option>
<option value="Security">Security</option>
<option value="Sports/Gaming">Sports/Gaming</option>
<option value="Technology/Communications">Technology/Communications</option>

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


        <div class="w-12 h-12 my-2 hover:bg-green-600 hover:shadow-lg bg-green-700 rounded-[50%] flex items-center justify-center">
          <button type="submit" class="py-2 px-6  text-white hover:text-green-700 rounded-full"><i class="fa fa-search"></i></button>
        </div>
      </div>
      <!-- End of Search Options and Button Section -->


  <input type="text" name="lat" id="lat" hidden value="">
  <input type="text" name="lng" id="lng" hidden value="">    
    </form>

    <div class="my-5 py-0">
  <ul class="nav justify-content-center">
    <li class="nav-item">
      <router-link class="nav-link join rounded-md bg-green-700 text-white hover:text-black mx-2" to="category/Agriculture">
        <i class="bi bi-bag"></i> Agriculture
      </router-link>
    </li>
    <li class="nav-item">
      <router-link class="nav-link join rounded-md bg-black mx-2 text-white hover:text-green-700" to="category/Renewable-Energy">
        <i class="bi bi-lightning-charge"></i> Renewable Energy
      </router-link>
    </li>
  </ul>




</div>





    

  </div>
</div>
</div>
<div class="text-center pb-0">
  <div id="category-slider" class="carousel slide">
    <div class="list">
      <ul class="d-flex list-unstyled  justify-content-center text-black py-0 my-0 flex-wrap pt-2">
        <li class="border border-gray-300 text-black  rounded-md p-0.5 mx-1 hover:text-green-700"><router-link to="category/Arts-Culture" class="text-decoration-none">Arts/Culture</router-link></li>
        <li class="border border-gray-300 text-black  rounded-md p-0.5 mx-1 hover:text-green-700"><router-link to="category/Auto" class="text-decoration-none">Auto</router-link></li>
        <li class="border border-gray-300 text-black rounded-md p-0.5 mx-1 hover:text-green-700"><router-link to="category/Domestic_Home" class="text-decoration-none">Domestic (HomeHelp etc)</router-link></li>
        <li class="border border-gray-300 text-black rounded-md p-0.5 mx-1 hover:text-green-700"><router-link to="category/Fashion" class="text-decoration-none">Fashion</router-link></li>
        <li class="border border-gray-300 text-black rounded-md p-0.5 mx-1 hover:text-green-700"><router-link to="category/Finance-Accounting" class="text-decoration-none">Finance/Accounting</router-link></li>
        <li class="border border-gray-300 text-black rounded-md p-0.5 mx-1 hover:text-green-700"><router-link to="category/Food" class="text-decoration-none">Food</router-link></li>
        <li class="border border-gray-300 text-black rounded-md p-0.5 mx-1 hover:text-green-700"><router-link to="category/Legal" class="text-decoration-none">Legal</router-link></li>
      </ul>
    </div>
    <div class="carousel-inner">
      <ul class="d-flex list-unstyled justify-content-center text-black py-0 my-0 flex-wrap pt-2">
        <li class="border border-gray-300 text-black rounded-md p-0.5 mx-1 hover:text-green-700"><router-link to="category/Media-Internet" class="text-decoration-none">Media/Internet</router-link></li>
        <li class="border border-gray-300 text-black rounded-md p-0.5 mx-1 hover:text-green-700"><router-link to="category/Pets" class="text-decoration-none">Pets</router-link></li>
        <li class="border border-gray-300 text-black rounded-md p-0.5 mx-1 hover:text-green-700"><router-link to="category/Retail" class="text-decoration-none">Retail</router-link></li>
        <li class="border border-gray-300 text-black rounded-md p-0.5 mx-1 hover:text-green-700"><router-link to="category/Real-State" class="text-decoration-none">Real Estate</router-link></li>
        <li class="border border-gray-300  text-black rounded-md p-0.5 mx-1 hover:text-green-700"><router-link to="category/Security" class="text-decoration-none">Security</router-link></li>
        <li class="border border-gray-300 text-black rounded-md p-0.5 mx-1 hover:text-green-700"><router-link to="category/Sports-Gaming" class="text-decoration-none">Sports/Gaming</router-link></li>
        <li class="border border-gray-300 text-black rounded-md p-0.5 mx-1 hover:text-green-700"><router-link to="category/Technology-Communications" class="text-decoration-none">Technology/Communications</router-link></li>
        <li class="border border-gray-300  text-black rounded-md p-0.5 mx-1 hover:text-green-700"><router-link to="category/Other" class="text-decoration-none">Other</router-link></li>
      </ul>
    </div>
  </div>
</div>



          </div>
          <!-- How it works -->






        </div>






        


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




 <!-- Your carousel HTML -->
<div  id="resource-slider" class="carousel  w-full mx-auto">
  <div class="carousel-inner w-[70%] mx-auto">
    <!-- Loop through your results to generate carousel items -->
    <div v-for="(result, index) in Math.ceil(results.length / 3)" :key="index" :class="{ 'carousel-item': true, 'active': index === 0 }">
      <div class="flex justify-center gap-2 px-3  items-center w-full">
        <!-- Loop through three cards for each carousel item -->
        <a :href="'./#/listingDetails/'+results[index * 3 + offset].id"  class="w-[300px] md:w-[calc(100% / 3 - 2rem)] px-2" v-for="offset in [0, 1, 2]" :key="index * 3 + offset" v-if="results[index * 3 + offset]">
         <div class="bg-white mt-4 w-[280px] h-[380px] mx-auto rounded-xl  p-3 mb-4 flex flex-col justify-between relative" style="box-shadow: rgba(50, 50, 105, 0.15) 0px 2px 5px 0px, rgba(0, 0, 0, 0.05) 0px 1px 1px 0px;">
    <div class="relative">
        <img :src="results[index * 3 + offset].image" alt="Image" class="w-[350px] h-[215px] object-cover rounded-[15px] ">
        <p class="absolute inset-t-0  ml-2 font-bold px-2 mr-5 rounded-xl bottom-2 bg-white/60 text-black text-start whitespace-nowrap py-1 text-xs">
            <i class="fa fa-map-marker pr-2"></i>{{ results[index * 3 + offset].location }}
        </p>
    </div>
    <footer class="text-sm text-gray-600">{{ results[index * 3 + offset].type }}</footer>
    <div class="flex flex-col justify-between px-1  gap-2">
        <div class="flex flex-col justify-between">
            <header>
                <h4 class="text-lg mt-2 hover:no-underline hover:text-green-800">{{ results[index * 3 + offset].name }}</h4>
            </header>
            <p class="text-sm text-gray-700">{{ results[index * 3 + offset].description }}</p>
            <!-- <p class="text-sm text-gray-700 whitespace-nowrap font-bold">Name: {{ results[index * 3 + offset].name }}</p> -->
            <p class="text-sm text-gray-700 whitespace-nowrap">Contact: {{ results[index * 3 + offset].contact }}</p>
<!-- <div class="amount px-3 pb-0">
    <p class="font-weight-bold">Amount: <span class="font-weight-light"><b>${{ results[index * 3 + offset].investment_needed }}</b></span></p>
</div> -->
<div
      class="text-black "
    >
      Amount Requested: <span class="font-bold text-black">${{ results[index * 3 + offset].investment_needed }}</span>
      <span class="text-xl"></span>



    

<div class="flex hidden  justify-start rounded-[8px] bg-green-700 hover:bg-green-800  hover:text-white  text-slate-100 py-2 ">
   <router-link :to="`/listingDetails/${results[index * 3 + offset].id}`">
       <button class="border-b-2 border-transparent hover:border-black focus:outline-none focus:border-black transition duration-300">Learn more</button>
<i class="fa fa-arrow-right" aria-hidden="true"></i>
    </router-link>
</div>



    </div>

    <!-- <button class="darksoul-hover-fill-button2" type="button"><div class="color-fill-2"></div><p>Button</p></button> -->

<div class="flex items-center gap-1">
  <p class="learn font-bold text-black text-green-700 py-2  rounded-full hover:text-green-700">
    <span class="underline">Learn more</span>
  </p>
  <i class="fa fa-chevron-right pt-1 text-black" aria-hidden="true"></i>
</div>
            <!-- <div class="hidden">
            <router-link :to="`/listingDetails/${results[index * 3 + offset].id}`" class="btn-learn-more  bg-green-800 hover:bg-green-700 text-white py-2 px-4 rounded text-base whitespace-nowrap mb-2">Learn More</router-link>
        </div> -->
        </div>
        
    </div>
</div>

        </a>
      </div>
    </div>
  </div>

  <!-- Carousel controls for manual scrolling -->
  <a class="carousel-control-prev mr-2 px-3 flex items-center justify-center" href="#resource-slider" role="button" data-slide="prev">
    <div class="bg-black rounded-full p-1 w-6 h-6 flex items-center justify-center">
      <span class="carousel-control-prev-icon text-white" aria-hidden="true"></span>
    </div>
    <span class="sr-only">Previous</span>
  </a>
  <a class="carousel-control-next px-3 flex items-center justify-center" href="#resource-slider" role="button" data-slide="next">
    <div class="bg-black rounded-full p-1 w-6 h-6 flex items-center justify-center">
      <span class="carousel-control-next-icon text-white" aria-hidden="true"></span>
    </div>
    <span class="sr-only">Next</span>
  </a>
</div>




<!--cards-->


<section> 
  <Slider/>
  
</section>


 



<section class="flex flex-col items-center w-[832.55px] mx-auto gap-8 space-y-8 pb-6 mt-6">
    <div class="how-it-works-header mt-4">
        <h3 class="text-[24px] font-bold">How Jitume Works</h3>
    </div>
    <div class="flex flex-col gap-6 lg:flex-row lg:justify-between px-[60px]">
        <div class="flex flex-col items-center">
            <div class="w-20 h-20 flex items-center justify-center rounded-full bg-[#EAF7EE] mb-2 mx-auto">
                <img src="images/location.png" alt="Location Icon" class="w-[32px] h-[42.18px]">
            </div>
            <p class="text-center text-[16px] text-[#000000] font-500">Enter Your Location</p>
        </div>
        <div class="flex flex-col items-center">
            <div class="w-20 h-20 flex items-center justify-center rounded-full bg-[#EAF7EE] mb-2 mx-auto">
                <img src="images/category.png" alt="Category Icon" class="w-[32px] h-[32px]">
            </div>
            <p class="text-center text-[16px] text-[#000000] font-500">Choose a category</p>
        </div>
        <div class="flex flex-col items-center">
            <div class="w-20 h-20 flex items-center justify-center rounded-full bg-[#EAF7EE] mb-2 mx-auto">
                <img src="images/locresults.png" alt="Location Results Icon" class="w-[32px] h-[32px]">
            </div>
            <p class="text-center text-[16px] text-[#000000] font-500">Get location results</p>
        </div>
        <div class="flex flex-col items-center">
            <div class="w-20 h-20 flex items-center justify-center rounded-full bg-[#EAF7EE] mb-2 mx-auto">
                <img src="images/choose.png" alt="Choose Business Icon" class="w-[32px] h-[42.01px]">
            </div>
            <p class="text-center text-[16px] text-[#000000] font-500">Choose your business</p>
        </div>
        <div class="flex flex-col items-center">
            <div class="w-20 h-20 flex items-center justify-center rounded-full bg-[#EAF7EE] mb-2 mx-auto">
                <img src="images/grow.png" alt="Grow Business Icon" class="w-[32px] h-[32px]">
            </div>
            <p class="text-center text-[16px] text-[#000000] font-500">Grow your business</p>
        </div>
    </div>
</section>


<div class="flex justify-center items-center my-6">
  <div class="p-4 flex gap-4 flex-col relative lg:w-3/4 xl:w-2/3 mx-4 md:mx-0">
    <div class="flex flex-col md:flex-row w-full md:w-auto justify-center items-center space-y-4 md:space-y-0 md:space-x-8">
      <div class="w-[390px] p-2 text-md text-center md:text-left">
        <p class="text-black ml-4 font-bold text-xl">
          <span class="text-[#198754]">100%</span> of your investment <br>goes to <span class="text-[#198754]">selected business.</span>
        </p>
      </div>

      <div class="w-[350px] md:w-auto flex justify-center">
        <img src="images/imageFrame.png" alt="Placeholder Image" class="w-[300px] h-[211px] md:max-w-md">
      </div>
    </div>
  </div>
</div>


<div class=" bg-[#F4FBF7] flex flex-col justify-center items-center  py-[40px] max-w-[1440px] mx-auto my-6 ">
  <div class="w-[334px] pt-6 text-center">
    
    
  <h2 class="text-[40px] font-bold text-black">Get started today!</h2>


  </div>

<button onclick="scrollToSection()"  class="bg-[#198754] unlock px-[10px] font-bold my-6 text-white rounded-[14px] w-[136px] h-[40px] py-[7px] text-sm text-center">
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

