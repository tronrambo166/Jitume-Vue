<template>
    <div class="main">
        <div class="container mt-3 mb-5">

            <div class="col-sm-1 px-0">
                    <a @click="$router.go(-1)" style="width: 100%;" class="m-auto border btn px-1 py-0 font-weight-bold">Back</a>
            </div>


            <div v-if="no_mile" class="w-75 h-100 py-5 my-5 my-auto justify-content-center my-2 text-center mx-auto">
                <h5 class="w-75 mx-auto bg-light py-3 my-3 text-secondary">No Milestones Yet!</h5>
            </div>

            <div v-else class="root py-5 mb-5 mr-4 ml-md-4  mr-md-0">
                <div class="progressbar-wrapper ">
                    <ul class="progressbar">

                        <li v-for="( result, index ) in results"
                            :class="result.status == 'In Progress' || result.status == 'Done' ? 'active' : ''"> Step
                        </li>

                    </ul>
                </div>
            </div>


            <div v-if="!no_mile" v-for="result in results" class="w-md-75 m-auto row mt-4 text-center">

                <!--Active Download form -->
                <div v-if="result.status == 'In Progress'" class="modal-body">
                    <form action="milestoneStripe" method="get" enctype="multipart/form-data"
                        class="vueform form-group form">



                        <div class="row pt-2 my-auto px-2 mr-md-0" width="">
                            <div class="col px-1 my-2 my-sm-0">
                                <div class=" ">
                                    <input readonly required="" name="title" type="text" v-model="result.title"
                                        class="placeH placeH_active w-100 py-1 border rounded ">
                                </div>
                            </div>


                            <div class="col px-0 my-2 my-sm-0">
                                <div class="">
                                    <input readonly required="" type="number" v-model="result.amount" name="amount"
                                        class="placeH placeH_active w-100 py-1 border rounded ">
                                </div>
                            </div>

                            <div class="col px-1 mt-2 mt-sm-0">
                                <div class="upload-btn-wrapper w-100 d-flex justify-content-start">
                                    <a @click="download_milestone_doc(result.id)"
                                        class="text-white  placeH btnUp3 w-100 d-flex align-items-center border rounded">Download Milestone
                                        Documentaion <i class="ml-2 fa fa-arrow-down"></i></a>

                                </div>
                            </div>


                            <div v-if="result.access && result.time_left != 'L A T E !'" class="col px-1 mt-2 mt-sm-0">

                                <!-- <div v-if="result.with_equip" class="form-group">
                                        <span  class="grey_btn pay_btn float-left diabled placeH_active text-center border rounded px-2 py-1 btn btn-light" >PAY
                                        </span> 

                                        <a @click="milestoneInvestEQP(result.id,result.investor_id,result.user_id);" type="submit" class="pay_btn placeH_active text-center border rounded px-2 py-1 btn btn-light" >EQUIP
                                        </a> 
                                         </div> -->

                                <div class="form-group">
                                    <button @click="make_session(form.id);" type="submit"
                                        class="pay_btn placeH_active text-center border rounded px-2 py-1 btn btn-light">PAY
                                    </button>

                                    <!--    <span  class="grey_btn pay_btn float-left diabled placeH_active text-center border rounded px-2 py-1 btn btn-light" >EQUIP
                                        </span> -->
                                </div>

                            </div>

                            <input type="number" hidden="" name="lisitng_id" v-model="form.id">
                            <input type="number" hidden name="milestone_id" v-model="result.id">

                            <div class="col px-1 mt-2 mt-sm-0">
                                <div class="form-group">
                                    <span
                                        class="placeH_active status text-center border rounded px-0 py-1 primary_bg text-light btn-block">In
                                        Progress</span>
                                </div>
                            </div>

                            <div class="col px-1 mt-2 mt-sm-0">
                                <div class=" border rounded px-2 d-inline-block d-flex align-items-center "
                                    style="padding: 3px;">
                                    <div>
                                        <p class="placeH_active text-success due d-inline">Due in:
                                        </p>
                                    </div>

                                    <div>
                                        <p v-if="result.time_left == 'L A T E !'" style="color:red;"
                                            class="placeH_active due d-inline"> {{ result.time_left }}
                                        </p>
                                        <p v-else class="placeH_active small due d-inline">{{ result.time_left }}</p>
                                    </div>

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
                                <div class="">
                                    <input readonly required="" name="title" type="text" v-model="result.title"
                                        class="placeH_done placeH_active w-100 py-1 border rounded">
                                </div>
                            </div>


                            <div class="col px-0 my-2 mt-sm-0 ">
                                <div class="">

                                    <input readonly required="" type="number" v-model="result.amount" name="amount"
                                        class="placeH_done placeH_active w-100 py-1 border rounded ">
                                </div>
                            </div>

                            <div class="col my-2 my-sm-0">
                                <div class="upload-btn-wrapper d-flex justify-content-start">
                                    <a class="text-white disabled placeH_done btnUp_done w-100 d-flex align-items-center border rounded">Download
                                        Milestone Documentaion <i class=" ml-2 fa fa-arrow-down"></i>
                                    </a>

                                </div>
                            </div>


                            <div class="col d-flex">
                                <div class="form-group mr-1">
                                    <a disabled
                                        class="placeH_active text-center border rounded px-2 py-1 btn btn-light btn-block">PAID</a>
                                </div>

                                <div class="form-group ml-1">
                                    <span style="background:black;"
                                        class="placeH_active status text-center border text-light rounded px-2 py-1 btn-block">DONE</span>
                                </div>
                            </div>


                        </div>

                    </form>

                </div>


                <!-- Done Layout -->




                <!--IN Active Download form -->
                <div v-else class="modal-body">
                    <form action="" method="post" enctype="multipart/form-data" class="vueform form-group form">


                        <div class="row pt-2 px-2  mr-sm-0">


                            <div class="col my-2 my-sm-0">
                                <div class=" ">
                                    <input readonly required="" name="title" type="text" v-model="result.title"
                                        class="placeH_inactive w-100 py-1 border rounded ">
                                </div>
                            </div>


                            <div class="col my-2 my-sm-0">
                                <div class="">

                                    <input readonly required="" type="number" v-model="result.amount" name="amount"
                                        class="placeH_inactive w-100 py-1 border rounded ">
                                </div>
                            </div>

                            <div class="col my-2 my-sm-0">
                                <div class="upload-btn-wrapper w-100">
                                    <a class="pl-4 disabled placeH_inactive btnUp4 w-100 border rounded">Download Milestone Documentaion <i
                                            class="ml-2 fa fa-arrow-down"></i></a>

                                </div>
                            </div>

                            <div class="col d-flex">
                                <div class="form-group ml-1">
                                    <span
                                        class="status text-center border rounded px-2 py-1 btn-light placeH_inactive btn-block">To
                                        Do</span>
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
        no_mile: false
    }),

    created() {
        if (sessionStorage.getItem('milestone') != null)
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

            axios.get('getMilestones/' + id).then((data) => {
                //console.log(data);
                t.results = data.data.data;
                if (data.data.length == 0)
                    t.no_mile = true;

            });

        },

        milestoneInvestEQP: function (mile_id, investor_id, owner_id) {
            var t = this;
            var listing_id = this.$route.params.id;
            listing_id = atob(listing_id); listing_id = atob(listing_id);

            axios.get('milestoneInvestEQP/' + listing_id + '/' + mile_id + '/' + investor_id + '/' + owner_id).then((data) => {
                console.log(data);
                if (data.data.success == 'success')
                    $.alert({
                        title: 'Alert!',
                        content: 'Request to invest with equipment sent! Now the business owner will contact with the investor and conclude the milestone.',
                    });
            });

        },

        make_session(id) {
            id = this.$route.params.id;
            sessionStorage.setItem('milestone', id);
        },

        download_milestone_doc(mile_id) {
            var id = this.$route.params.id; 
            id = atob(id); id = atob(id);
            var t = this;
            axios.get('download_milestoneDoc/' + id + '/' + mile_id).then((data) => {
                console.log(data);

            });
        }


    },

    mounted() {
        this.getMilestones();

    }


}

</script>