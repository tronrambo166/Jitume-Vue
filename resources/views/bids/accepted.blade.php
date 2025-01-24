<head>
    <link
        rel="stylesheet"
        href="https://stackpath.bootstrapcdn.com/bootstrap/4.4.1/css/bootstrap.min.css"
    />
</head>
<script src="https://cdn.tailwindcss.com"></script>

<div
    class="max-w-4xl mx-auto mt-16 bg-white rounded-lg shadow-lg overflow-hidden relative"
>
    <!-- Header with Logo -->
    <div class="bg-green-900 py-10 text-center text-white relative z-10">
        <img
            src="../../../React/src/images/TujitumeLogo.svg"
            alt="Company Logo"
            class="h-12 w-auto mx-auto"
        />
        <h1 class="text-3xl font-bold mt-4">Bid Accepted!</h1>
    </div>

    <div class="email-container" >
    <div class="content" style="padding: 20px">
        <h2 class="email-title" style="font-size: 20px; margin-bottom: 20px">
            Congratulations!
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
            accepted.
        </p>
        <p
            class="email-message"
            style="
                font-size: 12px;
                padding-top: 10px;
                line-height: 1.8;
                margin-bottom: 30px;
            "
        >
            @if($type == 'Monetary') Proceed to progress with the milestones
            work?
        </p>
        <div class="flex gap-3">
            <a
                target="_blank"
                href="<?php echo config('app.api_url');?>agreeToBid/{{$bid_id}}"
                class="text-green-700 hover:text-white border hover:no-underline border-green-700 hover:bg-green-800 focus:ring-4 focus:outline-none focus:ring-green-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center me-2 mb-2 dark:border-green-500 dark:text-green-900 dark:hover:text-white dark:hover:bg-green-600 dark:focus:ring-green-800"
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

        @else Please Request a Project Manager to Proceed with this Investment
        (Please note that investor with assets must have a project manager)
        <br />
        <div class="w-full mx-auto mt-4 py-4 text-center">
            <a  style="text-decoration:none;color:white;background:green;padding:8px;border-radius:5px;display: inline;width: 50%;margin: auto;margin-top: 20px;"
                target="_blank"
                href="<?php echo config('app.app_url');?>dashboard?b_idToVWPM={{$bid_id}}"
                class="bg-blue-800 text-white px-6 py-3 hover:no-underline rounded-lg transition hover:bg-blue-900"
            >
                Request a Project Manager to Verify.</a
            >

            <a  style="text-decoration:none;color:white;background:green;padding:8px;border-radius:5px;display: inline;width: 50%;margin: auto;margin-top: 20px;"
                target="_blank"
                href="<?php echo config('app.app_url');?>dashboard?b_idToVWBO={{$bid_id}}"
                class="bg-blue-800 text-white px-6 py-3 hover:no-underline rounded-lg transition hover:bg-blue-900"
            >
                Request Business Owner to Verify</a
            >

            <a href="<?php echo config('app.api_url');?>CancelAssetBid/{{$bid_id}}/confirm" 
			style="text-decoration:none;color:white;background:red;padding:8px;border-radius:5px;display: inline;width: 50%;margin: auto;margin-top: 20px;">
			Cancel</a>
        </div>

        @endif

        <div class="mt-8 text-center text-gray-500 text-sm">
            <p>
                Thank you for using <span class="font-semibold">Tujitume</span>!
            </p>
            <p class="font-semibold">Best regards,</p>

            <p>The Tujitume Team</p>
            <!-- <p class="mt-2">© 2025 Tujitume. All rights reserved.</p> -->
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

