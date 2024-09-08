import React, { useEffect, useState } from 'react';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import Task from '../../../../models/Task';

const KanbanBoard = (props) => {
  const [tasks, setTasks] = useState({
    pending: [],
    in_progress: [],
    completed: [],
  });

  useEffect(() => {
    if (props.taskList) {
      const pendingTasks = props.taskList.filter(task => task.status === 'pending');
      const inProgressTasks = props.taskList.filter(task => task.status === 'in_progress');
      const completedTasks = props.taskList.filter(task => task.status === 'completed');

      setTasks({
        pending: pendingTasks,
        in_progress: inProgressTasks,
        completed: completedTasks,
      });
    }
  }, [props.taskList]);
  const updateTaskStatus = async (taskId, newStatus) => {
    try {
       await Task.update(taskId, { status: newStatus });


    } catch (error) {
        console.error('An error occurred while updating the task status.');
    }
  };

  const onDragEnd = (result) => {
    const { source, destination } = result;

    if (!destination) return;

    const sourceList = Array.from(tasks[source.droppableId]);
    const [removed] = sourceList.splice(source.index, 1);
    const destList = Array.from(tasks[destination.droppableId]);

    destList.splice(destination.index, 0, removed);

    setTasks({
      ...tasks,
      [source.droppableId]: sourceList,
      [destination.droppableId]: destList,
    });
      // Durumu API ile güncelle
      if (source.droppableId !== destination.droppableId) {
        const newStatus = destination.droppableId; // Hedef sütunun ID'si durumu temsil eder
        updateTaskStatus(removed.id, newStatus); // Görev durumunu API'de güncelle
      }
  };

  return (
    <DragDropContext onDragEnd={onDragEnd}>
      <div style={{ display: 'flex', justifyContent: 'space-between' }}>
        {Object.keys(tasks).map((status) => (
          <Droppable key={status} droppableId={status}>
            {(provided) => (
              <div
                {...provided.droppableProps}
                ref={provided.innerRef}
                style={{ margin: '0 10px', padding: '10px', border: '1px solid gray', width: '30%' }}
              >
                <h3>{status.replace('_', ' ').toUpperCase()}</h3>
                {tasks[status].length > 0 ? (
                  tasks[status].map((task, index) => (
                    <Draggable key={task.id} draggableId={task.id.toString()} index={index}>
                      {(provided) => (
                        <div
                          ref={provided.innerRef}
                          {...provided.draggableProps}
                          {...provided.dragHandleProps}
                          style={{
                            padding: '10px',
                            marginBottom: '10px',
                            border: '1px solid gray',
                            ...provided.draggableProps.style,
                          }}
                        >
                          <p>{task.content || task.description}</p>
                        </div>
                      )}
                    </Draggable>
                  ))
                ) : (
                  <p>No tasks in this category</p>
                )}
                {provided.placeholder}
              </div>
            )}
          </Droppable>
        ))}
      </div>
    </DragDropContext>
  );
};

export default KanbanBoard;
