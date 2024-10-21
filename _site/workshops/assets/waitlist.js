document.addEventListener('DOMContentLoaded', function() {
    const waitlistPopup = document.getElementById('waitlistPopup');
    const waitlistEmail = document.getElementById('waitlistEmail');
    const submitWaitlist = document.getElementById('submitWaitlist');
    const closePopup = waitlistPopup.querySelector('.close');
    const waitlistPrice = document.getElementById('waitlistPrice');

    let currentPrice = '';

    document.querySelectorAll('.waitlist-button').forEach(function(button) {
        button.addEventListener('click', function() {
            currentPrice = this.getAttribute('data-price');
            waitlistPrice.textContent = '$' + currentPrice;
            waitlistPopup.classList.remove('hidden');
        });
    });

    closePopup.addEventListener('click', function() {
        waitlistPopup.classList.add('hidden');
    });

    submitWaitlist.addEventListener('click', function(e) {
        e.preventDefault();
        if (waitlistEmail.value) {
            // Here you would typically send the email and price to your server
            console.log('Email submitted:', waitlistEmail.value, 'for price:', currentPrice);
            waitlistPopup.innerHTML = '<div class="modal-content"><p>Thank you for joining the waitlist!</p></div>';
            setTimeout(() => {
                waitlistPopup.classList.add('hidden');
            }, 3000);
        } else {
            alert('Please enter a valid email address.');
        }
    });

    window.addEventListener('click', function(event) {
        if (event.target == waitlistPopup) {
            waitlistPopup.classList.add('hidden');
        }
    });
});
