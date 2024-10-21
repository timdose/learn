document.addEventListener('DOMContentLoaded', function() {
    const waitlistPopup = document.getElementById('waitlistPopup');
    const modalContent = waitlistPopup.querySelector('.modal-content');
    const originalContent = modalContent.innerHTML;

    let currentPrice = '';
    let waitlistEmail, submitWaitlist, waitlistPrice, closePopup;

    function initializeElements() {
        waitlistEmail = document.getElementById('waitlistEmail');
        submitWaitlist = document.getElementById('submitWaitlist');
        waitlistPrice = document.getElementById('waitlistPrice');
        closePopup = waitlistPopup.querySelector('.close');
        
        if (closePopup) {
            closePopup.addEventListener('click', closeModal);
        }
    }

    initializeElements();

    document.querySelectorAll('.waitlist-button').forEach(function(button) {
        button.addEventListener('click', function() {
            currentPrice = this.getAttribute('data-price');
            resetForm();
            waitlistPrice.textContent = '$' + currentPrice;
            waitlistPopup.classList.remove('hidden');
        });
    });

    function closeModal() {
        waitlistPopup.classList.add('hidden');
    }

    function handleSubmit(e) {
        e.preventDefault();
        if (waitlistEmail.value) {
            // Here you would typically send the email and price to your server
            console.log('Email submitted:', waitlistEmail.value, 'for price:', currentPrice);
            modalContent.innerHTML = '<span class="close">&times;</span><p>Thank you for joining the waitlist!</p>';
            const newClosePopup = modalContent.querySelector('.close');
            if (newClosePopup) {
                newClosePopup.addEventListener('click', closeModal);
            }
            setTimeout(closeModal, 3000);
        } else {
            alert('Please enter a valid email address.');
        }
    }

    function resetForm() {
        modalContent.innerHTML = originalContent;
        initializeElements();
        submitWaitlist.addEventListener('click', handleSubmit);
    }

    window.addEventListener('click', function(event) {
        if (event.target == waitlistPopup) {
            closeModal();
        }
    });
});
