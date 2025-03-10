import { useState, useEffect } from 'react';
import { getDb } from '../database/db';

/**
 * Custom hook to fetch and manage courses list data
 * @returns {Object} Courses data, loading state, and filtering/sorting functions
 */
export const useCoursesList = () => {
  const [loading, setLoading] = useState(true);
  const [courses, setCourses] = useState([]);
  const [filteredCourses, setFilteredCourses] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState('name');
  const [sortOrder, setSortOrder] = useState('asc');

  useEffect(() => {
    fetchCourses();
  }, []);

  useEffect(() => {
    // Apply filtering and sorting
    let filtered = [...courses];
    
    // Filter by search query
    if (searchQuery) {
      filtered = filtered.filter(course => 
        course.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (course.code && course.code.toLowerCase().includes(searchQuery.toLowerCase())) ||
        (course.instructor && course.instructor.toLowerCase().includes(searchQuery.toLowerCase()))
      );
    }
    
    // Apply sorting
    filtered.sort((a, b) => {
      let comparison = 0;
      
      if (sortBy === 'name') {
        comparison = a.name.localeCompare(b.name);
      } else if (sortBy === 'code') {
        comparison = (a.code || '').localeCompare(b.code || '');
      } else if (sortBy === 'startDate') {
        const dateA = a.start_date ? new Date(a.start_date) : new Date(0);
        const dateB = b.start_date ? new Date(b.start_date) : new Date(0);
        comparison = dateA - dateB;
      }
      
      return sortOrder === 'asc' ? comparison : -comparison;
    });
    
    setFilteredCourses(filtered);
  }, [courses, searchQuery, sortBy, sortOrder]);

  // Fetch courses from database
  const fetchCourses = async () => {
    try {
      const db = getDb();
      const coursesData = db.prepare('SELECT * FROM courses').all();
      
      // Get assignment counts for each course
      const coursesWithCounts = coursesData.map(course => {
        const assignmentCount = db.prepare('SELECT COUNT(*) as count FROM assignments WHERE course_id = ?').get(course.id).count;
        return {
          ...course,
          assignmentCount
        };
      });
      
      setCourses(coursesWithCounts);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching courses:', error);
      setLoading(false);
    }
  };

  return {
    loading,
    courses,
    filteredCourses,
    searchQuery,
    setSearchQuery,
    sortBy,
    setSortBy,
    sortOrder,
    setSortOrder,
    refreshCourses: fetchCourses
  };
};

export default useCoursesList;
