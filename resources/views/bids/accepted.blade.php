<head>
    <link
        rel="stylesheet"
        href="https://stackpath.bootstrapcdn.com/bootstrap/4.4.1/css/bootstrap.min.css"
    />
</head>
<script src="https://cdn.tailwindcss.com"></script>

<div
    style="
        max-width: 1024px;
        margin-left: auto;
        margin-right: auto;
        margin-top: 4rem;
        background-color: white;
        border-radius: 0.5rem;
        box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
        overflow: hidden;
        position: relative;
    "
>
    <!-- Header with Logo -->
      <div
        style="
            background-color: #14532d;
            padding: 0.9rem 0;
            text-align: center;
            color: #ffffff;
            position: relative;
            z-index: 10;
        "
    >
        <img
                       src="{{ $message->embed('https://tujitume.com/images/Email/EmailWhite.png')}}"

            alt="Company Logo"
            style="height: 3rem; width: auto; margin: 0 auto"
        />
        <h1
            style="font-size: 2rem; font-weight: 700; margin-top: 1rem"
        >
            Bid Confirmed
        </h1>
    </div>

    <div class="email-container" >
    <div class="content" style="padding: 20px">
        <h2 class="email-title" style="font-size: 20px; margin-bottom: 20px">
            Congratulations
        </h2>
        <p
            class="email-message"
            style="
                font-size: 12px;
                padding-top: 10px;
                line-height: 0.5;
                margin-bottom: 30px;
            "
        >
            Hi, &nbsp; Your bid to invest in the {{$business_name}} has been
            Confirmed.
        </p>
        <p
            class="email-message"
            style="
                font-size: 12px;
                padding-top: 5px;
                line-height: 1.8;
                margin-bottom: 5px;
            "
        >
            @if($type == 'Monetary')

            <p>
            We’re pleased to inform you that this investment process has been confirmed. The project will <br>
            now proceed to the next phase: Milestone Progression (In-Progress).
            Here’s what to expect moving forward:<br>
            <span style="color: #2E8B57;">✓</span> Milestone Coordination: Payments will be coordinated seamlessly between the
            Platform, Business Owner and Investor on completed milestones.<br>
            <span style="color: #2E8B57;">✓</span> Dashboard Updates: All milestone progress and related financials will be updated in
            your project dashboard for real-time tracking.<br>
            <span style="color: #2E8B57;">✓</span> Support: Should you have any questions or require clarification, our support team is
            here to assist.<br>
            <span style="color: #2E8B57;">✓</span> Please be on alert of completion milestone emails as progress of their investment
            depends on your review.<br>
            <span style="color: #2E8B57;">✓</span> You have the option to request a local project manager to supervise the project.
        </p>

             <p style="margin-left: 19px;"> Proceed to progress with the milestones
            work?</p>
        </p>
        <div class="flex gap-3">
            <a
                target="_blank"
                href="<?php echo config('app.api_url');?>agreeToProgressWithMilestone/{{$bid_id}}"
                 style="
                        color: #2f9f1f;
                        border: 1px solid #2f9f1f;
                        padding: 0.625rem 1.25rem;
                        font-size: 0.875rem;
                        font-weight: 500;
                        border-radius: 0.5rem;
                        text-align: center;
                        margin-right: 0.5rem;
                        margin-bottom: 0.5rem;
                        text-decoration: none;
                    "
                    onmouseover="this.style.backgroundColor='#388e3c'; this.style.color='white'; this.style.textDecoration='none';"
                    onmouseout="this.style.backgroundColor=''; this.style.color='#2f9f1f';"
                    onfocus="this.style.boxShadow='0 0 0 4px rgba(72, 187, 120, 0.5)';"
                    onblur="this.style.boxShadow='';"
                    >Ok</a
            >
            <!-- <a
                href="#"
                class="text-red-700 hover:text-white border hover:no-underline border-red-700 hover:bg-red-800 focus:ring-4 focus:outline-none focus:ring-red-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center me-2 mb-2 dark:border-red-500 dark:text-red-900 dark:hover:text-white dark:hover:bg-red-600 dark:focus:ring-red-800"
                >Cancel</a
            > -->
        </div>

        <p
            class="email-message"
            style="
                font-size: 12px;
                padding-top: 10px;
                line-height: 1.8;
                margin-bottom: 30px;
            "
        >
            If you require a project manager, please
            <a
                target="_blank"
                href="<?php echo config('app.app_url');?>dashboard?b_idToVWPM={{$bid_id}}"
                >click here</a
            >
            (Please note that investors with assets must have a project
            manager).
        </p>

        @else 

        Please Request a Project Manager to Proceed with this Investment
        (Please note that investor with assets must have a project manager)
        <br />
        <div style="margin-top:35px;" class="w-full mx-auto mt-4 py-4 text-center">
            <a  style="background-color: #14532d; color: white; padding: 0.75rem 1.5rem; border-radius: 0.5rem; text-decoration: none; font-weight: 500; font-size: 1rem; transition: background-color 0.3s ease-in-out;"
    onmouseover="this.style.backgroundColor='#139647';"
    onmouseout="this.style.backgroundColor='#14532d';" target="_blank"
                href="<?php echo config('app.app_url');?>dashboard?b_idToVWPM={{$bid_id}}"
            >
                Request a Project Manager to Verify.</a
            >

            <a  
            style="background-color: #0d3a1f; color: white; padding: 0.75rem 1.5rem; border-radius: 0.5rem; text-decoration: none; font-weight: 500; font-size: 1rem; transition: background-color 0.3s ease-in-out;"
    onmouseover="this.style.backgroundColor='#139647';"
    onmouseout="this.style.backgroundColor='#14532d';"target="_blank"
                href="<?php echo config('app.app_url');?>dashboard?b_idToVWBO={{$bid_id}}"
            >
                Request Business Owner to Verify</a
            >

            <a href="<?php echo config('app.api_url');?>CancelAssetBid/{{$bid_id}}/confirm" 
			 style="
                        color: #e11d48;
                        border: 1px solid #e11d48;
                        padding: 0.625rem 1.25rem;
                        font-size: 0.875rem;
                        font-weight: 500;
                        border-radius: 0.5rem;
                        text-align: center;
                        margin-top: 15px;
                        margin-right: 0.5rem;
                        margin-bottom: 0.5rem;
                        text-decoration: none;
                    "
                    onmouseover="this.style.backgroundColor='#9f1239'; this.style.color='white'; this.style.textDecoration='none';"
                    onmouseout="this.style.backgroundColor=''; this.style.color='#e11d48';"
                    onfocus="this.style.boxShadow='0 0 0 4px rgba(248, 113, 113, 0.5)';"
                    onblur="this.style.boxShadow='';">Cancel</a>
        </div>

        @endif

         <div
                class="footer"
                style="
                    margin-top: 2rem;
                    text-align: start;
                    color: gray;
                    font-size: 12px;
                "
            >
                <p>
                    <img
                        src="{{ $message->embed('https://tujitume.com/images/Email/EmailVertDark.png')}}"
                        alt="Company Logo"
                        style="
                            height: 3rem;
                            width: auto;
                            float: left;
                            margin-right: 1rem;
                            margin-top: -0.2rem;
                            margin-bottom: 4rem;
                        "
                    />
                </p>
                 <p style="font-weight: 600">
                    Best regards, <br/>
                   <div style="margin-bottom:3px;">The Tujitume Team</div> 
                </p>
            </div>
    </div>
