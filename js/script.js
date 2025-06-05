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

    // Hero image 3D hover effect
    const heroImageContainer = document.querySelector('.hero-image');
    const heroImage = document.querySelector('.hero-image img');

    if (heroImageContainer && heroImage) {
        heroImageContainer.addEventListener('mousemove', function (e) {
            const rect = heroImageContainer.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;

            const centerX = rect.width / 2;
            const centerY = rect.height / 2;

            const rotateX = (y - centerY) / centerY * 10; // Max rotation 10deg
            const rotateY = (x - centerX) / centerX * -10; // Max rotation 10deg, inverted

            heroImage.style.transform = `rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale(1.05)`;
        });

        heroImageContainer.addEventListener('mouseleave', function () {
            heroImage.style.transform = 'rotateX(0deg) rotateY(0deg) scale(1)';
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
    // Initialize charts if they exist
    if (typeof Chart !== 'undefined') {
        // Messages Chart
        const messagesCtx = document.getElementById('messagesChart');
        if (messagesCtx) {
            new Chart(messagesCtx, {
                type: 'line',
                data: {
                    labels: ['Mo', 'Di', 'Mi', 'Do', 'Fr', 'Sa', 'So'],
                    datasets: [{
                        label: 'Gesendete Nachrichten',
                        data: [120, 190, 230, 250, 280, 190, 150],
                        borderColor: '#FF6B00',
                        backgroundColor: 'rgba(255, 107, 0, 0.1)',
                        tension: 0.4,
                        fill: true
                    }]
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    plugins: {
                        legend: {
                            display: false
                        }
                    },
                    scales: {
                        y: {
                            beginAtZero: true,
                            grid: {
                                color: 'rgba(255, 255, 255, 0.05)'
                            },
                            ticks: {
                                color: 'rgba(255, 255, 255, 0.7)'
                            }
                        },
                        x: {
                            grid: {
                                color: 'rgba(255, 255, 255, 0.05)'
                            },
                            ticks: {
                                color: 'rgba(255, 255, 255, 0.7)'
                            }
                        }
                    }
                }
            });
        }

        // Response Rate Chart
        const responseRateCtx = document.getElementById('responseRateChart');
        if (responseRateCtx) {
            new Chart(responseRateCtx, {
                type: 'doughnut',
                data: {
                    labels: ['Antworten', 'Keine Antwort'],
                    datasets: [{
                        data: [68, 32],
                        backgroundColor: [
                            '#FF1F8E',
                            'rgba(255, 255, 255, 0.1)'
                        ],
                        borderWidth: 0
                    }]
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    plugins: {
                        legend: {
                            position: 'bottom',
                            labels: {
                                color: 'rgba(255, 255, 255, 0.7)',
                                padding: 20
                            }
                        }
                    },
                    cutout: '70%'
                }
            });
        }

        // Message Performance Chart
        const performanceCtx = document.getElementById('messagePerformanceChart');
        if (performanceCtx) {
            new Chart(performanceCtx, {
                type: 'radar',
                data: {
                    labels: ['Antwortrate', 'Conversion', 'Engagement', 'Vertrauen', 'ROI'],
                    datasets: [
                        {
                            label: 'Text',
                            data: [20, 15, 30, 40, 25],
                            backgroundColor: 'rgba(255, 107, 0, 0.2)',
                            borderColor: 'rgba(255, 107, 0, 1)',
                            pointBackgroundColor: 'rgba(255, 107, 0, 1)',
                            pointBorderColor: '#fff',
                            pointHoverBackgroundColor: '#fff',
                            pointHoverBorderColor: 'rgba(255, 107, 0, 1)'
                        },
                        {
                            label: 'Audio',
                            data: [40, 30, 50, 60, 45],
                            backgroundColor: 'rgba(255, 31, 142, 0.2)',
                            borderColor: 'rgba(255, 31, 142, 1)',
                            pointBackgroundColor: 'rgba(255, 31, 142, 1)',
                            pointBorderColor: '#fff',
                            pointHoverBackgroundColor: '#fff',
                            pointHoverBorderColor: 'rgba(255, 31, 142, 1)'
                        },
                        {
                            label: 'Video',
                            data: [60, 50, 70, 80, 65],
                            backgroundColor: 'rgba(75, 192, 192, 0.2)',
                            borderColor: 'rgba(75, 192, 192, 1)',
                            pointBackgroundColor: 'rgba(75, 192, 192, 1)',
                            pointBorderColor: '#fff',
                            pointHoverBackgroundColor: '#fff',
                            pointHoverBorderColor: 'rgba(75, 192, 192, 1)'
                        }
                    ]
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    scales: {
                        r: {
                            angleLines: {
                                color: 'rgba(255, 255, 255, 0.1)'
                            },
                            grid: {
                                color: 'rgba(255, 255, 255, 0.1)'
                            },
                            pointLabels: {
                                color: 'rgba(255, 255, 255, 0.7)'
                            },
                            ticks: {
                                backdropColor: 'transparent',
                                color: 'rgba(255, 255, 255, 0.7)'
                            }
                        }
                    },
                    plugins: {
                        legend: {
                            labels: {
                                color: 'rgba(255, 255, 255, 0.7)'
                            }
                        }
                    }
                }
            });
        }

        // Conversion Funnel Chart
        const conversionCtx = document.getElementById('conversionFunnelChart');
        if (conversionCtx) {
            new Chart(conversionCtx, {
                type: 'bar',
                data: {
                    labels: ['Gesendete DMs', 'Geöffnet', 'Beantwortet', 'Gespräch', 'Termin', 'Kunde'],
                    datasets: [{
                        label: 'Conversion Funnel',
                        data: [1000, 850, 580, 320, 180, 75],
                        backgroundColor: [
                            'rgba(255, 107, 0, 0.8)',
                            'rgba(255, 107, 0, 0.7)',
                            'rgba(255, 107, 0, 0.6)',
                            'rgba(255, 31, 142, 0.6)',
                            'rgba(255, 31, 142, 0.7)',
                            'rgba(255, 31, 142, 0.8)'
                        ],
                        borderWidth: 0,
                        borderRadius: 4
                    }]
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    indexAxis: 'y',
                    plugins: {
                        legend: {
                            display: false
                        }
                    },
                    scales: {
                        x: {
                            beginAtZero: true,
                            grid: {
                                color: 'rgba(255, 255, 255, 0.05)'
                            },
                            ticks: {
                                color: 'rgba(255, 255, 255, 0.7)'
                            }
                        },
                        y: {
                            grid: {
                                display: false
                            },
                            ticks: {
                                color: 'rgba(255, 255, 255, 0.7)'
                            }
                        }
                    }
                }
            });
        }
    }

}); // End of DOMContentLoaded

// --- Pricing Logic Helper Functions (should be globally accessible or properly scoped if moved) ---
// Make sure these are not redeclared if already present elsewhere

const basePrices = {
    basic: 750 / 2250, // Premium Connect: 750€ für 2250 DMs
    premium: 1250 / 2250, // Audio Impact: 1250€ für 2250 DMs
    enterprise: 1750 / 2250 // Ultimate Conversion: 1750€ für 2250 DMs
};
const toolCosts = {
    basic: 150,
    premium: 150,
    enterprise: 150
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