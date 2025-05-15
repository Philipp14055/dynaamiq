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

    // Pricing tabs (jetzt Package Cards Direktwahl)
    const packageCards = document.querySelectorAll('.package-card'); // Geändert von pricingTabs zu packageCards

    if (packageCards.length > 0) {
        packageCards.forEach(card => { // Geändert von tab zu card
            card.addEventListener('click', function () {
                const packageType = this.getAttribute('data-package');
                const packageName = this.querySelector('h3').textContent;

                packageCards.forEach(c => c.classList.remove('active'));
                this.classList.add('active');

                // Update summary immediately
                document.getElementById('summaryPackage').textContent = packageName;

                // Update pricing based on new package selection
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

            // Update the track element width
            const dmSliderTrack = document.getElementById('dmSliderTrack');
            if (dmSliderTrack) {
                dmSliderTrack.style.width = `${percentage}%`;
            }
        }
    }

    // Pricing calculator
    function updatePricing() {
        const activePackageCard = document.querySelector('.package-card.active');
        if (!activePackageCard) {
            console.error("Kein aktives Paket für Preisberechnung gefunden.");
            return;
        }
        const activePackageType = activePackageCard.getAttribute('data-package');

        const activeDurationOption = document.querySelector('.duration-option.active');
        if (!activeDurationOption) {
            console.error("Keine aktive Laufzeit für Preisberechnung gefunden.");
            return;
        }
        const duration = parseInt(activeDurationOption.getAttribute('data-duration'));
        // Rabatt direkt von der Vorlage ablesen (0, 10, 20)
        let discountPercentage = 0;
        if (duration === 6) discountPercentage = 10;
        if (duration === 12) discountPercentage = 20;

        const dmSlider = document.getElementById('dmSlider');
        if (!dmSlider) {
            console.error("DM Slider nicht gefunden.");
            return;
        }
        const dmCount = parseInt(dmSlider.value);

        let basePricePerDM, toolCosts, setupCosts;

        // Preise basierend auf der Vorlage für "Premium Connect"
        // und Annahmen für die anderen Pakete, da diese nicht detailliert sind.
        if (activePackageType === 'premium') { // Premium Connect
            basePricePerDM = (1575 - 125) / 2250; // (Monatlicher Preis - Tool Kosten) / DMs
            toolCosts = 125;
            setupCosts = 600;
        } else if (activePackageType === 'audio') { // Audio Impact - Annahme
            basePricePerDM = 0.70; // Annahme, basierend auf altem mittlerem Paket
            toolCosts = 175;     // Annahme
            setupCosts = 800;      // Annahme
        } else if (activePackageType === 'ultimate') { // Ultimate Conversion - Annahme
            basePricePerDM = 0.85; // Annahme, basierend auf altem höchsten Paket (leicht angepasst)
            toolCosts = 225;     // Annahme
            setupCosts = 1000;     // Annahme
        } else {
            console.error("Unbekannter Pakettyp: ", activePackageType);
            return;
        }

        let monthlyDmCost = dmCount * basePricePerDM;
        let currentMonthlyPrice = monthlyDmCost + toolCosts;

        if (discountPercentage > 0) {
            currentMonthlyPrice = currentMonthlyPrice * (1 - (discountPercentage / 100));
        }

        const totalSetupCosts = setupCosts; // Bleibt einmalig
        const overallTotalPrice = (currentMonthlyPrice * duration) + totalSetupCosts;

        document.getElementById('summaryPackage').textContent = activePackageCard.querySelector('h3').textContent;
        document.getElementById('summaryDuration').textContent = `${duration} Monate`;
        document.getElementById('summaryDMs').textContent = `${formatNumber(dmCount)} DMs pro Monat`;
        document.getElementById('summaryToolCosts').textContent = `${toolCosts.toFixed(0)} € pro Monat`;
        document.getElementById('summarySetupCosts').textContent = `${totalSetupCosts.toFixed(0)} € (einmalig)`;
        document.getElementById('summaryMonthlyPrice').textContent = `${formatNumber(currentMonthlyPrice.toFixed(0))} € pro Monat`;
        document.getElementById('summaryTotalPrice').textContent = `${formatNumber(overallTotalPrice.toFixed(0))} €`;
    }

    // Initialize pricing on page load - Sicherstellen, dass dies nach allen Element-Definitionen geschieht
    // und dass initiale Werte im HTML korrekt sind (z.B. erstes Paket 'active')
    if (document.querySelector('.package-card.active') && document.querySelector('.duration-option.active') && document.getElementById('dmSlider')) {
        updatePricing();
    } else {
        // Fallback, falls initiale Auswahl nicht im HTML gesetzt ist oder Elemente fehlen
        // Setze Standardauswahl und update Preise
        const firstPackage = document.querySelector('.package-card');
        if (firstPackage && !document.querySelector('.package-card.active')) {
            firstPackage.classList.add('active');
        }
        const firstDuration = document.querySelector('.duration-option');
        if (firstDuration && !document.querySelector('.duration-option.active')) {
            firstDuration.classList.add('active');
        }
        // Trigger updatePricing, wenn alle Elemente vorhanden sind
        if (document.querySelector('.package-card.active') && document.querySelector('.duration-option.active') && document.getElementById('dmSlider')) {
            updatePricing();
        }
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

    // Testimonial "Load More" functionality
    const testimonialGrid = document.querySelector('.testimonial-grid');
    if (testimonialGrid) {
        const testimonialCards = Array.from(testimonialGrid.querySelectorAll('.testimonial-card')); // Convert to Array
        const loadMoreButton = document.getElementById('loadMoreTestimonials');
        const showLessButton = document.getElementById('showLessTestimonials'); // Get the new button
        const initialShowCount = 3;

        function updateVisibleTestimonials() {
            let visibleCount = 0;
            testimonialCards.forEach((card, index) => {
                if (card.style.display !== 'none') {
                    visibleCount++;
                }
            });

            if (visibleCount <= initialShowCount) {
                loadMoreButton.style.display = testimonialCards.length > initialShowCount ? '' : 'none';
                showLessButton.style.display = 'none';
            } else {
                loadMoreButton.style.display = 'none';
                showLessButton.style.display = '';
            }
        }

        // Initial setup: Hide cards beyond the initial count
        testimonialCards.forEach((card, index) => {
            if (index >= initialShowCount) {
                card.style.display = 'none';
            } else {
                card.style.display = '';
            }
        });
        updateVisibleTestimonials(); // Set initial button states

        if (loadMoreButton) {
            loadMoreButton.addEventListener('click', function () {
                testimonialCards.forEach(card => {
                    card.style.display = ''; // Show all cards
                });
                updateVisibleTestimonials();
            });
        }

        if (showLessButton) {
            showLessButton.addEventListener('click', function () {
                testimonialCards.forEach((card, index) => {
                    if (index >= initialShowCount) {
                        card.style.display = 'none'; // Hide cards beyond initial count
                    }
                });
                updateVisibleTestimonials();
                // Scroll to the top of the testimonials section for better UX
                const testimonialsSection = document.getElementById('testimonials');
                if (testimonialsSection) {
                    testimonialsSection.scrollIntoView({ behavior: 'smooth' });
                }
            });
        }
    }

    /* Old Testimonial Slider - Commenting out as it's replaced by grid
    const testimonialsSlider = document.querySelector('.testimonials-slider');
    if (testimonialsSlider) {
        const cardsContainer = testimonialsSlider.querySelector('.testimonial-cards');
        const cards = Array.from(cardsContainer.children);
        const dotsContainer = testimonialsSlider.parentElement.querySelector('.testimonial-dots');
        const prevBtn = testimonialsSlider.querySelector('.prev-btn');
        const nextBtn = testimonialsSlider.querySelector('.next-btn');

        let currentIndex = 0;
        let itemsPerPage = 3; // Default for desktop
        let totalPages = 0;
        let autoSlideInterval;

        function updateSliderConfig() {
            if (window.innerWidth <= 768) { // Mobile
                itemsPerPage = 1;
            } else if (window.innerWidth <= 992) { // Tablet
                itemsPerPage = 2;
            } else { // Desktop
                itemsPerPage = 3;
            }
            totalPages = Math.ceil(cards.length / itemsPerPage);
            // Recalculate width of the container for cards
            // cardsContainer.style.width = `${cards.length * (100 / itemsPerPage)}%`;
            cards.forEach(card => {
                 // card.style.flexBasis = `${100 / itemsPerPage}%`; // Ensure cards take up correct space dynamically
                 // card.style.flexBasis = card.style.flexBasis; // No, this line is wrong. Need to get the value from CSS or define it here
            });
            goToSlide(0); // Reset to first slide on resize
        }


        function createDots() {
            if (!dotsContainer) return;
            dotsContainer.innerHTML = '';
            for (let i = 0; i < totalPages; i++) {
                const dot = document.createElement('button');
                dot.classList.add('dot');
                if (i === currentIndex) {
                    dot.classList.add('active');
                }
                dot.addEventListener('click', () => {
                    goToSlide(i);
                    resetAutoSlide();
                });
                dotsContainer.appendChild(dot);
            }
        }

        function updateDots() {
            if (!dotsContainer) return;
            const dots = dotsContainer.querySelectorAll('.dot');
            dots.forEach((dot, index) => {
                if (index === currentIndex) {
                    dot.classList.add('active');
                } else {
                    dot.classList.remove('active');
                }
            });
        }


        function goToSlide(slideIndex) {
            if (slideIndex < 0) {
                slideIndex = totalPages - 1;
            } else if (slideIndex >= totalPages) {
                slideIndex = 0;
            }
            currentIndex = slideIndex;
            const cardWidth = cards[0].offsetWidth; // Assuming all cards have same width for calculation
            const gap = parseInt(window.getComputedStyle(cardsContainer).gap) || 0; // Get gap value
            
            // Calculate offset based on items per page and card width including gap
            // This needs to be reliable, considering cards are flex items.
            // The transform should move by groups of `itemsPerPage`.
            let offset = 0;
            if (cards.length > 0) {
                 // Calculate the width of a single card + its gap for the slide calculation.
                 // The offset needs to be by `currentIndex * itemsPerPage * (card_width + gap)`
                 // but the transform is on cardsContainer, which is a flex container.
                 // Simpler approach for fixed itemsPerPage:
                 // Offset for N items: N * (card_width + gap) - gap (to remove last gap)
                 // For flexbox, it's easier to just scroll a certain number of items into view.
                 // The current transform approach is good if cardsContainer width is set correctly.

                 // Let's assume the cardsContainer shows 'itemsPerPage' cards at a time.
                 // The transform needs to shift by the width of 'itemsPerPage' cards.

                 // The previous implementation was:
                 // cardsContainer.style.transform = `translateX(-${currentIndex * (100 / totalPages)}%)`; 
                 // This assumes totalPages correctly represents viewable groups.

                 // If itemsPerPage = 3, and 10 cards total.
                 // totalPages = Math.ceil(10/3) = 4 pages. (0,1,2,3)
                 // Page 0: items 0,1,2
                 // Page 1: items 3,4,5
                 // Page 2: items 6,7,8
                 // Page 3: items 9
                 // This needs careful calculation for the transform.
                 // It is simpler to calculate offset based on individual item widths.

                let totalWidthOfItemsToShift = 0;
                for(let i = 0; i < currentIndex * itemsPerPage; i++) {
                    if(cards[i]) { // Make sure card exists
                         totalWidthOfItemsToShift += cards[i].offsetWidth + gap;
                    }
                }
                 if (currentIndex * itemsPerPage > 0 && cards.length > 1) { // remove last gap if not first slide
                    // totalWidthOfItemsToShift -= gap; // This might be needed if gap is applied after every item
                 }
                cardsContainer.style.transform = `translateX(-${totalWidthOfItemsToShift}px)`;
            }

            updateDots();
        }


        function nextSlide() {
            goToSlide(currentIndex + 1);
        }

        function prevSlide() {
            goToSlide(currentIndex - 1);
        }

        function startAutoSlide() {
            // stopAutoSlide(); // Clear existing interval
            // autoSlideInterval = setInterval(nextSlide, 5000); // Change slide every 5 seconds
        }

        function resetAutoSlide() {
            // clearInterval(autoSlideInterval);
            // startAutoSlide();
        }

        if (nextBtn) nextBtn.addEventListener('click', () => { nextSlide(); resetAutoSlide(); });
        if (prevBtn) prevBtn.addEventListener('click', () => { prevSlide(); resetAutoSlide(); });

        // Initialize slider
        updateSliderConfig(); // Set initial itemsPerPage and create dots
        // createDots(); // createDots is now called within updateSliderConfig or after.
        // goToSlide(0); // goToSlide is called within updateSliderConfig
        // startAutoSlide(); // Start auto-sliding

        // Recalculate on window resize
        window.addEventListener('resize', () => {
            updateSliderConfig();
            // createDots(); // Ensure dots are recreated based on new totalPages
            // goToSlide(currentIndex); // Adjust current slide to new layout
        });
    }
    */

    // Background Music Control - Autoplay Attempt
    const backgroundMusic = document.getElementById('background-music');
    const playPauseButton = document.getElementById('play-pause-button');

    if (playPauseButton && backgroundMusic) {
        const playPauseIcon = playPauseButton.querySelector('i');
        if (playPauseIcon) {

            function setButtonState() {
                if (backgroundMusic.paused) {
                    playPauseIcon.classList.remove('fa-pause');
                    playPauseIcon.classList.add('fa-play');
                } else {
                    playPauseIcon.classList.remove('fa-play');
                    playPauseIcon.classList.add('fa-pause');
                }
            }

            // Attempt to autoplay when metadata is loaded
            function attemptAutoplay() {
                backgroundMusic.play().then(() => {
                    // Autoplay started successfully
                    console.log("Hintergrundmusik Autoplay erfolgreich.");
                    setButtonState();
                }).catch(error => {
                    // Autoplay was prevented or failed
                    console.log("Hintergrundmusik Autoplay verhindert: ", error);
                    // Ensure button shows Play icon if autoplay fails
                    backgroundMusic.pause(); // Make sure it's really paused
                    setButtonState();
                });
            }

            // Wait for metadata before attempting autoplay
            if (backgroundMusic.readyState >= 1) { // HAVE_METADATA or more
                attemptAutoplay();
            } else {
                backgroundMusic.addEventListener('loadedmetadata', attemptAutoplay, { once: true });
            }
            // Initial defensive state set (will be updated by autoplay attempt or events)
            setButtonState();


            // Event-Listener for the Button-Klick
            playPauseButton.addEventListener('click', function () {
                if (backgroundMusic.paused) {
                    backgroundMusic.play().catch(error => {
                        console.log("Play wurde verhindert oder Fehler: ", error);
                        // State will be updated by 'pause' event if playback fails immediately
                    });
                } else {
                    backgroundMusic.pause();
                    // State will be updated by 'pause' event
                }
            });

            // Event-Listener am Audio-Element, um Button synchron zu halten
            backgroundMusic.addEventListener('play', setButtonState);
            backgroundMusic.addEventListener('pause', setButtonState);
            backgroundMusic.addEventListener('ended', setButtonState);

        } else {
            console.error("Play/Pause Icon nicht im Button gefunden.");
        }
    } else {
        if (!backgroundMusic) console.error("Audio Element #background-music nicht gefunden.");
        if (!playPauseButton) console.error("Button #play-pause-button nicht gefunden.");
    }

});

