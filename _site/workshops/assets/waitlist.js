document.addEventListener('DOMContentLoaded', function() {
    console.log('DOMContentLoaded event fired');

    const waitlistForm = document.getElementById('waitlistForm');
    const submitButton = document.getElementById('submitWaitlistButton');
    const waitlistEmail = document.getElementById('waitlistEmail');
    const waitlistPopup = document.getElementById('waitlistPopup');
    const modalContent = waitlistPopup.querySelector('.modal-content');
    
    console.log('Form found:', waitlistForm);
    console.log('Submit button found:', submitButton);
    console.log('Email input found:', waitlistEmail);

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

    if (waitlistForm) {
        waitlistForm.addEventListener('submit', handleSubmit);
        console.log('Submit event listener added to form');
    } else {
        console.log('Waitlist form not found');
    }

    // Remove all other event listeners
});

// Outside DOMContentLoaded event
console.log('JavaScript file loaded');
