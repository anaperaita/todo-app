import { useState, useCallback, ChangeEvent, KeyboardEvent } from 'react';
import { Todo, UpdateTodoInput, Priority } from '../../types';

interface TodoItemViewModel {
  isEditing: boolean;
  editText: string;
  editPriority: Priority;
  editCategory: string;
  editDueDate: string;
  handleToggle: () => void;
  handleDelete: () => void;
  handleEdit: () => void;
  handleCancelEdit: () => void;
  handleSaveEdit: () => void;
  handleTextChange: (e: ChangeEvent<HTMLInputElement>) => void;
  handlePriorityChange: (e: ChangeEvent<HTMLSelectElement>) => void;
  handleCategoryChange: (e: ChangeEvent<HTMLInputElement>) => void;
  handleDueDateChange: (e: ChangeEvent<HTMLInputElement>) => void;
  handleKeyDown: (e: KeyboardEvent<HTMLInputElement>) => void;
  handleStatusChange: (e: ChangeEvent<HTMLSelectElement>) => void;
}

interface UseTodoItemViewModelProps {
  todo: Todo;
  onToggle: (id: string) => void;
  onDelete: (id: string) => void;
  onUpdate: (id: string, updates: UpdateTodoInput) => void;
}

/**
 * ViewModel for TodoItem component.
 * Manages edit mode state and user interactions.
 */
export const useTodoItemViewModel = ({
  todo,
  onToggle,
  onDelete,
  onUpdate,
}: UseTodoItemViewModelProps): TodoItemViewModel => {
  const [isEditing, setIsEditing] = useState(false);
  const [editText, setEditText] = useState(todo.text);
  const [editPriority, setEditPriority] = useState(todo.priority);
  const [editCategory, setEditCategory] = useState(todo.category);
  const [editDueDate, setEditDueDate] = useState(todo.dueDate || '');

  const handleToggle = useCallback(() => {
    onToggle(todo.id);
  }, [todo.id, onToggle]);

  const handleDelete = useCallback(() => {
    onDelete(todo.id);
  }, [todo.id, onDelete]);

  const handleEdit = useCallback(() => {
    setIsEditing(true);
    setEditText(todo.text);
    setEditPriority(todo.priority);
    setEditCategory(todo.category);
    setEditDueDate(todo.dueDate || '');
  }, [todo]);

  const handleCancelEdit = useCallback(() => {
    setIsEditing(false);
    setEditText(todo.text);
    setEditPriority(todo.priority);
    setEditCategory(todo.category);
    setEditDueDate(todo.dueDate || '');
  }, [todo]);

  const handleSaveEdit = useCallback(() => {
    const trimmedText = editText.trim();

    if (!trimmedText) {
      return;
    }

    const updates: UpdateTodoInput = {
      text: trimmedText,
      priority: editPriority,
      category: editCategory.trim(),
      dueDate: editDueDate || null,
    };

    onUpdate(todo.id, updates);
    setIsEditing(false);
  }, [todo.id, editText, editPriority, editCategory, editDueDate, onUpdate]);

  const handleTextChange = useCallback((e: ChangeEvent<HTMLInputElement>) => {
    setEditText(e.target.value);
  }, []);

  const handlePriorityChange = useCallback((e: ChangeEvent<HTMLSelectElement>) => {
    setEditPriority(e.target.value as Priority);
  }, []);

  const handleCategoryChange = useCallback((e: ChangeEvent<HTMLInputElement>) => {
    setEditCategory(e.target.value);
  }, []);

  const handleDueDateChange = useCallback((e: ChangeEvent<HTMLInputElement>) => {
    setEditDueDate(e.target.value);
  }, []);

  const handleKeyDown = useCallback(
    (e: KeyboardEvent<HTMLInputElement>) => {
      if (e.key === 'Enter') {
        e.preventDefault();
        handleSaveEdit();
      } else if (e.key === 'Escape') {
        e.preventDefault();
        handleCancelEdit();
      }
    },
    [handleSaveEdit, handleCancelEdit]
  );

  const handleStatusChange = useCallback((e: ChangeEvent<HTMLSelectElement>) => {
    const newStatus = e.target.value;
    onUpdate(todo.id, { status: newStatus });
  }, [todo.id, onUpdate]);

  return {
    isEditing,
    editText,
    editPriority,
    editCategory,
    editDueDate,
    handleToggle,
    handleDelete,
    handleEdit,
    handleCancelEdit,
    handleSaveEdit,
    handleTextChange,
    handlePriorityChange,
    handleCategoryChange,
    handleDueDateChange,
    handleKeyDown,
    handleStatusChange,
  };
};
