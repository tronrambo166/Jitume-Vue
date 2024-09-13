<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Milestone Completion</title>
</head>
<body style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: #f8f9fa;">

    <!-- milestone section -->
    <div class="email-container" style="width: 80%; margin: 50px auto; background-color: #fff; padding: 20px; border-radius: 8px; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);">
        <div class="content" style="padding: 20px;">
            <h2 style="font-size: 20px; margin-bottom: 20px;">Completion of Milestone!</h2>
            <p class="email-message" style="font-size: 12px; padding-top: 10px; line-height: 1.8; margin-bottom: 30px;">
                Hi,<br>
                Milestone {{$mile_name}} of business {{$business_name}} is done and you can now review with the entrepreneur.<br>
                Do you want to Continue to the Next Milestone?
            </p>
            <div class="button-container" style="display: flex; margin-top: 20px;">
                <a target="_blank" href="http://127.0.0.1:8000/api/agreeToNextmile/{{$bid_id}}" class="button continue" style="display: inline-block; padding: 12px 24px; text-decoration: none; color: #fff; border-radius: 6px; transition: background-color 0.3s ease; background-color: green;">Continue</a>
                <a href="#" class="button cancel" style="display: inline-block; padding: 12px 24px; text-decoration: none; color: #dc3545; border-radius: 6px; transition: background-color 0.3s ease; margin-left: 10px;">Cancel</a>
            </div>
            <p class="thanks" style="text-align: center; color: rgb(13, 14, 13); margin-top: 20px; font-size: 14px;">Thanks!<br />Jitume Admin.</p>
        </div>
    </div>

   


   

    

    <!-- milestone done -->

    <!-- <div class="email-container" style="width: 80%; margin: 50px auto; background-color: #fff; padding: 20px; border-radius: 8px; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);">
        <div class="content" style="padding: 20px;">
            <h2 class="email-title" style="font-size: 20px; margin-bottom: 20px;">Congratulations!</h2>
            <p class="email-message" style="font-size: 12px; padding-top: 10px; line-height: 1.8; margin-bottom: 30px;">All Milestones are completed and Thomas Muller thanks you for your business!</p>
            <p class="thanks" style="text-align: center; color: rgb(13, 14, 13); margin-top: 20px; font-size: 14px;">Thanks!<br>Jitume Admin</p>
        </div>
    </div> -->


</body>
</html>
