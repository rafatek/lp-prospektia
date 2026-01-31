// --- Dark Mode Chart Configuration ---
Chart.defaults.color = '#94a3b8'; // slate-400
Chart.defaults.borderColor = '#334155'; // slate-700
Chart.defaults.scale.grid.color = '#1e293b'; // slate-800

// --- 1. Hero Animations (Vanilla JS) ---
function animateCounter(id, end, duration) {
    let start = 0;
    const element = document.getElementById(id);
    const stepTime = Math.abs(Math.floor(duration / end));
    const timer = setInterval(() => {
        start += 1;
        element.textContent = start;
        if (start == end) clearInterval(timer);
    }, stepTime);
}

// Initialize animations on load
window.addEventListener('load', () => {
    animateCounter("hero-leads-counter", 42, 2000);
    animateCounter("hero-meetings-counter", 8, 2000);
    initProblemChart();
    initDynamicWords();
    initTestimonialCarousel();
    initCountdownTimer();
});

// --- 1.x Countdown Timer Logic ---
// --- 1.x Countdown Timer Logic ---
function initCountdownTimer() {
    const timerElement = document.getElementById('countdown-timer');
    if (!timerElement) return;

    // Generate random duration: 3 days + random hours (0-23) + random minutes (0-59)
    const randomHours = Math.floor(Math.random() * 24);
    const randomMinutes = Math.floor(Math.random() * 60);

    // Total seconds = (3 days * 24h * 60m * 60s) + (randomHours * 60m * 60s) + (randomMinutes * 60s)
    let timeInSeconds = (3 * 24 * 60 * 60) + (randomHours * 60 * 60) + (randomMinutes * 60);

    function updateTimer() {
        // Calculate days, hours, minutes, seconds from total seconds
        const days = Math.floor(timeInSeconds / (24 * 60 * 60));
        const hours = Math.floor((timeInSeconds % (24 * 60 * 60)) / (60 * 60));
        const minutes = Math.floor((timeInSeconds % (60 * 60)) / 60);
        const seconds = Math.floor(timeInSeconds % 60);

        // Format with leading zeros
        const displayDays = days < 10 ? '0' + days : days;
        const displayHours = hours < 10 ? '0' + hours : hours;
        const displayMinutes = minutes < 10 ? '0' + minutes : minutes;
        const displaySeconds = seconds < 10 ? '0' + seconds : seconds;

        // Update display: 03d 12h 45m 30s
        timerElement.textContent = `${displayDays}d ${displayHours}h ${displayMinutes}m ${displaySeconds}s`;

        if (timeInSeconds > 0) {
            timeInSeconds--;
        } else {
            // Optional: Loop or stop? For now, let's stop or reset to 3 days.
            // Resetting to a new random 3-day window for consistency with "evergreen" feel
            updateTimer(); // Recursion to get new random if needed, but for simplicity just stop at 00:00:00:00 or reset.
            // Simplest evergreen approach: Reset to original random duration
            // But actually, just clearing interval or letting it sit at 00 is fine.
            // Let's reset to keep urgency.
            timeInSeconds = (3 * 24 * 60 * 60) + (Math.floor(Math.random() * 24) * 60 * 60) + (Math.floor(Math.random() * 60) * 60);
        }
    }

    // Update immediately then every second
    updateTimer();
    setInterval(updateTimer, 1000);
}

// --- 1. Hero Counters Animation ---
function animateCounter(id, endValue, duration) {
    const obj = document.getElementById(id);
    if (!obj) return;
    let startTimestamp = null;
    const step = (timestamp) => {
        if (!startTimestamp) startTimestamp = timestamp;
        const progress = Math.min((timestamp - startTimestamp) / duration, 1);
        obj.innerHTML = Math.floor(progress * endValue);
        if (progress < 1) {
            window.requestAnimationFrame(step);
        } else {
            obj.innerHTML = endValue;
        }
    };
    window.requestAnimationFrame(step);
}

