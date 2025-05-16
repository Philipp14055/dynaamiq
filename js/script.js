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

    // Testimonial slider (New version from Andere Siete/test.js)
    const testimonialCards = document.querySelectorAll('.testimonial-card');
    const testimonialDotsContainer = document.querySelector('.testimonial-dots'); // Renamed for clarity
    const prevBtn = document.querySelector('.testimonials-slider .prev-btn'); // Scoped to slider
    const nextBtn = document.querySelector('.testimonials-slider .next-btn'); // Scoped to slider
    let currentSlide = 0;
    let visibleSlides = 3; // Default for desktop
    let autoSlideInterval;

    function updateVisibleSlidesAndCardWidths() {
        if (window.innerWidth <= 768) { // Matches @media (max-width: 768px)
            visibleSlides = 1;
        } else if (window.innerWidth <= 992) { // Matches @media (max-width: 992px)
            visibleSlides = 2;
        } else {
            visibleSlides = 3;
        }

        const totalCards = testimonialCards.length;
        if (totalCards === 0) {
            if (testimonialDotsContainer) testimonialDotsContainer.style.display = 'none';
            return;
        }

        testimonialCards.forEach((card, index) => {
            let isVisible = false;
            for (let i = 0; i < visibleSlides; i++) {
                if ((currentSlide + i) % totalCards === index) {
                    isVisible = true;
                    break;
                }
            }
            card.style.display = isVisible ? 'flex' : 'none';
        });

        // Update dots
        if (testimonialDotsContainer) {
            testimonialDotsContainer.innerHTML = ''; // Clear existing dots
            const numPages = Math.ceil(totalCards / visibleSlides);

            if (numPages <= 1) { // Only one page or no scroll needed
                testimonialDotsContainer.style.display = 'none';
            } else {
                testimonialDotsContainer.style.display = 'flex'; // Restore display
                for (let i = 0; i < numPages; i++) {
                    const dot = document.createElement('span');
                    dot.classList.add('dot');
                    // The active dot corresponds to the page of the currentSlide
                    if (i === Math.floor(currentSlide / visibleSlides)) {
                        dot.classList.add('active');
                    }
                    dot.addEventListener('click', () => {
                        // When a dot is clicked, show the first slide of that "page"
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

        // Ensure slideIndex is within bounds and handles potential negative values from prevSlide
        currentSlide = (slideIndex % totalCards + totalCards) % totalCards;

        // If moving to a specific slide that isn't the start of a "page" for dot calculation,
        // it's fine. The dot calculation Math.floor(currentSlide / visibleSlides) will handle it.

        updateVisibleSlidesAndCardWidths(); // This will also update/re-render dots and set the active one
        resetAutoSlide();
    }

    function nextSlide() {
        const totalCards = testimonialCards.length;
        if (totalCards <= visibleSlides && totalCards > 0) return; // No sliding if all cards are visible or fewer
        showSlide(currentSlide + 1);
    }

    function prevSlide() {
        const totalCards = testimonialCards.length;
        if (totalCards <= visibleSlides && totalCards > 0) return;
        showSlide(currentSlide - 1);
    }

    function startAutoSlide() {
        if (autoSlideInterval) clearInterval(autoSlideInterval); // Clear existing interval first
        if (testimonialCards.length > visibleSlides) { // Only auto-slide if there's something to slide to
            autoSlideInterval = setInterval(nextSlide, 7000);
        }
    }

    function resetAutoSlide() {
        clearInterval(autoSlideInterval);
        startAutoSlide();
    }

    if (testimonialCards.length > 0) {
        updateVisibleSlidesAndCardWidths(); // Initial setup for slides and dots
        window.addEventListener('resize', () => {
            // Recalculate visible slides and redraw everything, then jump to current slide's page start
            // This ensures consistency if currentSlide is, e.g. 1, and visibleSlides changes from 1 to 2.
            const currentSlidePageStart = Math.floor(currentSlide / visibleSlides) * visibleSlides;
            // updateVisibleSlidesAndCardWidths(); // This will be called by showSlide
            showSlide(currentSlide); // Re-evaluate and redraw based on new visibleSlides
        });
        startAutoSlide(); // Start auto-slide after initial setup

        // Event listeners for prev/next buttons are still valid as they call showSlide
        if (prevBtn) {
            prevBtn.addEventListener('click', prevSlide);
        }
        if (nextBtn) {
            nextBtn.addEventListener('click', nextSlide);
        }
    }

    // Pricing tabs (New version from Andere Siete/test.js)
    const pricingTabs = document.querySelectorAll('.pricing-tab');
    const packageFeatures = document.querySelectorAll('.package-features');

    if (pricingTabs.length > 0) {
        pricingTabs.forEach(tab => {
            tab.addEventListener('click', function () {
                const packageType = this.getAttribute('data-package');

                pricingTabs.forEach(tab => tab.classList.remove('active'));
                packageFeatures.forEach(features => features.classList.remove('active'));

                this.classList.add('active');
                document.querySelector(`.${packageType}-features`).classList.add('active');

                // Update summary
                if (document.getElementById('summaryPackage')) {
                    document.getElementById('summaryPackage').textContent = this.querySelector('h3').textContent;
                }

                // Update pricing based on package
                updatePricing();
            });
        });
    }

    // Duration options (New version from Andere Siete/test.js)
    const durationOptions = document.querySelectorAll('.duration-option');

    if (durationOptions.length > 0) {
        durationOptions.forEach(option => {
            option.addEventListener('click', function () {
                durationOptions.forEach(opt => opt.classList.remove('active'));
                this.classList.add('active');

                const duration = this.getAttribute('data-duration');
                if (document.getElementById('summaryDuration')) {
                    document.getElementById('summaryDuration').textContent = `${duration} Monate`;
                }

                // Update pricing based on duration
                updatePricing();
            });
        });
    }

    // DM Slider (New version from Andere Siete/test.js)
    const dmSlider = document.getElementById('dmSlider');
    const dmValue = document.getElementById('dmValue');

    if (dmSlider && dmValue) {
        dmSlider.value = 2500; // Initial value
        dmValue.textContent = formatNumber(dmSlider.value);
        if (document.getElementById('summaryDMs')) {
            document.getElementById('summaryDMs').textContent = `${formatNumber(dmSlider.value)} DMs pro Monat`;
        }
        updateSliderBackground();

        dmSlider.addEventListener('input', function () {
            const value = this.value;
            dmValue.textContent = formatNumber(value);
            if (document.getElementById('summaryDMs')) {
                document.getElementById('summaryDMs').textContent = `${formatNumber(value)} DMs pro Monat`;
            }
            updateSliderBackground();
            updatePricing();
        });
    }

    function updateSliderBackground() {
        if (!dmSlider) return;
        const min = parseInt(dmSlider.min);
        const max = parseInt(dmSlider.max);
        const val = parseInt(dmSlider.value);
        const percentage = ((val - min) / (max - min)) * 100;

        dmSlider.style.background = `linear-gradient(to right, 
            var(--primary-color) 0%, 
            var(--secondary-color) ${percentage}%, 
            rgba(255, 255, 255, 0.1) ${percentage}%, 
            rgba(255, 255, 255, 0.1) 100%)`;
    }

    // Pricing calculator (New version from Andere Siete/test.js)
    function updatePricing() {
        if (!document.querySelector('.pricing-tab.active') || !document.querySelector('.duration-option.active') || !dmSlider) {
            return; // Exit if essential elements are not found
        }

        const activePackageTab = document.querySelector('.pricing-tab.active');
        const activeDurationOption = document.querySelector('.duration-option.active');

        const activePackage = activePackageTab.getAttribute('data-package');
        const duration = parseInt(activeDurationOption.getAttribute('data-duration'));
        const discount = parseInt(activeDurationOption.getAttribute('data-discount') || "0");
        const dmCount = parseInt(dmSlider.value);

        let basePrice, toolCosts, setupCosts;

        if (activePackage === 'basic') {
            basePrice = 0.5;
            toolCosts = 125;
            setupCosts = 600;
        } else if (activePackage === 'premium') {
            basePrice = 0.7;
            toolCosts = 175;
            setupCosts = 800;
        } else if (activePackage === 'enterprise') {
            basePrice = 0.9;
            toolCosts = 225;
            setupCosts = 1000;
        } else {
            return; // Unknown package
        }

        let monthlyPrice = (dmCount * basePrice) + toolCosts;
        if (discount > 0) {
            monthlyPrice = monthlyPrice * (1 - (discount / 100));
        }
        const totalPrice = (monthlyPrice * duration) + setupCosts;

        if (document.getElementById('summaryToolCosts')) {
            document.getElementById('summaryToolCosts').textContent = `${toolCosts} € pro Monat`;
        }
        if (document.getElementById('summarySetupCosts')) {
            document.getElementById('summarySetupCosts').textContent = `${setupCosts} € (einmalig)`;
        }
        if (document.getElementById('summaryMonthlyPrice')) {
            document.getElementById('summaryMonthlyPrice').textContent = `${formatNumber(monthlyPrice.toFixed(0))} € pro Monat`;
        }
        if (document.getElementById('summaryTotalPrice')) {
            document.getElementById('summaryTotalPrice').textContent = `${formatNumber(totalPrice.toFixed(0))} €`;
        }
    }

    if (document.querySelector('.pricing-tab')) {
        updatePricing();
    }

    // Format numbers with thousand separator (from Andere Siete/test.js)
    function formatNumber(num) {
        return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
    }

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

    // Form submission
    const consultationForm = document.getElementById('consultationForm');

    if (consultationForm) {
        consultationForm.addEventListener('submit', function (e) {
            e.preventDefault();

            // In a real implementation, you would send the form data to a server
            // For now, just show a success message
            const formContainer = consultationForm.parentElement;
            formContainer.innerHTML = `
                <div class="success-message">
                    <svg xmlns="http://www.w3.org/2000/svg" width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="#FF6B00" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                        <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
                        <polyline points="22 4 12 14.01 9 11.01"></polyline>
                    </svg>
                    <h3>Vielen Dank für Ihre Anfrage!</h3>
                    <p>Wir werden uns innerhalb von 24 Stunden bei Ihnen melden.</p>
                </div>
            `;
        });
    }

    // Request button
    const requestButton = document.getElementById('requestButton');

    if (requestButton) {
        requestButton.addEventListener('click', function () {
            // Scroll to contact form
            document.querySelector('#contact').scrollIntoView({
                behavior: 'smooth'
            });
        });
    }
});