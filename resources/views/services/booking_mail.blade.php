

        

<!--Hidden Cart view-->

        <!-- Booking accepted -->
    <div class="email-container" style="width: 80%; margin: 50px auto; background-color: #fff; padding: 20px; border-radius: 8px; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);">

    @if($reason == 0)
        <div class="content" style="padding: 20px;">
            
            <h2 class="email-title" style="font-size: 20px; margin-bottom: 20px;">Booking Accepted!</h2>
            <p class="email-message" style="font-size: 12px; padding-top: 10px; line-height: 1.8; margin-bottom: 30px;">Hi,<br>Your booking request to {{$business_name}} has been accepted.</p>
            <div class="button-container" style="display: flex; margin-top: 20px;"> <!-- https://test.jitume.com -->
             	<a target="_blank" href="<?php echo config('app.app_url');?>service-milestones/{{$s_id}}" class="button button-primary" style="display: inline-block; padding: 12px 24px; text-decoration: none; color: #fff; border-radius: 6px; transition: background-color 0.3s ease; background-color: green;">Pay Here
                </a>

                <a target="_blank" href="<?php echo config('app.app_url');?>service-milestones/{{$s_id}}" class="button button-primary" style="display: inline-block; padding: 12px 24px; text-decoration: none; color: #fff; border-radius: 6px; transition: background-color 0.3s ease; background-color: yellow;">Cancel
                </a>

            </div>
            <p class="thanks" style="text-align: center; color: rgb(13, 14, 13); margin-top: 20px; font-size: 14px;">Thanks!<br>Tujitume Admin</p>
        </div>
    @else

        <div class="content" style="padding: 20px;">
            
            <h2 class="email-title" style="font-size: 20px; margin-bottom: 20px;">Booking Rejected!</h2>
            <p class="email-message" style="font-size: 12px; padding-top: 10px; line-height: 1.8; margin-bottom: 30px;">Hi,<br>Your booking request to {{$business_name}} has been accepted. <br> Reason: {{$reason}}</p>
            <div class="button-container" style="display: flex; margin-top: 20px;"> <!-- https://test.jitume.com -->
                <a target="_blank" href="<?php echo config('app.app_url');?>service-milestones/{{$s_id}}" class="button button-primary" style="display: inline-block; padding: 12px 24px; text-decoration: none; color: #fff; border-radius: 6px; transition: background-color 0.3s ease; background-color: green;">Pay Here
                </a>

                <a target="_blank" href="<?php echo config('app.app_url');?>service-milestones/{{$s_id}}" class="button button-primary" style="display: inline-block; padding: 12px 24px; text-decoration: none; color: #fff; border-radius: 6px; transition: background-color 0.3s ease; background-color: yellow;">Cancel
                </a>

            </div>
            <p class="thanks" style="text-align: center; color: rgb(13, 14, 13); margin-top: 20px; font-size: 14px;">Thanks!<br>Tujitume Admin</p>
        </div>

    @endif

    </div>
  
        
		
       
      

<script src="https://code.jquery.com/jquery-3.4.1.min.js" integrity="sha256-CSXorXvZcTkaix6Yvo6HppcZGetbYMGWSFlBw8HfCJo=" crossorigin="anonymous"></script>
       

<script src="https://cdn.jsdelivr.net/npm/popper.js@1.16.0/dist/umd/popper.min.js" integrity="sha384-Q6E9RHvbIyZFJoft+2mJbHaEWldlvI9IOYy5n3zV9zzTtmI3UksdQRVvoxMfooAo" crossorigin="anonymous"></script>
<script src="https://stackpath.bootstrapcdn.com/bootstrap/4.4.1/js/bootstrap.min.js" integrity="sha384-wfSDF2E50Y2D1uUdj0O3uMBJnjuUD4Ih7YwaYd1iqfktj0Uod8GCExl3Og8ifwB6" crossorigin="anonymous"></script>
    


<!--Hidden Cart view-->