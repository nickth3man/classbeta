import React from 'react';

const AssignmentList = ({ assignments }) => {
  if (!assignments || assignments.length === 0) {
    return <div>No assignments available.</div>;
  }

  return (
    <ul>
      {assignments.map(assignment => (
        <li key={assignment.id}>{assignment.title}</li>
      ))}
    </ul>
  );
};

export default AssignmentList;
