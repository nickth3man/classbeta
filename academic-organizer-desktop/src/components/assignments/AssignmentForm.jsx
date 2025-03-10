import React from 'react';
import { useAssignmentForm } from '../../hooks/useAssignmentForm';
import { TextField, FormControl, InputLabel, Select, MenuItem, Button } from '@mui/material';

const AssignmentForm = ({ onSubmit }) => {
  const { formData, errors, handleChange, handleSubmit } = useAssignmentForm(onSubmit);

  return (
    <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
      <TextField
        label="Title"
        name="title"
        value={formData.title}
        onChange={handleChange}
        error={!!errors.title}
        helperText={errors.title}
        required
      />
      <TextField
        label="Description"
        name="description"
        value={formData.description}
        onChange={handleChange}
        multiline
        rows={4}
      />
      <TextField
        label="Due Date"
        type="date"
        name="due_date"
        value={formData.due_date}
        onChange={handleChange}
        InputLabelProps={{ shrink: true }}
        error={!!errors.due_date}
        helperText={errors.due_date}
        required
      />
      <FormControl fullWidth>
        <InputLabel>Status</InputLabel>
        <Select
          name="status"
          value={formData.status}
          label="Status"
          onChange={handleChange}
        >
          <MenuItem value="Pending">Pending</MenuItem>
          <MenuItem value="Completed">Completed</MenuItem>
        </Select>
      </FormControl>
      <Button type="submit" variant="contained">
        Submit
      </Button>
    </form>
  );
};

export default AssignmentForm;
