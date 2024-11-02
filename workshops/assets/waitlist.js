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

    // Generic modal management functions
    function setupModal(modalElement) {
        const closeButton = modalElement.querySelector('.close');
        
        function closeModal() {
            modalElement.classList.add('hidden');
            modalElement.dispatchEvent(new CustomEvent('modalClosed'));
        }

        function openModal() {
            modalElement.classList.remove('hidden');
        }

        // Close button click
        if (closeButton) {
            closeButton.addEventListener('click', (e) => {
                e.preventDefault();
                closeModal();
            });
        }

        // Outside click
        modalElement.addEventListener('click', (e) => {
            if (e.target === modalElement) {
                closeModal();
            }
        });

        return { openModal, closeModal };
    }

    // Setup both modals
    const waitlistModal = setupModal(waitlistPopup);
    const timePreferenceModal = setupModal(timePreferencePopup);

    // Single keyboard event listener for all modals
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
            if (!waitlistPopup.classList.contains('hidden')) {
                waitlistModal.closeModal();
            }
            if (!timePreferencePopup.classList.contains('hidden')) {
                timePreferenceModal.closeModal();
            }
        }
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
        const email = document.getElementById('waitlistEmail').value;
        console.log('Email:', email);
        
        waitlistModal.closeModal();
        waitlistForm.reset();
        
        const submittedWaitlistEmail = document.getElementById('submittedWaitlistEmail');
        console.log('Submitted waitlist email:', submittedWaitlistEmail);
        submittedWaitlistEmail.value = email;
        timePreferenceModal.openModal();
    }

    if (waitlistForm) {
        waitlistForm.addEventListener('submit', handleSubmit);
        console.log('Submit event listener added to form');
    } else {
        console.log('Waitlist form not found');
    }

    // Add event listener for the "None of these times" link
    const noTimesLink = document.getElementById('noTimesLink');
    const otherTimesContainer = document.getElementById('otherTimesContainer');
    
    noTimesLink.addEventListener('click', function(e) {
        e.preventDefault();
        otherTimesContainer.classList.toggle('hidden');
    });

    // Update waitlist button click handlers
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

            waitlistModal.openModal();
        });
    });
});

// Outside DOMContentLoaded event
console.log('JavaScript file loaded');
