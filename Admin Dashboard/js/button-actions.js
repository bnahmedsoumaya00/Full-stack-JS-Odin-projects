// Button Actions Component
class ButtonActions extends EventHandler {
    constructor(selector = '.action-btn') {
        super();
        this.buttons = DOMUtils.$$(selector);
        this.actions = new Map([
            ['New', () => this.createNew()],
            ['Upload', () => this.uploadFile()],
            ['Share', () => this.shareProject()]
        ]);
        this.init();
    }

    init() {
        this.bindEvents();
    }

    bindEvents() {
        this.buttons.forEach(btn => {
            this.on(btn, 'click', (e) => this.handleClick(e, btn));
        });
    }

    handleClick(event, button) {
        const buttonText = button.textContent;
        console.log(`${buttonText} button clicked`);
        
        // Visual feedback
        Animator.scaleButton(button);
        
        // Execute action
        const action = this.actions.get(buttonText);
        if (action) {
            action();
        } else {
            console.warn(`No action defined for button: ${buttonText}`);
        }
    }

    // Action methods
    createNew() {
        console.log('Creating new project...');
        this.onCreateNew?.();
    }

    uploadFile() {
        console.log('Uploading file...');
        this.onUploadFile?.();
    }

    shareProject() {
        console.log('Sharing project...');
        this.onShareProject?.();
    }

    // Event callbacks
    onCreateNew(callback) { this.onCreateNew = callback; }
    onUploadFile(callback) { this.onUploadFile = callback; }
    onShareProject(callback) { this.onShareProject = callback; }

    // Add new action
    addAction(buttonText, callback) {
        this.actions.set(buttonText, callback);
    }
}
