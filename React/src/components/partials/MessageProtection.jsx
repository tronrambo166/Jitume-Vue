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

    // Check for abusive words
    const abusiveWordsFound = abusiveRegex.test(message);

    // Mask abusive words with first and last letters visible
    let protectedMessage = message.replace(abusiveRegex, (word) => {
        if (word.length <= 2) return word; // Skip masking for very short words
        return word[0] + "*".repeat(word.length - 2) + word[word.length - 1];
    });

    // Check for email addresses and phone numbers without masking
    const emailsFound = message.match(emailRegex);
    const phonesFound = message.match(phoneRegex);

    // Return the results: protected message, whether abusive words were found,
    // and the found emails and phone numbers
    return {
        protectedMessage,
        abusiveWordsFound,
        emailsFound, // List of found emails
        phonesFound, // List of found phone numbers
    };
};

export default MessageProtection;
