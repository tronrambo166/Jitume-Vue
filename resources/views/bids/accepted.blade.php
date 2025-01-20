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
            <a
                href="#"
                class="text-red-700 hover:text-white border hover:no-underline border-red-700 hover:bg-red-800 focus:ring-4 focus:outline-none focus:ring-red-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center me-2 mb-2 dark:border-red-500 dark:text-red-900 dark:hover:text-white dark:hover:bg-red-600 dark:focus:ring-red-800"
                >Cancel</a
            >
        </div>
        <!-- If you require a project manager, please click here (Please not that investor with assets must have a project manager) <a target="_blank" href="https://test.jitume.com/#/projectManagers/{{$bid_id}}"
			style="text-decoration:none;color: aliceblue;background:navy;padding:8px;border-radius:5px;">
			Request a Project Manager </a> -->

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
                href="<?php echo config('app.app_url');?>projectManagers/{{$bid_id}}"
                >click here</a
            >
            (Please note that investors with assets must have a project
            manager).
        </p>

        @else Please Request a Project Manager to Proceed with this Investment
        (Please note that investor with assets must have a project manager)
        <br />
        <div class="w-full mx-auto mt-4 py-4 text-center">
            <a
                target="_blank"
                href="<?php echo config('app.app_url');?>projectManagers/{{$bid_id}}"
                class="bg-blue-800 text-white px-6 py-3 hover:no-underline rounded-lg transition hover:bg-blue-900"
            >
                Request</a
            >

            <!-- <a href="http://127.0.0.1:5173/projectManagerCancel/{{$bid_id}}"
			style="text-decoration:none;color:white;background:red;padding:8px;border-radius:5px;display: inline;width: 50%;margin: auto;margin-top: 20px;">
			Cancel</a> -->
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

<!--Hidden Cart view-->

<!-- Bid accepted -->

<!-- <div class="row  w-75 m-auto border shadow text-center bg-light" style=" box-shadow: 3px 3px 7px 7px grey; width:70%; background: #fbfbfb;border: 1px solid black;">
	<div class="container w-75 m-auto" style="box-shadow: 3px 3px 7px 7px grey; background: #fbfbfb;width:75%; margin:auto; text-align:center">
	
	 <h2 style="text-align: left;color: black;font-family: sans-serif;">  
	 	<br> Bid Accepted!</h2>
		
		<div class="" style="width:100%; margin:auto;">
		<h4 style="line-height: 28px;font-weight:500; color: #000000a1;font-family: sans-serif;text-align:left;"> Hi,<br> 
	            Your bid to invest in the {{$business_name}} has been accepted. </h4> <br> 

	            @if($type == 'Monetery')
	           Proceed to progress with the milestones work?
	        <div style="width:100%;margin: auto; padding-bottom:20px;padding-top:15px;"> 
	        	<a target="_blank" href="https://test.jitume.com/agreeToBid/{{$bid_id}}"
			style="width:50%;text-decoration:none;color: aliceblue;background:green;padding:10px 30px;border-radius:5px;margin-left:30px">
			Ok </a>

			<a
			style="width:50%;text-decoration:none;color: aliceblue;background:red;padding:10px 30px;border-radius:5px;margin-left:30px">
			Cancel </a>
		</div>
				<!-- <p>Please be on alert of completion milestone emails as progress of your investment depends on your review. </p> 
	            If you require a project manager, please click here (Please not that investor with assets must have a project manager) <a target="_blank" href="https://test.jitume.com/#/projectManagers/{{$bid_id}}"
			style="text-decoration:none;color: aliceblue;background:navy;padding:8px;border-radius:5px;">
			Request a Project Manager </a>

			@else
			Please Request a Project Manager to Proceed with this Investment (Please note that investor with assets must have a project manager) <br>
			
			<div style="width:100%;margin: auto; padding-bottom:20px;padding-top:15px;"> 
			 <a target="_blank" href="https://test.jitume.com/#/projectManagers/{{$bid_id}}"
			style="text-decoration:none;color: aliceblue;background:navy;padding:8px;border-radius:5px;display: block;width: 50%;margin: auto;margin-top: 20px;">
			Request</a>

			<a href="https://test.jitume.com/#/projectManagerCancel/{{$bid_id}}"
			style="text-decoration:none;color:white;background:red;padding:8px;border-radius:5px;display: block;width: 50%;margin: auto;margin-top: 20px;">
			Cancel</a>
		        </div>

			@endif

		</div>
	
	
			
			
			<p style="font-weight: bold; color:#000000a1; line-height:22px; font-family:arial; padding-top:20px; padding-bottom:20px; text-align:center;" class="py-3 text-center"> Thanks! <br />   Jitume Admin.</p>

	</div>
	
	
	</div>
 -->

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

<script type="text/javascript">
    function openModal(val) {
        if (val == "hide") $("#ConfirmModal").css("display", "none");
        else $("#ConfirmModal").css("display", "block");
    }
</script>

<!--Hidden Cart view-->
