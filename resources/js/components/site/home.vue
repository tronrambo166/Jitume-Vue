<template>
  
  <div class="container-fluid px-0">
    
    <div class="home_bg" style="">
 

        <div class="heading">

        <div class="row" style="">

         <div class=" col-sm-12 text-center image" style="">

         <div class="my-4 w-50 mx-auto text-center">   
            <h4 style="font-size:27px; font-weight: 500px;" class="text-dark ">
             <!--  <marquee>Invest in Agriculture | Sports/Gaming | Real State | Entertainment | Auto | Finance/Accounting Security | Pets | Domestic Help | Other</marquee> -->
            </h4> 

            <h2 class="h2 text-center text-dark py-2">Your Platform To Invest In Local Businesses
            </h2>

 
          </div>

          <form id="form" @submit.prevent ="search();" class=" w-100" method="post">
              <div style="width:75%;" class=" mx-auto text-center row py-0 searchBar text-center">

              <!-- <div style="border-radius: 35px 0 0 35px;" class="py-2 col-sm-3 bg-white">
              <input  required=""  style="border: none;height: 42px;" class="bar bg-white form-control d-inline" type="text" name="listing_name" placeholder="What are you looking for?"></div> -->

                <div style="border-radius: 35px 0 0 35px;"  class="py-2 col-5 bg-white">
                    <input id="searchbox" required="" onkeyup="suggest(this.value);" style="border: none;height: 42px;" class="bar bg-white form-control d-inline" type="text" name="search" value="" placeholder="Location">

                </div>

                <div class="pt-2 col-4 bg-white">
                    <div class="dropdown pt-1">

                      <select  name="category" class="border-white form-control">
                        <option class="form-control small" >Category</option>

                        <option class="form-control" value="Agriculture" >Agriculture</option>
                        <option value="Arts / Culture" >Arts/Culture </option>
                        <option value="Auto" >Auto</option>
                        <option value="Sports/Gaming" >Sports/Gaming</option>
                        <option value="Real State" >Real State</option>
                        <option value="Food" >Food </option>
                        <option value="Legal" >Legal </option>
                        <option value="Security" >Security </option>
                        <option value="Media / Internet" >Media/Internet </option>
                          
                        <option value="Fashion" >Fashion </option>
                        <option value="Technology / Communications" >Technology/Communications </option>
                        <option value="Retail" >Retail </option>
                       
                        <option value="Finance/Accounting" >Finance/Accounting</option>
                        <option value="Pets">Pets</option>
                        <option value="Domestic (Home Help etc)">Domestic (Home Help etc)</option>
                        <option value="Other" >Other</option> 

                      </select>

                    </div>
                  </div>

                  <div style="border-radius: 0 35px 35px 0;" class="bg-white col-3 py-2 ">
                      <button  class="searchListing px-sm-3 px-1 float-right" type="submit">Search</button>
                  </div>

                </div>               

                <div class="row" style="">
                    <div id="result_list" class="text-left" style="display: none;width:30%; z-index: 1000;height: 600px;position: absolute; margin-left: 174px;top: 139px;">
                        
                    </div>
                </div>
  
            </form>
          </div>                

        </div> 
                    
      </div>


    <div class="row mt-4">

        <div class="cats text-center categories navbar navbar-expand-sm pb-0">
                                        
        <ul class=" navbar-nav mx-auto" >
            
            <li class="nav-item" > <router-link to="category/Agriculture">Agriculture </router-link></li> 
              <li class="nav-item" > <router-link to="category/Arts-Culture">Arts/Culture </router-link></li>
               <li class="nav-item" > <router-link to="category/Auto">Auto </router-link></li>    
                <li class="nav-item" > <router-link to="category/Domestic_Home">Domestic (HomeHelp etc) </router-link></li>
                <li class="nav-item" > <router-link to="category/Fashion">Fashion </router-link></li> 
                 <li class="nav-item" > <router-link to="category/Finance-Accounting">Finance/Accounting </router-link></li>  
                  <li class="nav-item" > <router-link to="category/Food">Food </router-link></li>
                   <li class="nav-item" > <router-link to="category/Legal">Legal  </router-link></li>  
                    <li class="nav-item" > <router-link to="category/Media-Internet">Media/Internet</router-link></li> 
                     <li class="nav-item" > <router-link to="category/Pets">Pets </router-link></li> 
                      <li class="nav-item" > <router-link to="category/Retail">Retail </router-link></li>

                 

           <li class="nav-item" > <router-link to="category/Real State">Real Estate </router-link></li>     
           
           
            <li class="nav-item" > <router-link to="category/Security">Security </router-link></li>    
             <li class="nav-item" > <router-link to="category/Sports-Gaming">Sports/Gaming </router-link></li>
               
                 
                <li class="nav-item" > <router-link to="category/Technology-Communications">Technology/Communications  </router-link></li>     
            
           <li class="nav-item" ><router-link to="category/Other">Other </router-link></li>   
           </ul>
            <br>
           

             </div>

             </div>

             <div class="categories cats py-0">
              <ul class="row text-center py-0">
                <li style="list-style-type:none;" class="nav-item py-0" > <router-link to="category/Renewable-Energy" class="py-0" style="color:#1ed73d;">Renewable Energy </router-link>
                </li>
              </ul>
            </div>


                      </div>




