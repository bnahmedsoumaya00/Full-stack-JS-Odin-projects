/**
 * Form View Class
 * Handles the book form modal and its interactions
 */
class FormView {
    constructor() {
        this.formElement = document.getElementById('newBookForm');
        this.modalElement = document.getElementById('newBookModal');
        this.initializeForm();
    }
    
    /**
     * Initialize form elements and cache references
     */
    initializeForm() {
        this.titleInput = document.getElementById('bookTitle');
        this.authorInput = document.getElementById('bookAuthor');
        this.pagesInput = document.getElementById('bookPages');
        this.genreInput = document.getElementById('bookGenre');
        this.readSelect = document.getElementById('bookRead');
        this.ratingSelect = document.getElementById('bookRating');
        
        this.addInputValidation();
    }
    
    /**
     * Add real-time input validation
     */
    addInputValidation() {
        // Title validation
        if (this.titleInput) {
            this.titleInput.addEventListener('blur', () => {
                this.validateField('title', this.titleInput.value);
            });
        }
        
        // Author validation
        if (this.authorInput) {
            this.authorInput.addEventListener('blur', () => {
                this.validateField('author', this.authorInput.value);
            });
        }
        
        // Pages validation
        if (this.pagesInput) {
            this.pagesInput.addEventListener('blur', () => {
                this.validateField('pages', this.pagesInput.value);
            });
            
            // Prevent negative values
            this.pagesInput.addEventListener('input', (e) => {
                if (e.target.value < 0) {
                    e.target.value = '';
                }
            });
        }
    }
    
    /**
     * Validate individual form field
     * @param {string} fieldName - Name of the field to validate
     * @param {string} value - Value to validate
     */
    validateField(fieldName, value) {
        const fieldElement = this[`${fieldName}Input`];
        if (!fieldElement) return;
        
        let isValid = true;
        let errorMessage = '';
        
        switch (fieldName) {
            case 'title':
                if (!value || value.trim().length === 0) {
                    isValid = false;
                    errorMessage = 'Title is required';
                } else if (value.length > 200) {
                    isValid = false;
                    errorMessage = 'Title must be less than 200 characters';
                }
                break;
                
            case 'author':
                if (!value || value.trim().length === 0) {
                    isValid = false;
                    errorMessage = 'Author is required';
                } else if (value.length > 100) {
                    isValid = false;
                    errorMessage = 'Author name must be less than 100 characters';
                }
                break;
                
            case 'pages':
                const pages = parseInt(value);
                if (!value || isNaN(pages) || pages <= 0) {
                    isValid = false;
                    errorMessage = 'Pages must be a positive number';
                } else if (pages > 50000) {
                    isValid = false;
                    errorMessage = 'Pages must be less than 50,000';
                }
                break;
        }
        
        this.showFieldValidation(fieldElement, isValid, errorMessage);
    }
    
    /**
     * Show validation feedback for a field
     * @param {HTMLElement} fieldElement - Input element
     * @param {boolean} isValid - Whether field is valid
     * @param {string} errorMessage - Error message to display
     */
    showFieldValidation(fieldElement, isValid, errorMessage) {
        // Remove existing validation classes and feedback
        fieldElement.classList.remove('is-valid', 'is-invalid');
        
        const existingFeedback = fieldElement.parentNode.querySelector('.invalid-feedback, .valid-feedback');
        if (existingFeedback) {
            existingFeedback.remove();
        }
        
        if (isValid) {
            fieldElement.classList.add('is-valid');
        } else {
            fieldElement.classList.add('is-invalid');
            
            const feedback = HTMLUtils.createElement('div', {
                className: 'invalid-feedback'
            }, errorMessage);
            
            fieldElement.parentNode.appendChild(feedback);
        }
    }
    
