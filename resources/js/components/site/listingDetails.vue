<template>
    <div class="container">
        
             
    
        <div class="heading row my-3"> 
        <div class="col-sm-7">
             <div class="grid images_3_of_2 rounded listing px-3">
                <img style="width:100%;height:405px" class="shadow card" 
                :src="form.image" alt="" />
                    
                 <div class="pl-2">
                    <h3 class="mt-2 text-left text-dark font-weight-bold ">{{form.name}} 
                    <div  class="float-right text-right w-25 py-0 my-0">   

                        <h6 class="font-weight-bold" >Amount: <span class="font-weight-light"><b>${{form.investment_needed}}</b></span></h6>
                    </div>
                </h3>

                     

                    <div v-if="auth_user" class="float-right w-25">
                     <div class="" style="background:#e5e5e9; height:21px;">
                         <span id="progress" class="d-block"></span>
                     </div>   
                      <span>{{share}}% Invested</span>
                    </div>
        
                        <p class="my-1"><i class="mr-2 fa fa-map-marker"></i>{{form.location}}</p>
                        </div>

                        <div class="row my-4">
                            <div class="col-sm-12">
                            <a class="btn border border-bottom-success">Overview</a>
                            <a class="btn border border-bottom-success">Add review</a>

                            <hr>
                            </div>
                            
                      
                <div class="Overview" id="Overview">
                    
                <div  class="w-75 eqp-invest my-4 text-left">
                <h4 class=" my-3">About Sodaa</h4>
                <p class=" small text-justify-center  ">Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip</p>
               </div>

                    <p><span class="mt-1 rounded"><i class="mr-2 fa fa-phone"></i>{{form.contact}}</span></p>
                    </div>

                      
                          </div>                                  

                    </div>

         </div> 

         <div class="col-sm-5">

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


          <div v-if="!form.conv" class="card bg-light w-75 mx-auto py-3">

                <h5 class="font-weight-bold ml-4 border border-light py-2 d-block ">Business Home Window <p class="d-inline "></p>
                </h5>

               <div v-if="auth_user" class="eqp-invest">
                <a data-target="#investModal" data-toggle="modal" class="business_btns py-2 text-center text-light buttonListing my-3">Unlock More Business Information To Invest</a>

                <!-- <router-link :to="`/subscribe/${form.listing_id}`" class="text-light text-center buttonListing my-3 py-2">Subscribe</router-link>

                <router-link :to="`/donate_eqp/${form.listing_id}`" class="text-light text-center buttonListing my-3 py-2">Donate</router-link>
                 -->

  <!-- INVEST MODAL -->
  <div  class="modal d-block" id="investModalShow" tabindex="-1" role="dialog" aria-labelledby="exampleModalLabel" aria-hidden="true">
  <div class="modal-dialog" role="document">
    <div class="modal-content">
      <div class="modal-header">
         <div class="card-header w-100">      
        </div>
        <button @click="modal_hide()" type="button" class="m-0 close" data-dismiss="modal" aria-label="Close">
          <span aria-hidden="true">&times;</span>
        </button>
      </div>
    
      <div class="modal-body">
        <div class="row">
            <div class="col-sm-12 w-75 mx-auto">
                <div style="cursor:pointer;background:white;" class="single card shadow p-3">
                    
                    <p style="font-size:12px;" class="text-dark smalls">This business requests a small fee of <b>${{form.investors_fee}} </b> to view their full business information. Do you want to pay now?</p> <hr>
                   

                </div>
            </div>

        </div>
        </div>
        <div class="modal-footer">
        <div class="card-header w-100 text-center">
            <form action="stripe" method="get">
       
                 <input type="text" hidden id="price" name="price" :value="form.investors_fee">
                  <input type="number" hidden id="listing_id" name="listing_id" value="">
       <button @click="make_session(form.listing_id);" type="submit" class=" btn-primary w-25 d-inline  px-3 font-weight-bold" >
          Ok
        </button>
        <button @click="modal_hide()" type="button" class=" btn-danger w-25 d-inline px-3 font-weight-bold m-0 " data-dismiss="modal" aria-label="Close">
          <span aria-hidden="true">Cancel</span>
        </button>

            </form>
        
         </div>
      </div>

        </div>
        </div>
        </div>
