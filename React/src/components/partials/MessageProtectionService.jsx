import React from "react";
import TujitumeLogo from "../../images/Tujitumelogo.svg";
import { analyzeMessage } from "./messageAnalyzer";
import { showMessageAlert } from "./messageAlert";
import {
    createEmailAlertContent,
    createPhoneAlertContent,
    createAbusiveAlertContent,
} from "./alertContent";

function useMessageProtection(showAlert) {
    const processMessage = async (
        message,
        id,
        service_id,
        from_id,
        sendCallback
    ) => {
        if (!message.trim()) return; // Prevent sending empty messages

        try {
            // Process the message through the protection logic
            const {
                protectedMessage,
                emailCensoredMessage,
                phoneCensoredMessage,
                sensitiveInfoCensoredMessage,
                abusiveCensoredMessage,
                abusiveWordsFound,
                emailsFound,
                phonesFound,
            } = await analyzeMessage(message);

            // Track abusive message count
            let abusiveCount =
                parseInt(localStorage.getItem("abusiveCount")) || 0;
            if (abusiveWordsFound) abusiveCount += 1;
            localStorage.setItem("abusiveCount", abusiveCount);

            // Get user's preferences from localStorage
            const hideEmailAlert =
                localStorage.getItem("hideEmailAlert") === "true";
            const hidePhoneAlert =
                localStorage.getItem("hidePhoneAlert") === "true";
            const hideAbusiveAlert =
                localStorage.getItem("hideAbusiveAlert") === "true";

            // Keep track of what needs to be censored
            let shouldCensorEmails = false;
            let shouldCensorPhones = false;
            let shouldCensorAbusive = abusiveWordsFound; // Always censor abusive content if found

            let alertsShown = false;

            // Handle email alert
            if (emailsFound && !hideEmailAlert) {
                alertsShown = true;
                const alertContent = createEmailAlertContent();

                await new Promise((resolve) => {
                    showMessageAlert(
                        alertContent,
                        TujitumeLogo,
                        showAlert,
                        (censorEmail) => {
                            shouldCensorEmails = censorEmail;
                            resolve();
                        }
                    );
                });
            }

            // Handle phone alert
            if (phonesFound && !hidePhoneAlert) {
                alertsShown = true;
                const alertContent = createPhoneAlertContent();

                await new Promise((resolve) => {
                    showMessageAlert(
                        alertContent,
                        TujitumeLogo,
                        showAlert,
                        (censorPhone) => {
                            shouldCensorPhones = censorPhone;
                            resolve();
                        }
                    );
                });
            }

            // Handle abusive language alert separately
            if (abusiveWordsFound && (abusiveCount > 5 || !hideAbusiveAlert)) {
                alertsShown = true;
                const alertContent = createAbusiveAlertContent();

                await new Promise((resolve) => {
                    showMessageAlert(
                        alertContent,
                        TujitumeLogo,
                        showAlert,
                        () => {
                            // No user choice needed - we always censor abusive content
                            resolve();
                        }
                    );
                });
            }

            // Now apply all the censoring based on what was determined above
            let finalMessage = message;

            // Apply censoring based on what was decided in the alerts
            if (
                shouldCensorEmails &&
                shouldCensorPhones &&
                shouldCensorAbusive
            ) {
                // Everything needs to be censored
                finalMessage = protectedMessage;
            } else if (shouldCensorEmails && shouldCensorPhones) {
                // Only emails and phones
                finalMessage = sensitiveInfoCensoredMessage;
            } else if (shouldCensorEmails && shouldCensorAbusive) {
                // Emails and abusive content
                finalMessage = message;
                // First censor abusive words
                finalMessage = abusiveCensoredMessage;
                // Then censor emails
                finalMessage = finalMessage.replace(
                    /[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/g,
                    "***@***.***"
                );
            } else if (shouldCensorPhones && shouldCensorAbusive) {
                // Phones and abusive content
                finalMessage = message;
                // First censor abusive words
                finalMessage = abusiveCensoredMessage;
                // Then censor phones
                finalMessage = finalMessage.replace(
                    /(\+\d{1,3}[-.\s]?)?\(?\d{3}\)?[-.\s]?\d{3}[-.\s]?\d{4}/g,
                    "***-***-****"
                );
            } else if (shouldCensorEmails) {
                // Only emails
                finalMessage = emailCensoredMessage;
            } else if (shouldCensorPhones) {
                // Only phones
                finalMessage = phoneCensoredMessage;
            } else if (shouldCensorAbusive) {
                // Only abusive content
                finalMessage = abusiveCensoredMessage;
            }

            // Debug logs to verify what's happening
            console.log("Message analysis results:", {
                originalMessage: message,
                finalMessage,
                abusiveWordsFound,
                emailsFound,
                phonesFound,
                shouldCensorAbusive,
                shouldCensorEmails,
                shouldCensorPhones,
            });

            // Send the final message (with any applicable censoring)
            sendCallback(finalMessage, id, service_id, from_id);
        } catch (error) {
            console.error("Error in message protection:", error);
            // If there's an error in the protection service, still allow the message to be sent
            sendCallback(message, id, service_id, from_id);
        }
    };

    return {
        processMessage,
    };
}

export default useMessageProtection;
