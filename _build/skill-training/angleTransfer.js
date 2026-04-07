class AngleTransfer {
    constructor(leftCanvas, rightCanvas) {
        this.leftCanvas = leftCanvas;
        this.rightCanvas = rightCanvas;
        this.leftCtx = leftCanvas.getContext('2d');
        this.rightCtx = rightCanvas.getContext('2d');
        
        // Configuration
        this.lineLength = 200; // Length of the angle line
        this.dotRadius = 4;    // Size of dots
        
        // Current test state
        this.currentAngle = null;
        this.leftDotPos = null;
        this.rightDotPos = null;
    }

    generateNew() {
        // Generate random angle between 0 and 360
        this.currentAngle = utils.randomAngle(0, 360);
        
        // Calculate dot positions for both canvases
        const leftCenter = utils.canvas.getCenter(this.leftCanvas);
        const rightCenter = utils.canvas.getCenter(this.rightCanvas);
        
        // Randomly offset the dots from center
        const offsetRange = 100;
        this.leftDotPos = {
            x: leftCenter.x + utils.random(-offsetRange, offsetRange),
            y: leftCenter.y + utils.random(-offsetRange, offsetRange)
        };
        
        this.rightDotPos = {
            x: rightCenter.x + utils.random(-offsetRange, offsetRange),
            y: rightCenter.y + utils.random(-offsetRange, offsetRange)
        };
    }

    draw() {
        if (!this.currentAngle) {
            this.generateNew();
        }

        // Draw left side (reference)
        utils.draw.clear(this.leftCtx, 'white');
        utils.draw.dot(this.leftCtx, this.leftDotPos.x, this.leftDotPos.y);
        utils.draw.angleLineFromPoint(
            this.leftCtx,
            this.leftDotPos.x,
            this.leftDotPos.y,
            this.currentAngle,
            this.lineLength
        );

        // Draw right side (practice)
        utils.draw.clear(this.rightCtx, 'black');
        utils.draw.dot(this.rightCtx, this.rightDotPos.x, this.rightDotPos.y, this.dotRadius, 'white');
    }

    showAnswer() {
        // Change background to white
        utils.draw.clear(this.rightCtx, 'white');
        
        // Draw black dot and line at the correct angle
        utils.draw.dot(this.rightCtx, this.rightDotPos.x, this.rightDotPos.y);
        utils.draw.angleLineFromPoint(
            this.rightCtx,
            this.rightDotPos.x,
            this.rightDotPos.y,
            this.currentAngle,
            this.lineLength
        );
    }
}
