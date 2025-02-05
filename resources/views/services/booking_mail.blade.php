

    <!-- Booking accepted -->
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
            Your Booking Request
        </h1>
    </div>
    <div>
    @if($reason == 0)
        <div class="content" style="padding: 20px;">
            
            <h2 class="email-title" style="font-size: 20px; margin-bottom: 20px;">Booking Accepted!</h2>
            <p class="email-message" style="font-size: 12px; padding-top: 10px; line-height: 1.8; margin-bottom: 30px;">Hi,<br>Your booking request to {{$business_name}} has been accepted.</p>
            <div class="button-container" style="display: flex; margin-top: 20px; gap: 20px; "> <!-- https://test.jitume.com -->
                <a target="_blank" href="<?php echo config('app.app_url');?>service-milestones/{{$s_id}}" class="button button-primary"        style="display: inline-block; padding: 12px 24px; text-decoration: none; color: #fff; border-radius: 6px; transition: background-color 0.3s ease; background-color: green; text-align: center;">Pay Here
                </a>

                <a target="_blank" href="<?php echo config('app.api_url');?>CancelBookingConfirm/{{$booking_id}}/confirm" class="button button-primary"        style="display: inline-block; padding: 12px 24px; text-decoration: none; color: black; border-radius: 6px; transition: background-color 0.3s ease; background-color: yellow; text-align: center;">Cancel
                </a>

            </div>
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
    @else
      <hr style="border: 1px solid #ccc; margin: 30px 0;">

        <div class="content" style="padding: 20px;">
            
            <h2 class="email-title" style="font-size: 20px; margin-bottom: 20px;">Booking Rejected!</h2>
            <p class="email-message" style="font-size: 12px; padding-top: 10px; line-height: 1.8; margin-bottom: 30px;">Hi,<br>Your booking request to {{$business_name}} has been Rejected. <br> Reason: {{$reason}}</p>
            <div class="button-container" style="display: flex;gap: 20px;  margin-top: 20px;"> <!-- https://test.jitume.com -->
         

            </div>
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

    @endif
      <hr style="border: 1px solid #ccc; margin: 30px 0;">

    </div>
    
    
    </div>
  
        
        
       
      

<script src="https://code.jquery.com/jquery-3.4.1.min.js" integrity="sha256-CSXorXvZcTkaix6Yvo6HppcZGetbYMGWSFlBw8HfCJo=" crossorigin="anonymous"></script>
       

<script src="https://cdn.jsdelivr.net/npm/popper.js@1.16.0/dist/umd/popper.min.js" integrity="sha384-Q6E9RHvbIyZFJoft+2mJbHaEWldlvI9IOYy5n3zV9zzTtmI3UksdQRVvoxMfooAo" crossorigin="anonymous"></script>
<script src="https://stackpath.bootstrapcdn.com/bootstrap/4.4.1/js/bootstrap.min.js" integrity="sha384-wfSDF2E50Y2D1uUdj0O3uMBJnjuUD4Ih7YwaYd1iqfktj0Uod8GCExl3Og8ifwB6" crossorigin="anonymous"></script>
    


<!--Hidden Cart view-->