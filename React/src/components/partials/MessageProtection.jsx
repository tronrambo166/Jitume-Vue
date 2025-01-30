const MessageProtection = (message) => {
    // Regex to detect email addresses
    const emailRegex = /\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b/g;

    // Regex to detect phone numbers (basic example for digits with optional separators)
    const phoneRegex =
        /(\+?\d{1,3}?[-.\s]?)?(\(?\d{3}\)?[-.\s]?)?\d{3}[-.\s]?\d{4}/g;

    // List of abusive words to censor
    const abusiveWords = [
        "stupid",
        "idiot",
        "useless",
        "terrible",
        "horrible",
        "awful",
        "ridiculous",
        "nonsense",
        "pathetic",
        "disgusting",
        "dumb",
        "worst",
        "garbage",
        "trash",
        "failure",
        "incompetent",
        "lazy",
        "ignorant",
        "fraud",
        "liar",
        "cheat",
        "scam",
        "rude",
        "annoying",
        "unacceptable",
        "crap",
        "sucks",
        "broken",
        "overpriced",
        "worthless",
    ];

    // Create a regex to detect abusive words (case-insensitive)
    const abusiveRegex = new RegExp(`\\b(${abusiveWords.join("|")})\\b`, "gi");

    // Mask email addresses
    let protectedMessage = message
        .replace(emailRegex, (email) => {
            const [localPart, domain] = email.split("@");
            return `${localPart[0]}${"*".repeat(
                localPart.length - 1
            )}@${domain}`;
        })
        // Mask phone numbers
        .replace(
            phoneRegex,
            (phone) => phone[0] + "*".repeat(phone.length - 1)
        );

    // Check for abusive words
    const abusiveWordsFound = abusiveRegex.test(message);

    // Mask abusive words with first and last letters visible
    protectedMessage = protectedMessage.replace(abusiveRegex, (word) => {
        if (word.length <= 2) return word; // Skip masking for very short words
        return word[0] + "*".repeat(word.length - 2) + word[word.length - 1];
    });

    return { protectedMessage, abusiveWordsFound };
};

const handleMessage = (newMessage) => {
    // Protect or encrypt the message using MessageProtection
    const { protectedMessage, abusiveWordsFound } =
        MessageProtection(newMessage);

    // Check if the protected message is different from the original message (sensitive info check)
    if (protectedMessage !== newMessage) {
        // If the message was altered by the protection (e.g., email or phone masked)
        showAlert("info", "Your message contains sensitive information.");
    }

    // Check for abusive language
    if (abusiveWordsFound) {
        showAlert(
            "error",
            "Your message contains sensitive language that violates our community guidelines. Continued use of abusive language may result in temporary or permanent suspension from the messaging system. Please keep the conversation respectful."
        );
    }
};

export default MessageProtection;
