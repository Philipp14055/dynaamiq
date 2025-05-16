// Dynaamiq AI Website - Main JavaScript
document.addEventListener('DOMContentLoaded', function () {
    // Initialize AOS animations
    AOS.init({
        duration: 800,
        easing: 'ease-in-out',
        once: true
    });

    // Navbar scroll effect
    const navbar = document.querySelector('.navbar');
    window.addEventListener('scroll', function () {
        if (window.scrollY > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    });

    // Mobile menu toggle
    const navbarToggle = document.querySelector('.navbar-toggle');
    const navbarMenu = document.querySelector('.navbar-menu');

    if (navbarToggle) {
        navbarToggle.addEventListener('click', function () {
            navbarMenu.classList.toggle('active');
        });
    }

    // Back to top button
    const backToTopBtn = document.querySelector('.back-to-top');

    if (backToTopBtn) {
        window.addEventListener('scroll', function () {
            if (window.scrollY > 300) {
                backToTopBtn.classList.add('active');
            } else {
                backToTopBtn.classList.remove('active');
            }
        });

        backToTopBtn.addEventListener('click', function (e) {
            e.preventDefault();
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        });
    }

    // Dashboard tabs
    const tabBtns = document.querySelectorAll('.tab-btn');
    const tabContents = document.querySelectorAll('.tab-content');

    if (tabBtns.length > 0) {
        tabBtns.forEach(btn => {
            btn.addEventListener('click', function () {
                const tabId = this.getAttribute('data-tab');

                tabBtns.forEach(btn => btn.classList.remove('active'));
                tabContents.forEach(content => content.classList.remove('active'));

                this.classList.add('active');
                document.getElementById(tabId).classList.add('active');
            });
        });
    }

    // Testimonial slider 
    const testimonialCardsContainer = document.querySelector('.testimonial-cards'); // Changed selector
    const testimonialCards = testimonialCardsContainer ? Array.from(testimonialCardsContainer.children) : []; // Get children
    const testimonialDotsContainer = document.querySelector('.testimonial-dots');
    const prevBtn = document.querySelector('.testimonials-slider .prev-btn');
    const nextBtn = document.querySelector('.testimonials-slider .next-btn');
    let currentSlide = 0;
    let visibleSlides = 3;
    let autoSlideInterval;

    function updateVisibleSlidesAndCardWidths() {
        if (!testimonialCardsContainer) return; // Exit if container not found

        if (window.innerWidth <= 768) {
            visibleSlides = 1;
        } else if (window.innerWidth <= 992) {
            visibleSlides = 2;
        } else {
            visibleSlides = 3;
        }

        const totalCards = testimonialCards.length;
        if (totalCards === 0) {
            if (testimonialDotsContainer) testimonialDotsContainer.style.display = 'none';
            return;
        }

        // Hide all cards initially then show the ones that should be visible
        testimonialCards.forEach(card => card.style.display = 'none');

        for (let i = 0; i < visibleSlides; i++) {
            const cardIndex = (currentSlide + i) % totalCards;
            if (testimonialCards[cardIndex]) { // Check if card exists
                testimonialCards[cardIndex].style.display = 'flex';
            }
        }

        if (testimonialDotsContainer) {
            testimonialDotsContainer.innerHTML = '';
            const numPages = Math.ceil(totalCards / visibleSlides);

            if (numPages <= 1) {
                testimonialDotsContainer.style.display = 'none';
            } else {
                testimonialDotsContainer.style.display = 'flex';
                for (let i = 0; i < numPages; i++) {
                    const dot = document.createElement('span');
                    dot.classList.add('dot');
                    if (i === Math.floor(currentSlide / visibleSlides)) {
                        dot.classList.add('active');
                    }
                    dot.addEventListener('click', () => {
                        showSlide(i * visibleSlides);
                    });
                    testimonialDotsContainer.appendChild(dot);
                }
            }
        }
    }

    function showSlide(slideIndex) {
        const totalCards = testimonialCards.length;
        if (totalCards === 0) return;
        currentSlide = (slideIndex % totalCards + totalCards) % totalCards;
        updateVisibleSlidesAndCardWidths();
        resetAutoSlide();
    }

    function nextSlideFn() { // Renamed to avoid conflict if nextSlide is a global var
        const totalCards = testimonialCards.length;
        if (totalCards <= visibleSlides && totalCards > 0) return;
        showSlide(currentSlide + 1);
    }

    function prevSlideFn() { // Renamed
        const totalCards = testimonialCards.length;
        if (totalCards <= visibleSlides && totalCards > 0) return;
        showSlide(currentSlide - 1);
    }

    function startAutoSlide() {
        if (autoSlideInterval) clearInterval(autoSlideInterval);
        if (testimonialCards.length > visibleSlides) {
            autoSlideInterval = setInterval(nextSlideFn, 7000);
        }
    }

    function resetAutoSlide() {
        clearInterval(autoSlideInterval);
        startAutoSlide();
    }

    if (testimonialCards.length > 0) {
        updateVisibleSlidesAndCardWidths();
        window.addEventListener('resize', () => {
            // Recalculate and redraw based on new visibleSlides
            // currentSlide should remain the same, let updateVisibleSlidesAndCardWidths handle display
            showSlide(currentSlide);
        });
        startAutoSlide();

        if (prevBtn) {
            prevBtn.addEventListener('click', prevSlideFn);
        }
        if (nextBtn) {
            nextBtn.addEventListener('click', nextSlideFn);
        }
    }

    // Pricing tabs
    const pricingTabs = document.querySelectorAll('.pricing-tab');
    const packageFeatures = document.querySelectorAll('.package-features');
    const summaryPackageEl = document.getElementById('summaryPackage'); // Cache element

    if (pricingTabs.length > 0) {
        pricingTabs.forEach(tab => {
            tab.addEventListener('click', function () {
                const packageType = this.getAttribute('data-package');

                pricingTabs.forEach(t => t.classList.remove('active'));
                packageFeatures.forEach(features => features.classList.remove('active'));

                this.classList.add('active');
                const currentPackageFeatures = document.querySelector(`.${packageType}-features`);
                if (currentPackageFeatures) {
                    currentPackageFeatures.classList.add('active');
                }

                if (summaryPackageEl) { // Use cached element
                    summaryPackageEl.textContent = this.querySelector('h3').textContent;
                }
                updatePricing();
            });
        });
    }

    // Duration options
    const durationOptions = document.querySelectorAll('.duration-option');
    const summaryDurationEl = document.getElementById('summaryDuration'); // Cache element

    if (durationOptions.length > 0) {
        durationOptions.forEach(option => {
            option.addEventListener('click', function () {
                durationOptions.forEach(opt => opt.classList.remove('active'));
                this.classList.add('active');

                const duration = this.getAttribute('data-duration');
                if (summaryDurationEl) { // Use cached element
                    summaryDurationEl.textContent = `${duration} Monate`;
                }
                updatePricing();
            });
        });
    }

    // DM Slider
    const dmSlider = document.getElementById('dmSlider');
    const dmValue = document.getElementById('dmValue');
    const summaryDMsEl = document.getElementById('summaryDMs'); // Cache element

    if (dmSlider && dmValue) {
        // dmSlider.value = 2250; // Set initial value if needed (HTML already has value="2250")
        dmValue.textContent = formatNumber(dmSlider.value);
        if (summaryDMsEl) { // Use cached element
            summaryDMsEl.textContent = `${formatNumber(dmSlider.value)} DMs pro Monat`;
        }
        updateSliderBackground();

        dmSlider.addEventListener('input', function () {
            const value = this.value;
            dmValue.textContent = formatNumber(value);
            if (summaryDMsEl) { // Use cached element
                summaryDMsEl.textContent = `${formatNumber(value)} DMs pro Monat`;
            }
            updatePricing(); // updatePricing first
            updateSliderBackground(); // then update background
        });
    }

    // Initial pricing update on load
    if (document.querySelector('.pricing-tab.active')) { // Ensure pricing elements are ready
        updatePricing();
    }

    // --- NEW LOGIC FOR PACKAGE SELECTION AND CONTACT FORM PREFILL ---
    const requestButton = document.getElementById('requestButton');
    if (requestButton) {
        requestButton.addEventListener('click', function () {
            // Gather all details from the pricing summary
            const packageName = document.getElementById('summaryPackage')?.textContent || 'N/A';
            const duration = document.getElementById('summaryDuration')?.textContent || 'N/A';
            const dms = document.getElementById('summaryDMs')?.textContent || 'N/A';
            const toolCosts = document.getElementById('summaryToolCosts')?.textContent || 'N/A';
            const setupCosts = document.getElementById('summarySetupCosts')?.textContent || 'N/A';
            const monthlyPrice = document.getElementById('summaryMonthlyPrice')?.textContent || 'N/A';
            const totalPrice = document.getElementById('summaryTotalPrice')?.textContent || 'N/A';

            const inquiryDetails =
                `Anfrage bezüglich Paketkonfiguration:
-------------------------------------
Paket: ${packageName}
Laufzeit: ${duration}
Anzahl DMs: ${dms}
Tool-Kosten: ${toolCosts}
Einmalige Aufsetzungskosten: ${setupCosts}
Monatlicher Preis: ${monthlyPrice}
Gesamtpreis: ${totalPrice}
-------------------------------------`;

            sessionStorage.setItem('dynaamiqPackageInquiry', inquiryDetails);
            prefillContactFormFromPricing(); // Call directly to ensure immediate update
            // Allow default anchor behavior to navigate to #contact
        });
    }

    function prefillContactFormFromPricing() {
        const inquiryDetails = sessionStorage.getItem('dynaamiqPackageInquiry');
        if (inquiryDetails) {
            const contactFormMessageTextarea = document.getElementById('message');

            // Get all hidden input fields
            const hiddenPackageNameInput = document.getElementById('selectedPackageName');
            const hiddenDurationInput = document.getElementById('selectedPackageDuration');
            const hiddenDMsInput = document.getElementById('selectedPackageDMs');
            const hiddenToolCostsInput = document.getElementById('selectedToolCosts');
            const hiddenSetupCostsInput = document.getElementById('selectedSetupCosts');
            const hiddenMonthlyPriceInput = document.getElementById('selectedMonthlyPrice');
            const hiddenTotalPriceInput = document.getElementById('selectedTotalPrice');

            // Parse details from the inquiryDetails string (more robust parsing needed if format is critical)
            const getValue = (regex) => {
                const match = inquiryDetails.match(regex);
                return match && match[1] ? match[1].trim() : '';
            };

            const selectedPackageName = getValue(/Paket: (.*?)\n/);
            const selectedDuration = getValue(/Laufzeit: (.*?)\n/);
            const selectedDMs = getValue(/Anzahl DMs: (.*?)\n/);
            const selectedToolCosts = getValue(/Tool-Kosten: (.*?)\n/);
            const selectedSetupCosts = getValue(/Einmalige Aufsetzungskosten: (.*?)\n/);
            const selectedMonthlyPrice = getValue(/Monatlicher Preis: (.*?)\n/);
            const selectedTotalPrice = getValue(/Gesamtpreis: (.*?)\n/);

            if (contactFormMessageTextarea) {
                contactFormMessageTextarea.value = `${inquiryDetails}\n\nIhre weitere Nachricht hier...`;
            }

            // Populate hidden fields
            if (hiddenPackageNameInput) hiddenPackageNameInput.value = selectedPackageName;
            if (hiddenDurationInput) hiddenDurationInput.value = selectedDuration;
            if (hiddenDMsInput) hiddenDMsInput.value = selectedDMs;
            if (hiddenToolCostsInput) hiddenToolCostsInput.value = selectedToolCosts;
            if (hiddenSetupCostsInput) hiddenSetupCostsInput.value = selectedSetupCosts;
            if (hiddenMonthlyPriceInput) hiddenMonthlyPriceInput.value = selectedMonthlyPrice;
            if (hiddenTotalPriceInput) hiddenTotalPriceInput.value = selectedTotalPrice;

            // Clear the item from sessionStorage after pre-filling to avoid re-filling on manual reload
            // sessionStorage.removeItem('dynaamiqPackageInquiry'); // Keep for now to allow refresh, remove if causing issues
        }
    }

    // Call on page load in case the user reloads on #contact or arrives with a stored inquiry
    prefillContactFormFromPricing();

    // Call when the hash changes to #contact (e.g., after clicking 'Jetzt anfragen')
    window.addEventListener('hashchange', function () {
        if (window.location.hash === '#contact') {
            prefillContactFormFromPricing();
        }
    });

    // Chart.js initialization
    // Assuming chart initialization logic is here or called from here
    // ... (Your existing Chart.js code)
    const chartContexts = {
        messages: document.getElementById('messagesChart')?.getContext('2d'),
        response: document.getElementById('responseRateChart')?.getContext('2d'),
        performance: document.getElementById('messagePerformanceChart')?.getContext('2d'),
        conversion: document.getElementById('conversionFunnelChart')?.getContext('2d')
    };

    const chartConfigs = {
        messages: {
            type: 'line',
            data: {
                labels: ['Jan', 'Feb', 'Mär', 'Apr', 'Mai', 'Jun'],
                datasets: [{
                    label: 'Gesendete Nachrichten',
                    data: [1200, 1500, 1300, 1800, 2000, 1700],
                    borderColor: '#FF6B00',
                    backgroundColor: 'rgba(255, 107, 0, 0.1)',
                    tension: 0.4,
                    fill: true
                }]
            },
            options: { maintainAspectRatio: false, plugins: { legend: { labels: { color: '#FFFFFF' } } }, scales: { y: { ticks: { color: '#FFFFFF' } }, x: { ticks: { color: '#FFFFFF' } } } }
        },
        response: {
            type: 'bar',
            data: {
                labels: ['Kampagne A', 'Kampagne B', 'Kampagne C'],
                datasets: [{
                    label: 'Antwortrate (%)',
                    data: [25, 35, 30],
                    backgroundColor: ['rgba(255, 107, 0, 0.7)', 'rgba(255, 31, 142, 0.7)', 'rgba(0, 207, 232, 0.7)'],
                }]
            },
            options: { maintainAspectRatio: false, plugins: { legend: { labels: { color: '#FFFFFF' } } }, scales: { y: { ticks: { color: '#FFFFFF' } }, x: { ticks: { color: '#FFFFFF' } } } }
        },
        performance: {
            type: 'doughnut',
            data: {
                labels: ['Text', 'Audio', 'Video'],
                datasets: [{
                    data: [40, 30, 30],
                    backgroundColor: ['#FF6B00', '#FF1F8E', '#00CFE8'],
                    borderColor: '#0F1524',
                }]
            },
            options: { maintainAspectRatio: false, plugins: { legend: { position: 'bottom', labels: { color: '#FFFFFF' } } } }
        },
        conversion: {
            type: 'funnel',
            data: {
                labels: ['Gesendet', 'Geöffnet', 'Geantwortet', 'Interessiert', 'Kunde'],
                datasets: [{
                    label: 'Conversion Funnel',
                    data: [3000, 2500, 1500, 600, 200],
                    backgroundColor: [
                        'rgba(255, 107, 0, 0.8)',
                        'rgba(255, 107, 0, 0.6)',
                        'rgba(255, 107, 0, 0.4)',
                        'rgba(255, 31, 142, 0.5)',
                        'rgba(0, 207, 232, 0.6)'
                    ],
                    borderColor: '#0F1524'
                }]
            },
            options: { maintainAspectRatio: false, indexAxis: 'y', plugins: { legend: { display: false } }, scales: { y: { ticks: { color: '#FFFFFF' } }, x: { ticks: { color: '#FFFFFF' } } } }
        }
    };

    if (chartContexts.messages) new Chart(chartContexts.messages, chartConfigs.messages);
    if (chartContexts.response) new Chart(chartContexts.response, chartConfigs.response);
    if (chartContexts.performance) new Chart(chartContexts.performance, chartConfigs.performance);
    // Funnel chart type might require a plugin for Chart.js v3+
    // For Chart.js v4, funnel is not a built-in type. You'd need 'chartjs-chart-funnel'.
    // If you have the plugin: if (chartContexts.conversion && Chart.controllers.funnel) new Chart(chartContexts.conversion, chartConfigs.conversion);
    // Temporarily disabling funnel chart if plugin is not confirmed to be present or type is wrong
    console.log("Funnel chart may require 'chartjs-chart-funnel' plugin for Chart.js v3/v4. Conversion chart not rendered if plugin is missing.");

}); // End of DOMContentLoaded

// --- Pricing Logic Helper Functions (should be globally accessible or properly scoped if moved) ---
// Make sure these are not redeclared if already present elsewhere

const basePrices = {
    basic: 0.60,
    premium: 0.70,
    enterprise: 0.85
};
const toolCosts = {
    basic: 125,
    premium: 175,
    enterprise: 250
};
const setupCost = 600;

function formatNumber(num) {
    return new Intl.NumberFormat('de-DE').format(num);
}

function updateSliderBackground() {
    const dmSlider = document.getElementById('dmSlider'); // Get it here as it might be called before DOMContentLoaded variable is set
    if (!dmSlider) return;
    const value = (dmSlider.value - dmSlider.min) / (dmSlider.max - dmSlider.min) * 100;
    dmSlider.style.background = `linear-gradient(to right, var(--primary-color) ${value}%, rgba(255, 255, 255, 0.1) ${value}%)`;
}

function updatePricing() {
    const activePackageTab = document.querySelector('.pricing-tab.active');
    const activeDurationOption = document.querySelector('.duration-option.active');
    const dmSlider = document.getElementById('dmSlider'); // Get it here as well

    if (!activePackageTab || !activeDurationOption || !dmSlider) {
        return;
    }

    const packageType = activePackageTab.getAttribute('data-package');
    const duration = parseInt(activeDurationOption.getAttribute('data-duration'));
    const discount = parseInt(activeDurationOption.getAttribute('data-discount')) / 100;
    const numDMs = parseInt(dmSlider.value);

    const pricePerDM = basePrices[packageType] || 0;
    const currentToolCosts = toolCosts[packageType] || 0;

    let monthlyDMcost = numDMs * pricePerDM;
    let monthlyTotal = monthlyDMcost + currentToolCosts;
    monthlyTotal = monthlyTotal * (1 - discount);

    let totalCost = (monthlyTotal * duration) + setupCost;

    // Cache DOM elements for summary update
    const summaryPackageEl = document.getElementById('summaryPackage');
    const summaryDurationEl = document.getElementById('summaryDuration');
    const summaryDMsEl = document.getElementById('summaryDMs');
    const summaryToolCostsEl = document.getElementById('summaryToolCosts');
    const summarySetupCostsEl = document.getElementById('summarySetupCosts');
    const summaryMonthlyPriceEl = document.getElementById('summaryMonthlyPrice');
    const summaryTotalPriceEl = document.getElementById('summaryTotalPrice');

    if (summaryPackageEl) summaryPackageEl.textContent = activePackageTab.querySelector('h3').textContent;
    if (summaryDurationEl) summaryDurationEl.textContent = `${duration} Monate`;
    if (summaryDMsEl) summaryDMsEl.textContent = `${formatNumber(numDMs)} DMs pro Monat`;
    if (summaryToolCostsEl) summaryToolCostsEl.textContent = `${formatNumber(currentToolCosts)} € pro Monat`;
    if (summarySetupCostsEl) summarySetupCostsEl.textContent = `${formatNumber(setupCost)} € (einmalig)`;
    if (summaryMonthlyPriceEl) summaryMonthlyPriceEl.textContent = `${formatNumber(monthlyTotal.toFixed(2))} € pro Monat`;
    if (summaryTotalPriceEl) summaryTotalPriceEl.textContent = `${formatNumber(totalCost.toFixed(2))} €`;
}