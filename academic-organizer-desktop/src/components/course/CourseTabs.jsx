import React from 'react';
import { Paper, Tabs, Tab } from '@mui/material';
import {
  Assignment as AssignmentIcon,
  AttachFile as AttachFileIcon,
  Note as NoteIcon
} from '@mui/icons-material';

import { TabPanel } from '../course';
import AssignmentList from './AssignmentList';
import FileList from './FileList';
import NoteList from './NoteList';

/**
 * CourseTabs component displays tabbed content for assignments, files, and notes
 */
function CourseTabs({
  tabValue,
  onTabChange,
  assignments,
  files,
  notes,
  onAddAssignment,
  onEditAssignment,
  onAddFile,
  onDownloadFile,
  onAddNote,
  onEditNote,
  onDeleteItem,
  formatDate,
  formatFileSize,
  getStatusColor,
  getPriorityColor
}) {
  return (
    <Paper sx={{ mb: 3 }}>
      <Tabs
        value={tabValue}
        onChange={onTabChange}
        indicatorColor="primary"
        textColor="primary"
        variant="fullWidth"
      >
        <Tab label="Assignments" icon={<AssignmentIcon />} iconPosition="start" />
        <Tab label="Files" icon={<AttachFileIcon />} iconPosition="start" />
        <Tab label="Notes" icon={<NoteIcon />} iconPosition="start" />
      </Tabs>

      {/* Assignments Tab */}
      <TabPanel value={tabValue} index={0}>
        <AssignmentList
          assignments={assignments}
          onAddClick={onAddAssignment}
          onEditClick={onEditAssignment}
          onDeleteClick={(id) => onDeleteItem('assignment', id)}
          formatDate={formatDate}
          getStatusColor={getStatusColor}
          getPriorityColor={getPriorityColor}
        />
      </TabPanel>

      {/* Files Tab */}
      <TabPanel value={tabValue} index={1}>
        <FileList
          files={files}
          onAddClick={onAddFile}
          onDownloadClick={onDownloadFile}
          onDeleteClick={(id) => onDeleteItem('file', id)}
          formatDate={formatDate}
          formatFileSize={formatFileSize}
        />
      </TabPanel>

      {/* Notes Tab */}
      <TabPanel value={tabValue} index={2}>
        <NoteList
          notes={notes}
          onAddClick={onAddNote}
          onEditClick={onEditNote}
          onDeleteClick={(id) => onDeleteItem('note', id)}
          formatDate={formatDate}
        />
      </TabPanel>
    </Paper>
  );
}

export default CourseTabs;
