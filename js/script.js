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
    const tabButtons = document.querySelectorAll('.tab-button');
    const tabContents = document.querySelectorAll('.tab-content');

    if (tabButtons.length > 0) {
        tabButtons.forEach(btn => {
            btn.addEventListener('click', function () {
                const tabId = this.getAttribute('data-tab');

                tabButtons.forEach(btn => btn.classList.remove('active'));
                tabContents.forEach(content => content.classList.remove('active'));

                this.classList.add('active');
                document.getElementById(tabId).classList.add('active');
            });
        });
    }

    // Pricing tabs
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
                document.getElementById('summaryPackage').textContent = this.querySelector('h3').textContent;

                // Update pricing based on package
                updatePricing();
            });
        });
    }

    // Duration options
    const durationOptions = document.querySelectorAll('.duration-option');

    if (durationOptions.length > 0) {
        durationOptions.forEach(option => {
            option.addEventListener('click', function () {
                durationOptions.forEach(opt => opt.classList.remove('active'));
                this.classList.add('active');

                const duration = this.getAttribute('data-duration');
                document.getElementById('summaryDuration').textContent = `${duration} Monate`;

                // Update pricing based on duration
                updatePricing();
            });
        });
    }

    // Package selection
    const packageButtons = document.querySelectorAll('.package-select');

    if (packageButtons.length > 0) {
        packageButtons.forEach(button => {
            button.addEventListener('click', function () {
                const packageType = this.getAttribute('data-package');
                const packageName = this.parentElement.querySelector('h3').textContent;

                // Update active state
                packageButtons.forEach(btn => {
                    btn.parentElement.classList.remove('active');
                });
                this.parentElement.classList.add('active');

                // Update summary
                document.getElementById('summaryPackage').textContent = packageName;

                // Update pricing based on package
                updatePricing();
            });
        });
    }

    // DM Slider
    const dmSlider = document.getElementById('dmSlider');
    const dmValue = document.getElementById('dmValue');

    if (dmSlider && dmValue) {
        // Set initial position slightly offset from start
        dmSlider.value = 2500;
        dmValue.textContent = formatNumber(dmSlider.value);
        document.getElementById('summaryDMs').textContent = `${formatNumber(dmSlider.value)} DMs pro Monat`;

        // Update slider background to show selected range
        updateSliderBackground();

        dmSlider.addEventListener('input', function () {
            const value = this.value;
            dmValue.textContent = formatNumber(value);
            document.getElementById('summaryDMs').textContent = `${formatNumber(value)} DMs pro Monat`;

            // Update slider background
            updateSliderBackground();

            // Update pricing based on DM count
            updatePricing();
        });

        // Function to update slider background and track
        function updateSliderBackground() {
            const min = parseInt(dmSlider.min);
            const max = parseInt(dmSlider.max);
            const val = parseInt(dmSlider.value);
            const percentage = ((val - min) / (max - min)) * 100;

            // Update the gradient background
            dmSlider.style.background = `linear-gradient(to right, 
                var(--primary-color) 0%, 
                var(--secondary-color) ${percentage}%, 
                rgba(255, 255, 255, 0.1) ${percentage}%, 
                rgba(255, 255, 255, 0.1) 100%)`;

            // Update the track element width
            const dmSliderTrack = document.getElementById('dmSliderTrack');
            if (dmSliderTrack) {
                dmSliderTrack.style.width = `${percentage}%`;
            }
        }
    }

    // Pricing calculator
    function updatePricing() {
        // Get current package
        const activePackage = document.querySelector('.pricing-tab.active').getAttribute('data-package');

        // Get current duration and discount
        const activeDuration = document.querySelector('.duration-option.active');
        const duration = parseInt(activeDuration.getAttribute('data-duration'));
        const discount = parseInt(activeDuration.getAttribute('data-discount'));

        // Get current DM count
        const dmCount = parseInt(dmSlider.value);

        // Base prices per package
        let basePrice, toolCosts, setupCosts;

        if (activePackage === 'basic') {
            basePrice = 0.5; // € per DM
            toolCosts = 125;
            setupCosts = 600;
        } else if (activePackage === 'premium') {
            basePrice = 0.7; // € per DM
            toolCosts = 175;
            setupCosts = 800;
        } else if (activePackage === 'enterprise') {
            basePrice = 0.9; // € per DM
            toolCosts = 225;
            setupCosts = 1000;
        }

        // Calculate monthly price
        let monthlyPrice = (dmCount * basePrice) + toolCosts;

        // Apply discount if applicable
        if (discount > 0) {
            monthlyPrice = monthlyPrice * (1 - (discount / 100));
        }

        // Calculate total price
        const totalPrice = (monthlyPrice * duration) + setupCosts;

        // Update summary
        document.getElementById('summaryToolCosts').textContent = `${toolCosts} € pro Monat`;
        document.getElementById('summarySetupCosts').textContent = `${setupCosts} € (einmalig)`;
        document.getElementById('summaryMonthlyPrice').textContent = `${formatNumber(monthlyPrice.toFixed(0))} € pro Monat`;
        document.getElementById('summaryTotalPrice').textContent = `${formatNumber(totalPrice.toFixed(0))} €`;
    }

    // Initialize pricing on page load
    if (document.querySelector('.pricing-tab')) {
        updatePricing();
    }

    // Format numbers with thousand separator
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

    // Testimonial slider
    const testimonialSlider = document.querySelector('.testimonials-slider');
    const testimonialCardsContainer = document.querySelector('.testimonial-cards');
    const testimonialCards = document.querySelectorAll('.testimonial-card');
    const testimonialDotsContainer = document.querySelector('.testimonial-dots');
    const prevBtn = document.querySelector('.prev-btn');
    const nextBtn = document.querySelector('.next-btn');
    let currentSlide = 0;
    let visibleSlides = 3; // Default for desktop
    let totalSlides = testimonialCards.length;
    let autoSlideInterval;

    function updateSliderConfig() {
        if (window.innerWidth < 768) {
            visibleSlides = 1;
        } else if (window.innerWidth < 992) {
            visibleSlides = 2;
        } else {
            visibleSlides = 3;
        }
        // Adjust total slides if it's not perfectly divisible - important for dots calculation
        // Or, recalculate how many 'pages' of slides there are.
    }

    function createDots() {
        if (!testimonialDotsContainer) return;
        testimonialDotsContainer.innerHTML = ''; // Clear existing dots
        const numDots = Math.ceil(totalSlides / visibleSlides);
        if (numDots <= 1) return; // No dots needed if only one page

        for (let i = 0; i < numDots; i++) {
            const dot = document.createElement('button');
            dot.classList.add('dot');
            dot.addEventListener('click', () => {
                goToSlide(i * visibleSlides); // Go to the start of the page
            });
            testimonialDotsContainer.appendChild(dot);
        }
        updateDots();
    }

    function updateDots() {
        if (!testimonialDotsContainer) return;
        const dots = testimonialDotsContainer.querySelectorAll('.dot');
        if (dots.length === 0) return;

        dots.forEach(dot => dot.classList.remove('active'));
        const currentPageIndex = Math.floor(currentSlide / visibleSlides);

        if (currentPageIndex >= 0 && currentPageIndex < dots.length) {
            dots[currentPageIndex].classList.add('active');
        } else if (dots.length > 0 && currentSlide >= totalSlides - visibleSlides) {
            // If somehow currentSlide is beyond the last full page but dots exist,
            // highlight the last dot. This can happen if totalSlides isn't a multiple of visibleSlides.
            dots[dots.length - 1].classList.add('active');
        }
    }

    function goToSlide(slideIndex) {
        // Clamp the index to prevent sliding beyond limits
        // Ensure currentSlide is a multiple of visibleSlides for page alignment if navigating by dots/page logic
        // However, the core logic should handle any valid start index of a view.
        currentSlide = Math.max(0, Math.min(slideIndex, totalSlides - visibleSlides));

        if (testimonialCards.length > 0 && testimonialCardsContainer) {
            const cardWidth = testimonialCards[0].offsetWidth;
            // Get the gap value reliably. Convert rem to pixels if necessary.
            // Assuming 1rem = 16px (default), 2rem = 32px. A more robust way is needed for variable root font-size.
            // Let's try reading computed style again, but check the value.
            let gapValue = 0;
            const computedGap = getComputedStyle(testimonialCardsContainer).gap;
            if (computedGap && computedGap !== 'normal') {
                // Simplistic pixel conversion assuming default font size
                if (computedGap.includes('rem')) {
                    // Assuming root font-size is 16px for rem conversion
                    // This is fragile! A better approach might be needed.
                    const baseFontSize = parseFloat(getComputedStyle(document.documentElement).fontSize) || 16;
                    gapValue = parseFloat(computedGap) * baseFontSize;
                } else if (computedGap.includes('px')) {
                    gapValue = parseFloat(computedGap);
                }
                // Add other unit handling if needed (em, %, etc.)
            }

            // Fallback if reading gap fails
            if (gapValue === 0 && totalSlides > 1) {
                // Estimate gap based on container width vs card widths if possible
                // Or hardcode a pixel value if rem calculation is too complex/unreliable
                console.warn("Could not reliably calculate gap. Using estimated value.");
                // Example hardcoded fallback for 2rem gap @ 16px font-size
                gapValue = 32;
            }

            const totalCardMoveWidth = cardWidth + gapValue;
            const moveAmount = -currentSlide * totalCardMoveWidth;

            testimonialCardsContainer.style.transform = `translateX(${moveAmount}px)`;
        }
        updateDots();
        resetAutoSlide();
    }

    function nextSlide() {
        const numPages = Math.ceil(totalSlides / visibleSlides);
        let currentPageNum = Math.floor(currentSlide / visibleSlides);
        let nextPageNum = currentPageNum + 1;

        if (nextPageNum >= numPages) { // If next page is beyond or at total pages
            nextPageNum = 0; // Loop to first page
        }
        let nextSlideIndex = nextPageNum * visibleSlides;
        // goToSlide will clamp nextSlideIndex if it's for a partial last page via its own logic.
        goToSlide(nextSlideIndex);
    }

    function prevSlide() {
        const numPages = Math.ceil(totalSlides / visibleSlides);
        let currentPageNum = Math.floor(currentSlide / visibleSlides);
        let prevPageNum = currentPageNum - 1;

        if (prevPageNum < 0) { // If previous page is before the first page
            prevPageNum = numPages - 1; // Loop to the last page
        }
        let prevSlideIndex = prevPageNum * visibleSlides;
        // goToSlide will clamp prevSlideIndex if it's for a partial last page via its own logic.
        goToSlide(prevSlideIndex);
    }

    function startAutoSlide() {
        if (autoSlideInterval) clearInterval(autoSlideInterval);
        autoSlideInterval = setInterval(nextSlide, 5000); // Slide every 5 seconds
    }

    function resetAutoSlide() {
        startAutoSlide(); // Restart the timer
    }

    // Initial Setup
    if (testimonialSlider && testimonialCards.length > 0) {
        updateSliderConfig(); // Set initial visibleSlides count
        createDots();         // Create initial dots
        goToSlide(0);         // Position slider initially
        startAutoSlide();     // Start auto-sliding

        // Event Listeners
        if (nextBtn) {
            nextBtn.addEventListener('click', nextSlide);
        }
        if (prevBtn) {
            prevBtn.addEventListener('click', prevSlide);
        }

        window.addEventListener('resize', () => {
            const oldVisibleSlides = visibleSlides;
            updateSliderConfig();
            if (oldVisibleSlides !== visibleSlides) {
                createDots();
                // Recalculate currentSlide to be a multiple of new visibleSlides, or closest valid
                currentSlide = Math.floor(currentSlide / oldVisibleSlides) * visibleSlides;
                currentSlide = Math.min(currentSlide, totalSlides - visibleSlides); // clamp
                currentSlide = Math.max(0, currentSlide); // clamp
                goToSlide(currentSlide);
            }
        });
    }
});
