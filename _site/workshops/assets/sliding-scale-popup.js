document.addEventListener('DOMContentLoaded', function() {
    const modal = document.getElementById('discountPopup');
    const openButtons = document.querySelectorAll('.openPopup');
    const closeBtn = modal.querySelector('.close'); // Select the close button within the modal
    const discountOptionButtons = document.querySelectorAll('.discount-option-button');

    // Open the modal
    openButtons.forEach(button => {
        button.addEventListener('click', function() {
            modal.style.display = 'block';
        });
    });

    // Close the modal when the close button is clicked
    if (closeBtn) {
        closeBtn.addEventListener('click', function() {
            modal.style.display = 'none';
        });
    } else {
        console.warn('Close button not found in the modal');
    }

    // Close the modal when clicking outside of it
    window.addEventListener('click', function(event) {
        if (event.target == modal) {
            modal.style.display = 'none';
        }
    });

    // Handle discount selection
    discountOptionButtons.forEach(button => {
        button.addEventListener('click', function() {
            const variantClass = 'show-if-' + this.getAttribute('data-variant');
            
            // Hide all pricing matrix variants
            document.querySelectorAll('.container-pricing, .discount-section').forEach(matrix => {
                matrix.classList.add('hidden');
            });

            // Show the corresponding pricing matrix variant by class
            const activeMatrices = document.querySelectorAll(`.${variantClass}`);
            
            if (activeMatrices.length > 0) {
                activeMatrices.forEach(matrix => {
                    matrix.classList.remove('hidden');
                });
            } else {
                console.warn('No active matrix found for class:', variantClass);
            }

            // Close the modal
            modal.style.display = 'none';
        });
    });

    // Simulate click on the first .openPopup button
    // if (openButtons.length > 0) {
    //     openButtons[0].click();
    // }
});
