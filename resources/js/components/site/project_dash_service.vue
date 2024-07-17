<template>
    <div class="main">
        <div class="container">

            <div class="col-sm-1 px-0 mt-1">
                    <a @click="$router.go(-1)" style="width: 100%;" class="m-auto border btn px-1 py-0 font-weight-bold">Back</a>
            </div>

            <div v-if="!auth_user" class="w-75 h-100 py-5 my-5 my-auto justify-content-center my-2 text-center mx-auto">
                <a style="cursor:pointer; width:40%;" @click="make_session2()"
                    class="searchListing mx-auto text-center py-1 text-light font-weight-bold" data-target="#loginModal"
                    data-toggle="modal">Login to pay</a>
            </div>

            <div v-if="no_mile" class="w-75 h-100 py-5 my-5 my-auto justify-content-center my-2 text-center mx-auto">
                <h5 class="w-75 mx-auto bg-light py-3 my-3 text-secondary">No Milestones Yet!</h5>
            </div>

            <div v-if="done_msg != null" class="w-75 my-5 h-100 text-center mx-auto">
                <h5 class="w-75 mx-auto bg-light py-3 my-3 text-secondary">Milestones completed, Service delivered!</h5>
            </div>


            <div class="root py-5 mb-5 ml-4">
                <div class="progressbar-wrapper">
                    <ul class="progressbar">

                        <li v-for="( result, index ) in results"
                            :class="result.active || result.status == 'Done' ? 'active' : ''"> Step </li>

                    </ul>
                </div>
            </div>


            <div v-for="result in results" class="w-75 m-auto row mt-4 text-center">

                <!--Active Download form -->
                <div v-if="result.active" class="modal-body">
                    <form action="milestoneService" method="get" enctype="multipart/form-data"
                        class="vueform form-group form">



                        <div class="row pt-2">

                            <div class="col px-1 my-2 my-sm-0">
                                <div class=" ">
                                    <input readonly required="" name="title" type="text" v-model="result.title"
                                        class="placeH w-100 border rounded py-1">
                                </div>
                            </div>


                            <div class="col px-1 my-2 my-sm-0 ">
                                <div class="">

                                    <input readonly required="" type="number" v-model="result.amount" name="amount"
                                        class="placeH w-100  border rounded py-1">
                                </div>
                            </div>

                            <div class="col px-1 mt-2 mt-sm-0">
                                <div class="upload-btn-wrapper w-100">
                                    <a @click="download_milestone_doc(result.mile_id)"
                                        class="text-white placeH btnUp3 w-100">Download Milestone Documentaion <i
                                            class="ml-2 fa fa-arrow-down pb-2"></i></a>

                                </div>
                            </div>


                            <div v-if="booked" class="col px-1 mt-2 mt-sm-0">
                                <div class="form-group">

                                    <a v-if ="result.status == 'In Progress'" class="placeH_inactive pb-2 text-center border rounded btn btn-secondary text-white btn-block">PAID</a>

                                    <a v-else-if="result.time_left == 'L A T E !'" @click="make_session(form.id);"
                                        
                                        class="placeH_active status text-center border border-dark btn btn-light btn-block disabled">PAY</a>

                                    <a v-else @click="make_session(form.id); pay_milestone(result.id,result.amount)" type="submit"
                                        class="placeH_active status text-center border rounded btn btn-light btn-block">PAY</a>
                                </div>
                            </div>

                            <input type="number" hidden="" name="lisitng_id" v-model="form.id">
                            <input type="number" hidden name="milestone_id" v-model="result.id">

                            <div class="col px-1 mt-2 mt-sm-0">
                                <div class="form-group">
                                    <span class="placeH_active status text-center border rounded primary_bg text-light py-1 btn-block">{{result.status}}</span>
                                </div>
                            </div>

                            <div class="col px-1 mt-2 mt-sm-0">
                                <div class="rounded border border-dark px-2 d-inline-block">
                                    <p style="font-size:12px;" class="placeH_active status text-success due small d-inline">Due in: </p>

                                    <p v-if="result.time_left == 'L A T E !'" style="color:red;" class="due d-inline">
                                        {{ result.time_left }} </p>
                                    <p v-else class="small due d-inline">{{ result.time_left }}</p>
                                </div>
                            </div>



                        </div>

                    </form>

                </div>

                <!--Active Download form -->



                <!--Done Download form -->
                <div v-else-if="result.status == 'Done'" class="modal-body">
                    <form action="" method="post" enctype="multipart/form-data" class="vueform form-group form">


                        <div class="row pt-2 my-auto mr-1 mr-md-0">

                            <div class="col mt-2 mt-sm-0">
                                <div class=" ">
                                    <input readonly required="" name="title" type="text" v-model="result.title"
                                        class="placeH_done w-100 border rounded py-1">
                                </div>
                            </div>


                            <div class="col px-1 my-2 mt-sm-0 ">
                                <div class="">

                                    <input readonly required="" type="number" v-model="result.amount" name="amount"
                                        class="placeH_done w-100 border py-1 rounded">
                                </div>
                            </div>

                            <div class="col my-2 my-sm-0">

                                <div class="upload-btn-wrapper d-flex justify-content-start">
                                    <a @click="download_milestone_doc(result.mile_id)" class="text-white disabled placeH_done btnUp_done  w-100 d-flex align-items-center border rounded">Download
                                        Milestone
                                        Documentaion <i class="ml-2 fa fa-arrow-down  pb-2"></i></a>

                                </div>
                            </div>


                            <div class="col my-2 my-sm-0 d-flex">

                                <!-- <div class="form-group mr-1">
                                    <a disabled
                                        class="placeH_active text-center border border-dark px-2 py-1 btn btn-light btn-block">PAID</a>
                                </div> -->

                                <div class="form-group ml-1">
                                    <span v-if="result.status == 'Done'" style="background:black;"
                                        class="placeH_active status text-center border text-light rounded px-2 py-1 btn-block">Done!</span>

                                        <span v-else style="background:black;"
                                        class="placeH_active status text-center border text-success rounded px-2 py-1 btn-block">Being Completed</span>
                                </div>
                            </div>


                        </div>

                    </form>

                </div>


                <!-- Done Layout -->




                <!--IN Active Download form -->
                <div v-else class="modal-body">
                    <form action="" method="post" enctype="multipart/form-data" class="vueform form-group form">



                        <div class="row pt-2 mr-1 mr-sm-0">

                            <div class="col px-1 my-2 my-sm-0">
                                <div class=" ">
                                    <input readonly required="" name="title" type="text" v-model="result.title"
                                        class="btn-secondary placeH_inactive w-100 py-1 border rounded ">
                                </div>
                            </div>


                            <div class="col px-1 my-2 my-sm-0 ">
                                <div class="">

                                    <input readonly required="" type="number" v-model="result.amount" name="amount"
                                        class="btn-secondary placeH_inactive w-100 py-1 border rounded">
                                </div>
                            </div>

                            <div class="col px-0 my-2 my-sm-0">
                                <div class="upload-btn-wrapper w-100">
                                    <a class="btn-secondary disabled placeH_inactive btnUp4 w-100">Download Milestone
                                        Documentaion <i class="ml-2 fa fa-arrow-down"></i></a>

                                </div>
                            </div>


                            <div class="col px-1 my-2 my-sm-0">
                                <div class="form-group">
                                    <a style="color:lightgray;" disabled class="placeH_inactive pb-2 text-center border rounded p-0 btn btn-secondary btn-block">PAY</a>
                                </div>
                            </div>

                            <div class="col px-0 my-2 my-sm-0">
                                <div class="form-group">
                                    <span class="placeH_inactive pb-2 status text-center border rounded p-0 btn btn-secondary btn-block">To Do</span>
                                </div>
                            </div>


                        </div>

                    </form>

                </div>


                <!-- IN Active Layout -->








            </div>
        </div>
    </div>
