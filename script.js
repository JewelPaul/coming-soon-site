// Debug flag
const DEBUG = true;

document.addEventListener('DOMContentLoaded', () => {
    if (DEBUG) console.log('DOM Content Loaded');

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

            if (!email || !email.includes('@') || !email.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)) {
                showMessage('Please enter a valid email.', 'error');
                return;
            }

            if (DEBUG) console.log('Email:', email);

            // Your new Google Apps Script Web App URL
            const scriptURL = "https://script.google.com/macros/s/AKfycbwks1dKVRUt6dF8_8Cg6vJMHWH3hE89gQPr0LsxuVAbmOVO6nxnR7Rdw4iNfiPtLR_GDg/exec"; // Replace with your URL

            try {
                const response = await fetch(scriptURL, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ email }) // Sending JSON payload
                });

                const result = await response.text();
                if (DEBUG) console.log('Response data:', result);

                if (response.ok && result.toLowerCase().includes("success")) {
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

    // TIMER CODE (UNCHANGED)
    function updateCountdown() {
        const launchDate = new Date('2024-12-31T00:00:00').getTime();
        const now = new Date().getTime();
        const timeRemaining = launchDate - now;

        if (timeRemaining <= 0) {
            document.getElementById('timer').innerHTML = "We're Live!";
            return;
        }

        const days = Math.floor(timeRemaining / (1000 * 60 * 60 * 24));
        const hours = Math.floor((timeRemaining % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((timeRemaining % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((timeRemaining % (1000 * 60)) / 1000);

        document.getElementById('timer').innerHTML = 
            `${days}d ${hours}h ${minutes}m ${seconds}s`;
    }

    setInterval(updateCountdown, 1000);
    updateCountdown();
});
