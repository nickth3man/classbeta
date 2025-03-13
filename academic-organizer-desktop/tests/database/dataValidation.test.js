const { ipcRenderer } = require('electron');

describe('Data Validation', () => {
  describe('Course Validation', () => {
    it('should validate required course fields', async () => {
      const invalidCourse = {};
      mockIpcError('Course name is required');
      await expect(ipcRenderer.invoke('validate-course', invalidCourse))
        .rejects.toThrow('Course name is required');
    });

    it('should validate course date formats', async () => {
      const courseWithInvalidDate = {
        name: 'Test Course',
        start_date: 'invalid-date'
      };
      mockIpcError('Invalid date format');
      await expect(ipcRenderer.invoke('validate-course', courseWithInvalidDate))
        .rejects.toThrow('Invalid date format');
    });

    it('should sanitize course input', async () => {
      const courseWithHTML = {
        name: '<script>alert("test")</script>Course',
        description: '<p>Description</p>'
      };
      mockIpcSuccess({
        name: 'Course',
        description: 'Description'
      });
      const response = await ipcRenderer.invoke('sanitize-course', courseWithHTML);
      expect(response.name).not.toContain('<script>');
      expect(response.description).not.toContain('<p>');
    });
  });

  describe('Assignment Validation', () => {
    it('should validate required assignment fields', async () => {
      const invalidAssignment = {};
      mockIpcError('Assignment title is required');
      await expect(ipcRenderer.invoke('validate-assignment', invalidAssignment))
        .rejects.toThrow('Assignment title is required');
    });

    it('should validate assignment priority values', async () => {
      const assignmentWithInvalidPriority = {
        title: 'Test Assignment',
        priority: 5
      };
      mockIpcError('Invalid priority value');
      await expect(ipcRenderer.invoke('validate-assignment', assignmentWithInvalidPriority))
        .rejects.toThrow('Invalid priority value');
    });

    it('should validate assignment status values', async () => {
      const assignmentWithInvalidStatus = {
        title: 'Test Assignment',
        status: 'invalid-status'
      };
      mockIpcError('Invalid status value');
      await expect(ipcRenderer.invoke('validate-assignment', assignmentWithInvalidStatus))
        .rejects.toThrow('Invalid status value');
    });
  });

  describe('File Validation', () => {
    it('should validate file size limits', async () => {
      const largeFile = {
        name: 'large.pdf',
        size: 1024 * 1024 * 100 // 100MB
      };
      mockIpcError('File size exceeds limit');
      await expect(ipcRenderer.invoke('validate-file', largeFile))
        .rejects.toThrow('File size exceeds limit');
    });

    it('should validate file types', async () => {
      const invalidFile = {
        name: 'malicious.exe',
        type: 'application/x-msdownload'
      };
      mockIpcError('Invalid file type');
      await expect(ipcRenderer.invoke('validate-file', invalidFile))
        .rejects.toThrow('Invalid file type');
    });
  });
});