

        

<!--Hidden Cart view-->  

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
        <h1 style="font-size: 2rem; font-weight: 700; margin-top: 1rem">
            Milestone Completed
        </h1>
    </div>
 <div class="content" style="padding: 20px">
	<h2 style="color: green; font-size: 1.8rem; font-weight: bold; margin-bottom: 15px;">
       Congratulations! </h2>
			
			<div class="" style="width:50%; margin:auto;">
			 <h4 style="color: black; font-size: 1rem; font-weight: 500; line-height: 1.5;">
            All Milestones are completed, and <strong>{{$owner}}</strong> thanks you for your business! Please review.
        </h4>
			@php $s_id = base64_encode(base64_encode($s_id)); @endphp
			<div style="margin-top: 20px;">
			<a target="_blank" href="<?php echo config('app.app_url');?>service-details/{{$s_id}}?review_popup=true" class="button continue" style="display: inline-block; padding: 12px 24px; text-decoration: none; color: #fff; border-radius: 6px; transition: background-color 0.3s ease; background-color: green;">Review</a>
			
		</div>

		
	</div>
	


			<!-- Do you want to Continue to the Next Milestone?
		        <div style="width:100%;margin: auto; padding-bottom:20px;padding-top:15px;"> 
		        	<a target="_blank" href="http://localhost/laravel_projects/jitumeLive/public/agreeToMileS/{{$s_id}}"
				style="width:50%;text-decoration:none;color: aliceblue;background:green;padding:10px 30px;border-radius:5px;margin-left:30px">
				Continue</a>

				<a
				style="width:50%;text-decoration:none;color: aliceblue;background:red;padding:10px 30px;border-radius:5px;margin-left:30px">
				Cancel </a>
			</div> -->
		
		
				
				
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
                   <div style="margin-bottom:3px;" ">The Tujitume Team</div> 
                </p>
            </div>

		</div>
</div>

		
		
		</div>
  
        
		
       
      

<script src="https://code.jquery.com/jquery-3.4.1.min.js" integrity="sha256-CSXorXvZcTkaix6Yvo6HppcZGetbYMGWSFlBw8HfCJo=" crossorigin="anonymous"></script>
       

<script src="https://cdn.jsdelivr.net/npm/popper.js@1.16.0/dist/umd/popper.min.js" integrity="sha384-Q6E9RHvbIyZFJoft+2mJbHaEWldlvI9IOYy5n3zV9zzTtmI3UksdQRVvoxMfooAo" crossorigin="anonymous"></script>
<script src="https://stackpath.bootstrapcdn.com/bootstrap/4.4.1/js/bootstrap.min.js" integrity="sha384-wfSDF2E50Y2D1uUdj0O3uMBJnjuUD4Ih7YwaYd1iqfktj0Uod8GCExl3Og8ifwB6" crossorigin="anonymous"></script>
    


<!--Hidden Cart view-->


        

        