<!-- HOW IT WORKS -->

<div class=" mt-4 border border-bottom-dark bg-white"></div>

        <div class="row w-75 mx-auto my-5 bg-white">
          <div class="col-sm-5 elementor-top-column elementor-element elementor-element-ce6f4c7" data-id="ce6f4c7" data-element_type="column">
      <div class="elementor-column-wrap elementor-element-populated">
              <div class="elementor-widget-wrap">
            <div class="elementor-element elementor-element-ccc6233 elementor-widget elementor-widget-listeo-headline" data-id="ccc6233" data-element_type="widget" data-widget_type="listeo-headline.default">

        <div class="text-dark">
          <h3 style="font-family: system-ui; text-align:left;" class="text-dark headline  headline-aligned-to-left  headline-box "> How It Works? </h3>
        </div>

        </div>

        <div class="elementor-element elementor-element-5df092b elementor-widget elementor-widget-listeo-iconbox" data-id="5df092b" data-element_type="widget" data-widget_type="listeo-iconbox.default">
        <div class="elementor-widget-container">

        <div class="icon-box-v3 row">

        <div class="ibv3-icon col-sm-3">
        <img width="60px" src="images/CreateAccountGreen.svg">                  </div>


        <div class="ibv3-content col-sm-9">
          <h4>Create an Account</h4>
            <p>Create an Account as as Investor or Business Owner</p>
        </div>
      </div>

        </div>
        </div>
        <div class="elementor-element elementor-element-9169400 elementor-widget elementor-widget-listeo-iconbox" data-id="9169400" data-element_type="widget" data-widget_type="listeo-iconbox.default">
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
        <div class="elementor-element elementor-element-b9196ce elementor-widget elementor-widget-listeo-iconbox" data-id="b9196ce" data-element_type="widget" data-widget_type="listeo-iconbox.default">
        <div class="elementor-widget-container">
        <div class="icon-box-v3 row">
        <div class="ibv3-icon col-sm-3">
         <img width="60px" src="images/ApplyForJitumeGreen.svg">                   </div>
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

    <div class="col-sm-1"></div>


     <div class="col-sm-6">
      <div class="text-dark">
          <h3 style="font-family: system-ui; text-align:left;" class="text-dark headline  headline-aligned-to-left  headline-box "> The Show </h3>
        </div>
       <video style ="width:100%; height:auto;" class="elementor-video" src="videos/Jitume.mp4" controls="" controlslist="nodownload"></video>
     </div>
    
   </div>
   <!-- How it works -->

   <div class="row mt-4 w-75 mx-auto">
