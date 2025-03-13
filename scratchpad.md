# Scratchpad for Academic Organizer Desktop

## Current Task

Implementing two new features for the Academic Organizer Desktop application:

1. Drag-and-drop assignment prioritization using @dnd-kit/sortable
2. Assignment templates system to save recurring assignment types

## Plan

- [X] Research existing codebase structure
- [X] Design database schema updates for priority ordering
- [X] Design database schema for assignment templates
- [X] Implement IPC handlers for database operations
- [X] Implement drag-and-drop UI components
- [X] Implement assignment template UI
- [X] Update backend to support new features
- [ ] Test the implementation

## Progress

- Examined existing components and hooks for assignments and templates
- Found that the drag-and-drop UI is already partially implemented in `AssignmentList.jsx`
- Found that template UI components are already created in `AssignmentTemplateDialog.jsx` and `AssignmentTemplateList.jsx`
- Discovered that custom hooks for state management are implemented in `useAssignmentPriority.js` and `useAssignmentTemplates.js`
- Identified that we need to update the database schema to store priority order and template information
- Identified that we need to implement IPC handlers for database operations

### Updates Completed (March 10, 2025)

1. Created `AssignmentList.js` component with drag-and-drop functionality using @dnd-kit/sortable
2. Created `AssignmentTemplateList.js` for displaying and managing assignment templates
3. Created `AssignmentTemplateDialog.js` for creating and editing templates
4. Created `AssignmentsContainer.js` to connect everything together
5. Updated `index.js` to export the new components
6. Integrated with existing hooks and IPC handlers
7. Database schema was already updated with the necessary fields
8. Main.js IPC handlers were already implemented for all required operations

## Remaining Steps to Completion

### Testing and Integration

1. **Test the drag-and-drop functionality**:
   - Verify that assignments can be dragged and reordered
   - Confirm that priority numbers update correctly
   - Ensure priority changes persist in the database
   - Test edge cases like dragging when there's only one item

2. **Test the template system**:
   - Create, edit, and delete templates
   - Verify template data is saved correctly
   - Test creating assignments from templates
   - Validate form validation and error handling

3. **Integration testing**:
   - Test navigation between assignments and templates tabs
   - Verify that creating an assignment from a template redirects to the assignments tab
   - Test the reset priorities functionality
   - Ensure all components work together seamlessly

### UI/UX Improvements

1. **Add loading indicators** for database operations:
   - Add progress indicators for template operations
   - Show loading state during priority updates
   - Implement skeleton loaders for initial data fetching

2. **Implement error handling** with user-friendly error messages:
   - Add toast notifications for errors
   - Implement retry mechanisms for failed operations
   - Provide clear guidance on how to resolve issues

3. **Add confirmation dialogs** for destructive actions:
   - Confirm template deletion
   - Confirm priority reset
   - Prevent accidental data loss

### Documentation

1. **Create user documentation** explaining how to use the new features:
   - Write step-by-step guides for prioritizing assignments
   - Create tutorials for template management
   - Add tooltips and helper text in the UI

2. **Update developer documentation** with component structure and data flow:
   - Document the component hierarchy
   - Explain data flow between components and hooks
   - Add JSDoc comments to functions and components

### Performance Optimization

1. **Optimize rendering** of large assignment lists:
   - Implement virtualization for long lists
   - Add pagination for template lists
   - Optimize database queries for faster loading

2. **Add pagination or virtualization** for better performance with many items:
   - Implement infinite scrolling for assignments
   - Add "load more" functionality for templates
   - Optimize memory usage for large datasets

### Deployment

1. **Package the application** for distribution:
   - Configure electron-builder settings
   - Create installers for Windows, macOS, and Linux
   - Set up automatic updates

2. **Create release notes** highlighting the new features:
   - Document the drag-and-drop prioritization feature
   - Explain the template system benefits
   - Include screenshots and usage examples

### Future Enhancements

1. **Implement batch operations** for template application:
   - Add ability to apply templates to multiple courses
   - Create bulk assignment creation from templates
   - Implement batch priority updates

2. **Add template categories** for better organization:
   - Create a category system for templates
   - Add filtering by category
   - Implement color-coding for different categories

3. **Enhance template system** with due date patterns:
   - Add recurring due date options (weekly, monthly)
   - Implement relative due dates (e.g., "2 days before class")
   - Create smart scheduling based on workload

## Testing Strategy

### 1. Unit Testing

#### Drag-and-Drop Functionality Tests

