
import React, { useState } from 'react';
import TaskCard, { Task } from './TaskCard';

export interface Column {
  id: string;
  title: string;
  color: string;
  tasks: Task[];
}

interface TaskColumnProps {
  column: Column;
  onDrop: (e: React.DragEvent, columnId: string) => void;
  onDragOver: (e: React.DragEvent) => void;
  onDragLeave: (e: React.DragEvent) => void;
  onTaskDragStart: (e: React.DragEvent, task: Task) => void;
  onTaskDragEnd: () => void;
  onStatusChange: (taskId: string, newStatus: string) => void;
}

const TaskColumn: React.FC<TaskColumnProps> = ({
  column,
  onDrop,
  onDragOver,
  onDragLeave,
  onTaskDragStart,
  onTaskDragEnd,
  onStatusChange
}) => {
  const [isOver, setIsOver] = useState(false);
  
  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsOver(true);
    onDragOver(e);
  };
  
  const handleDragLeave = (e: React.DragEvent) => {
    setIsOver(false);
    onDragLeave(e);
  };
  
  const handleDrop = (e: React.DragEvent) => {
    setIsOver(false);
    onDrop(e, column.id);
  };

  return (
    <div 
      className={`flex flex-col w-64 md:w-72 min-w-64 md:min-w-72 rounded-lg border border-border backdrop-blur-sm transition-all duration-300 ${
        isOver ? 'column-highlight border-muted/50' : 'bg-card/50'
      }`}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
    >
      <div className="p-2 md:p-3 border-b border-border flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="h-2 w-2 md:h-3 md:w-3 rounded-full bg-muted"></span>
          <h4 className="font-medium text-xs md:text-sm text-foreground">{column.title}</h4>
          <span className="text-xs bg-muted/50 px-1.5 md:px-2 py-0.5 rounded-full text-muted-foreground">
            {column.tasks.length}
          </span>
        </div>
        <div className="text-muted-foreground">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M12 12V12.01M8 12V12.01M16 12V12.01" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </div>
      </div>
      
      <div className="p-1.5 md:p-2 flex-1 space-y-1.5 md:space-y-2 overflow-auto">
        {column.tasks.map((task) => (
          <TaskCard
            key={task.id}
            task={task}
            onDragStart={onTaskDragStart}
            onDragEnd={onTaskDragEnd}
            onStatusChange={onStatusChange}
          />
        ))}
      </div>
    </div>
  );
};

export default TaskColumn;
