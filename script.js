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

            // Your actual Google Apps Script Web App URL
            const scriptURL = "https://script.google.com/macros/s/AKfycby87vV_klrJT646n3CpT0wXwTkPdDz3QZ3Yy6WsuCbHVrTkbti2MGHE9ErOSW8OfHgY/exec"; 

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
});