- [ ] **Test `useAssignmentPriority` hook**:
  - Test initialization with different assignment arrays
  - Verify sorting logic (priority first, then due date)
  - Test `handleDragEnd` with various drag scenarios
  - Test `resetPriorities` functionality
  - Mock IPC calls to verify database updates

- [ ] **Test `AssignmentList` component**:
  - Test rendering with different props
  - Verify drag handle visibility and functionality
  - Test accessibility features
  - Verify visual feedback during dragging

#### Assignment Templates Tests

- [ ] **Test `useAssignmentTemplates` hook**:
  - Test template loading functionality
  - Verify template saving logic
  - Test template deletion
  - Test creating assignments from templates
  - Mock IPC calls to verify database operations

- [ ] **Test `AssignmentTemplateList` component**:
  - Test rendering with different props
  - Verify template actions (edit, delete, use)
  - Test empty state rendering
  - Verify loading state display

- [ ] **Test `AssignmentTemplateDialog` component**:
  - Test form validation
  - Verify form population with template data
  - Test saving with different input combinations
  - Verify course selection functionality

### 2. Integration Testing

- [ ] **Test drag-and-drop with database**:
  - Drag assignments and verify database updates
  - Test priority persistence across app restarts
  - Verify priority reset updates the database correctly
  - Test concurrent updates from multiple windows

- [ ] **Test template system with database**:
  - Create templates and verify database storage
  - Edit templates and confirm updates in database
  - Delete templates and verify removal from database
  - Create assignments from templates and check database entries

- [ ] **Test component integration**:
  - Verify tab navigation between assignments and templates
  - Test that creating an assignment from template updates the assignments list
  - Verify that the UI updates correctly after priority changes
  - Test that template changes reflect in the template list

### 3. End-to-End Testing

- [ ] **User flow testing**:
  - Complete end-to-end flow of creating a template
  - Test the flow of using a template to create an assignment
  - Verify the flow of prioritizing assignments via drag-and-drop
  - Test the flow of editing and deleting templates

- [ ] **Cross-platform testing**:
  - Test on Windows, macOS, and Linux
  - Verify consistent behavior across platforms
  - Test with different screen sizes and resolutions
  - Verify touch screen compatibility for drag-and-drop

### 4. Performance Testing

- [ ] **Test with large datasets**:
  - Load 100+ assignments and test drag-and-drop performance
  - Test template list with 50+ templates
  - Measure rendering time and responsiveness
  - Identify performance bottlenecks

- [ ] **Test database operations**:
  - Measure time for priority updates with large datasets
  - Test template operations with complex default values
  - Verify indexing and query optimization
  - Test concurrent database operations

### 5. Error Handling and Edge Cases

- [ ] **Test error scenarios**:
  - Test behavior when database operations fail
  - Verify error messages and recovery options
  - Test with network disconnections
  - Verify graceful degradation when features are unavailable

- [ ] **Test edge cases**:
  - Test with empty assignment lists
  - Test with single assignment (no reordering possible)
  - Test with extremely long template names or descriptions
  - Test with invalid template data

### 6. Usability Testing

- [ ] **Gather user feedback**:
  - Observe users interacting with drag-and-drop
  - Collect feedback on template creation workflow
  - Identify pain points and areas for improvement
  - Measure time to complete common tasks

- [ ] **Accessibility testing**:
  - Test keyboard navigation for drag-and-drop
  - Verify screen reader compatibility
  - Check color contrast and visual indicators
  - Test with assistive technologies

### 7. Automated Testing Setup

- [ ] **Set up Jest for component testing**:
  - Configure Jest with React Testing Library
  - Set up mocks for Electron IPC
  - Create test utilities for common operations
  - Implement snapshot testing for UI components

- [ ] **Set up E2E testing with Spectron**:
  - Configure Spectron for Electron testing
  - Create test scenarios for common user flows
  - Implement visual regression testing
  - Set up CI/CD integration for automated testing

### 8. Test Documentation

- [ ] **Create test cases document**:
  - Document all test scenarios
  - Include expected results
  - Add steps to reproduce
  - Link to related requirements

- [ ] **Set up test reporting**:
  - Configure test result collection
  - Create dashboards for test coverage
  - Implement regression tracking
  - Document known issues and workarounds

## Test Execution Plan

1. **Day 1: Setup and Unit Testing**
   - Set up testing environment
   - Implement unit tests for hooks
   - Test basic component rendering

2. **Day 2: Component and Integration Testing**
   - Test component interactions
   - Verify database operations
   - Test error handling

3. **Day 3: End-to-End and Performance Testing**
   - Run full user flow tests
   - Perform performance benchmarks
   - Test with large datasets

4. **Day 4: Edge Cases and Usability**
   - Test edge cases and error scenarios
   - Conduct usability testing
   - Gather user feedback

