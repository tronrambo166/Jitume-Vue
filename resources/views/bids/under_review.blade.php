
<head>
	<link rel="stylesheet" href="https://stackpath.bootstrapcdn.com/bootstrap/4.4.1/css/bootstrap.min.css">
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
      <div
        class="bg-green-900 py-10 text-center text-white relative z-10"
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
            class="h-12 w-auto mx-auto"
            style="height: 3rem; width: auto; margin: 0 auto"
        />
        <h1
            class="text-3xl font-bold mt-4"
            style="font-size: 2rem; font-weight: 700; margin-top: 1rem"
        >
            Bid Under Review
        </h1>
    </div>

        <div >
        <div class="content" style="padding: 20px;">
            <h2 class="email-title" style="font-size: 20px; margin-bottom: 20px;">Your Bid Is Under Review</h2>
            <p class="email-message" style="font-size: 12px; padding-top: 10px; line-height: 0.5; margin-bottom: 30px;">Hi,&nbsp; Your bid to invest in the {{$business_name}} is under review. You'll get a notification when it's accepted.</p>
            <p class="email-message" style="font-size: 12px; padding-top: 10px; line-height: 1.8; margin-bottom: 30px;">

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
			 <p>Please be on alert of completion milestone emails as progress of your investment depends on your review. </p> 
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
         
  

             
      

<script src="https://code.jquery.com/jquery-3.4.1.min.js" integrity="sha256-CSXorXvZcTkaix6Yvo6HppcZGetbYMGWSFlBw8HfCJo=" crossorigin="anonymous"></script>
       

<script src="https://cdn.jsdelivr.net/npm/popper.js@1.16.0/dist/umd/popper.min.js" integrity="sha384-Q6E9RHvbIyZFJoft+2mJbHaEWldlvI9IOYy5n3zV9zzTtmI3UksdQRVvoxMfooAo" crossorigin="anonymous"></script>
<script src="https://stackpath.bootstrapcdn.com/bootstrap/4.4.1/js/bootstrap.min.js" integrity="sha384-wfSDF2E50Y2D1uUdj0O3uMBJnjuUD4Ih7YwaYd1iqfktj0Uod8GCExl3Og8ifwB6" crossorigin="anonymous"></script>
    
    <script type="text/javascript">
    	function openModal(val) {
		if(val == 'hide')
		$('#ConfirmModal').css('display','none');
		else
    	$('#ConfirmModal').css('display','block');
    	}
    </script>


<!--Hidden Cart view-->