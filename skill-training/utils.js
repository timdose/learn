// Random number utilities
const utils = {
    // Get a random number between min and max (inclusive)
    random: (min, max) => {
        return Math.floor(Math.random() * (max - min + 1)) + min;
    },

    // Get a random angle in degrees (can specify range)
    randomAngle: (minDegrees = 0, maxDegrees = 360) => {
        return utils.random(minDegrees, maxDegrees);
    },

    // Convert degrees to radians
    toRadians: (degrees) => {
        return degrees * (Math.PI / 180);
    },

    // Convert radians to degrees
    toDegrees: (radians) => {
        return radians * (180 / Math.PI);
    },

    // Drawing utilities
    draw: {
        // Clear canvas with specific color
        clear: (ctx, color = 'white') => {
            const {width, height} = ctx.canvas;
            ctx.save();
            ctx.setTransform(1, 0, 0, 1, 0, 0);
            ctx.fillStyle = color;
            ctx.fillRect(0, 0, width, height);
            ctx.restore();
        },

        // Draw a dot
        dot: (ctx, x, y, radius = 4, color = 'black') => {
            ctx.beginPath();
            ctx.fillStyle = color;
            ctx.arc(x, y, radius, 0, Math.PI * 2);
            ctx.fill();
        },

        // Draw a line from point to point
        line: (ctx, x1, y1, x2, y2, color = 'black', width = 2) => {
            ctx.beginPath();
            ctx.strokeStyle = color;
            ctx.lineWidth = width;
            ctx.moveTo(x1, y1);
            ctx.lineTo(x2, y2);
            ctx.stroke();
        },

        // Draw a line at an angle from a point
        angleLineFromPoint: (ctx, x, y, angle, length, color = 'black', width = 2) => {
            const radians = utils.toRadians(angle);
            const endX = x + Math.cos(radians) * length;
            const endY = y + Math.sin(radians) * length;
            utils.draw.line(ctx, x, y, endX, endY, color, width);
            return {endX, endY};
        }
    },

    // Canvas utilities
    canvas: {
        // Get canvas center point
        getCenter: (canvas) => {
            return {
                x: canvas.width / (2 * window.devicePixelRatio),
                y: canvas.height / (2 * window.devicePixelRatio)
            };
        },

        // Get canvas dimensions in display pixels
        getDimensions: (canvas) => {
            return {
                width: canvas.width / window.devicePixelRatio,
                height: canvas.height / window.devicePixelRatio
            };
        }
    }
};