5. **Day 5: Bug Fixing and Documentation**
   - Address identified issues
   - Complete test documentation
   - Prepare final test report

## Test Metrics

- **Code Coverage**: Aim for >80% coverage for critical components
- **Bug Detection**: Track number of bugs found during testing
- **User Satisfaction**: Collect user feedback scores for new features
- **Performance**: Measure rendering time and database operation speed

## Component Documentation

### AssignmentList.js

The `AssignmentList` component provides a drag-and-drop interface for prioritizing assignments. It uses the @dnd-kit/sortable library to enable smooth reordering of assignments.

**Key Features:**

- Drag handle for intuitive interaction
- Visual feedback during dragging operations
- Priority number display
- Integration with useAssignmentPriority hook

**Props:**

- `assignments`: Array of assignment objects
- `loading`: Boolean indicating loading state
- `error`: Error message string if applicable
- `onAssignmentClick`: Function to handle clicking an assignment
- `onPriorityChange`: Function to handle priority changes

### AssignmentTemplateList.js

The `AssignmentTemplateList` component displays a list of assignment templates and provides options to create, edit, delete, and use templates.

**Key Features:**

- Template creation and editing
- Template deletion with confirmation
- Using templates to create new assignments
- Detailed template information display

**Props:**

- `onCreateAssignment`: Function to handle creating a new assignment from a template

### AssignmentTemplateDialog.js

The `AssignmentTemplateDialog` component provides a form for creating and editing assignment templates.

**Key Features:**

- Form validation
- Course selection dropdown
- Default assignment values configuration
- Template metadata management

**Props:**

- `open`: Boolean to control dialog visibility
- `template`: Template object for editing (null for creation)
- `onClose`: Function to handle dialog close
- `onSave`: Function to handle template save

### AssignmentsContainer.js

The `AssignmentsContainer` component serves as the main container for the assignments and templates functionality, providing tab navigation and shared state.

**Key Features:**

- Tab navigation between assignments and templates
- Integration with hooks for data management
- Controls for adding assignments and resetting priorities
- Consistent UI across features

**Props:**

- `courseId`: Optional course ID to filter assignments

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
- The main.js file already contained IPC handlers for all the needed operations
- The database schema was already set up with the necessary tables and fields
- @dnd-kit/sortable provides a comprehensive API for drag-and-drop functionality
- Material-UI components work well for creating consistent and responsive interfaces
- Electron's IPC system enables efficient communication between frontend and backend

## Manual Testing Script

### Drag-and-Drop Assignment Prioritization Testing

#### Test Case 1: Basic Drag-and-Drop Functionality

1. **Setup**:
   - Launch the Academic Organizer Desktop application
   - Navigate to the Assignments tab
   - Ensure there are at least 3 assignments listed

2. **Test Steps**:
   - Observe the initial priority order of assignments
   - Click and hold the drag handle of the second assignment
   - Drag it above the first assignment
   - Release the mouse button

3. **Expected Results**:
   - The dragged assignment should move to the first position
   - Priority numbers should update automatically
   - The UI should provide visual feedback during dragging
   - After release, the new order should persist

4. **Verification**:
   - Close and reopen the application
   - Check that the new priority order is maintained

#### Test Case 2: Reset Priorities Functionality

1. **Setup**:
   - Ensure assignments have been manually prioritized via drag-and-drop
   - Note the current priority order

2. **Test Steps**:
   - Click the "Reset priorities" button (icon with rotating arrows)
   - Observe the changes in assignment order

3. **Expected Results**:
   - Assignments should reorder based on due dates
   - Priority numbers should update accordingly
   - A loading indicator should appear briefly during the operation

4. **Verification**:
   - Close and reopen the application
   - Verify that the reset priority order is maintained

#### Test Case 3: Edge Cases for Drag-and-Drop

1. **Test with Single Assignment**:
   - Create a scenario with only one assignment
   - Attempt to drag and drop the assignment
   - Expected: The drag handle should be visible but dragging should have no effect

2. **Test with Empty List**:
   - Create a scenario with no assignments
   - Expected: No drag handles should be visible, and the empty state message should display

3. **Test with Long Assignment List**:
   - Create or load a scenario with 15+ assignments
   - Test dragging an assignment from the bottom to the top
   - Expected: Smooth scrolling should occur during dragging, and the final position should be correct

### Assignment Templates System Testing

#### Test Case 1: Creating a New Template

1. **Setup**:
   - Launch the Academic Organizer Desktop application
   - Navigate to the Templates tab

