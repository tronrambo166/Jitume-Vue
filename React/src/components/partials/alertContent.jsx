export const createEmailAlertContent = () => {
    return `
        <h2 class="text-lg font-semibold mb-4">Your message contains an email address.</h2>
        <p>Sharing email addresses in messages can be risky and may expose you to spam or phishing attempts.</p>
        <p class="mt-2 text-red-600">Consider using our secure messaging system instead of sharing direct contact information.</p>
        <div class="flex items-center mt-4">
            <input type="checkbox" id="censorEmailInfo" class="mr-2">
            <label for="censorEmailInfo" class="text-sm font-medium">Send with censored email (***@***.***)</label>
        </div>
        <div class="flex items-center mt-2">
            <input type="checkbox" id="dontShowEmailAlert" class="mr-2">
            <label for="dontShowEmailAlert" class="text-sm">Don't show this alert again</label>
        </div>
    `;
};

export const createPhoneAlertContent = () => {
    return `
        <h2 class="text-lg font-semibold mb-4">Your message contains a phone number.</h2>
        <p>Sharing phone numbers in messages can lead to unwanted calls or messages and compromise your privacy.</p>
        <p class="mt-2 text-red-600">We recommend using our platform's built-in communication tools instead.</p>
        <div class="flex items-center mt-4">
            <input type="checkbox" id="censorPhoneInfo" class="mr-2">
            <label for="censorPhoneInfo" class="text-sm font-medium">Send with censored phone number (***-***-****)</label>
        </div>
        <div class="flex items-center mt-2">
            <input type="checkbox" id="dontShowPhoneAlert" class="mr-2">
            <label for="dontShowPhoneAlert" class="text-sm">Don't show this alert again</label>
        </div>
    `;
};

export const createAbusiveAlertContent = () => {
    return `
        <h2 class="text-lg font-semibold mb-4">Your message contains inappropriate language.</h2>
        <p>Continued use of abusive language may result in temporary or permanent suspension from the messaging system. Please keep the conversation respectful.</p>
        <div class="flex items-center mt-4">
            <input type="checkbox" id="dontShowAbusive" class="mr-2">
            <label for="dontShowAbusive" class="text-sm">Don't show this alert again</label>
        </div>
    `;
};
