import React from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Grid,
  CircularProgress
} from '@mui/material';

// Hooks
import { useDashboardData } from '../hooks';

// Components
import { LoadingErrorState } from '../components/common';
import {
  DashboardHeader,
  StatsCard,
  UpcomingAssignments,
  RecentCourses
} from '../components/dashboard';

/**
 * Dashboard page component
 * Displays overview of courses, assignments, and statistics
 */
function Dashboard() {
  const navigate = useNavigate();
  const { 
    loading, 
    courses, 
    upcomingAssignments, 
    stats, 
    getCompletionPercentage 
  } = useDashboardData();

  if (loading) {
    return <LoadingErrorState loading={loading} />;
  }

  return (
    <Box>
      {/* Header with action buttons */}
      <DashboardHeader />

      {/* Stats Cards */}
      <Grid container spacing={3} mb={4}>
        <Grid item xs={12} sm={4}>
          <StatsCard 
            title="Total Courses" 
            value={stats.totalCourses} 
            onViewAll={() => navigate('/courses')} 
          />
        </Grid>
        <Grid item xs={12} sm={4}>
          <StatsCard 
            title="Total Assignments" 
            value={stats.totalAssignments} 
            onViewAll={() => navigate('/assignments')} 
          />
        </Grid>
        <Grid item xs={12} sm={4}>
          <StatsCard 
            title="Completion Rate" 
            value={getCompletionPercentage()} 
            onViewAll={() => navigate('/assignments')} 
            isPercentage={true}
          />
        </Grid>
      </Grid>

      {/* Main Content */}
      <Grid container spacing={3}>
        {/* Upcoming Assignments */}
        <Grid item xs={12} md={7}>
          <UpcomingAssignments assignments={upcomingAssignments} />
        </Grid>

        {/* Recent Courses */}
        <Grid item xs={12} md={5}>
          <RecentCourses courses={courses} />
        </Grid>
      </Grid>
    </Box>
  );
}

export default Dashboard;