</template>

<script>

export default {
    props: ['auth_user'],
    data: () => ({
        form: new Form({
            id: ''
        }),
        results: [],
        status: false,
        done_msg: '',
        no_mile: false,
        booked:false
    }),

    created() {
        if (sessionStorage.getItem('milestoneS') != null)
            sessionStorage.clear();

        var id = this.$route.params.id;
        id = atob(id); id = atob(id);
        let t = this;
        t.form.id = id;


    },
    methods: {

        getMilestones: function () {
            var id = this.$route.params.id;
            id = atob(id); id = atob(id);
             var t = this;

            axios.get('getMilestonesS/' + id).then((data) => {
                console.log(data);
                t.results = data.data.data;
                t.done_msg = data.data.done_msg;
                t.booked = data.data.booked;
                if (data.data.data.length == 0)
                    t.no_mile = true;


            });

        },

        make_session(id) {
            var id = this.$route.params.id;
            sessionStorage.setItem('milestoneS', id);
        },

        make_session2() {
          var id = this.$route.params.id;
          sessionStorage.setItem('milestoneS', id);
          document.getElementById('c_to_action').value = 'loginFromService';
          document.getElementById('c_to_action_login').value = 'loginFromService';
          },

        download_milestone_doc(mile_id) {
            var id = this.$route.params.id;
            id = atob(id); id = atob(id);
            var t = this;
            axios.get('download_milestoneDocS/' + id + '/' + mile_id).then((data) => {
                console.log(data);

            });
        },

        pay_milestone: function (mile_id,amount) {
        var amount = btoa(amount);
        var mile_id = btoa(mile_id)
        $.confirm({
          title: 'Please Confirm',
          content: 'Are you sure?',
          buttons: {
            confirm: function () {
              window.location.href = './milestoneService/' + mile_id + '/' + amount;
            },
            cancel: function () {
              $.alert('Canceled!');
            },
          }
        });

    },


    },

    mounted() {
        this.getMilestones();
        if (sessionStorage.getItem('milestoneS') != null)
            sessionStorage.clear();
    }


}

</script>