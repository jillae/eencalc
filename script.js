// --- machineData object moved to the top ---
const machineData = {
    "99500": { leasingMin: 20666, leasingMax: 24114, creditMin: 149, creditMax: 299, flatrate: 5996, hasCredits: true, name: "Emerald" },
    "37500": { leasingMin: 7872, leasingMax: 9186, creditMin: 75, creditMax: 159, flatrate: 3296, hasCredits: true, name: "FX 635" },
    "44500": { leasingMin: 9317, leasingMax: 10871, creditMin: 95, creditMax: 199, flatrate: 4176, hasCredits: true, name: "FX 405" },
    "45900": { leasingMin: 9605, leasingMax: 11208, creditMin: 99, creditMax: 199, flatrate: 4356, hasCredits: true, name: "Zerona" },
    "9900": { leasingMin: 0, leasingMax: 0, creditMin: 0, creditMax: 0, flatrate: 0, hasCredits: false, name: "XLR8" },
    "17900": { leasingMin: 0, leasingMax: 0, creditMin: 0, creditMax: 0, flatrate: 0, hasCredits: false, name: "EVRL" },
    "19900": { leasingMin: 0, leasingMax: 0, creditMin: 0, creditMax: 0, flatrate: 0, hasCredits: false, name: "GVL" },
    "30900": { leasingMin: 0, leasingMax: 0, creditMin: 0, creditMax: 0, flatrate: 0, hasCredits: false, name: "Base Station" },
    "25900": { leasingMin: 0, leasingMax: 0, creditMin: 0, creditMax: 0, flatrate: 0, hasCredits: false, name: "Lunula" }
};
// --- End of machineData object ---

function resetForm() {
    leasingCostInput.value = "0";
    leasingCostSlider.value = "0";
    creditCostInput.value = "0";
    flatrateCostInput.value = "0";
    const creditsGroup = document.querySelector('.credits-group');
    const flatrateContainerElement = document.querySelector('.flatrate-container'); // Renamed for clarity

    if (creditsGroup) { // Null check before accessing classList
        creditsGroup.classList.add('hidden');
    } else {
        console.warn("creditsGroup element not found during resetForm()"); // Debug log
    }
    if (flatrateContainerElement) { // Null check before accessing classList
        flatrateContainerElement.classList.add('hidden');
    } else {
        console.warn("flatrateContainer element not found during resetForm()"); // Debug log
    }
    updateCalculations();
}

const treatmentsPerDayInput = document.getElementById("treatmentsPerDayInput");
const revenuePerTreatmentInput = document.getElementById("revenuePerTreatmentInput");
const leasingCostInput = document.getElementById("leasingCostInput");
const creditCostInput = document.getElementById("creditCostInput"); // ÄNDRAT från creditCost
const clinicSizeSlider = document.getElementById("clinicSizeSlider");
const resultTableBody = document.getElementById("resultTable").getElementsByTagName("tbody")[0];
const machineSelect = document.getElementById("machine");
const insuranceSelect = document.getElementById("insuranceSelect");
const leasingPeriodSelect = document.getElementById("leasingPeriodSelect"); // ÄNDRAT från leasingPeriod
const leasingCostSlider = document.getElementById("leasingCostSlider");
const leasingMin = document.getElementById("leasingMin");
const leasingMax = document.getElementById("leasingMax");
const flatrateCostInput = document.getElementById("flatrateCostInput"); // ÄNDRAT från flatrateCost
const flatrateContainer = document.getElementById("flatrateContainer");

let fetchedMachineData = {};

async function fetchMachineData() {
    try {
        const response = await fetch('machineData.json');
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        fetchedMachineData = await response.json();
        console.log("Machine data fetched successfully:", fetchedMachineData); // ADDED CONSOLE LOG
        populateMachineOptions(fetchedMachineData);
    } catch (error) {
        console.error("Could not fetch machine data, using default data:", error);
        populateMachineOptions(machineData); // USE DEFAULT DATA IF FETCH FAILS
    }
}

