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
        // Get the email value before clearing the form
        const email = document.getElementById('waitlistEmail').value;
        const requestId = document.getElementById('hiddenRequestId').value;
        console.log('Email:', email);
        console.log('Request ID:', requestId);
        
        // Close the waitlist modal
        waitlistModal.closeModal();
        
        // Clear the form
        waitlistForm.reset();
        
        // Check if the last clicked button had the data-ask-times attribute
        const shouldAskTimes = lastClickedButton && lastClickedButton.hasAttribute('data-ask-times');
        
        if (shouldAskTimes) {
            const timePreferencePopup = document.getElementById('timePreferencePopup');
            const submittedWaitlistEmail = document.getElementById('submittedWaitlistEmail');
            const submittedRequestId = document.getElementById('submittedRequestId');
            console.log('Submitted waitlist email:', submittedWaitlistEmail);
            submittedWaitlistEmail.value = email;
            submittedRequestId.value = requestId;
            timePreferenceModal.openModal();
        }
    }

    // Track the last clicked waitlist button
    let lastClickedButton = null;

    if (waitlistForm) {
        waitlistForm.addEventListener('submit', handleSubmit);
        console.log('Submit event listener added to form');
    } else {
        console.log('Waitlist form not found');
    }

    // Add event listener for the "None of these times" link
    const noTimesLink = document.getElementById('noTimesLink');
    const otherTimesContainer = document.getElementById('otherTimesContainer');
    
    if (noTimesLink) {  // Only add the event listener if the link exists
        noTimesLink.addEventListener('click', function(e) {
            e.preventDefault();
            otherTimesContainer.classList.toggle('hidden');
        });
    }

    function handleTimePreferenceSubmit(e) {
        e.preventDefault();
        const form = e.target;
        const email = document.getElementById('submittedWaitlistEmail').value;
        const requestId = document.getElementById('submittedRequestId').value;
        const courseName = document.getElementById('submittedCourseName').value;
        const selectedTimes = Array.from(form.querySelectorAll('input[name="timePreference"]:checked'))
            .map(checkbox => checkbox.value);
        const otherTimes = document.getElementById('otherTimes').value;

        if (selectedTimes.length === 0 && !otherTimes) {
            alert('Please select at least one time preference or provide alternative times.');
            return;
        }

        const data = {
            email: email,
            requestId: requestId,
            courseName: courseName,
            timePreferences: selectedTimes,
            otherTimes: otherTimes
        };
        
        console.log('Submitting data:', data); // Debug log
        
        // Define the endpoint based on environment
        const endpoint = '{{ jekyll.environment }}' === 'production' 
            ? '/workshops/process_time_preference.php'
            : '/workshops/process_time_preference.test.json';

        fetch(endpoint, {
            method: '{{ jekyll.environment }}' === 'production' ? 'POST' : 'GET',
            headers: {
                'Content-Type': 'application/json'
            },
            body: '{{ jekyll.environment }}' === 'production' ? JSON.stringify(data) : null
        })
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                // Store the original content
                const modalContent = timePreferencePopup.querySelector('.modal-content');
                const originalContent = modalContent.innerHTML;
                
                // Replace content with message
                modalContent.innerHTML = `
                    <div class="temp-message success">
                        <h3>Thank You!</h3>
                        <p>${data.message}</p>
                    </div>
                `;
                
                // Reset and restore after delay
                setTimeout(() => {
                    timePreferenceModal.closeModal();
                    form.reset();
                    modalContent.innerHTML = originalContent;
                }, 2000);
            } else {
                throw new Error(data.error || 'An error occurred');
            }
        })
        .catch(error => {
            console.error('Error:', error);
            const modalContent = timePreferencePopup.querySelector('.modal-content');
            const originalContent = modalContent.innerHTML;
            
            modalContent.innerHTML = `
                <div class="temp-message error">
                    <h3>Error</h3>
                    <p>An error occurred. Please try again.</p>
                </div>
            `;
            
            setTimeout(() => {
                modalContent.innerHTML = originalContent;
            }, 3000);
        });
    }

    // Add the event listener to the time preference form
    const timePreferenceForm = document.getElementById('timePreferenceForm');
    if (timePreferenceForm) {
        timePreferenceForm.addEventListener('submit', handleTimePreferenceSubmit);
    }

    // Add click handlers for all waitlist buttons
    document.querySelectorAll('.waitlist-button').forEach(button => {
        button.addEventListener('click', function(e) {
            e.preventDefault();
            lastClickedButton = this;
            
            // Add this code to update pricing info
            const price = this.getAttribute('data-price');
            const originalPrice = this.getAttribute('data-original-price');
            const discount = this.getAttribute('data-discount');
            const itemName = this.getAttribute('data-item-name');
            
            // Update the existing elements
            document.getElementById('waitlistItemName').textContent = itemName;
            document.getElementById('waitlistPrice').textContent = `$${price}`;
            
            if (discount) {
                document.getElementById('waitlistOriginalPrice').textContent = `$${originalPrice}`;
                document.getElementById('waitlistDiscount').textContent = `${discount}% off`;
            } else {
                document.getElementById('waitlistOriginalPrice').textContent = '';
                document.getElementById('waitlistDiscount').textContent = '';
            }

            // Generate request ID: YYYYMMDD-XXXX
            const today = new Date();
            const dateStr = today.getFullYear() +
                String(today.getMonth() + 1).padStart(2, '0') +
                String(today.getDate()).padStart(2, '0');
            
            // Generate 4 random uppercase letters (A-Z only)
            const randomStr = Array.from({ length: 4 }, () => 
                String.fromCharCode(65 + Math.floor(Math.random() * 26))
            ).join('');
            
            const requestId = `${dateStr}-${randomStr}`;
            
            // Copy data attributes to hidden fields
            const form = document.getElementById('waitlistForm');
            const dataAttributes = [
                'price',
                'item-name',
                'discount',
                'original-price',
                'ask-times'
            ];
            
            // Add requestId to form
            const requestIdField = form.querySelector('input[name="requestId"]');
            console.log('Request ID field:', requestIdField);
            if (!requestIdField) {
                console.error('Request ID field not found in the form.');
                return;
            }
            requestIdField.value = requestId;
            
            dataAttributes.forEach(attr => {
                const value = this.getAttribute(`data-${attr}`);
                const fieldName = attr.replace(/-([a-z])/g, g => g[1].toUpperCase()); // convert to camelCase
                const hiddenField = form.querySelector(`input[name="${fieldName}"]`);
                
                if (!hiddenField) {
                    // Create field if it doesn't exist
                    const input = document.createElement('input');
                    input.type = 'hidden';
                    input.name = fieldName;
                    form.appendChild(input);
                }
                
                // Set the value (convert empty string to "true" for boolean attributes)
                const isBoolean = value === '';
                form.querySelector(`input[name="${fieldName}"]`).value = 
                    isBoolean ? 'true' : value;
            });
            
            waitlistModal.openModal();
        });
    });
});

// Outside DOMContentLoaded event
console.log('JavaScript file loaded');
