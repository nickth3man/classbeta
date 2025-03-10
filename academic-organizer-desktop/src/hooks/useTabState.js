import { useState } from 'react';

/**
 * Custom hook to manage tab state
 * @returns {Object} Tab state and handler
 */
export const useTabState = () => {
  const [tabValue, setTabValue] = useState(0);

  // Handle tab change
  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

  return {
    tabValue,
    handleTabChange
  };
};

export default useTabState;
