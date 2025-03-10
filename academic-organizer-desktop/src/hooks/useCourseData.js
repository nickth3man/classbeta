import { useState, useEffect } from 'react';
import { getDb } from '../database/db';

/**
 * Custom hook to fetch and manage course data
 * @param {string} courseId - The ID of the course to fetch
 * @returns {Object} Course data, loading state, and error state
 */
export const useCourseData = (courseId) => {
  const [loading, setLoading] = useState(true);
  const [course, setCourse] = useState(null);
  const [assignments, setAssignments] = useState([]);
  const [files, setFiles] = useState([]);
  const [notes, setNotes] = useState([]);
  const [error, setError] = useState(null);

  // Fetch course data
  const fetchCourseData = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const db = getDb();
      
      // Fetch course
      const courseData = db.prepare('SELECT * FROM courses WHERE id = ?').get(courseId);
      
      if (!courseData) {
        setError('Course not found');
        setLoading(false);
        return;
      }
      
      setCourse(courseData);
      
      // Fetch assignments
      const assignmentsData = db.prepare('SELECT * FROM assignments WHERE course_id = ? ORDER BY due_date ASC').all(courseId);
      setAssignments(assignmentsData);
      
      // Fetch files
      const filesData = db.prepare('SELECT * FROM files WHERE course_id = ? ORDER BY created_at DESC').all(courseId);
      setFiles(filesData);
      
      // Fetch notes
      const notesData = db.prepare('SELECT * FROM notes WHERE course_id = ? ORDER BY created_at DESC').all(courseId);
      setNotes(notesData);
      
      setLoading(false);
    } catch (error) {
      console.error('Error fetching course data:', error);
      setError('Failed to load course data');
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCourseData();
  }, [courseId]);

  return {
    loading,
    error,
    course,
    assignments,
    files,
    notes,
    refreshData: fetchCourseData
  };
};

export default useCourseData;