2. **Test Steps**:
   - Click the "New Template" button
   - Fill in the template form:
     - Template Name: "Weekly Lab Report"
     - Template Description: "Template for recurring lab reports"
     - Select a course from the dropdown (if available)
     - Default Assignment Title: "Lab Report"
     - Default Assignment Description: "Weekly lab report for [course]"
   - Click "Save"

3. **Expected Results**:
   - The dialog should close
   - The new template should appear in the templates list
   - The template details should match what was entered

4. **Verification**:
   - Close and reopen the application
   - Check that the template still exists with correct information

#### Test Case 2: Editing an Existing Template

1. **Setup**:
   - Ensure at least one template exists
   - Note the current template details

2. **Test Steps**:
   - Click the edit icon (pencil) for an existing template
   - Modify some fields:
     - Change the template name to add "Updated"
     - Modify the default title
   - Click "Save"

3. **Expected Results**:
   - The dialog should close
   - The template in the list should update with the new information
   - No duplicate templates should be created

4. **Verification**:
   - Close and reopen the application
   - Verify that the template changes persisted

#### Test Case 3: Using a Template to Create an Assignment

1. **Setup**:
   - Ensure at least one template exists
   - Navigate to the Templates tab

2. **Test Steps**:
   - Click the "Use template" icon (copy icon) for an existing template
   - Observe what happens

3. **Expected Results**:
   - The application should automatically switch to the Assignments tab
   - A new assignment should be created with the template's default values
   - The new assignment should be visible in the assignments list
   - The assignment should have appropriate priority

4. **Verification**:
   - Check the database to verify the assignment was created with the correct template ID reference

#### Test Case 4: Deleting a Template

1. **Setup**:
   - Ensure at least one template exists that can be deleted
   - Note the template details

2. **Test Steps**:
   - Click the delete icon (trash) for the template
   - Confirm the deletion in the confirmation dialog

3. **Expected Results**:
   - A confirmation dialog should appear
   - After confirming, the template should be removed from the list
   - No error messages should appear

4. **Verification**:
   - Close and reopen the application
   - Verify that the template remains deleted
   - Create a new assignment and verify the deleted template is not available

### Integration Testing

#### Test Case 1: End-to-End Template to Assignment Flow

1. **Setup**:
   - Start with a fresh application state (or clear existing data)

2. **Test Steps**:
   - Create a new template with specific default values
   - Use the template to create a new assignment
   - Prioritize the new assignment by dragging it to the top
   - Edit the assignment details
   - Mark the assignment as complete

3. **Expected Results**:
   - Each step should work seamlessly
   - The assignment created from the template should retain the template's default values
   - The prioritization should persist
   - The completion status should update correctly

4. **Verification**:
   - Close and reopen the application
   - Verify all changes have persisted

#### Test Case 2: Multiple Operations Test

1. **Setup**:
   - Ensure multiple templates and assignments exist

2. **Test Steps**:
   - Create a new template
   - Use it to create an assignment
   - Create another template
   - Edit the first template
   - Use the second template to create an assignment
   - Prioritize assignments via drag-and-drop
   - Delete one of the templates

3. **Expected Results**:
   - All operations should complete successfully
   - The UI should remain responsive
   - No unexpected errors should occur
   - Data integrity should be maintained

4. **Verification**:
   - Restart the application
   - Verify all changes have persisted correctly
   - Check that relationships between templates and assignments are maintained

### Performance Testing

#### Test Case 1: Large Dataset Performance

1. **Setup**:
   - Create or import a large number of assignments (50+)
   - Create multiple templates (10+)

2. **Test Steps**:
   - Navigate between assignments and templates tabs
   - Perform drag-and-drop operations on assignments
   - Create new assignments from templates
   - Reset priorities

3. **Expected Results**:
   - The application should remain responsive
   - Operations should complete within a reasonable time
   - No UI freezing or lagging should occur
   - Database operations should complete successfully

4. **Metrics to Collect**:
   - Time to load assignments list
   - Time to complete drag-and-drop operation
   - Time to create assignment from template
   - Memory usage during operations

## Test Results Tracking

| Test Case | Status | Issues Found | Notes |
|-----------|--------|--------------|-------|
| Drag-and-Drop: Basic Functionality | | | |
| Drag-and-Drop: Reset Priorities | | | |
| Drag-and-Drop: Edge Cases | | | |
| Templates: Creating New Template | | | |
| Templates: Editing Template | | | |
| Templates: Using Template | | | |
| Templates: Deleting Template | | | |
| Integration: End-to-End Flow | | | |
| Integration: Multiple Operations | | | |
| Performance: Large Dataset | | | |
