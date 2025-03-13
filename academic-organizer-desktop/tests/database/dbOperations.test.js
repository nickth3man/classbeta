const { ipcRenderer } = require('electron');

describe('Database Operations', () => {
  describe('Course Operations', () => {
    const mockCourse = {
      name: 'Test Course',
      code: 'TEST101',
      semester: 'Fall 2023',
      instructor: 'Dr. Test'
    };

    it('should create a course with validation', async () => {
      mockIpcSuccess({ id: 1, ...mockCourse });
      const response = await ipcRenderer.invoke('create-course', mockCourse);
      expect(response).toHaveProperty('id');
      expect(response.name).toBe(mockCourse.name);
    });

    it('should reject invalid course data', async () => {
      const invalidCourse = { name: '' };
      mockIpcError('Invalid course data');
      await expect(ipcRenderer.invoke('create-course', invalidCourse))
        .rejects.toThrow('Invalid course data');
    });
  });

  describe('Assignment Operations', () => {
    const mockAssignment = {
      courseId: 1,
      title: 'Test Assignment',
      dueDate: '2023-12-31',
      priority: 'high',
      status: 'pending'
    };

    it('should create an assignment with validation', async () => {
      mockIpcSuccess({ id: 1, ...mockAssignment });
      const response = await ipcRenderer.invoke('create-assignment', mockAssignment);
      expect(response).toHaveProperty('id');
      expect(response.title).toBe(mockAssignment.title);
    });

    it('should reject invalid assignment data', async () => {
      const invalidAssignment = { title: '' };
      mockIpcError('Invalid assignment data');
      await expect(ipcRenderer.invoke('create-assignment', invalidAssignment))
        .rejects.toThrow('Invalid assignment data');
    });
  });

  describe('Error Handling', () => {
    it('should handle database connection errors', async () => {
      mockIpcError('Database connection failed');
      await expect(ipcRenderer.invoke('get-courses'))
        .rejects.toThrow('Database connection failed');
    });

    it('should handle transaction rollback', async () => {
      mockIpcError('Transaction failed');
      await expect(ipcRenderer.invoke('create-course', {}))
        .rejects.toThrow('Transaction failed');
    });
  });
});