function populateMachineOptions(data) {
    console.log("Data received in populateMachineOptions:", data); // ADDED CONSOLE LOG
    const machineSelect = document.getElementById("machine");
    machineSelect.innerHTML = '<option value="0" selected>Välj maskin</option>';
    for (const price in data) {
        if (data.hasOwnProperty(price)) {
            try {
                const option = document.createElement("option");
                option.value = price;
                option.textContent = data[price].name;
                machineSelect.appendChild(option);
            } catch (error) {
                console.error("Error creating or appending option:", error);
            }
        }
    }
    // Try forcing a redraw
    if (machineSelect) {
        machineSelect.style.display = 'none';
        machineSelect.offsetHeight; // Trigger reflow
        machineSelect.style.display = '';
    }
}

function updateCalculations() {
    const machine = machineSelect.value;
    const leasingCost = parseFloat(leasingCostInput.value);
    const treatmentsPerDay = parseFloat(treatmentsPerDayInput.value);

    if (isNaN(leasingCost)) {
        console.error("Leasingkostnaden är ogiltig:", leasingCostInput.value);
        return;
    }

    const data = machineData[machine];
    if (machine !== '0' && !data) { // Check if a machine is selected before accessing data
        console.error("Ingen data hittades för vald maskin:", machine);
        return;
    }
    if (machine === '0') {
        return; // Do not perform calculations if no machine is selected
    }

    updateSliderLabels(); // Ensure labels are updated on calculations

    let creditPrice;
    if (leasingCost >= data.leasingMax) {
        creditPrice = data.creditMin;
    } else if (leasingCost <= data.leasingMin) {
        creditPrice = data.creditMax;
    } else {
        creditPrice = data.creditMin +
            (data.leasingMax - leasingCost) *
            ((data.creditMax - data.creditMin) / (data.leasingMax - data.leasingMin));
    }


    if (data.hasCredits) {
        if (treatmentsPerDay >= 3) {
            // Visa flatrate och dölj styckpris
            const creditsGroup = document.querySelector(".credits-group");
            const flatrateContainerElement = document.querySelector(".flatrate-container");
            if (creditsGroup) creditsGroup.classList.add("hidden");
            if (flatrateContainerElement) flatrateContainerElement.classList.remove("hidden");
            creditCostInput.value = 0;
            flatrateCostInput.value = data.flatrate;
        } else {
            // Visa styckpris och dölj flatrate
            const creditsGroup = document.querySelector(".credits-group");
            const flatrateContainerElement = document.querySelector(".flatrate-container");
            if (creditsGroup) creditsGroup.classList.remove("hidden");
            if (flatrateContainerElement) flatrateContainerElement.classList.add("hidden");
            creditCostInput.value = creditPrice.toFixed(2);
            flatrateCostInput.value = 0;
        }
    } else {
        // Dölj både styckpris och flatrate
        const creditsGroup = document.querySelector(".credits-group");
        const flatrateContainerElement = document.querySelector(".flatrate-container");
        if (creditsGroup) creditsGroup.classList.add("hidden");
        if (flatrateContainerElement) flatrateContainerElement.classList.add("hidden");
        creditCostInput.value = 0;
        flatrateCostInput.value = 0;
    }


    if (typeof calculateAndUpdateTable === "function") {
        calculateAndUpdateTable();
    } else {
        console.error("Funktionen 'calculateAndUpdateTable' saknas.");
    }
}


// Function to fetch exchange rate from Riksbankens API
async function fetchExchangeRate(fromCurrency, toCurrency) {
    return null; // Return null to use fallback in calculateLeasingCost
}

// Function to calculate leasing cost
async function calculateLeasingCost(machinePrice) {
    const exchangeRate = await fetchExchangeRate("EUR", "SEK") || 11.49260; // Use fetched rate or fallback
    const shippingCostEur = 652; // Fraktkostnad i EUR
    const leasingPeriodValue = leasingPeriodSelect.value;

    if (leasingPeriodValue === "0") {
        return 0;
    }

    const tariff = parseFloat(leasingPeriodValue) / 100; // Get tariff from selected leasing period
    const insurance = insuranceSelect.value;
    const insuranceRates = {
        10000: 0.04,
        20000: 0.03,
        50000: 0.025,
        Infinity: 0.015
    };

    if (machinePrice > 0) {
        const priceSek = (machinePrice + shippingCostEur) * exchangeRate;
        let monthlyCost = priceSek * tariff;
        if (insurance === "ja") {
            for (const [limit, rate] of Object.entries(insuranceRates)) {
                if (machinePrice <= parseFloat(limit)) {
                    monthlyCost += (priceSek * rate) / 12;
                    break;
                }
            }
        }
        return Math.round(monthlyCost);
    } else {
        return 0;
    }
}