</div>

<!-- Bid accepted -->


<script
    src="https://code.jquery.com/jquery-3.4.1.min.js"
    integrity="sha256-CSXorXvZcTkaix6Yvo6HppcZGetbYMGWSFlBw8HfCJo="
    crossorigin="anonymous"
></script>

<script
    src="https://cdn.jsdelivr.net/npm/popper.js@1.16.0/dist/umd/popper.min.js"
    integrity="sha384-Q6E9RHvbIyZFJoft+2mJbHaEWldlvI9IOYy5n3zV9zzTtmI3UksdQRVvoxMfooAo"
    crossorigin="anonymous"
></script>
<script
    src="https://stackpath.bootstrapcdn.com/bootstrap/4.4.1/js/bootstrap.min.js"
    integrity="sha384-wfSDF2E50Y2D1uUdj0O3uMBJnjuUD4Ih7YwaYd1iqfktj0Uod8GCExl3Og8ifwB6"
    crossorigin="anonymous"
></script>

<!--POP UP MODAL-->
<!-- <style>

.modal {
  display: none; 
  position: fixed; 
  z-index: 1; 
  padding-top: 100px; 
  left: 0;
  top: 0;
  width: 100%; 
  height: 100%; 
  overflow: auto; 
  background-color: rgb(0,0,0); 
  background-color: rgba(0,0,0,0.4);
}

.modal-content {
  background-color: #fefefe;
  margin: auto;
  padding: 20px;
  border: 1px solid #888;
  width: 80%;
}

.close {
  color: #aaaaaa;
  float: right;
  font-size: 28px;
  font-weight: bold;
}

.close:hover,
.close:focus {
  color: #000;
  text-decoration: none;
  cursor: pointer;
}
</style>
</head>
<body>

<h2>Tujitume</h2> -->

<!-- <div id="myModal" class="modal">

 
  <div class="modal-content">
    <span class="close">&times;</span>
    <p>If press 'Ok', The following bid will be canceled with & you will be redirected to Tujitume.</p>
    <div class="w-full mx-auto mt-4 py-4 text-center">
            <a 
            style="text-decoration:none;color:black;background:yellow;padding:8px;border-radius:5px;display: inline;width: 50%;margin: auto;margin-top: 20px;">
            Ok</a>

            <a
                target="_blank"
                
                class="bg-blue-800 text-white px-6 py-3 hover:no-underline rounded-lg transition hover:bg-blue-900"
            >
                Request a Project Manager to Verify.</a
            >

            <a
                target="_blank"
                
                class="bg-blue-800 text-white px-6 py-3 hover:no-underline rounded-lg transition hover:bg-blue-900"
            >
                Request Business Owner to Verify</a
            >

            
        </div>
  </div>

</div> -->
<!-- 
<script>
// Get the modal
var modal = document.getElementById("myModal");

// Get the button that opens the modal
var btn = document.getElementById("myBtn");

// Get the <span> element that closes the modal
var span = document.getElementsByClassName("close")[0];

// When the user clicks the button, open the modal 
btn.onclick = function() {
  modal.style.display = "block";
}

// When the user clicks on <span> (x), close the modal
span.onclick = function() {
  modal.style.display = "none";
}

// When the user clicks anywhere outside of the modal, close it
window.onclick = function(event) {
  if (event.target == modal) {
    modal.style.display = "none";
  }
}
</script> -->

<!--POP UP MODAL-->