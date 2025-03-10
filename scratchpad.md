# Scratchpad for Academic Organizer Desktop

## Current Task

Implementing two new features for the Academic Organizer Desktop application:

1. Drag-and-drop assignment prioritization using @dnd-kit/sortable
2. Assignment templates system to save recurring assignment types

## Plan

- [X] Research existing codebase structure
- [ ] Design database schema updates for priority ordering
- [ ] Design database schema for assignment templates
- [ ] Implement IPC handlers for database operations
- [ ] Implement drag-and-drop UI components
- [ ] Implement assignment template UI
- [ ] Update backend to support new features
- [ ] Test the implementation

## Progress

- Examined existing components and hooks for assignments and templates
- Found that the drag-and-drop UI is already partially implemented in `AssignmentList.jsx`
- Found that template UI components are already created in `AssignmentTemplateDialog.jsx` and `AssignmentTemplateList.jsx`
- Discovered that custom hooks for state management are implemented in `useAssignmentPriority.js` and `useAssignmentTemplates.js`
- Identified that we need to update the database schema to store priority order and template information
- Identified that we need to implement IPC handlers for database operations

## Database Schema Updates Needed

1. **Assignments Table**:
   - Update the `priority` field to be an INTEGER instead of TEXT to store numeric priority order
   - Add a `created_from_template` field to track which template an assignment was created from

2. **New Templates Table**:
   - Create a new `assignment_templates` table to store template information
   - Fields: id, name, description, defaults (JSON)

## IPC Handlers Needed

1. **Priority Management**:
   - `update-assignment-priorities` - Update priority order for multiple assignments

2. **Template Management**:
   - `get-assignment-templates` - Get all templates
   - `save-assignment-template` - Create or update a template
   - `delete-assignment-template` - Delete a template
   - `create-assignment-from-template` - Create a new assignment from a template

## Lessons

- Using Portable Devin for research and code generation
- Need to update database schema to store priority order and template information
- Following established patterns: custom hooks for state management and Material-UI components
- The UI components for both features are already partially implemented
- Need to implement the backend functionality to make the features work
