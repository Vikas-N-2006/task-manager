import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CloseIcon, PlusIcon, EditIcon, CalendarIcon, TypeIcon, AlignLeftIcon } from './Icon';

const TaskForm = ({ task, onSubmit, onCancel, isEditing }) => {
  const [formData, setFormData] = useState({
    title: '',
    description: ''
  });
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [charCount, setCharCount] = useState({
    title: 0,
    description: 0
  });

  useEffect(() => {
    if (task) {
      const initialData = {
        title: task.title || '',
        description: task.description || ''
      };
      setFormData(initialData);
      setCharCount({
        title: initialData.title.length,
        description: initialData.description.length
      });
    }
  }, [task]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Update character count
    setCharCount(prev => ({
      ...prev,
      [name]: value.length
    }));
    
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.title.trim()) {
      newErrors.title = 'Title is required';
    } else if (formData.title.length > 100) {
      newErrors.title = 'Title must be less than 100 characters';
    }
    
    if (!formData.description.trim()) {
      newErrors.description = 'Description is required';
    } else if (formData.description.length > 500) {
      newErrors.description = 'Description must be less than 500 characters';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    setIsSubmitting(true);
    try {
      await onSubmit(formData);
    } catch (error) {
      console.error('Form submission error:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const getTitlePlaceholder = () => {
    return isEditing ? "Update task title..." : "What needs to be done?";
  };

  const getDescriptionPlaceholder = () => {
    return isEditing ? "Update task description..." : "Describe the task in detail...";
  };

  return (
    <AnimatePresence>
      <motion.div 
        className="modal-overlay"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onCancel}
      >
        <motion.div 
          className="task-form-modal"
          initial={{ opacity: 0, scale: 0.8, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.8, y: 20 }}
          transition={{ type: "spring", damping: 25, stiffness: 300 }}
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="task-form-header">
            <div className="header-content">
              <div className="header-icon">
                {isEditing ? (
                  <EditIcon size={24} />
                ) : (
                  <PlusIcon size={24} />
                )}
              </div>
              <div className="header-text">
                <h2 className="form-title">
                  {isEditing ? 'Edit Task' : 'Create New Task'}
                </h2>
                <p className="form-subtitle">
                  {isEditing ? 'Update your task details' : 'Add a new task to your dashboard'}
                </p>
              </div>
            </div>
            <motion.button
              className="close-button"
              onClick={onCancel}
              whileHover={{ scale: 1.1, rotate: 90 }}
              whileTap={{ scale: 0.9 }}
            >
              <CloseIcon size={20} />
            </motion.button>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="task-form-content">
            {/* Title Field */}
            <div className="form-field">
              <label htmlFor="title" className="field-label">
                <TypeIcon size={16} />
                Task Title
                <span className="required-star">*</span>
              </label>
              <div className="input-wrapper">
                <input
                  type="text"
                  id="title"
                  name="title"
                  className={`form-input ${errors.title ? 'error' : ''}`}
                  placeholder={getTitlePlaceholder()}
                  value={formData.title}
                  onChange={handleChange}
                  disabled={isSubmitting}
                  maxLength={100}
                  autoFocus
                />
                <div className="input-meta">
                  <span className={`char-count ${charCount.title > 90 ? 'warning' : ''}`}>
                    {charCount.title}/100
                  </span>
                </div>
              </div>
              {errors.title && (
                <motion.div 
                  className="error-message"
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                >
                  {errors.title}
                </motion.div>
              )}
            </div>

            {/* Description Field */}
            <div className="form-field">
              <label htmlFor="description" className="field-label">
                <AlignLeftIcon size={16} />
                Description
                <span className="required-star">*</span>
              </label>
              <div className="input-wrapper">
                <textarea
                  id="description"
                  name="description"
                  className={`form-textarea ${errors.description ? 'error' : ''}`}
                  placeholder={getDescriptionPlaceholder()}
                  value={formData.description}
                  onChange={handleChange}
                  disabled={isSubmitting}
                  maxLength={500}
                  rows={4}
                />
                <div className="input-meta">
                  <span className={`char-count ${charCount.description > 450 ? 'warning' : ''}`}>
                    {charCount.description}/500
                  </span>
                </div>
              </div>
              {errors.description && (
                <motion.div 
                  className="error-message"
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                >
                  {errors.description}
                </motion.div>
              )}
            </div>

            {/* Preview Section */}
            {(formData.title || formData.description) && (
              <motion.div 
                className="preview-section"
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
              >
                <h4 className="preview-title">Preview</h4>
                <div className="preview-content">
                  {formData.title && (
                    <div className="preview-item">
                      <strong>Title:</strong> {formData.title}
                    </div>
                  )}
                  {formData.description && (
                    <div className="preview-item">
                      <strong>Description:</strong> {formData.description}
                    </div>
                  )}
                </div>
              </motion.div>
            )}

            {/* Form Actions */}
            <div className="form-actions">
              <motion.button
                type="button"
                className="btn-cancel"
                onClick={onCancel}
                disabled={isSubmitting}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                Cancel
              </motion.button>
              <motion.button
                type="submit"
                className="btn-submit"
                disabled={isSubmitting || !formData.title.trim() || !formData.description.trim()}
                whileHover={{ scale: isSubmitting ? 1 : 1.02 }}
                whileTap={{ scale: isSubmitting ? 1 : 0.98 }}
              >
                {isSubmitting ? (
                  <>
                    <div className="loading-spinner-small"></div>
                    {isEditing ? 'Updating...' : 'Creating...'}
                  </>
                ) : (
                  <>
                    {isEditing ? (
                      <>
                        <EditIcon size={16} />
                        Update Task
                      </>
                    ) : (
                      <>
                        <PlusIcon size={16} />
                        Create Task
                      </>
                    )}
                  </>
                )}
              </motion.button>
            </div>
          </form>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default TaskForm;