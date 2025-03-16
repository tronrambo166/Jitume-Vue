export const showMessageAlert = (
    alertContent,
    logoSrc,
    showAlert,
    onConfirm
) => {
    return new Promise((resolve) => {
        try {
            // Try to use $.alert if available
            if (typeof $.alert === "function") {
                $.alert({
                    title: false,
                    content: `
                        <div>
                            <div class="flex items-center mb-4">
                                <img src="${logoSrc}" alt="Tujitume Logo" style="max-width: 100px;" class="jconfirm-logo mr-4">
                                <h1 class="text-xl font-bold text-red-600">Alert</h1>
                            </div>
                            ${alertContent}
                        </div>
                    `,
                    buttons: {
                        send: {
                            text: "Send Message",
                            btnClass: "btn-green",
                            action: function () {
                                // Check if user wants to censor info based on which alert is showing
                                let shouldCensor = false;

                                // Check for email censoring option
                                const censorEmailInfo =
                                    document.getElementById("censorEmailInfo");
                                if (
                                    censorEmailInfo &&
                                    censorEmailInfo.checked
                                ) {
                                    shouldCensor = true;
                                }

                                // Check for phone censoring option
                                const censorPhoneInfo =
                                    document.getElementById("censorPhoneInfo");
                                if (
                                    censorPhoneInfo &&
                                    censorPhoneInfo.checked
                                ) {
                                    shouldCensor = true;
                                }

                                // Save "don't show again" preferences
                                const dontShowEmailAlert =
                                    document.getElementById(
                                        "dontShowEmailAlert"
                                    );
                                if (
                                    dontShowEmailAlert &&
                                    dontShowEmailAlert.checked
                                ) {
                                    localStorage.setItem(
                                        "hideEmailAlert",
                                        "true"
                                    );
                                }

                                const dontShowPhoneAlert =
                                    document.getElementById(
                                        "dontShowPhoneAlert"
                                    );
                                if (
                                    dontShowPhoneAlert &&
                                    dontShowPhoneAlert.checked
                                ) {
                                    localStorage.setItem(
                                        "hidePhoneAlert",
                                        "true"
                                    );
                                }

                                const dontShowAbusive =
                                    document.getElementById("dontShowAbusive");
                                if (
                                    dontShowAbusive &&
                                    dontShowAbusive.checked
                                ) {
                                    localStorage.setItem(
                                        "hideAbusiveAlert",
                                        "true"
                                    );
                                }

                                onConfirm(shouldCensor);
                                resolve();
                            },
                        },
                        cancel: {
                            text: "Cancel",
                            btnClass: "btn-red",
                            action: function () {
                                console.log("Message sending cancelled.");
                                resolve(false);
                            },
                        },
                    },
                });
            } else {
                // Fallback to using the built-in showAlert function
                const isEmailAlert = alertContent.includes("email address");
                const isPhoneAlert = alertContent.includes("phone number");
                const isAbusiveAlert = alertContent.includes(
                    "inappropriate language"
                );

                let alertType = "warning";
                let alertMessage =
                    "Your message contains sensitive information.";

                if (isEmailAlert) {
                    alertMessage =
                        "Your message contains an email address. Proceed?";
                } else if (isPhoneAlert) {
                    alertMessage =
                        "Your message contains a phone number. Proceed?";
                } else if (isAbusiveAlert) {
                    alertMessage =
                        "Your message contains inappropriate language.";
                }

                showAlert(alertType, alertMessage);

                // Simple confirm doesn't support checkbox, so we'll use a basic approach
                if (isEmailAlert || isPhoneAlert) {
                    if (
                        confirm(
                            "Would you like to censor this sensitive information?"
                        )
                    ) {
                        onConfirm(true); // Censor the info
                    } else {
                        onConfirm(false); // Don't censor
                    }
                } else {
                    // For abusive content, just confirm to proceed
                    if (confirm("Proceed with sending the message?")) {
                        onConfirm(true);
                    }
                }
                resolve();
            }
        } catch (error) {
            console.error("Error showing alert:", error);
            // Final fallback
            if (
                confirm(
                    "Your message contains sensitive information. Do you want to censor it?"
                )
            ) {
                onConfirm(true); // Censor the info
            } else {
                onConfirm(false); // Don't censor
            }
            resolve();
        }
    });
};
