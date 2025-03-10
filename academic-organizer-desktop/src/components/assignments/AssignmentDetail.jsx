import React from 'react';

const AssignmentDetail = ({ assignment }) => {
  if (!assignment) {
    return <div>Select an assignment to view details.</div>;
  }

  return (
    <div>
      <h2>{assignment.title}</h2>
      <p>{assignment.description}</p>
      <p>Due Date: {assignment.due_date}</p>
      <p>Status: {assignment.status}</p>
    </div>
  );
};

export default AssignmentDetail;
