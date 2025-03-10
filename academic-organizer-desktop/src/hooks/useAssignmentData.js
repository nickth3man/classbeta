import { useState, useEffect } from 'react';

export const useAssignmentData = () => {
  const [assignments, setAssignments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Simulate fetching data from SQLite database
    const fetchData = async () => {
      try {
        // Dummy data simulation; replace with actual DB call
        const data = [
          { id: 1, title: 'Assignment 1', description: 'Description 1', due_date: '2025-03-15', status: 'Pending' },
          { id: 2, title: 'Assignment 2', description: 'Description 2', due_date: '2025-03-20', status: 'Completed' }
        ];
        setAssignments(data);
        setLoading(false);
      } catch (err) {
        setError(err);
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  return { assignments, loading, error };
};
