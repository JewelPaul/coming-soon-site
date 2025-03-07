// Subscription form handling
document.addEventListener('DOMContentLoaded', () => {
    const subscribeForm = document.getElementById('subscribeForm');
    const messageDiv = document.getElementById('message');

    function showMessage(text, type) {
        if (!messageDiv) return;
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
            const emailInput = document.getElementById('email');
            const email = emailInput.value.trim();

            if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
                showMessage('Please enter a valid email address', 'error');
                return;
            }

            try {
                const response = await fetch('/subscribe', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ email })
                });

                const data = await response.json();

                if (response.ok) {
                    showMessage('Thank you for subscribing!', 'success');
                    emailInput.value = '';
                } else {
                    showMessage(data.error || 'Subscription failed', 'error');
                }
            } catch (error) {
                showMessage('Server connection failed', 'error');
            }
        });
    }
});
