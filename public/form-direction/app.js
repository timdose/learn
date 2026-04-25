document.addEventListener('DOMContentLoaded', (event) => {
    const subjectImage = document.getElementById('subjectImage');
    const dotImage = document.getElementById('dotImage');
    const userDotCanvas = document.getElementById('userDotCanvas');
    const ctx = userDotCanvas.getContext('2d');
    const checkButton = document.getElementById('checkButton');
    const nextButton = document.getElementById('nextButton');
    const prevButton = document.getElementById('prevButton');
    const subjectSelect = document.getElementById('subjectSelect');

    let imageLoaded = false;
    let currentDot = null; // To keep track of the current dot position
    let currentDotIndex = 0; // Start with the first dot image
    let currentSubjectIndex = 0; // Start with the first subject
    let subjects = []; // Array to hold subjects
    let dotImages = []; // Array to hold dot images for the current subject
    let totalDots = 0; // Declare totalDots in a broader scope

    // Load the YAML file
    fetch('images.yaml')
        .then(response => response.text())
        .then(yamlText => {
            const data = jsyaml.load(yamlText);
            subjects = data.subjects; // Get the list of subjects
            populateSubjectSelect(); // Populate the dropdown menu
            loadSubject(currentSubjectIndex); // Load the first subject
        })
        .catch(error => console.error('Error loading YAML file:', error));

    function populateSubjectSelect() {
        subjects.forEach((subject, index) => {
            const option = document.createElement('option');
            option.value = index; // Set the value to the index
            option.textContent = subject.title; // Set the display text to the subject title
            subjectSelect.appendChild(option); // Add the option to the dropdown
        });

        // Add event listener for subject change
        subjectSelect.addEventListener('change', (event) => {
            currentSubjectIndex = parseInt(event.target.value); // Get the selected index
            loadSubject(currentSubjectIndex); // Load the selected subject
        });
    }

    function loadSubject(index) {
        const subject = subjects[index];
        document.getElementById('subjectTitle').textContent = subject.title; // Display the subject title
        const randomNum = new Date().getTime(); // Use current timestamp as a random number

        // Ensure subject.subject_image is defined and valid
        if (subject.subject_image) {
            subjectImage.src = `quiz/images/${subject.name}/${subject.subject_image}?t=${randomNum}`; // Use name for URL
        } else {
            console.error('Subject image not defined for:', subject);
        }

        // Ensure dot_images is defined and valid
        if (subject.dot_images && Array.isArray(subject.dot_images)) {
            dotImages = subject.dot_images.map(img => `quiz/images/${subject.name}/${img}?t=${randomNum}`); // Use name for URL
        } else {
            console.error('Dot images not defined or not an array for:', subject);
            dotImages = []; // Reset to empty array if not valid
        }

        currentDotIndex = 0; // Reset dot index
        totalDots = dotImages.length; // Set total number of dot images

        // Check if there are any dot images before setting the src
        if (totalDots > 0) {
            dotImage.src = dotImages[currentDotIndex]; // Set the initial dot image with cache buster
        } else {
            console.error('No dot images available for subject:', subject);
        }

        console.log('Loaded subject:', subject.title, 'with dot images:', dotImages); // Log the title instead of name
        
        updateDotCounter(); // Update counter when a subject is loaded
    }

    function resizeCanvas() {
        userDotCanvas.width = subjectImage.width;
        userDotCanvas.height = subjectImage.height;
        userDotCanvas.style.width = `${subjectImage.offsetWidth}px`;
        userDotCanvas.style.height = `${subjectImage.offsetHeight}px`;
        console.log('Canvas resized to:', userDotCanvas.width, userDotCanvas.height);

        // Redraw the current dot if it exists
        if (currentDot) {
            drawX(currentDot.x, currentDot.y);
        }
    }

    function checkImagesLoaded() {
        if (subjectImage.complete && dotImage.complete) {
            console.log('Both images are loaded');
            imageLoaded = true;
            resizeCanvas();
        } else {
            console.log('Images not loaded yet, retrying...');
            setTimeout(checkImagesLoaded, 100); // Check again in 100ms
        }
    }

    subjectImage.onload = checkImagesLoaded;
    dotImage.onload = checkImagesLoaded;

    // Start checking if images are loaded
    checkImagesLoaded();

    window.addEventListener('resize', resizeCanvas);

    function drawX(x, y) {
        ctx.strokeStyle = 'rgba(0, 0, 255, 0.7)'; // Blue color with 70% opacity
        ctx.lineWidth = 4; // Increase line width for thicker lines

        ctx.beginPath();
        ctx.moveTo(x - 10, y - 10); // Start point of the first line
        ctx.lineTo(x + 10, y + 10); // End point of the first line
        ctx.moveTo(x + 10, y - 10); // Start point of the second line
        ctx.lineTo(x - 10, y + 10); // End point of the second line
        ctx.stroke(); // Draw the lines
        console.log('X drawn at:', x, y);
    }

    function clearDot() {
        ctx.clearRect(0, 0, userDotCanvas.width, userDotCanvas.height); // Clear the entire canvas
        console.log('Previous X cleared');
    }

    userDotCanvas.addEventListener('click', (event) => {
        console.log('Canvas clicked');
        if (!imageLoaded) {
            console.log('Image not loaded yet');
            return;
        }
        const rect = userDotCanvas.getBoundingClientRect();
        const x = event.clientX - rect.left; // Get mouse position relative to the canvas
        const y = event.clientY - rect.top;  // Get mouse position relative to the canvas
        
        // Clear the previous X before drawing a new one
        clearDot();
        
        // Draw the new X and update the current dot position
        drawX(x, y);
        currentDot = { x, y }; // Store the current dot position
    });

    // Add functionality to the Show answer button
    checkButton.addEventListener('click', () => {
        // Change the clip-path to reveal the right half of the dot image
        dotImage.style.clipPath = 'inset(0 0 0 0)'; // Reveal the entire image
        console.log('Revealed the right half of the dot image.');
    });

    // Add functionality to the Next button
    nextButton.addEventListener('click', () => {
        // Increment the dot image index
        currentDotIndex++;
        if (currentDotIndex >= dotImages.length) {
            currentDotIndex = dotImages.length - 1; // Stay at the last image if out of bounds
        }
        dotImage.src = dotImages[currentDotIndex]; // Update the dot image source

        // Reset the clip-path to hide the left half
        dotImage.style.clipPath = 'inset(0 50% 0 0)'; // Hide the left half

        // Load the new image
        dotImage.onload = () => {
            console.log(`Loaded new dot image: ${dotImages[currentDotIndex]}`);
        };

        // Update button states
        updateButtonStates();
        updateDotCounter(); // Update counter after changing the dot index
    });

    // Add functionality to the Previous button
    prevButton.addEventListener('click', () => {
        // Decrement the dot image index, ensuring it doesn't go below 0
        currentDotIndex--;
        if (currentDotIndex < 0) {
            currentDotIndex = 0; // Stay at the first image if out of bounds
        } else {
            dotImage.src = dotImages[currentDotIndex]; // Update the dot image source
            // Load the new image
            dotImage.onload = () => {
                console.log(`Loaded previous dot image: ${dotImages[currentDotIndex]}`);
            };
        }

        // Reset the clip-path to hide the left half
        dotImage.style.clipPath = 'inset(0 50% 0 0)'; // Hide the left half

        // Update currentIndex to reflect the current dot
        currentIndex = currentDotIndex; // Update currentIndex

        // Update button states
        updateButtonStates(); // Ensure button states are updated
        updateDotCounter(); // Update counter after changing the dot index
    });

    // Keyboard shortcuts
    window.addEventListener('keydown', (event) => {
        switch (event.key) {
            case 'ArrowLeft': // Left arrow key
                prevButton.click(); // Trigger the Previous button
                break;
            case 'ArrowRight': // Right arrow key
                nextButton.click(); // Trigger the Next button
                break;
            case ' ': // Space bar
                event.preventDefault(); // Prevent scrolling
                checkButton.click(); // Trigger the Show answer button
                break;
        }
    });

    // Force initial resize
    setTimeout(resizeCanvas, 0);

    // Initialize current index and total dots
    let currentIndex = 0; // Current index of the dot images

    // Function to update button states
    function updateButtonStates() {
        prevButton.disabled = (currentDotIndex === 0); // Disable if first dot
        nextButton.disabled = (currentDotIndex === totalDots - 1); // Disable if last dot
    }

    // Call this function whenever the currentIndex changes
    // Example: after navigating to a new dot image
    updateButtonStates();

    // Function to update the dot counter
    function updateDotCounter() {
        const dotCounter = document.getElementById('dotCounter');
        dotCounter.textContent = `${currentDotIndex + 1} / ${totalDots}`; // Update counter
    }

    // Add this function to handle random dot image selection
    document.getElementById('randomButton').addEventListener('click', function() {
        let randomIndex;
        do {
            randomIndex = Math.floor(Math.random() * totalDots); // Generate a random index
        } while (randomIndex === currentDotIndex); // Ensure it's different from the current index

        // Update the image source based on the random index
        dotImage.src = dotImages[randomIndex]; // Use dotImages array for the current subject
        // Update the counter display
        document.getElementById('dotCounter').textContent = `${randomIndex + 1} / ${totalDots}`; // Update counter

        currentDotIndex = randomIndex; // Update currentDotIndex to the new random index
        updateButtonStates(); // Update button states based on the new index
    });

    const buttons = document.querySelectorAll('.button');

    buttons.forEach(button => {
        let tooltipTimeout;

        button.addEventListener('mouseenter', () => {
            tooltipTimeout = setTimeout(() => {
                const tooltip = button.querySelector('.tooltip');
                tooltip.style.visibility = 'visible';
                tooltip.style.opacity = '1'; // Show tooltip
            }, 1000); // Delay in milliseconds (1000ms = 1 second)
        });

        button.addEventListener('mouseleave', () => {
            clearTimeout(tooltipTimeout); // Clear the timeout if mouse leaves
            const tooltip = button.querySelector('.tooltip');
            tooltip.style.visibility = 'hidden';
            tooltip.style.opacity = '0'; // Hide tooltip
        });
    });

    // Add event listeners for keyboard shortcuts
    document.addEventListener('keydown', function(event) {
        switch (event.key) {
            case 'ArrowLeft': // Left Arrow
                document.getElementById('prevButton').classList.add('active');
                break;
            case ' ': // Space Bar
                document.getElementById('checkButton').classList.add('active');
                break;
            case 'ArrowRight': // Right Arrow
                document.getElementById('nextButton').classList.add('active');
                break;
            case 'r': // R key for Random
                document.getElementById('randomButton').classList.add('active');
                document.getElementById('randomButton').click(); // Trigger the random button click
                break;
        }
    });

    // Remove active state when key is released
    document.addEventListener('keyup', function(event) {
        switch (event.key) {
            case 'ArrowLeft':
                document.getElementById('prevButton').classList.remove('active');
                break;
            case ' ':
                document.getElementById('checkButton').classList.remove('active');
                break;
            case 'ArrowRight':
                document.getElementById('nextButton').classList.remove('active');
                break;
            case 'r':
                document.getElementById('randomButton').classList.remove('active');
                break;
            case '?':
                helpModal.classList.remove('hidden');
                break;
            case 'Escape':
                helpModal.classList.add('hidden');
                break;
        }
    });

    // Help modal
    const helpModal = document.getElementById('helpModal');
    const closeButton = document.querySelector('.close-button');  
    const modalScreen = document.querySelector('.modal-screen');
    const helpButton = document.getElementById('helpButton');
    
    helpButton.addEventListener('click', () => {
        helpModal.classList.remove('hidden');
    });
    
    closeButton.addEventListener('click', () => {
        console.log('Close button clicked');
        helpModal.classList.add('hidden');
    });
    modalScreen.addEventListener('click', () => {
        console.log('Modal screen clicked');
        helpModal.classList.add('hidden');
    });
});