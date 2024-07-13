<template>
    <div class="container bg-white" id="">

    
       <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/4.7.0/css/font-awesome.min.css">
       
                <h3 class="text-center font-weight-bold"><b class="h5 text-success" > </b> </h3>
       

         <div class="clear"></div>
       
         <div class="clear"></div>

            <div class="content_bottom">
                <div class="heading">
                     <h3 class="my-4 font-weight-bold text-center text-secondary">{{catName}} Business</h3>
                </div>
                <div class="clear"></div>
            </div>


            <!-- <div class="row">
                <div id="" class="col-sm-5 ml-3">
                <h4 class="btn-light px-2 py-1 mb-3">Filter by Turnover</h4>

                <div id="slider" class="">
                    
                </div>

                <div class="row mt-5">
                <div  class="col-sm-6 ">
                    <span id="price_low" class="form-control"  name="min" > </span>
                   </div>

                  <div  class="col-sm-6 ">
                    <span id="price_high" class="form-control"  name="min" > </span>

                   </div>
                </div>

                </div>
            </div> -->

             
         <div class="row flex justify-center mt-4 px-3">

             
                <div v-for="( result, index ) in results" class="listing col-sm-3 my-5">
                    <router-link :to="`/listingDetails/${result.id}`" class="shadow-sm rounded-[20px] card border px-3">

                     <video v-if="result.file" controls style="max-width:332px; height:230px" alt="">
                    <source :src="result.file" type="video/mp4">
                     </video> 

                     <img v-else :src="result.image" style="max-width:332px; height:230px" alt=""/>

                    <div class="p-1 pb-2">
                      <h5 class="card_heading mb-0 py-2">{{ result.name }} </h5>

                      <p class="card_text pt-1 text-left"><i class="mr-2 fa fa-map-marker"></i>{{ result.location }}</p>

                      <p class="card_text"><span class="rounded"><i class="mr-2 fa fa-phone"></i>{{ result.contact }}</span></p>
                    </div>

                    <div class="amount float-right text-left w-100 py-0 my-0">   
                        <h6 class="amount font-weight-bold" >Amount: <span class="font-weight-light"><b>${{result.investment_needed}}</b></span></h6>
                    </div>

                    </router-link>
                    
              </div>

              <div v-if = "empty" class="col-sm-12 mx-auto">
                <h4 class="bg-light py-4 text-center my-5">No Listing Available Under This Category!</h4>
             </div>
                </div>



<!-- 
         <div class="content_bottom">
                <div class="heading">
                     <h3 class="my-4 bg-light text-center text-secondary">Services</h3>
                </div>
                <div class="clear"></div>
            </div>

             
         <div class="row mt-4">

         <div v-if="this.services =='' && this.results ==''">
         <h3 class="text-center font-weight-bold btn-light btn py-3 d-block">No Results Found! </h3></div>
             
                <div v-for="( service, index ) in services" class="listing col-sm-4 my-5">
                    <router-link :to="`/servicegDetails/${service.id}`" class="shadow card border px-5">


                     <img :src="service.image" style="max-width:332px; height:230px" alt=""/>

                    <h4 class="mt-3 mb-0">{{service.name}} </h4>
                    <p class="my-1"><i class="mr-2 fa fa-map-marker"></i>{{service.location}}</p>
                    
                    </router-link>
                    
              </div>
                </div> -->
                
               
            </div>
           </div>
           

               </div>
   
</template>

<script>
   
export default {
    props: ['auth_user','app_url'],
    data: () => ({
    results:[],
    services:[],
    catName:'',
    empty:false
    }),


    methods:{
    setRes:function () {
            let t = this;
            this.catName = this.$route.params.name;
             //this.results = this.ids.split(",");
            axios.get('categoryResults/'+t.catName).then( (data) =>{
                t.results = data.data.data;

                for (const [key, value] of Object.entries(t.results)) {                   
                    value.id = btoa(value.id);
                    value.id = btoa(value.id);
                    console.log(value.id);
                }
                
                t.services = data.data.services;
                if(data.data.data.length == 0)
                    t.empty = true;;
              }).catch( (error) =>{})
        },

        getPhoto(){
   
        return '../';

        }
 
  },
  
   mounted() { 
   this.setRes()
   //this.range()
     //return this.$store.dispatch("fetchpro")
      } 

    }
</script>
