<!--Hidden Cart view-->

<div style="
        max-width: 1024px;
        margin-left: auto;
        margin-right: auto;
        margin-top: 4rem;
        background-color: white;
        border-radius: 0.5rem;
        box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
        overflow: hidden;
        position: relative;
    ">
    <!-- Header with Logo -->
    <div style="
            background-color: #14532d;
            padding: 0.9rem 0;
            text-align: center;
            color: #ffffff;
            position: relative;
            z-index: 10;
        ">
        <img src="{{ $message->embed('https://tujitume.com/images/Email/EmailWhite.png')}}" alt="Company Logo"
            style="height: 3rem; width: auto; margin: 0 auto" />
        <h1 style="font-size: 2rem; font-weight: 700; margin-top: 1rem">
            Milestone Status Changed to Done
        </h1>
    </div>

    <div style="padding: 20px; text-align: center; font-family: sans-serif; background: #f9f9f9; border-radius: 8px;">
        <h2 style="color: black; font-size: 1.5rem; font-weight: bold; margin-bottom: 15px;">
            Milestone Status Changed to Done
        </h2>

        <div
            style="width: 60%; margin: auto; background: white; padding: 15px; border-radius: 8px; box-shadow: 0 2px 4px rgba(0,0,0,0.1); text-align: left;">
            <h4 style="font-weight: 500; color: #555; font-size: 1rem; margin-bottom: 8px;">
                <strong>Milestone Name:</strong> {{$name}}
            </h4>
            <h4 style="font-weight: 500; color: #555; font-size: 1rem; margin-bottom: 8px;">
                <strong>Amount:</strong> {{$amount}}
            </h4>
            <h4 style="font-weight: 500; color: #555; font-size: 1rem;">
                <strong>Service Name:</strong> {{$business}}
            </h4>
        </div>

        <div class="footer" style="
                    margin-top: 2rem;
                    text-align: start;
                    color: gray;
                    font-size: 12px;
                ">
            <p>
                <img src="{{ $message->embed('https://tujitume.com/images/Email/EmailVertDark.png')}}"
                    alt="Company Logo" style="
                            height: 3rem;
                            width: auto;
                            float: left;
                            margin-right: 1rem;
                            margin-top: -0.2rem;
                            margin-bottom: 4rem;
                        " />
            </p>
            <p style="font-weight: 600">
                Best regards, <br />
            <div style="margin-bottom:3px;" ">The Tujitume Team</div> 
                </p>
            </div>
	</div>

</div>

<script
    src=" https://code.jquery.com/jquery-3.4.1.min.js" integrity="sha256-CSXorXvZcTkaix6Yvo6HppcZGetbYMGWSFlBw8HfCJo="
                crossorigin="anonymous">
                </script>

                <script src="https://cdn.jsdelivr.net/npm/popper.js@1.16.0/dist/umd/popper.min.js"
                    integrity="sha384-Q6E9RHvbIyZFJoft+2mJbHaEWldlvI9IOYy5n3zV9zzTtmI3UksdQRVvoxMfooAo"
                    crossorigin="anonymous"></script>
                <script src="https://stackpath.bootstrapcdn.com/bootstrap/4.4.1/js/bootstrap.min.js"
                    integrity="sha384-wfSDF2E50Y2D1uUdj0O3uMBJnjuUD4Ih7YwaYd1iqfktj0Uod8GCExl3Og8ifwB6"
                    crossorigin="anonymous"></script>

                <!--Hidden Cart view-->