document.addEventListener('DOMContentLoaded', function() {
    console.log('DOMContentLoaded event fired');

    const waitlistForm = document.getElementById('waitlistForm');
    const submitButton = document.getElementById('submitWaitlistButton');
    const waitlistEmail = document.getElementById('waitlistEmail');
    const waitlistPopup = document.getElementById('waitlistPopup');
    const modalContent = waitlistPopup.querySelector('.modal-content');
    const closeButton = waitlistPopup.querySelector('.close');
    
    console.log('Form found:', waitlistForm);
    console.log('Submit button found:', submitButton);
    console.log('Email input found:', waitlistEmail);

    // Ensure the popup is hidden on page load
    waitlistPopup.classList.add('hidden');

    // Function to open the modal
    function openModal() {
        waitlistPopup.classList.remove('hidden');
    }

    // Function to close the modal
    function closeModal() {
        waitlistPopup.classList.add('hidden');
        // Add a custom event dispatch to help with testing
        waitlistPopup.dispatchEvent(new CustomEvent('modalClosed'));
    }

    // Add keyboard event listener for Escape key
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && !waitlistPopup.classList.contains('hidden')) {
            closeModal();
        }
    });

    // Add click event to close button
    if (closeButton) {
        closeButton.addEventListener('click', (e) => {
            e.preventDefault();
            closeModal();
        });
    }

    // Add click events to all waitlist buttons
    document.querySelectorAll('.waitlist-button').forEach(button => {
        button.addEventListener('click', function(e) {
            e.preventDefault()
            const itemName = this.getAttribute('data-item-name');
            const price = this.getAttribute('data-price');
            const originalPrice = this.getAttribute('data-original-price');
            const discount = this.getAttribute('data-discount');
            
            // Set hidden input values
            document.getElementById('hiddenItemName').value = itemName;
            document.getElementById('hiddenPrice').value = price;
            document.getElementById('hiddenOriginalPrice').value = originalPrice;
            document.getElementById('hiddenDiscount').value = discount;

            // Update visible text in the modal
            document.getElementById('waitlistItemName').textContent = itemName;
            document.getElementById('waitlistPrice').textContent = '$' + price;
            if (originalPrice !== price) {
                document.getElementById('waitlistOriginalPrice').textContent = '$' + originalPrice;
                document.getElementById('waitlistDiscount').textContent = discount + '% off';
            }

            openModal();
        });
    });

    // Move these function definitions outside DOMContentLoaded
    function handleSubmit(e) {
        console.log('handleSubmit function called');
        e.preventDefault();

        console.log('Email input:', waitlistEmail);
        console.log('Email value:', waitlistEmail ? waitlistEmail.value : 'Email input not found');

        if (waitlistEmail && waitlistEmail.value) {
            const formData = new FormData(waitlistForm);
            console.log('Form data:', Object.fromEntries(formData));
            
            console.log('Sending AJAX request');
            
            fetch('/workshops/process_waitlist.php', {
                method: 'POST',
                body: formData
            })
            .then(response => {
                console.log('Raw response:', response);
                return response.text();
            })
            .then(text => {
                console.log('Response text:', text);
                try {
                    const data = JSON.parse(text);
                    console.log('Parsed JSON:', data);
                    if (data.message) {
                        showSuccessMessage(data.message);
                    } else if (data.error) {
                        alert(data.error);
                    }
                } catch (e) {
                    console.error('Error parsing JSON:', e);
                    alert('An error occurred while processing the response. Please try again.');
                }
            })
            .catch(error => {
                console.error('Fetch error:', error);
                alert('An error occurred. Please try again.');
            });
        } else {
            console.log('Email is empty or email input not found');
            alert('Please enter a valid email address.');
        }
    }

    function showSuccessMessage(message) {
        const successMessage = document.createElement('div');
        successMessage.textContent = message;
        successMessage.style.cssText = `
            position: fixed;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            background-color: #4CAF50;
            color: white;
            padding: 20px;
            border-radius: 5px;
            text-align: center;
            z-index: 1000;
        `;
        document.body.appendChild(successMessage);

        // Clear the form
        waitlistForm.reset();

        // Remove the success message and close the modal after 3 seconds
        setTimeout(() => {
            document.body.removeChild(successMessage);
            closeModal();
        }, 3000);
    }

    if (waitlistForm) {
        waitlistForm.addEventListener('submit', handleSubmit);
        console.log('Submit event listener added to form');
    } else {
        console.log('Waitlist form not found');
    }
});

// Outside DOMContentLoaded event
console.log('JavaScript file loaded');
