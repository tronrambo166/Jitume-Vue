

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
            
            <h2 class="email-title" style="font-size: 20px; margin-bottom: 20px;">Booking Accepted</h2>
            <p class="email-message" style="font-size: 12px; padding-top: 10px; line-height: 1.8; margin-bottom: 30px;">
                Dear Customer,<br>We are pleased to inform you that your booking request for {{$business_name}} has been
                accepted by the service owner.</p>

            <h5 style="margin-top: 8px;margin-bottom: 15px;">Booking Details:<h5>


            <p class="email-message" style="font-size: 12px; padding-top: 5px; line-height: 1.8; margin-bottom: 30px;">

                 <b>Booking ID:</b> #OO{{$id}}<br>
                 <b>Service Name:</b> {{$business_name}}<br>
                 <b>Requested Date:</b> {{$date}}<br>

                 @php $Tax = $amount*0.05; $Total = $amount+$Tax; @endphp
                <strong>Amount:</strong> {{$amount}} <br/>
                <strong>Jitume Fee:</strong> {{$Tax}} <br/>
                <strong>Total:</strong> {{$Total}}<br>
            </p>

            <h5>Next Steps:</h5>
            <p> If you no longer wish to proceed, you may cancel the booking by clicking 'Cancel'</p>

            <div class="button-container" style="display: flex; margin-top: 20px; gap: 20px; align-items: center;">
    <!-- Pay Button -->
    <a 
        target="_blank" 
        href="<?php echo config('app.app_url');?>service-milestones/{{$s_id}}" 
        style="
            display: inline-block;
            padding: 10px 24px;
            text-decoration: none;
            color: #fff;
            border-radius: 6px;
            transition: all 0.3s ease;
            background-color: #2f9f1f;
            text-align: center;
            font-weight: 500;
            border: 1px solid #2f9f1f;
            font-size: 0.875rem;
        "
        onmouseover="this.style.backgroundColor='#26801a';"
        onmouseout="this.style.backgroundColor='#2f9f1f';"
        onfocus="this.style.boxShadow='0 0 0 3px rgba(47, 159, 31, 0.3)';"
        onblur="this.style.boxShadow='none';"
    >
        Pay Here
    </a>

    <!-- Cancel Button -->
    <a 
        target="_blank" 
        href="<?php echo config('app.api_url');?>CancelBookingConfirm/{{$booking_id}}/confirm" 
        style="
            display: inline-block;
            padding: 10px 24px;
            text-decoration: none;
            color: #e11d48;
            border-radius: 6px;
            transition: all 0.3s ease;
            background-color: transparent;
            text-align: center;
            font-weight: 500;
            border: 1px solid #e11d48;
            font-size: 0.875rem;
        "
        onmouseover="this.style.backgroundColor='#e11d48'; this.style.color='white';"
        onmouseout="this.style.backgroundColor='transparent'; this.style.color='#e11d48';"
        onfocus="this.style.boxShadow='0 0 0 3px rgba(225, 29, 72, 0.3)';"
        onblur="this.style.boxShadow='none';"
    >
        Cancel
    </a>
</div>


            <p> If you need assistance, feel free to reach out to us at support@tujitume.com </p>

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
            
            <h2 class="email-title" style="font-size: 20px; margin-bottom: 20px;">Booking Rejected</h2>
            <p class="email-message" style="font-size: 12px; padding-top: 10px; line-height: 1.8; margin-bottom: 30px;">
                Dear Customer,<br>Your booking request for the service {{$business_name}} has
            been rejected by the service owner.. <br> Reason: {{$reason}}</p>

            <h5 style="margin-top: 8px;margin-bottom: 8px;">Booking Details:<h5>


            <p class="email-message" style="font-size: 12px; padding-top: 5px; line-height: 1.5; margin-bottom: 30px;">

                 <b>Booking ID:</b> #OO{{$id}}<br>
                 <b>Service Name:</b> {{$business_name}}<br>
                 <b>Requested Date:</b> {{$date}}<br>

                If you believe this rejection was made in error, please contact the service owner directly
                through Tujitume support.
            </p>



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