<!DOCTYPE html>
<html lang="en">
    <head>
        <meta charset="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>Milestone Completion</title>
        <script src="https://cdn.tailwindcss.com"></script>
    </head>
    <body
        style="
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            background-color: #f8f9fa;
        "
    >
        <div
            class="max-w-4xl mx-auto mt-16 bg-white rounded-lg shadow-lg overflow-hidden relative"
        >
            <!-- Header with Logo -->
            <div
                class="bg-green-900 py-10 text-center text-white relative z-10"
            >
                <img
                    src="../../../React/src/images/TujitumeLogo.svg"
                    alt="Company Logo"
                    class="h-12 w-auto mx-auto"
                />
                <h1 class="text-3xl font-bold mt-4">Milestone Completed!</h1>
            </div>
            <!-- milestone section -->
            <div
                class="email-container"
               
            >
                <div class="content" style="padding: 20px">
                    <h2 style="font-size: 20px; margin-bottom: 20px">
                        Completion of Milestone!
                    </h2>
                    <p
                        class="email-message"
                        style="
                            font-size: 12px;
                            padding-top: 10px;
                            line-height: 1.8;
                            margin-bottom: 30px;
                        "
                    >
                        Hi,<br />
                        Milestone {{$mile_name}} of business {{$business_name}}
                        is done and you can now review with the entrepreneur.<br />
                        Do you want to Continue to the Next Milestone?
                    </p>
                    <div
                        class="button-container"
                        style="display: flex; margin-top: 20px"
                    >
                        <a
                            target="_blank"
                            href="<?php echo config('app.api_url');?>agreeToNextmile/{{$bid_id}}"
                           class="text-green-700 hover:text-white border border-green-700 hover:bg-green-800 focus:ring-4 focus:outline-none focus:ring-green-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center me-2 mb-2 dark:border-green-500 dark:text-green-900 dark:hover:text-white dark:hover:bg-green-600 dark:focus:ring-green-800"
                            >Continue</a
                        >
                        <a
                            href="#"
                            class="text-red-700 hover:text-white border border-red-700 hover:bg-red-800 focus:ring-4 focus:outline-none focus:ring-red-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center me-2 mb-2 dark:border-red-500 dark:text-red-900 dark:hover:text-white dark:hover:bg-red-600 dark:focus:ring-red-800"
                            >Cancel</a
                        >
                    </div>
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
