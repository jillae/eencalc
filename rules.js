// rules.js
import machineData from './machineData.json';

// Funktion för att beräkna leasingkostnad
export function calculateLeasingCost(machinePrice, leasingPeriod, insurance) {
    if (machinePrice <= 0 || leasingPeriod === 0) return 0;

    const exchangeRate = 11.49260; // Fallback-värde för EUR till SEK
    const shippingCostEur = 652;
    const tariff = leasingPeriod / 100;
    const priceSek = (machinePrice + shippingCostEur) * exchangeRate;
    let monthlyCost = priceSek * tariff;

    if (insurance === "ja") {
        const insuranceRates = {
            10000: 0.04,
            20000: 0.03,
            50000: 0.025,
            Infinity: 0.015
        };

        for (const [limit, rate] of Object.entries(insuranceRates)) {
            if (machinePrice <= parseFloat(limit)) {
                monthlyCost += (priceSek * rate) / 12;
                break;
            }
        }
    }

    return Math.round(monthlyCost);
}

// Funktion för att beräkna kreditkostnad
export function calculateCreditCost(treatmentsPerDay, machineId) {
    const machine = machineData[machineId];
    if (!machine || !machine.hasCredits) return 0;

    if (treatmentsPerDay >= 3) {
        return machine.flatrate; // Flatrate om behandlingar >= 3
    } else {
        return Math.round(treatmentsPerDay * machine.creditMin * 22); // Per behandling
    }
}