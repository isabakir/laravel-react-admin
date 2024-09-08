
# API Documentation

This document provides a detailed description of the API endpoints used in the Laravel React Task Management System. Each endpoint includes its purpose, request parameters, and response formats.



## Task Endpoints

### Get All Tasks

- **URL**: `/api/v1/tasks`
- **Method**: `GET`
- **Description**: Retrieves a paginated list of tasks, along with the user assigned to each task.
- **Parameters** (optional):
  - `page`: The page number for pagination.
 
- **Response**:
  ```json
  {
    "data": [
      {
        "id": 1,
        "title": "Task Title",
        "description": "Task Description",
        "status": "pending",
        "user": {
          "id": 2,
          "name": "John Doe"
        },
        "start_date": "2024-09-08",
        "end_date": "2024-09-10"
      }
    ],
   
      "first": "http://api.example.com/tasks?page=1",
      "last": "http://api.example.com/tasks?page=10",
      "prev": null,
      "next": "http://api.example.com/tasks?page=2",
   
    
      "current_page": 1,
      "last_page": 10,
      "per_page": 10,
      "total": 100
   
  }
  ```

---

### Create a Task

- **URL**: `/api/v1/tasks`
- **Method**: `POST`
- **Description**: Creates a new task and assigns it to a user.
- **Request Body**:
  ```json
  {
    "title": "New Task",
    "description": "Task description here",
    "assignedTo": 2,
    "startDate": "2024-09-08",
    "endDate": "2024-09-10",
    "status": "pending"
  }
  ```
- **Response**:
  ```json
  {
    "data": {
      "id": 1,
      "title": "New Task",
      "description": "Task description here",
      "status": "pending",
      "user": {
        "id": 2,
        "name": "John Doe"
      },
      "start_date": "2024-09-08",
      "end_date": "2024-09-10"
    },
    "message": "Task created successfully"
  }
  ```

---

### Update a Task

- **URL**: `/api/v1/tasks/{id}`
- **Method**: `PUT`
- **Description**: Updates an existing task.
- **Request Body**:
  ```json
  {
    "title": "Updated Task",
    "description": "Updated description",
    "assignedTo": 3,
    "startDate": "2024-09-10",
    "endDate": "2024-09-12",
    "status": "in_progress"
  }
  ```
- **Response**:
  ```json
  {
    "data": {
      "id": 1,
      "title": "Updated Task",
      "description": "Updated description",
      "status": "in_progress",
      "user": {
        "id": 3,
        "name": "Jane Doe"
      },
      "start_date": "2024-09-10",
      "end_date": "2024-09-12"
    },
    "message": "Task updated successfully"
  }
  ```

---

### Delete a Task

- **URL**: `/api/v1/tasks/{id}`
- **Method**: `DELETE`
- **Description**: Deletes an existing task.
- **Response**:
  ```json
  {
    "message": "Task deleted successfully"
  }
  ```