<hr>
         <div >
            <h3 style="text-align:left;" class="text-dark headline  headline-aligned-to-left  headline-box "> 
              Latest Businesses 
            </h3>
         </div>
             
                <div v-for="( result, index ) in results" class="listing col-sm-3 my-5">
                    <router-link :to="`/listingDetails/${result.id}`" class="shadow card border px-2">

                     <video v-if="result.file" controls style="width:332px; height:230px" alt="">
                    <source :src="result.file" type="video/mp4">
                     </video> 

                     <img v-else :src="result.image" style="width:100%; height:130px" alt=""/>

                    <h4 class="mt-3 mb-0">{{result.name}} </h4>
                    <p class="my-1"><i class="mr-2 fa fa-map-marker"></i>{{result.location}}</p>
                    <p><span class="mt-1 rounded"><i class="mr-2 fa fa-phone"></i>{{result.contact}}</span></p>
                    </router-link>
                    
              </div>
                </div>

   <div class="row mt-2 border border-bottom-dark"></div>


   </div>

</template>


<script>
   
export default {
    
  props: ['auth_user','business'],  
  data: () => ({
  results:[],
  form: new Form({
  listing_name:'',
  search:'',
  categories:'',
  
  }),
  checkListing:'',
  serviceDetails:'',
  milestone:'',
  commit:''

    }),


created() {
            console.log(this.auth_user);
            this.checkListing = sessionStorage.getItem('invest');
            if(this.checkListing!=null)
              this.$router.push(`listingDetails/${this.checkListing}`)

            this.serviceDetails = sessionStorage.getItem('serviceDetails');
            if(this.serviceDetails!=null)
              this.$router.push(`serviceDetails/${this.serviceDetails}`)

            this.milestone = sessionStorage.getItem('milestone');
            this.milestoneS = sessionStorage.getItem('milestoneS');
            if(this.milestone !=null)
              this.$router.push(`business-milestone/${this.milestone}`);

           else if(this.milestoneS !=null)
              this.$router.push(`service-milestone/${this.milestoneS}`);


      //CALL ACTION
      $('#call_to').html('');
      $('#call_to').html('<a onclick="c_to_action();" data-target="#loginModal" data-toggle="modal" class="header_buttons text-light px-sm-3 my-1 px-1 py-1 ml-5 d-inline-block small text-center" ><span id="c_to_ac">Add Your Business</span></a> ');
        },

  methods:{

  async search(){
  const response = await this.form.post('search');
  console.log(response.data);
  toastr.success(response.data.success, { timeout:5000 });
 //this.$router.push('/manage-category');
 //this.$router.push({name: 'listingSearch', params: { id: 1 }})

  },

search(){
const form = $('#form');
var thiss = this;
var ids='';

$.ajax({
url:'search',
method:'POST',
headers:{'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content')},
dataType:'json',
data:form.serialize(),
    success: function (response) {
    console.log(response);

    Object.entries(response.results).forEach(entry => {
           const [index, row] = entry; 
           ids = ids+row.id+',';      
          });console.log(ids);

          if(!ids) ids =0;

    //thiss.$router.push({ path: '/listingResults', query: { result: response } })
    thiss.$router.push({ name: 'listingResults', params: { results: ids}})
    },
    error: function (response) {
    console.log(response);
      }
});
  },

  latBusiness:function () {
            let t = this;
            axios.get('latBusiness').then( (data) =>{
                t.results = data.data.data;
                console.log(data);
              }).catch( (error) =>{})
        },

        routerPush:function(){
            this.commit = sessionStorage.getItem('commit');
            if (this.commit !=null)
              this.$router.push(`business-milestone/${this.commit}`);
        },

  },

  mounted() { 
   this.latBusiness();
   this.routerPush();
      } 

     
    }
</script>
