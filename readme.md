# Features Overview

This document outlines the main features of the Laravel React Task Management System. The project integrates both task management and Kanban-style task organization with real-time notifications and job scheduling.

## Task Management

- **CRUD Operations**: 
  - Users can create, update, delete, and list tasks.
  - Each task includes:
    - **Title**: Brief description of the task.
    - **Description**: Detailed description of the task.
    - **Assigned To**: The user responsible for the task.
    - **Start and End Dates**: Time frame for completing the task.
    - **Status**: Tracks the task's current state (pending, in progress, completed).
  
## Kanban Board

- **Drag and Drop**: Tasks can be easily dragged and dropped between the following status columns:
  - **Pending**
  - **In Progress**
  - **Completed**
- **Real-time Updates**: When a task status changes via the Kanban board, the task's status is updated in real-time using an API.

## Real-Time Notifications

- **Task Status Change Notifications**:
  - Users are notified in real time whenever the status of a task assigned to them changes.
  - Notifications can be configured to send via email, SMS, or other methods.

## Automated Task Updates

- **Scheduled Task Start**: 
  - Tasks with a start date are automatically updated from "pending" to "in progress" when their start date arrives.
  - This is done using a **queue job** that checks task start dates every minute and updates them accordingly.

## Caching

- **Task Caching**: 
  - To improve performance, task lists are cached for 60 seconds to reduce repeated database queries.
  
## API Endpoints

- **Get Tasks**: 
  - Retrieves a paginated list of tasks.
  
- **Create Task**:
  - Allows the creation of new tasks with all necessary fields.
  
- **Update Task**:
  - Updates the details of an existing task, including changing its status.

- **Delete Task**:
  - Deletes a task by its ID.

## Job Scheduling

- **Task Auto-Start**:
  - A **job** (`StartTasksJob`) automatically moves tasks from "pending" to "in progress" based on their scheduled start date.
  - The job runs every minute to ensure that tasks are started promptly.

## Frontend Enhancements

- **Material-UI Integration**:
  - The frontend is styled using Material-UI for an elegant and responsive design.
  - Task management tables and forms use Material-UI components for consistency.
  
- **Pagination**:
  - Task lists are paginated, with users able to navigate between pages and adjust the number of items shown per page.
  
- **Dynamic Forms**:
  - Users can add and edit tasks using React forms, which dynamically validate inputs and only update fields that have changed.
  