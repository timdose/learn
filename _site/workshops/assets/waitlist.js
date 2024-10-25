document.addEventListener('DOMContentLoaded', function() {
    console.log('DOMContentLoaded event fired');

    const waitlistForm = document.getElementById('waitlistForm');
    const submitButton = document.getElementById('submitWaitlistButton');
    const waitlistEmail = document.getElementById('waitlistEmail');
    
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
                return response.text();  // Change this from response.json()
            })
            .then(text => {
                console.log('Response text:', text);
                try {
                    const data = JSON.parse(text);
                    console.log('Parsed JSON:', data);
                    // Handle the data as before
                    if (data.message) {
                        const modalContent = document.querySelector('.modal-content');
                        modalContent.innerHTML = '<span class="close">&times;</span><p>' + data.message + '</p>';
                        const newClosePopup = modalContent.querySelector('.close');
                        if (newClosePopup) {
                            newClosePopup.addEventListener('click', closeModal);
                        }
                        setTimeout(closeModal, 3000);
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
