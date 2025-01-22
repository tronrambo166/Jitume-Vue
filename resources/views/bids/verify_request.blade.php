<!--Hidden Cart view-->
<!-- import tailwind css -->
<script src="https://cdn.tailwindcss.com"></script>

<!-- Header with Logo -->
<div
    class="max-w-4xl mx-auto mt-16 bg-white rounded-lg shadow-lg overflow-hidden relative"
>
    <div>
        <div class="bg-green-900 py-10 text-center text-white relative z-10">
            <img
                src="../../../React/src/images/TujitumeLogo.svg"
                alt="Company Logo"
                class="h-12 w-auto mx-auto"
            />
            <h1 class="text-3xl font-bold mt-4">Equipment Verify request!</h1>
        </div>
    </div>
    <!-- Bid Rejected -->
    <div class="email-container">
        <div class="content" style="padding: 20px">
            <h2
                class="email-title"
                style="font-size: 20px; margin-bottom: 20px"
            >
               
            </h2>
            <p
                class="email-message"
                style="font-size: 12px; line-height: 1.8; margin-bottom: 30px"
            >
                Hi,<br />Someone requested you to verify their Equipment regarding to a bid to business {{$business_name}}. Please goto dashboard notifications to review.
            </p>

            <a
                target="_blank"
                href="<?php echo config('app.app_url');?>dashboard"
                class="bg-blue-800 text-white px-6 py-3 hover:no-underline rounded-lg transition hover:bg-blue-900"
            >
                Review</a
            >

            <div class="mt-8 text-center text-gray-500 text-sm">
                <p>
                    Thank you for using
                    <span class="font-semibold">Tujitume</span>!
                </p>
                <p class="font-semibold">Best regards,</p>

                <p>The Tujitume Team</p>
                <!-- <p class="mt-2">© 2025 Tujitume. All rights reserved.</p> -->
            </div>
        </div>
    </div>
</div>

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

<!--Hidden Cart view-->