<!-- INVEST MODAL -->  

                </div> 


                <div v-else class="eqp-invest">
                <a @click="make_session(form.listing_id);" data-target="#loginmodal2" data-toggle="modal" class="business_btns py-2 text-center text-light buttonListing my-3"><b>Unlock More Business Information To Invest</b></a>

                <!-- <a  @click="make_session(form.listing_id);" data-target="#loginmodal2" data-toggle="modal" class="py-2 text-center text-light buttonListing my-3"><b>Subscribe</b></a>

                <a  @click="make_session(form.listing_id);" data-target="#loginmodal2" data-toggle="modal" class="py-2 text-center text-light buttonListing my-3"><b>Donate</b></a> -->


                </div>

         </div>


         <div v-else class="bg-light w-75 mx-auto py-3 text-center">


               <div  class="eqp-invest">

                

                <a @mouseleave="leave()" @mouseover="hover()" style="border: 1px solid black;" id="convBtn1"  class="py-1 convBtn text-center mx-auto w-75 btn  px-4">Message Business Owner</a>

                <router-link to="/services"  @mouseleave.native="leave()" @mouseover.native="hover2" style="border: 1px solid black;" id="convBtn2"  class="py-1 convBtn my-3 text-center mx-auto w-75 btn  px-4">Download Financial Statements</router-link>
               </div>


               <div  class="eqp-invest">
                <a style="border: 1px solid black;" @mouseleave="leave()"  @mouseover="hover3()" @click="download_business()" id="convBtn3" class="py-1 convBtn text-center mx-auto w-75 btn mt-4 px-4">Download Business Documentation</a>


                <router-link :to="`/business-milestone/${form.listing_id}`"  @mouseleave.native="leave()" @mouseover.native="hover4" style="border: 1px solid black;" id="convBtn4"  class="py-1 convBtn my-3 text-center mx-auto w-75 btn  px-4">View Business Milestones</router-link>

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
                            <div class="col-sm-3">Amount:$</div>
                            <div class="col-sm-3">
                                <input v-on:keyup="calculate($event.target.value);" value="" id="bid_amount" style="height:25px;" type="number" name="bid_amount"></div>
                        </div>

                        <div class="row mt-3">
                            <div class="col-sm-3">Represents:</div>
                            <div class="col-sm-2"></div>
                            <div class="col-sm-5"><p id="bid_percent"> %</p>
                            <input step="0.01" hidden value="" id="bid_percent2" type="number" >
                        </div>
                        </div>
                    </div>
                    
                </div>

                 <a style="border: 1px solid black;" @mouseleave="leave()"  @mouseover="hover5()" @click="bidCommits()" id="convBtn5" class="py-1 convBtn text-center mx-auto w-75 btn mt-4 px-4">Invest</a>


                  <a style="border: 1px solid black;" @mouseleave="leave()"  @mouseover="hover6()" @click="bidCommitsEQP()" id="convBtn6" class="py-1 convBtn text-center mx-auto w-75 btn mt-4 px-4">Invest With Equpment</a>

                
               </div>

         </div>



         </div>
        
        </div>
  
    

    <!-- INVEST MODAL -->
  <div  class="modal fade" id="investModal" tabindex="-1" role="dialog" aria-labelledby="exampleModalLabel" aria-hidden="true">
  <div class="modal-dialog" role="document">
    <div class="modal-content">
      <div class="modal-header">

         <div class="card-header w-100">
           
        </div>

        </div>
    
    
      <div class="modal-body">

        <div class="row">
            <div class="col-sm-12 w-75 mx-auto">
                <div style="cursor:pointer;background:white;" class="single card shadow p-3">
                    
                    <p style="font-size:12px;" class="text-dark smalls">This business requests a small fee of <b>${{form.investors_fee}} </b> to view their full business information. Do you want to pay now?</p> <hr>
                   

                </div>
            </div>

          <!--  <div class="col-sm-6">
                 <div @click="select2()" style="cursor:pointer;" class="multiple card shadow p-3">
                    <h5>Tiered Subscription</h5>
                    <p style="min-height: 50px;" class="text-secondary small">Access multiple businesses records</p> <hr>
                    <select @change="price($event)" class="form-control" style="    font-family: system-ui;">
                        <option hidden>Select</option>
                        <option value="1 Month">1 Month, $30/month</option>
                        <option value="1 Year">1 Year, $20/month</option>
                        <option value="2 Years">2 Years, $15/month</option>
                        <option value="3 Years">3 Years, $12month</option>
                    </select>



                </div>
            </div> -->

        </div>

        </div>

        <div class="modal-footer">

        <div class="card-header w-100 text-center">
            <form action="stripe" method="get">
       
                 <input type="text" hidden id="price" name="price" :value="form.investors_fee">
                  <input type="number" hidden id="listing_id" name="listing_id" value="">


        <button @click="make_session(form.listing_id);" type="submit" class=" btn-primary w-25 d-inline  px-3 font-weight-bold" >
          Ok
        </button>
        <button type="button" class=" btn-danger w-25 d-inline px-3 font-weight-bold m-0 " data-dismiss="modal" aria-label="Close">
          <span aria-hidden="true">Cancel</span>
        </button>

            </form>
        
         </div>

      </div>

        </div>
        </div>
        </div>


<!-- INVEST MODAL -->  

        
        <!-- Body -->
        
        
    </div> 
   
</template>

<script> 
   
