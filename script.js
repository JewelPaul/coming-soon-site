// Debug flag
const DEBUG = true;

document.addEventListener('DOMContentLoaded', () => {
    if (DEBUG) console.log('DOM Content Loaded');

    // Launch date: May 11, 2024 at 00:00 UTC
    const targetDate = new Date('2024-05-11T00:00:00Z');
    if (DEBUG) console.log('Target Date:', targetDate);

    function updateCountdown() {
        try {
            const now = new Date();
            if (DEBUG) console.log('Current time:', now);

            const timeLeft = targetDate.getTime() - now.getTime();
            if (DEBUG) console.log('Time left (ms):', timeLeft);

            const days = Math.floor(timeLeft / (1000 * 60 * 60 * 24));
            const hours = Math.floor((timeLeft % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
            const minutes = Math.floor((timeLeft % (1000 * 60 * 60)) / (1000 * 60));
            const seconds = Math.floor((timeLeft % (1000 * 60)) / 1000);

            if (DEBUG) console.log('Calculated time:', { days, hours, minutes, seconds });

            // Get elements
            const daysEl = document.getElementById('days');
            const hoursEl = document.getElementById('hours');
            const minutesEl = document.getElementById('minutes');
            const secondsEl = document.getElementById('seconds');

            if (DEBUG) console.log('Elements:', { daysEl, hoursEl, minutesEl, secondsEl });

            // Update elements if they exist
            if (daysEl) daysEl.textContent = String(Math.max(0, days)).padStart(2, '0');
            if (hoursEl) hoursEl.textContent = String(Math.max(0, hours)).padStart(2, '0');
            if (minutesEl) minutesEl.textContent = String(Math.max(0, minutes)).padStart(2, '0');
            if (secondsEl) secondsEl.textContent = String(Math.max(0, seconds)).padStart(2, '0');

        } catch (error) {
            console.error('Error in updateCountdown:', error);
        }
    }

    // Update immediately
    updateCountdown();

    // Set up interval for updates
    const intervalId = setInterval(updateCountdown, 1000);
    if (DEBUG) console.log('Interval set:', intervalId);

    // Subscription form handling
    const subscribeForm = document.getElementById('subscribeForm');
    const messageDiv = document.getElementById('message');

    if (DEBUG) console.log('Form elements:', { subscribeForm, messageDiv });

    function showMessage(text, type) {
        if (DEBUG) console.log('Showing message:', { text, type });

        if (!messageDiv) {
            console.error('Message div not found');
            return;
        }

        messageDiv.textContent = text;
        messageDiv.className = `message ${type}`;
        messageDiv.style.display = 'block';

        setTimeout(() => {
            messageDiv.style.display = 'none';
        }, type === 'success' ? 7000 : 5000);
    }

    if (subscribeForm) {
        subscribeForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            if (DEBUG) console.log('Form submitted');

            const emailInput = document.getElementById('email');
            const email = emailInput.value.trim();

            if (!email || !email.includes('@')) {
                showMessage('Please enter a valid email.', 'error');
                return;
            }

            if (DEBUG) console.log('Email:', email);

            // Your actual Google Apps Script Web App URL
            const scriptURL = "https://script.google.com/macros/s/AKfycby87vV_klrJT646n3CpT0wXwTkPdDz3QZ3Yy6WsuCbHVrTkbti2MGHE9ErOSW8OfHgY/exec"; 

            try {
                const response = await fetch(scriptURL, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/x-www-form-urlencoded',
                    },
                    body: new URLSearchParams({ email }) // Proper encoding for Apps Script
                });

                const result = await response.text();
                if (DEBUG) console.log('Response data:', result);

                if (response.ok) {
                    showMessage('Thank you for subscribing!', 'success');
                    emailInput.value = ''; // Clear input field
                } else {
                    showMessage('Subscription failed. Please try again.', 'error');
                }
            } catch (error) {
                console.error('Subscription error:', error);
                showMessage('Failed to connect to server. Check your internet.', 'error');
            }
        });
    } else {
        console.error('Subscribe form not found');
    }
});
