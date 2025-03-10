import { useState } from 'react';

export const useAssignmentForm = (onSubmit) => {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    due_date: '',
    status: 'Pending'
  });
  const [errors, setErrors] = useState({});

  const validateField = (name, value) => {
    const newErrors = { ...errors };
    switch (name) {
      case 'title':
        newErrors.title = value.trim() ? '' : 'Title is required';
        break;
      case 'due_date':
        if (!value) {
          newErrors.due_date = 'Due date is required';
        } else if (new Date(value) < new Date()) {
          newErrors.due_date = 'Due date cannot be in the past';
        } else {
          newErrors.due_date = '';
        }
        break;
      default:
        break;
    }
    setErrors(newErrors);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    validateField(name, value);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Validate all fields before submission
    Object.entries(formData).forEach(([field, value]) => {
      validateField(field, value);
    });
    
    if (Object.values(errors).every(error => !error)) {
      onSubmit(formData);
      // Optionally reset form data after submission
      setFormData({ title: '', description: '', due_date: '', status: 'Pending' });
    }
  };

  return { formData, errors, handleChange, handleSubmit };
};
