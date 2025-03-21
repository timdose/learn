class SkillTrainer {
    constructor() {
        // Canvas setup
        this.leftCanvas = document.getElementById('leftCanvas');
        this.rightCanvas = document.getElementById('rightCanvas');
        this.leftCtx = this.leftCanvas.getContext('2d');
        this.rightCtx = this.rightCanvas.getContext('2d');

        // Current state
        this.currentSkill = null;
        this.isAnswerRevealed = false;

        // Bind event handlers
        this.handleResize = this.handleResize.bind(this);
        this.handleKeyPress = this.handleKeyPress.bind(this);

        // Set up event listeners
        window.addEventListener('resize', this.handleResize);
        document.addEventListener('keydown', this.handleKeyPress);
        document.getElementById('newTest').addEventListener('click', () => this.newTest());
        document.getElementById('showAnswer').addEventListener('click', () => this.showAnswer());

        // Initial setup
        this.handleResize();
        this.initializeAngleTransfer();
    }

    handleResize() {
        // Make canvas pixels match display size
        const updateCanvas = (canvas) => {
            const rect = canvas.getBoundingClientRect();
            canvas.width = rect.width * window.devicePixelRatio;
            canvas.height = rect.height * window.devicePixelRatio;
            const ctx = canvas.getContext('2d');
            ctx.scale(window.devicePixelRatio, window.devicePixelRatio);
            canvas.style.width = rect.width + 'px';
            canvas.style.height = rect.height + 'px';
        };

        updateCanvas(this.leftCanvas);
        updateCanvas(this.rightCanvas);

        // Redraw current test
        if (this.currentSkill) {
            this.currentSkill.draw();
        }
    }

    handleKeyPress(event) {
        if (event.code === 'Space') {
            event.preventDefault();
            if (!this.isAnswerRevealed) {
                this.showAnswer();
            } else {
                this.newTest();
            }
        }
    }

    initializeAngleTransfer() {
        this.currentSkill = new AngleTransfer(this.leftCanvas, this.rightCanvas);
        this.newTest();
    }

    newTest() {
        this.isAnswerRevealed = false;
        this.currentSkill.generateNew();
        this.currentSkill.draw();
    }

    showAnswer() {
        if (!this.isAnswerRevealed) {
            this.isAnswerRevealed = true;
            this.currentSkill.showAnswer();
        }
    }
}

// Initialize when the page loads
window.addEventListener('load', () => {
    window.app = new SkillTrainer();
});
