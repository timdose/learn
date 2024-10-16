document.addEventListener('DOMContentLoaded', function() {
    const modal = document.getElementById('discountPopup');
    const openButtons = document.querySelectorAll('.openPopup'); // Use a class for all buttons
    const closeBtn = document.querySelector('.close');
    const discountOptions = document.querySelectorAll('.discount-option');

    // Open the modal for each button
    openButtons.forEach(button => {
        button.addEventListener('click', function() {
            modal.style.display = 'block';
        });
    });

    // Close the modal
    closeBtn.addEventListener('click', function() {
        modal.style.display = 'none';
    });

    // Close the modal when clicking outside of it
    window.addEventListener('click', function(event) {
        if (event.target == modal) {
            modal.style.display = 'none';
        }
    });

    // Handle discount selection
    discountOptions.forEach(option => {
        option.addEventListener('click', function() {
            const variantClass = 'container-pricing-' + this.getAttribute('data-variant');
            console.log('Selected variant class:', variantClass);

            // Hide all pricing matrix variants
            document.querySelectorAll('.container-pricing').forEach(matrix => {
                matrix.classList.add('hidden');
            });

            // Show the corresponding pricing matrix variant by class
            const activeMatrices = document.querySelectorAll(`.${variantClass}`);
            console.log('Active matrices:', activeMatrices); // Debugging line

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
});