export default {
    
   props: ['auth_user','business'],
   data: () =>({
    form: new Form({
        name:'',
        listing_id:'',
        details:'',
        location:'',
        contact:'',
        category:'',
        image:'',
        investment_needed:'',
        investors_fee:'',
        conv:'',
    }),

    results:[],  
    details:[],
    progress:'',
    share:''
    }),

created(){
if(sessionStorage.getItem('invest')!=null)
    sessionStorage.clear(); 
},
    methods:{

   getDetails:function(){ 
    var id=this.$route.params.id; var t=this;
    document.getElementById('listing_id').value = id;

    axios.get('searchResults/'+id).then( (data) =>{console.log(data);
    t.form.conv = data.data.conv;
    t.form.name = data.data.data[0].name;
    t.form.details = data.data.data[0].details;
    t.form.location = data.data.data[0].location;
    t.form.contact = data.data.data[0].contact;
    t.form.image = data.data.data[0].image;
    t.form.category = data.data.data[0].category;
    t.form.listing_id = data.data.data[0].id;
    t.form.investment_needed = data.data.data[0].investment_needed;
    t.form.investors_fee = data.data.data[0].investors_fee;
    
    });
    
    },

    select(){ 
    $('.single').css('background','#72c537');
    $('.multiple').css('background','');},
        
    select2(){ 
    $('.single').css('background','');
    $('.multiple').css('background','#72c537');},
    price(ev){
    document.getElementById('price').value = ev.target.value;
    },

    getPhoto(){
   
        return '../';

        },

  
  make_session(id){
            sessionStorage.setItem('invest',id);
            document.getElementById('c_to_action').value = 'loginFromService';
            document.getElementById('c_to_action_login2').value = 'loginFromService';
        },

        hover(){
            $('#convBtn1').css('background','#72c537');
        },
        hover2(){
            $('#convBtn2').css('background','#72c537');
        },
        hover3(){
            $('#convBtn3').css('background','#72c537');
        },
        hover4(){
            $('#convBtn4').css('background','#72c537');
        },
        hover5(){
            $('#convBtn5').css('background','#72c537');
        },
        hover6(){
            $('#convBtn6').css('background','#72c537');
        },
        leave(){
            $('.convBtn').css('background','');
        },

    download_business(){
    var id=this.$route.params.id; var t=this;
    axios.get('download_business/'+id).then( (data) =>{console.log(data);
    
    });
        },

    getMilestones:function(){ 
    var id=this.$route.params.id; var t=this;

    axios.get('getMilestones/'+id).then( (data) =>{
        console.log(data);
        t.results = data.data.data;
        t.progress = data.data.progress;
        t.share = (data.data.share)*t.progress;
        $('#progress').css('width',t.progress+'%');
    
    });
    
    },


    bidCommits:function(){
    var checked  = '';
    //[...document.querySelectorAll('input[name="miles"]:checked')]
   //.forEach((cb) => checked = checked+cb.value+',');

        var amount = $('#bid_amount').val();
        var percent = $('#bid_percent2').val();
        var business_id = this.$route.params.id;
        if(amount == '' || amount == 0)
            $.alert({
                title: 'Alert!',
                content: 'Please enter a bid to invest!',
            });
        else
        {
            var amount = btoa(amount);
            var business_id = btoa(business_id)
            var percent = btoa(percent)
            $.confirm({
                        title: 'Are you sure?',
                        content: 'Are you sure to bid?',
                        buttons: {
                           confirm: function () {
                           window.location.href = './bidCommits/'+amount+'/'+business_id+'/'+percent;  
                            },
                            cancel: function () {
                                $.alert('Canceled!');
                            },
                        }
                    });
            
            //$('#convBtn4 a').trigger('click');
        }

    },


    bidCommitsEQP:function(){
    var checked  = '';
    [...document.querySelectorAll('input[name="miles"]:checked')]
   .forEach((cb) => checked = checked+cb.value+',');

        var ids = checked;
        if(ids == '')
            $.alert({
                title: 'Alert!',
                content: 'Please select a milestone to commit!',
            });
        else
        {
            $.confirm({
                        title: 'Are you sure?',
                        content: 'Are you sure to commit?',
                        buttons: {
                            confirm: function () {
                             axios.get('milestoneCommitsEQP/'+ids).then( (data) =>{
                             console.log(data);
                             });  
                             $.alert({
                                    title: 'Alert!',
                                    content: 'Commit Success!',
                                });
                            },
                            cancel: function () {
                                $.alert('Canceled!');
                            },
                        }
                    });
            
            //$('#convBtn4 a').trigger('click');
        }

    },

    modal_hide:function(){
    $('#investModalShow').removeClass('d-block');
    },

    calculate:function(bid){
    var total = this.form.investment_needed;
    var percent = (bid/total)*100
    var percent = percent.toFixed(2);
    if(percent >=100)
        document.getElementById('bid_percent').innerHTML = '<b class="text-danger">Exceeds 100%</b>';
    else
    document.getElementById('bid_percent').innerHTML = percent+'%';
    document.getElementById('bid_percent2').value = percent;
    }

        },
  

     mounted() { 
     this.getDetails();
     this.getMilestones();
    
      }
   

    }
</script>