// Function to update leasing cost based on selected machine
async function updateLeasingCost(selectedMachineValue) {
    if (selectedMachineValue > 0 && leasingPeriodSelect.value !== "0") {
        try {
            const leasingCost = await calculateLeasingCost(selectedMachineValue);
            leasingCostInput.value = leasingCost;
            leasingCostSlider.value = leasingCost;
            updateSliderLimits();
            updateCalculations();
        } catch (error) {
            console.error("Error calculating leasing cost:", error);
            leasingCostInput.value = "0";
            leasingCostSlider.value = "0";
        }
    } else {
        leasingCostInput.value = "0";
        leasingCostSlider.value = "0";
        updateSliderLimits();
        updateCalculations();
    }
}

// Function to update slider limits based on selected machine
function updateSliderLimits() {
    const machine = machineSelect.value;
    const data = machineData[machine];
    const leasingSliderGroup = document.querySelector('.leasing-slider-group');
    const leasingCostInputGroup = document.querySelector('.input-group:has(#leasingCostInput)');
    const creditsGroup = document.querySelector('.credits-group'); // Lägg till denna rad

    if (data) {
        leasingCostSlider.min = parseFloat(data.leasingMin); // TVINGA TILL NUMMER MED parseFloat()
        leasingCostSlider.max = parseFloat(data.leasingMax); // TVINGA TILL NUMMER MED parseFloat()
        leasingCostInput.min = parseFloat(data.leasingMin);  // TVINGA TILL NUMMER MED parseFloat()
        leasingCostInput.max = parseFloat(data.leasingMax);  // TVINGA TILL NUMMER MED parseFloat()

        leasingCostSlider.value = parseFloat(data.leasingMax);
        leasingCostInput.value = parseFloat(data.leasingMax);

        leasingMin.textContent = formatNumberWithSpaces(data.leasingMin) + " kr";
        leasingMax.textContent = formatNumberWithSpaces(data.leasingMax) + " kr";

        if (data.hasCredits === false) {
            if (leasingSliderGroup) leasingSliderGroup.classList.add('hidden');
            if (leasingCostInputGroup) leasingCostInputGroup.classList.add('hidden');
            if (creditsGroup) creditsGroup.classList.add('hidden'); // Lägg till denna rad
        } else {
            if (leasingSliderGroup) leasingSliderGroup.classList.remove('hidden');
            if (leasingCostInputGroup) leasingCostInputGroup.classList.remove('hidden');
            if (creditsGroup) creditsGroup.classList.remove('hidden'); // Lägg till denna rad
        }
    } else {
        leasingMin.textContent = "";
        leasingMax.textContent = "";
        if (leasingSliderGroup) leasingSliderGroup.classList.remove('hidden');
        if (leasingCostInputGroup) leasingCostInputGroup.classList.remove('hidden');
        if (creditsGroup) creditsGroup.classList.add('hidden'); // Lägg till denna rad
    }
    updateCalculations();
}

