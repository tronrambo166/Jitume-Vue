// Description: This component converts USD to local currency based on the user's location.
import React, { useState, useEffect } from "react";

// Cache for exchange rates
let cachedRate = null;
let lastFetchTime = 0;

const convertUsdToLocal = async (usdAmount) => {
    try {
        const numericAmount =
            typeof usdAmount === "string"
                ? parseFloat(usdAmount.replace(/,/g, ""))
                : Number(usdAmount);

        if (isNaN(numericAmount)) {
            throw new Error("Invalid amount");
        }

        const now = Date.now();
        if (cachedRate && now - lastFetchTime < 3600000) {
            const converted = numericAmount * cachedRate.rate;
            return {
                amount: numericAmount,
                converted: new Intl.NumberFormat().format(converted.toFixed(2)),
                currency: cachedRate.currency,
                fromCache: true,
            };
        }

        const locationRes = await fetch(
            "https://www.cloudflare.com/cdn-cgi/trace"
        );
        const locationText = await locationRes.text();
        const locData = Object.fromEntries(
            locationText
                .split("\n")
                .filter(Boolean)
                .map((line) => line.split("="))
        );

        if (!locData.loc) throw new Error("Location detection failed");

        if (locData.loc === "US") {
            return {
                amount: numericAmount,
                converted: new Intl.NumberFormat().format(
                    numericAmount.toFixed(2)
                ),
                currency: "USD",
                isUSD: true,
            };
        }

        const countryRes = await fetch(
            `https://restcountries.com/v3.1/alpha/${locData.loc}`
        );
        const [countryData] = await countryRes.json();
        const currencyCode = Object.keys(countryData.currencies)[0];

        const exchangeRes = await fetch(
            "https://api.exchangerate-api.com/v4/latest/USD"
        );
        const exchangeData = await exchangeRes.json();
        const rate = exchangeData.rates[currencyCode];

        cachedRate = { rate, currency: currencyCode };
        lastFetchTime = now;

        const converted = numericAmount * rate;

        return {
            amount: numericAmount,
            converted: new Intl.NumberFormat().format(converted.toFixed(2)),
            currency: currencyCode,
        };
    } catch (error) {
        console.error("Conversion failed, using USD as fallback", error);
        const fallbackAmount =
            typeof usdAmount === "number"
                ? usdAmount.toFixed(2)
                : typeof usdAmount === "string"
                ? parseFloat(usdAmount.replace(/,/g, "")).toFixed(2)
                : "0.00";

        return {
            amount: fallbackAmount,
            converted: new Intl.NumberFormat().format(fallbackAmount),
            currency: "USD",
            error: true,
        };
    }
};

const SkeletonLoader = () => {
    return (
        <div className="skeleton-loader">
            <div
                className="skeleton-line"
                style={{ width: "100px", height: "24px" }}
            ></div>
        </div>
    );
};

const UsdToLocalCurrency = ({ amount }) => {
    const [conversion, setConversion] = useState({
        loading: true,
        amount: amount,
        converted:
            typeof amount === "number"
                ? new Intl.NumberFormat().format(amount.toFixed(2))
                : "0.00",
        currency: "USD",
        error: null,
    });

    useEffect(() => {
        const convert = async () => {
            try {
                setConversion((prev) => ({ ...prev, loading: true }));
                const result = await convertUsdToLocal(amount);
                setConversion({
                    ...result,
                    loading: false,
                    error: result.error ? "Conversion unavailable" : null,
                });
            } catch (err) {
                const fallbackAmount =
                    typeof amount === "number"
                        ? amount.toFixed(2)
                        : typeof amount === "string"
                        ? parseFloat(amount.replace(/,/g, "")).toFixed(2)
                        : "0.00";

                setConversion({
                    amount: fallbackAmount,
                    converted: new Intl.NumberFormat().format(fallbackAmount),
                    currency: "USD",
                    loading: false,
                    error: "Conversion failed",
                });
            }
        };
        convert();
    }, [amount]);

    if (conversion.loading) return <SkeletonLoader />;

    return (
        <div className="currency-converter">
            {conversion.isUSD ? (
                <span className="original-amount">${conversion.converted}</span>
            ) : !conversion.error ? (
                <span className="converted-amount">
                    {conversion.currency} {conversion.converted}
                </span>
            ) : (
                <span className="conversion-error">
                    ${conversion.converted}
                </span>
            )}
        </div>
    );
};

export default UsdToLocalCurrency;
