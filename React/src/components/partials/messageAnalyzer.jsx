export const analyzeMessage = async (message) => {
    // Check for emails using a regex pattern
    const emailRegex = /[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/g;
    const emailMatches = message.match(emailRegex);
    const emailsFound = emailMatches !== null;

    // Check for phone numbers using a regex pattern
    const phoneRegex =
        /(\+\d{1,3}[-.\s]?)?\(?\d{3}\)?[-.\s]?\d{3}[-.\s]?\d{4}/g;
    const phoneMatches = message.match(phoneRegex);
    const phonesFound = phoneMatches !== null;

    // Save detected sensitive information for later comparison
    const detectedEmails = emailMatches || [];
    const detectedPhones = phoneMatches || [];

    // Create different censoring versions
    const originalMessage = message;

    // Only emails censored
    let emailCensoredMessage = message;
    if (emailsFound) {
        emailCensoredMessage = emailCensoredMessage.replace(
            emailRegex,
            "***@***.***"
        );
    }

    // Only phones censored
    let phoneCensoredMessage = message;
    if (phonesFound) {
        phoneCensoredMessage = phoneCensoredMessage.replace(
            phoneRegex,
            "***-***-****"
        );
    }

    // Both emails and phones censored
    let sensitiveInfoCensoredMessage = message;
    if (emailsFound) {
        sensitiveInfoCensoredMessage = sensitiveInfoCensoredMessage.replace(
            emailRegex,
            "***@***.***"
        );
    }
    if (phonesFound) {
        sensitiveInfoCensoredMessage = sensitiveInfoCensoredMessage.replace(
            phoneRegex,
            "***-***-****"
        );
    }

    // API key for bad words detection
    const apiKey = "EQl5DJtJ4wUCjObM9efr7Bz7xjcWdMRX";

    // Check for abusive words using APILayer
    let abusiveWordsFound = false;
    let abusiveCensoredMessage = message; // Original message with only abusive words censored
    let protectedMessage = sensitiveInfoCensoredMessage; // Message with all types of censoring applied

    // Create a message for the bad words check that removes the detected sensitive info first
    // to prevent false positives from censored patterns
    let messageForBadWordsCheck = message;

    // Remove actual email addresses and phone numbers for bad words check
    // This prevents false positives when the API sees "***@***.***" patterns
    if (emailsFound) {
        for (const email of detectedEmails) {
            messageForBadWordsCheck = messageForBadWordsCheck.replace(
                email,
                " "
            );
        }
    }

    if (phonesFound) {
        for (const phone of detectedPhones) {
            messageForBadWordsCheck = messageForBadWordsCheck.replace(
                phone,
                " "
            );
        }
    }

    try {
        const myHeaders = new Headers();
        myHeaders.append("apikey", apiKey);
        myHeaders.append("Content-Type", "text/plain");

        const requestOptions = {
            method: "POST",
            headers: myHeaders,
            body: messageForBadWordsCheck, // Use the clean message without sensitive info
            redirect: "follow",
        };

        const response = await fetch(
            "https://api.apilayer.com/bad_words?censor_character=*",
            requestOptions
        );

        if (response.ok) {
            const data = await response.json();
            console.log("Bad words API response:", data);

            // Check if any bad words were found
            abusiveWordsFound = data.bad_words_total > 0;

            // Additional validation: If the only "bad words" detected were parts of emails or phone numbers
            // (which we removed before sending), then this is a false positive
            if (abusiveWordsFound && data.bad_words_list) {
                // If the bad words list is empty or only contains common parts of emails/phones, ignore
                const commonFalsePositives = ["ass", "sex", "xxx"];
                const realBadWords = data.bad_words_list.filter((word) => {
                    // Check if this "bad word" is just part of an email or phone
                    const isPartOfEmail = detectedEmails.some((email) =>
                        email.includes(word.word)
                    );
                    const isPartOfPhone = detectedPhones.some((phone) =>
                        phone.includes(word.word)
                    );
                    const isCommonFalsePositive = commonFalsePositives.includes(
                        word.word
                    );

                    return (
                        !isPartOfEmail &&
                        !isPartOfPhone &&
                        !isCommonFalsePositive
                    );
                });

                // Update the abusive flag based on our filtered list
                abusiveWordsFound = realBadWords.length > 0;
            }

            // If bad words were found and censored response is available, use it
            if (abusiveWordsFound && data.censored_content) {
                // Use the censored content directly from the API
                abusiveCensoredMessage = data.censored_content;

                // Also use this censored content as the base for the protected message
                protectedMessage = data.censored_content;

                // Then add email and phone censoring to the protected message if needed
                if (emailsFound) {
                    protectedMessage = protectedMessage.replace(
                        emailRegex,
                        "***@***.***"
                    );
                }
                if (phonesFound) {
                    protectedMessage = protectedMessage.replace(
                        phoneRegex,
                        "***-***-****"
                    );
                }
            }
        } else {
            console.error("Bad words API error:", response.statusText);
        }
    } catch (error) {
        console.error("Error calling bad words API:", error);
    }

    console.log({
        abusiveWordsFound,
        emailsFound,
        phonesFound,
        protectedMessage,
    });

    return {
        protectedMessage, // Everything censored (emails + phones + abusive)
        emailCensoredMessage, // Only emails censored
        phoneCensoredMessage, // Only phones censored
        sensitiveInfoCensoredMessage, // Emails and phones censored
        abusiveCensoredMessage, // Only abusive language censored
        abusiveWordsFound,
        emailsFound,
        phonesFound,
    };
};