// Function to calculate and update the result table
function calculateAndUpdateTable() {
    const treatmentsPerDay = parseFloat(treatmentsPerDayInput.value);
    const revenuePerTreatment = parseFloat(revenuePerTreatmentInput.value);
    const leasingCost = parseFloat(leasingCostInput.value) || 0;
    const creditCost = parseFloat(creditCostInput.value);
    const clinicSize = parseInt(clinicSizeSlider.value);
    const machineValue = machineSelect.value;

    const revenuePerDay = treatmentsPerDay * revenuePerTreatment;
    const revenuePerWeek = revenuePerDay * 5;
    const revenuePerMonth = revenuePerDay * 22;
    const revenuePerYear = revenuePerMonth * 12;
    const costPerMonth = calculateCostPerMonth(treatmentsPerDay, creditCost, machineValue); // Pass machineValue to calculateCostPerMonth
    const netPerMonth = Math.round(revenuePerMonth - leasingCost - costPerMonth);
    const netPerYear = netPerMonth * 12;
    const totalRevenue50 = Math.round(revenuePerYear * 0.5);
    const totalRevenue75 = Math.round(revenuePerYear * 0.75);
    const totalRevenue100 = Math.round(revenuePerYear);

    document.getElementById("treatmentsPerDayValue").textContent = `${treatmentsPerDay} st`;
    const netPerYearElements = document.querySelectorAll("#netPerYearValue3");
    netPerYearElements.forEach(element => {
        element.textContent = formatNumberWithSpaces(netPerYear) + " kr";
    });
    document.getElementById("revenuePerTreatmentValue").textContent = formatNumberWithSpaces(revenuePerTreatment) + " kr";
    document.getElementById("revenuePerDayValue").textContent = formatNumberWithSpaces(revenuePerDay) + " kr"; // **KORRIGERAT - TAGIT BORT * 7**
    document.getElementById("revenuePerWeekValue").textContent = formatNumberWithSpaces(revenuePerDay * 7) + " kr";
    document.getElementById("revenuePerMonthValue").textContent = formatNumberWithSpaces(revenuePerMonth) + " kr";
    document.getElementById("revenuePerYearValue").textContent = formatNumberWithSpaces(revenuePerYear) + " kr";
    document.getElementById("totalRevenue50Value").textContent = formatNumberWithSpaces(totalRevenue50) + " kr";
    document.getElementById("totalRevenue75Value").textContent = formatNumberWithSpaces(totalRevenue75) + " kr";
    document.getElementById("totalRevenue100Value").textContent = formatNumberWithSpaces(totalRevenue100) + " kr";
    document.getElementById("leasingCostValue").textContent = formatNumberWithSpaces(leasingCost) + " kr";
    document.getElementById("costPerMonthValue").textContent = formatNumberWithSpaces(costPerMonth) + " kr";
    document.getElementById("totalCostValue").textContent = formatNumberWithSpaces(leasingCost + costPerMonth) + " kr";
    document.getElementById("netPerMonthValue").textContent = formatNumberWithSpaces(netPerMonth) + " kr";
    document.getElementById("netPerYearValue2").textContent = formatNumberWithSpaces(netPerYear) + " kr";
    // document.getElementById("netPerYearValue3").textContent = formatNumberWithSpaces(netPerYear); // Corrected: Removed "+ " kr" duplication - handled by querySelectorAll

    updateSliderLabels(); // Call function to update slider labels
}


// Function to calculate cost per month for credits or flatrate
function calculateCostPerMonth(treatmentsPerDay, creditCost, machineValue) { // Added machineValue parameter
    const machineInfo = machineData[machineValue];
    let calculatedCreditCost = 0; // Initialize to 0

    if (!machineInfo) {
        console.warn("Machine info not found for value:", machineValue); // Debugging log
        return 0; // Return 0 if no machine info found
    }

    if (machineInfo.hasCredits) { // Only proceed if machine has credits
        if (treatmentsPerDay < 3) {
            calculatedCreditCost = Math.round(treatmentsPerDay * machineInfo.creditMin * 22);
            creditCostInput.value = machineInfo.creditMin;
            flatrateCostInput.value = 0;
             if (flatrateContainer) flatrateContainer.classList.add("hidden"); // Null check - DEBUGGING
        } else if (treatmentsPerDay >= 3) {
            calculatedCreditCost = machineInfo.flatrate;
            creditCostInput.value = 0;
            flatrateCostInput.value = machineInfo.flatrate;
            if (flatrateContainer) flatrateContainer.classList.remove("hidden"); // Null check - DEBUGGING
        }
    } else { // Machine has no credits
        calculatedCreditCost = 0;
        creditCostInput.value = 0;
        flatrateCostInput.value = 0;
        if (flatrateContainer) flatrateContainer.classList.add("hidden"); // Null check - DEBUGGING
    }
    return calculatedCreditCost;
}


// Function to format numbers with spaces
function formatNumberWithSpaces(number) {
    return number.toString().replace(/\B(?=(\d{3})+(?!\d))/g, " ");
}

