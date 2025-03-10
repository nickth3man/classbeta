import React from 'react';
import {
  Card,
  CardContent,
  Typography,
  Button,
  Box,
  CircularProgress
} from '@mui/material';

/**
 * StatsCard component for displaying dashboard statistics
 * 
 * @param {Object} props
 * @param {string} props.title - Card title
 * @param {string|number} props.value - Main value to display
 * @param {string} props.viewAllLink - Link for "View All" button
 * @param {Function} props.onViewAll - Function to handle "View All" click
 * @param {boolean} props.isPercentage - Whether the value is a percentage (for circular progress)
 */
const StatsCard = ({ title, value, viewAllLink, onViewAll, isPercentage = false }) => {
  return (
    <Card>
      <CardContent>
        <Typography color="textSecondary" gutterBottom>
          {title}
        </Typography>
        
        {isPercentage ? (
          <Box display="flex" alignItems="center">
            <CircularProgress 
              variant="determinate" 
              value={value} 
              size={60}
              thickness={5}
              sx={{ mr: 2 }}
            />
            <Typography variant="h3" component="div">
              {value}%
            </Typography>
          </Box>
        ) : (
          <Typography variant="h3" component="div">
            {value}
          </Typography>
        )}
        
        <Button 
          size="small" 
          sx={{ mt: 1 }}
          onClick={onViewAll}
        >
          View All
        </Button>
      </CardContent>
    </Card>
  );
};

export default StatsCard;
