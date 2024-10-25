document.addEventListener('DOMContentLoaded', function() {
    console.log('DOM fully loaded');

    const waitlistForm = document.getElementById('waitlistForm');
    const submitButton = document.getElementById('submitWaitlistButton');
    const waitlistPopup = document.getElementById('waitlistPopup');
    const modalContent = waitlistPopup.querySelector('.modal-content');
    const originalContent = modalContent.innerHTML;  // Define originalContent here

    console.log('Form element:', waitlistForm);
    console.log('Submit button:', submitButton);

    if (waitlistForm) {
        waitlistForm.addEventListener('submit', handleSubmit);
        console.log('Submit event listener added to form');
    }

    if (submitButton) {
        submitButton.addEventListener('click', function(e) {
            console.log('Submit button clicked');
            e.preventDefault();
            handleSubmit(e);
        });
        console.log('Click event listener added to submit button');
    }

    function initializeElements() {
        const closePopup = waitlistPopup.querySelector('.close');
        if (closePopup) {
            closePopup.addEventListener('click', closeModal);
        }
    }

    initializeElements();

    document.querySelectorAll('.waitlist-button').forEach(function(button) {
        button.addEventListener('click', function() {
            const itemName = this.getAttribute('data-item-name');
            const price = this.getAttribute('data-price');
            const originalPrice = this.getAttribute('data-original-price');
            const discount = this.getAttribute('data-discount');
            
            openWaitlistModal(itemName, price, originalPrice, discount);
        });
    });

    function openWaitlistModal(itemName, price, originalPrice, discount) {
        console.log('Opening modal for:', itemName);
        resetForm();
        updateHiddenFields(itemName, price, originalPrice, discount);
        waitlistPopup.classList.remove('hidden');
    }

    function updateHiddenFields(itemName, price, originalPrice, discount) {
        document.getElementById('hiddenItemName').value = itemName;
        document.getElementById('hiddenPrice').value = price;
        document.getElementById('hiddenOriginalPrice').value = originalPrice;
        document.getElementById('hiddenDiscount').value = discount;
        
        document.getElementById('waitlistItemName').textContent = itemName;
        document.getElementById('waitlistPrice').textContent = '$' + price;
        if (originalPrice != price) {
            document.getElementById('waitlistOriginalPrice').textContent = '$' + originalPrice;
            document.getElementById('waitlistDiscount').textContent = discount + '% off';
        }
    }

    function closeModal() {
        waitlistPopup.classList.add('hidden');
    }

    function handleSubmit(e) {
        console.log('handleSubmit function called');
        e.preventDefault();

        const waitlistEmail = document.getElementById('waitlistEmail');
        console.log('Email input:', waitlistEmail);

        if (waitlistEmail && waitlistEmail.value) {
            const formData = new FormData(waitlistForm);
            
            console.log('Sending AJAX request');
            
            fetch('process_waitlist.php', {
                method: 'POST',
                body: formData
            })
            .then(response => response.json())
            .then(data => {
                console.log('Received response:', data);
                if (data.message) {
                    modalContent.innerHTML = '<span class="close">&times;</span><p>' + data.message + '</p>';
                    const newClosePopup = modalContent.querySelector('.close');
                    if (newClosePopup) {
                        newClosePopup.addEventListener('click', closeModal);
                    }
                    setTimeout(closeModal, 3000);
                } else if (data.error) {
                    alert(data.error);
                }
            })
            .catch(error => {
                console.error('Error:', error);
                alert('An error occurred. Please try again.');
            });
        } else {
            console.log('Email is empty or email input not found');
            alert('Please enter a valid email address.');
        }
    }

    function resetForm() {
        modalContent.innerHTML = originalContent;
        initializeElements();
    }

    window.addEventListener('click', function(event) {
        if (event.target == waitlistPopup) {
            closeModal();
        }
    });
});
