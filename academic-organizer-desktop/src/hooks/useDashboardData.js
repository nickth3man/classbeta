import { useState, useEffect } from 'react';
import { getDb } from '../database/db';

/**
 * Custom hook to fetch and manage dashboard data
 * @returns {Object} Dashboard data and loading state
 */
export const useDashboardData = () => {
  const [loading, setLoading] = useState(true);
  const [courses, setCourses] = useState([]);
  const [upcomingAssignments, setUpcomingAssignments] = useState([]);
  const [stats, setStats] = useState({
    totalCourses: 0,
    totalAssignments: 0,
    completedAssignments: 0,
  });

  useEffect(() => {
    fetchDashboardData();
  }, []);

  // Fetch dashboard data from database
  const fetchDashboardData = async () => {
    try {
      const db = getDb();
      
      // Get courses
      const coursesData = db.prepare('SELECT * FROM courses ORDER BY start_date DESC LIMIT 5').all();
      setCourses(coursesData);
      
      // Get upcoming assignments
      const today = new Date().toISOString().split('T')[0];
      const assignmentsData = db.prepare(`
        SELECT a.*, c.name as course_name, c.color as course_color
        FROM assignments a
        JOIN courses c ON a.course_id = c.id
        WHERE a.due_date >= ?
        AND a.status != 'completed'
        ORDER BY a.due_date ASC
        LIMIT 10
      `).all(today);
      setUpcomingAssignments(assignmentsData);
      
      // Get stats
      const totalCourses = db.prepare('SELECT COUNT(*) as count FROM courses').get().count;
      const totalAssignments = db.prepare('SELECT COUNT(*) as count FROM assignments').get().count;
      const completedAssignments = db.prepare("SELECT COUNT(*) as count FROM assignments WHERE status = 'completed'").get().count;
      
      setStats({
        totalCourses,
        totalAssignments,
        completedAssignments,
      });
      
      setLoading(false);
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
      setLoading(false);
    }
  };

  // Calculate completion percentage
  const getCompletionPercentage = () => {
    if (stats.totalAssignments === 0) return 0;
    return Math.round((stats.completedAssignments / stats.totalAssignments) * 100);
  };

  return {
    loading,
    courses,
    upcomingAssignments,
    stats,
    getCompletionPercentage,
    refreshData: fetchDashboardData
  };
};

export default useDashboardData;
