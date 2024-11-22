

        

<!--Hidden Cart view-->  

        <div class="row  w-75 m-auto border shadow text-center bg-light" style=" box-shadow: 3px 3px 7px 7px grey; width:70%; background: white;border: 1px solid green;">
		<div class="container w-75 m-auto" style="box-shadow: 3px 3px 7px 7px grey; background: white;width:80%; margin:auto; text-align:center">
		
		 <h2 style="color: green;font-family: sans-serif;">  
		 	 Congratulations! </h2>
			
			<div class="" style="width:50%; margin:auto;">
			<h4 style="color: black;font-family:  sans-serif;text-align:left;">  All Milestones are completed and {{$owner}} thanks you for your business! Please review</h4>

			@php $s_id = base64_encode(base64_encode($s_id)); @endphp

			<a target="_blank" href="<?php echo config('app.app_url');?>service-details/{{$s_id}}?review_popup=true" class="button continue" style="display: inline-block; padding: 12px 24px; text-decoration: none; color: #fff; border-radius: 6px; transition: background-color 0.3s ease; background-color: green;">Review</a>
			
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
		
		
				
				
				<p style="font-weight: bold; color:black; line-height:22px; font-family:arial; padding-top:20px; padding-bottom:20px; text-align:center;" class="py-3 text-center"> Thanks! <br />   Jitume Admin.</p>

		</div>
		
		
		</div>
  
        
		
       
      

<script src="https://code.jquery.com/jquery-3.4.1.min.js" integrity="sha256-CSXorXvZcTkaix6Yvo6HppcZGetbYMGWSFlBw8HfCJo=" crossorigin="anonymous"></script>
       

<script src="https://cdn.jsdelivr.net/npm/popper.js@1.16.0/dist/umd/popper.min.js" integrity="sha384-Q6E9RHvbIyZFJoft+2mJbHaEWldlvI9IOYy5n3zV9zzTtmI3UksdQRVvoxMfooAo" crossorigin="anonymous"></script>
<script src="https://stackpath.bootstrapcdn.com/bootstrap/4.4.1/js/bootstrap.min.js" integrity="sha384-wfSDF2E50Y2D1uUdj0O3uMBJnjuUD4Ih7YwaYd1iqfktj0Uod8GCExl3Og8ifwB6" crossorigin="anonymous"></script>
    


<!--Hidden Cart view-->


        

        
