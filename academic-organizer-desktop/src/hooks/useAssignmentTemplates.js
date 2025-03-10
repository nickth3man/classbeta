import { useState, useEffect, useCallback } from 'react';
import { ipcRenderer } from 'electron';

/**
 * Custom hook to manage assignment templates
 * @returns {Object} - Template management methods and state
 */
const useAssignmentTemplates = () => {
  const [templates, setTemplates] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [selectedTemplate, setSelectedTemplate] = useState(null);

  // Load templates on mount
  useEffect(() => {
    loadTemplates();
  }, []);

  /**
   * Load templates from the database
   */
  const loadTemplates = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      // In a real implementation, this would be an IPC call to the main process
      const result = await ipcRenderer.invoke('get-assignment-templates');
      setTemplates(result || []);
    } catch (err) {
      console.error('Error loading templates:', err);
      setError('Failed to load assignment templates');
    } finally {
      setLoading(false);
    }
  }, []);

  /**
   * Save a new template or update an existing one
   * @param {Object} template - Template data to save
   */
  const saveTemplate = useCallback(async (template) => {
    setLoading(true);
    setError(null);

    try {
      // In a real implementation, this would be an IPC call to the main process
      const result = await ipcRenderer.invoke('save-assignment-template', template);
      
      if (template.id) {
        // Update existing template
        setTemplates(prevTemplates => 
          prevTemplates.map(t => t.id === template.id ? result : t)
        );
      } else {
        // Add new template
        setTemplates(prevTemplates => [...prevTemplates, result]);
      }
      
      return result;
    } catch (err) {
      console.error('Error saving template:', err);
      setError('Failed to save assignment template');
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  /**
   * Delete a template
   * @param {number} templateId - ID of the template to delete
   */
  const deleteTemplate = useCallback(async (templateId) => {
    setLoading(true);
    setError(null);

    try {
      // In a real implementation, this would be an IPC call to the main process
      await ipcRenderer.invoke('delete-assignment-template', templateId);
      setTemplates(prevTemplates => prevTemplates.filter(t => t.id !== templateId));
      return true;
    } catch (err) {
      console.error('Error deleting template:', err);
      setError('Failed to delete assignment template');
      return false;
    } finally {
      setLoading(false);
    }
  }, []);

  /**
   * Create a new assignment from a template
   * @param {number} templateId - ID of the template to use
   * @param {Object} overrides - Values to override in the template (e.g., due_date)
   */
  const createFromTemplate = useCallback(async (templateId, overrides = {}) => {
    setLoading(true);
    setError(null);

    try {
      const template = templates.find(t => t.id === templateId);
      if (!template) {
        throw new Error('Template not found');
      }

      // Create assignment data from template with overrides
      const assignmentData = {
        ...template.defaults,
        ...overrides,
        created_from_template: templateId
      };

      // In a real implementation, this would be an IPC call to the main process
      const result = await ipcRenderer.invoke('create-assignment', assignmentData);
      return result;
    } catch (err) {
      console.error('Error creating from template:', err);
      setError('Failed to create assignment from template');
      return null;
    } finally {
      setLoading(false);
    }
  }, [templates]);

  return {
    templates,
    loading,
    error,
    selectedTemplate,
    setSelectedTemplate,
    loadTemplates,
    saveTemplate,
    deleteTemplate,
    createFromTemplate
  };
};

export default useAssignmentTemplates;