// Function to update treatments per day based on clinic size
function updateTreatmentsPerDay() {
    const smallLabel = document.getElementById('small-label');
    const mediumLabel = document.getElementById('medium-label');
    const largeLabel = document.getElementById('large-label');
    let treatmentsPerDay = 4;

    switch (clinicSizeSlider.value) {
        case '1':
            treatmentsPerDay = 2;
            if (smallLabel) smallLabel.classList.add('active');
            if (mediumLabel) mediumLabel.classList.remove('active');
            if (largeLabel) largeLabel.classList.remove('active');
            break;
        case '2':
            treatmentsPerDay = 4;
            if (smallLabel) smallLabel.classList.remove('active');
            if (mediumLabel) mediumLabel.classList.add('active');
            if (largeLabel) largeLabel.classList.remove('active');
            break;
        case '3':
            treatmentsPerDay = 6;
            if (smallLabel) smallLabel.classList.remove('active');
            if (mediumLabel) mediumLabel.classList.remove('active');
            if (largeLabel) largeLabel.classList.add('active');
            break;
    }
    treatmentsPerDayInput.value = treatmentsPerDay;
    calculateAndUpdateTable();
}

// Function to update slider labels
function updateSliderLabels() {
    const machine = machineSelect.value;
    const data = machineData[machine];

    if (data) {
        leasingMin.textContent = formatNumberWithSpaces(data.leasingMin) + " kr";
        leasingMax.textContent = formatNumberWithSpaces(data.leasingMax) + " kr";
    } else {
        leasingMin.textContent = "";
        leasingMax.textContent = "";
    }
}


// Event listeners
clinicSizeSlider.addEventListener("input", updateTreatmentsPerDay);
treatmentsPerDayInput.addEventListener("input", calculateAndUpdateTable);
revenuePerTreatmentInput.addEventListener("input", calculateAndUpdateTable);
creditCostInput.addEventListener("input", calculateAndUpdateTable);
flatrateCostInput.addEventListener("input", calculateAndUpdateTable); // Added listener for flatrateCostInput

machineSelect.addEventListener("change", async function() {
    const selectedMachineValue = parseFloat(machineSelect.value);
    if (selectedMachineValue > 0 && leasingPeriodSelect.value !== "0") {
        await updateLeasingCost(selectedMachineValue);
        updateSliderLimits();
    } else {
        // Reset values when no machine is selected
        leasingCostInput.value = "0";
        leasingCostSlider.value = "0";
        creditCostInput.value = "0";
        flatrateCostInput.value = "0";
        updateSliderLimits();
    }
    updateCalculations();
});

leasingPeriodSelect.addEventListener("change", async function() {
    const selectedMachineValue = parseFloat(machineSelect.value);
    if (selectedMachineValue > 0) {
        await updateLeasingCost(selectedMachineValue);
    }
    updateCalculations(); // Anropa updateCalculations() även här för Leasing Period ändring
});

insuranceSelect.addEventListener("change", async function() {
    const selectedMachineValue = parseFloat(machineSelect.value);
    await updateLeasingCost(selectedMachineValue);
    updateCalculations(); // Anropa updateCalculations() även här för Försäkring ändring
});

leasingCostSlider.addEventListener("input", function() {
    const sliderValue = parseFloat(leasingCostSlider.value); // Hämta SLIDER-VÄRDE som NUMMER
    leasingCostInput.value = sliderValue.toFixed(0);        // Sätt INPUT-VÄRDE och AVRUNDA till HELTAL
    updateCalculations();
});

leasingCostInput.addEventListener("input", function() {
    const inputValue = parseFloat(leasingCostInput.value);    // Hämta INPUT-VÄRDE som NUMMER
    leasingCostSlider.value = inputValue.toFixed(0);       // Sätt SLIDER-VÄRDE och AVRUNDA till HELTAL
    updateCalculations();
});

// Lägg till detta i slutet av filen
document.addEventListener('DOMContentLoaded', async function() { // Made the function async
    await fetchMachineData(); // Await the fetch operation
    resetForm();

    // Set initial state
    updateTreatmentsPerDay();
    updateSliderLimits();
    calculateAndUpdateTable();

    // If no machine is selected, hide credit-related elements
    const machineSelectElement = document.getElementById('machine');
    if (machineSelectElement && machineSelectElement.value === "0") {
        const creditsGroup = document.querySelector('.credits-group');
        const flatrateContainerElement = document.querySelector('.flatrate-container');

        if (creditsGroup) creditsGroup.classList.add('hidden');
        if (flatrateContainerElement) flatrateContainerElement.classList.add('hidden');
    }
});