---

---

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

    // Add click event to modal wrapper for outside clicks
    waitlistPopup.addEventListener('click', (e) => {
        // Close only if clicking the overlay (waitlistPopup) and not its children
        if (e.target === waitlistPopup) {
            closeModal();
        }
    });

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

        if (waitlistEmail && waitlistEmail.value) {
            const formData = new FormData(waitlistForm);
            console.log('Form data:', Object.fromEntries(formData));
            
            // Define the endpoint based on environment
            const endpoint = '{{ jekyll.environment }}' === 'production' 
                ? '/workshops/process_waitlist.php'
                : '/workshops/process_waitlist.test.json';
            
            console.log('Sending request to:', endpoint);
            
            fetch(endpoint, {
                method: '{{ jekyll.environment }}' === 'production' ? 'POST' : 'GET', // Use GET for JSON file
                body: '{{ jekyll.environment }}' === 'production' ? formData : null   // Don't send body for GET
            })
            .then(response => {
                console.log('Raw response:', response);
                return response.json(); // Changed from response.text() since we know it's JSON
            })
            .then(data => {
                console.log('Response data:', data);
                if (data.message) {
                    showSuccessMessage(data.message);
                } else if (data.error) {
                    alert(data.error);
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
        // Get the email value before clearing the form
        const email = document.getElementById('waitlistEmail').value;
        console.log('Email:', email);
        
        // Close the waitlist modal
        closeModal();
        
        // Clear the form
        waitlistForm.reset();
        
        // Show time preference popup with success message
        const timePreferencePopup = document.getElementById('timePreferencePopup');
        const submittedWaitlistEmail = document.getElementById('submittedWaitlistEmail');
        console.log('Submitted waitlist email:', submittedWaitlistEmail);
        submittedWaitlistEmail.value = email;
        timePreferencePopup.classList.remove('hidden');
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
