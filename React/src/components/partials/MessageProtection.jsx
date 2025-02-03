const checkAndReplaceAbusiveWords = async (message) => {
    const myHeaders = new Headers();
    myHeaders.append("apikey", "EQl5DJtJ4wUCjObM9efr7Bz7xjcWdMRX");

    const requestOptions = {
        method: "POST",
        redirect: "follow",
        headers: myHeaders,
        body: message,
    };

    try {
        const response = await fetch(
            "https://api.apilayer.com/bad_words?censor_character=*",
            requestOptions
        );
        const result = await response.json();

        return result.censored_content || message; // Return censored message or original
    } catch (error) {
        console.log("Error while checking abusive words:", error);
        return message; // Return original message if API call fails
    }
};

const MessageProtection = async (message) => {
    // Regex to detect email addresses
    const emailRegex = /\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b/g;

    // Regex to detect phone numbers (basic example for digits with optional separators)
    const phoneRegex =
        /(\+?\d{1,3}?[-.\s]?)?(\(?\d{3}\)?[-.\s]?)?\d{3}[-.\s]?\d{4}/g;

    // Check for abusive words using API
    const protectedMessage = await checkAndReplaceAbusiveWords(message);

    // Check for email addresses and phone numbers
    const emailsFound = message.match(emailRegex);
    const phonesFound = message.match(phoneRegex);

    return {
        protectedMessage,
        abusiveWordsFound: protectedMessage !== message, // If different, abusive words were found
        emailsFound,
        phonesFound,
    };
};

export default MessageProtection;
