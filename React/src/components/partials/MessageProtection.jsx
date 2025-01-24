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
        .replace(phoneRegex, (phone) => {
            return phone[0] + "*".repeat(phone.length - 1);
        })
        // Mask abusive words with first and last letters visible
        .replace(abusiveRegex, (word) => {
            if (word.length <= 2) return word; // Skip masking for very short words
            return (
                word[0] + "*".repeat(word.length - 2) + word[word.length - 1]
            );
        });

    return protectedMessage;
};

export default MessageProtection;
