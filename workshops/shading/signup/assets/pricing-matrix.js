// Assuming you have buttons with class 'sliding-scale-button' and pricing matrix variants with a common class 'pricing-matrix'
document.addEventListener('DOMContentLoaded', function() {
    document.querySelectorAll('.sliding-scale-button').forEach(button => {
        button.addEventListener('click', function() {
            // Get the data attribute that corresponds to the pricing matrix variant
            const variantClass = 'container-pricing-' + this.getAttribute('data-variant');
            console.log('Selected variant class:', variantClass);

            // Hide all pricing matrix variants
            document.querySelectorAll('.container-pricing').forEach(matrix => {
                matrix.classList.add('hidden');
            });

            // Show the corresponding pricing matrix variant by class
            const activeMatrix = document.querySelectorAll(`.${variantClass}`);
            console.log('Active matrices:', activeMatrix); // Debugging line

            if (activeMatrix.length > 0) {
                activeMatrix.forEach(matrix => {
                    matrix.classList.remove('hidden');
                });
            } else {
                console.warn('No active matrix found for class:', variantClass);
            }
        });
    });
});