    /**
     * Get form data as object
     * @returns {Object} Form data object
     */
    getFormData() {
        if (!this.formElement) return null;
        
        const formData = new FormData(this.formElement);
        
        return {
            title: formData.get('title')?.trim() || '',
            author: formData.get('author')?.trim() || '',
            pages: formData.get('pages') || '',
            genre: formData.get('genre')?.trim() || '',
            read: formData.get('read') === 'true',
            rating: formData.get('rating') ? parseInt(formData.get('rating')) : null
        };
    }
    
    /**
     * Validate entire form
     * @returns {Object} Validation result
     */
    validateForm() {
        const formData = this.getFormData();
        if (!formData) {
            return { isValid: false, errors: ['Form not found'] };
        }
        
        return ValidationUtils.validateBookForm(formData);
    }
    
    /**
     * Show form validation errors
     * @param {string[]} errors - Array of error messages
     */
    showFormErrors(errors) {
        // Remove existing alert
        const existingAlert = this.modalElement.querySelector('.alert');
        if (existingAlert) {
            existingAlert.remove();
        }
        
        if (errors.length === 0) return;
        
        const alertHtml = `
            <div class="alert alert-danger alert-dismissible fade show" role="alert">
                <strong>Please correct the following errors:</strong>
                <ul class="mb-0 mt-2">
                    ${errors.map(error => `<li>${HTMLUtils.escapeHtml(error)}</li>`).join('')}
                </ul>
                <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
            </div>
        `;
        
        const modalBody = this.modalElement.querySelector('.modal-body');
        modalBody.insertAdjacentHTML('afterbegin', alertHtml);
    }
    
    /**
     * Reset form to initial state
     */
    resetForm() {
        if (this.formElement) {
            this.formElement.reset();
            
            // Remove validation classes
            const inputs = this.formElement.querySelectorAll('.form-control, .form-select');
            inputs.forEach(input => {
                input.classList.remove('is-valid', 'is-invalid');
            });
            
            // Remove feedback messages
            const feedbacks = this.formElement.querySelectorAll('.invalid-feedback, .valid-feedback');
            feedbacks.forEach(feedback => feedback.remove());
            
            // Remove alerts
            const alerts = this.modalElement.querySelectorAll('.alert');
            alerts.forEach(alert => alert.remove());
        }
    }
    
    /**
     * Show the modal
     */
    showModal() {
        if (this.modalElement) {
            const modal = bootstrap.Modal.getOrCreateInstance(this.modalElement);
            modal.show();
        }
    }
    
    /**
     * Hide the modal
     */
    hideModal() {
        if (this.modalElement) {
            const modal = bootstrap.Modal.getInstance(this.modalElement);
            if (modal) {
                modal.hide();
            }
        }
    }
    
    /**
     * Set form data for editing a book
     * @param {Book} book - Book to edit
     */
    setFormData(book) {
        if (!book || !this.formElement) return;
        
        if (this.titleInput) this.titleInput.value = book.title;
        if (this.authorInput) this.authorInput.value = book.author;
        if (this.pagesInput) this.pagesInput.value = book.pages;
        if (this.genreInput) this.genreInput.value = book.genre || '';
        if (this.readSelect) this.readSelect.value = book.read.toString();
        if (this.ratingSelect) this.ratingSelect.value = book.rating || '';
    }
    
    /**
     * Focus on the first input when modal is shown
     */
    focusFirstInput() {
        if (this.titleInput) {
            setTimeout(() => {
                this.titleInput.focus();
            }, 150); // Wait for modal animation
        }
    }
    
    /**
     * Add loading state to submit button
     * @param {boolean} loading - Whether to show loading state
     */
    setSubmitLoading(loading) {
        const submitBtn = this.modalElement.querySelector('button[type="submit"]');
        if (!submitBtn) return;
        
        if (loading) {
            submitBtn.disabled = true;
            submitBtn.innerHTML = `
                <span class="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                Adding Book...
            `;
        } else {
            submitBtn.disabled = false;
            submitBtn.innerHTML = `
                <i class="bi bi-plus-circle me-1"></i>
                Add Book
            `;
        }
    }
}