// --- 1.x Dynamic Words Animation (Typewriter Effect) ---
function initDynamicWords() {
    const words = ["Leads", "Clientes", "Empresas", "Contatos"];
    const element = document.getElementById("dynamic-word");
    let wordIndex = 0;
    let charIndex = words[0].length;
    let isDeleting = true; // Start by deleting existing word
    let typeSpeed = 2000;  // Initial delay

    function type() {
        const currentWord = words[wordIndex];

        if (isDeleting) {
            charIndex--;
            typeSpeed = 100;
        } else {
            charIndex++;
            typeSpeed = 150;
        }

        element.textContent = currentWord.substring(0, charIndex);

        if (!isDeleting && charIndex === currentWord.length) {
            isDeleting = true;
            typeSpeed = 2000;
        } else if (isDeleting && charIndex === 0) {
            isDeleting = false;
            wordIndex = (wordIndex + 1) % words.length;
            typeSpeed = 500;
        }

        setTimeout(type, typeSpeed);
    }

    setTimeout(type, 1000);
}

// --- 2. Problem Chart Logic ---
let problemChartInstance = null;

function initProblemChart() {
    const ctx = document.getElementById('problemChart').getContext('2d');

    // Initial Data (Manual)
    const dataManual = {
        labels: ['Pesquisa Manual', 'Entrada de Dados', 'Vendas Reais'],
        datasets: [{
            data: [60, 25, 15],
            backgroundColor: ['#ef4444', '#f97316', '#10b981'],
            borderWidth: 0
        }]
    };

    problemChartInstance = new Chart(ctx, {
        type: 'doughnut',
        data: dataManual,
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: { position: 'bottom' },
                tooltip: {
                    callbacks: {
                        label: function (context) {
                            return context.label + ': ' + context.raw + '%';
                        }
                    },
                    backgroundColor: 'rgba(15, 23, 42, 0.9)',
                    titleColor: '#fff',
                    bodyColor: '#cbd5e1',
                    borderColor: 'rgba(255,255,255,0.1)',
                    borderWidth: 1
                }
            },
            cutout: '70%'
        }
    });
}

function updateProblemChart(mode) {
    // Update UI buttons
    const btnManual = document.getElementById('btn-manual');
    const btnAuto = document.getElementById('btn-automated');

    if (mode === 'manual') {
        btnManual.classList.add('bg-slate-700', 'text-white', 'shadow-lg');
        btnManual.classList.remove('bg-transparent', 'text-slate-500', 'border-slate-600/50');

        btnAuto.classList.add('bg-transparent', 'text-slate-500', 'border-slate-600/50');
        btnAuto.classList.remove('bg-slate-700', 'text-white', 'shadow-lg');

        problemChartInstance.data.datasets[0].data = [60, 25, 15];
        problemChartInstance.data.datasets[0].backgroundColor = ['#ef4444', '#f97316', '#10b981'];
    } else {
        btnAuto.classList.add('bg-slate-700', 'text-white', 'shadow-lg');
        btnAuto.classList.remove('bg-transparent', 'text-slate-500', 'border-slate-600/50');

        btnManual.classList.add('bg-transparent', 'text-slate-500', 'border-slate-600/50');
        btnManual.classList.remove('bg-slate-700', 'text-white', 'shadow-lg');

        // Automated: Manual research drops to near zero, Sales time increases
        problemChartInstance.data.datasets[0].data = [5, 5, 90];
        problemChartInstance.data.datasets[0].backgroundColor = ['#475569', '#475569', '#3b82f6'];
    }
    problemChartInstance.update();
}

// --- 3. Testimonial Carousel Logic ---
// New Netflix-Style Carousel relies on CSS 'animate-scroll'
// We can keep this empty or remove the old logic entirely.
// The HTML uses: class="animate-scroll hover:[animation-play-state:paused]"
function initTestimonialCarousel() {
    // No JS initialization needed for CSS marquee
}



function scrollToCTA() {
    document.querySelector('#planos').scrollIntoView({ behavior: 'smooth' });
}

// --- 4. FAQ Logic ---
function toggleFaq(button) {
    const content = button.nextElementSibling;
    const icon = button.querySelector('svg');

    // Toggle hidden class
    content.classList.toggle('hidden');

    // Rotate icon
    if (content.classList.contains('hidden')) {
        icon.classList.remove('rotate-180');
        icon.classList.add('text-slate-500');
        button.classList.remove('bg-slate-800/50');
    } else {
        icon.classList.add('rotate-180');
        icon.classList.remove('text-slate-500');
        icon.classList.add('text-blue-500');
        button.classList.add('bg-slate-800/50');
    }
}
