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

            // Start with the original message that will be gradually updated based on alerts
            let currentMessage = message;
            let alertsShown = false;

            // First, check for abusive content - if found, always censor it regardless of other alerts
            if (abusiveWordsFound) {
                currentMessage = abusiveCensoredMessage;
            }

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
                            // Apply email censoring if requested
                            if (censorEmail) {
                                if (currentMessage === message) {
                                    currentMessage = emailCensoredMessage;
                                } else if (
                                    currentMessage === abusiveCensoredMessage
                                ) {
                                    // If abusive words already censored, now also censor email
                                    const tempMsg =
                                        abusiveCensoredMessage.replace(
                                            /[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/g,
                                            "***@***.***"
                                        );
                                    currentMessage = tempMsg;
                                }
                            }
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
                            // Apply phone censoring if requested
                            if (censorPhone) {
                                if (currentMessage === message) {
                                    currentMessage = phoneCensoredMessage;
                                } else if (
                                    currentMessage === emailCensoredMessage
                                ) {
                                    currentMessage =
                                        sensitiveInfoCensoredMessage; // Both email and phone censored
                                } else if (
                                    currentMessage === abusiveCensoredMessage
                                ) {
                                    // If abusive words already censored, now also censor phone
                                    const tempMsg =
                                        abusiveCensoredMessage.replace(
                                            /(\+\d{1,3}[-.\s]?)?\(?\d{3}\)?[-.\s]?\d{3}[-.\s]?\d{4}/g,
                                            "***-***-****"
                                        );
                                    currentMessage = tempMsg;
                                }
                            }
                            resolve();
                        }
                    );
                });
            }

            // Handle abusive language alert separately (but don't re-censor content)
            if (abusiveWordsFound && (abusiveCount > 5 || !hideAbusiveAlert)) {
                alertsShown = true;
                const alertContent = createAbusiveAlertContent();

                await new Promise((resolve) => {
                    showMessageAlert(
                        alertContent,
                        TujitumeLogo,
                        showAlert,
                        () => {
                            // No need to modify the message here - already handled abusive content above
                            resolve();
                        }
                    );
                });
            }

            // Send the final message (with any applicable censoring)
            sendCallback(currentMessage, id, service_id, from_id);
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
