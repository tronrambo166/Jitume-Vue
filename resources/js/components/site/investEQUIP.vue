<template>
    <div class="container">
        
             
        <div class="heading card row px-4 my-3 w-50 mx-auto"> 
        
            <form @submit.prevent="bidCommitsEQP" method="post" enctype="multipart/form-data">             

            <!-- <input hidden type="number" class="form-control"  name="amount" value=""> -->                     

                   <div class="row my-3 row form-group">
                    <div class="col-sm-12 my-3"> 
                        <div class="row">
                           <div class="col-sm-10"><label class="h4" for="name">
                                <h6 class=""> <b> Please upload good quality photos of the assets* </b> </h6></label>
                               </div>
                    
                    <div class="col-sm-2"> 
                        <div class="upload-btn-wrapper">
                        <label for="file-upload2" class="btnUp_listing text-center">                 
                      <img src="images/up.png" class="mx-auto" width="25px"> </label>
                      <input style="" id="file-upload2" required="" type="file" name="photos[]" @change="handleFile" multiple />
                  </div>
                    </div>

                        </div>
                    </div> 
                </div>


                  <div class="row my-3 row form-group">
                    <div class="col-sm-12 my-3"> 
                        <div class="row">
                           <div class="col-sm-10"><label class="h4" for="name">
                                <h6 class=""> <b> Please provide legal documents that act as evidence of the ownership of the Assets (Original purchase receipt/titles/certificates etc)* </b> </h6></label>
                               </div>
                    
                    <div class="col-sm-2"> 
                        <div class="upload-btn-wrapper">
                        <label for="file-upload2" class="btnUp_listing text-center">                 
                      <img src="images/up.png" class="mx-auto" width="25px"> </label>
                      <input required="" @change="handleFile2" style="" id="file-upload2"  type="file" name="legal_doc" />
                  </div>
                    </div>

                        </div>
                    </div> 
                </div>


                  <div class="row my-3 row form-group">
                    <div class="col-sm-12 my-3"> 
                        <div class="row">
                           <div class="col-sm-10"><label class="h4" for="name">
                                <h6 class=""> <b> Please provide the Asset’s make, model, and serial number* </b> </h6></label>
                               </div>
                    
                    <div class="col-sm-10"> 
                      <textarea class="border"  required="" v-model="form.serial" name="serial" rows="2" cols="35"></textarea>
                        </div>
                    </div> 
                </div>
                </div>


                  <div class="row my-3 row form-group">
                    <div class="col-sm-12 my-3"> 
                        <div class="row">
                           <div class="col-sm-10"><label class="h4" for="name">
                                <h6 class=""> <b> Any other Asset records </b>(Optional) </h6></label>
                               </div>
                    
                    <div class="col-sm-2"> 
                        <div class="upload-btn-wrapper">
                        <label for="file-upload2" class="btnUp_listing text-center">                 
                      <img src="images/up.png" class="mx-auto" width="25px"> </label>
                      <input @change="handleFile3" style="" id="file-upload2" type="file" name="optional_doc" />
                  </div>
                    </div>

                        </div>
                    </div> 
                </div>

                <div class="row my-5 w-50 mx-auto"> 
                    <button id="ok" style="width: 38%;" class="modal_ok m-auto border border-dark btn btn-success text-white font-weight-bold">OK</button>

                <a @click="$router.go(-1)" style="width: 48%;" class="m-auto border border-dark btn modal_cancel_btn px-1 font-weight-bold">Back</a>
                </div>


            </form>

        </div>
        
        
    </div> 
   
</template>

<script> 
   
export default {
    
   props: ['auth_user','business'],
   data: () =>({
    form: new Form({
        listing_id:'',
        amount:'',
        percent:'',
        photos:[],
        legal_doc:'',
        serial:'',
        optional_doc:'',
        conv:'',
    }),

    results:[],  
    }),

created(){
if(sessionStorage.getItem('invest')!=null)
    sessionStorage.clear(); 
},
    methods:{

   getDetails:function(){ 
    var id=this.$route.params.id; var t=this;
    axios.get('searchResults/'+id).then( (data) =>{console.log(data);
    
    });
    
    },
  
    setValues(){
         var amount=atob(this.$route.params.amount);
         var listing_id=atob(this.$route.params.id);
         var percent=atob(this.$route.params.percent);  
         this.form.amount = amount;
         this.form.listing_id = listing_id;
         this.form.percent = percent; 
        },

    handleFile (event) {
      let t = this
      const file = event.target.files
      this.form.photos = file
       let filereader = new FileReader();
      // filereader.onload = function(e) {
      // t.form.showImage = e.target.result
      // }
      filereader.readAsDataURL(event.target.files[0])
      console.log(this.form.photos);
    },
    handleFile2 (event) {
      let t = this
      const file = event.target.files
      this.form.legal_doc = file[0]
       let filereader = new FileReader();
      filereader.readAsDataURL(event.target.files[0])
      console.log(this.form.legal_doc);
    },
    handleFile3 (event) {
      let t = this
      const file = event.target.files
      this.form.optional_doc = file[0]
       let filereader = new FileReader();
      filereader.readAsDataURL(event.target.files[0])
    },

    async bidCommitsEQP(){
    const response = await this.form.post('bidCommitsEQP');
    console.log(response.data);
    if(response.data.success){
        $.alert({
          title: 'Alert!',
          content: response.data.success,
        });
        $('#ok').css('display','none');
    }
    else
    $.alert({
          title: 'Alert!',
          content: response.data.failed,
        });
    

 // this.$router.push('/manage-category');

    }    


        },
  
     mounted() {
     this.setValues(); 
     //this.getDetails();
    
      }
   

    }
</script>
