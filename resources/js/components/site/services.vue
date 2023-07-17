<template>
    <div class="container" id="">
     


<!-- PAGE CONTENT -->
<div class="mb-5 row service_img mx-auto text-center" style="min-height:500px">
  
   <div class=" col-sm-12 text-center" style="">

         <div class="py-5"></div>
         <div class="mt-5 mb-4 w-50 mx-auto text-center">   
         <h2 style="font-size: 60px;
    font-weight: bold;
    font-style: normal;text-shadow: 3px 3px #2a2a2c ; " class="text-light ">Looking for...
       </h2> 
     </div>

                             <form id="form" @submit.prevent ="search();" class=" w-100" method="post">
                            <div style="width:85%;" class=" mx-auto text-center row py-4 rounded text-center">

                            <div style="border-radius: 35px 0 0 35px;" class="py-2 col-sm-3 bg-white">
                              <input  required=""  style="border: none;height: 42px;" class="bar bg-white form-control d-inline" type="text" name="listing_name" placeholder="What are you looking for?"></div>

                              <div style="" class="py-2 col-sm-3 bg-white">
                              <input id="searchbox" required="" onkeyup="suggest(this.value);" style="border: none;height: 42px;" class="bar bg-white form-control d-inline" type="text" name="search" value=""placeholder="Location">

                          </div>

                          <div class="py-2 col-sm-3 bg-white">
                          <div class="dropdown">

           <select  name="category" class="mt-2 border-none form-control">    
           <option hidden class="form-control" >Services</option>
           <option class="form-control" value="Business Planning" >Business Planning</option>
           <option value="IT" >IT</option>
           <option value="Legal Project Management" >Legal Project Management</option>
           <option value="Branding and Design" >Branding and Design </option>
           <option value="Auto" >Auto</option>
           <option value="Finance, Accounting & 
                Tax Marketing" >Finance, Accounting & 
                Tax Marketing</option>
           <option value="Tax Marketing">Tax Marketing</option>
           <option value="Public Relations">Public Relations</option>
           <option value="Other" >Other</option> 

           </select>

                        </div>
                        </div>

                            <div style="border-radius: 0 35px 35px 0;" class="bg-white col-sm-3 py-2 ">
                                <button  class="px-sm-3 px-1 searchListing  float-right" type="submit">Search</button>
                            </div>

                               </div>               

                            <div class="row" style="">
                                <div id="result_list" class="text-left" style="display: none;width:32%; z-index: 1000;height: 600px;position: absolute; margin-left: 378px;top: 330px;">
                                    
                                </div>
                            </div>
  
                        </form>
                        </div>

</div>

<!-- PAGE CONTENT -->

    

               </div>
   
</template>

<script>
   
export default {
    props: ['auth_user'],
    data: () => ({
    res:[],
    emptyCat:false
    }),

    created(){
    console.log(this.$router.currentRoute.path);
    document.getElementById('c_to_ac').innerHTML = 'Add Your Service';
    $('#call_to').html('');
    $('#call_to').html('<a onclick="c_to_actionS();" data-target="#loginModal" data-toggle="modal" style="background: #72c537; border-radius: 15px;cursor: pointer;font-size: 11px; " class="text-light px-sm-3 my-1 px-1 py-1 ml-5 d-inline-block small text-center" ><span style="font-weight:bolder;" id="c_to_ac">Add Your Service</span></a> ');

    

    },
    methods:{
    
    search(){
    const form = $('#form');
    var thiss = this;
    var ids='';

    $.ajax({
    url:'searchService',
    method:'POST',
    headers:{'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content')},
    dataType:'json',
    data:form.serialize(),
    success: function (response) {
    console.log(response);

    Object.entries(response.results).forEach(entry => {
    const [index, row] = entry; 
    ids = ids+row.id+',';      
    });//console.log(ids);

    //thiss.$router.push({ path: '/listingResults', query: { result: response } })
    thiss.$router.push({ name: 'serviceResults', params: { results: ids}})
    },
    error: function (response) {
    console.log(response);
    }
    });
    },


    replaceText(){
    if(this.$router.currentRoute.path == '/services' ||
     this.$router.currentRoute.path == '/serviceResults'){
    $('#call_to').html('');
    $('#call_to').html('<a onclick="c_to_actionS();" data-target="#loginModal" data-toggle="modal" class="header_buttons text-light px-sm-3 my-1 px-1 py-1 ml-5 d-inline-block small text-center" ><span  id="c_to_ac">Add Your Service</span></a> ');
    }
    }

  },
  
mounted() { 
     //return this.$store.dispatch("fetchpro")
     this.replaceText();
      } 

    }
</script>
