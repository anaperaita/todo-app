import { useState, useCallback, FormEvent, ChangeEvent } from 'react';
import { Priority, CreateTodoInput } from '../../types';

interface TodoFormViewModel {
  text: string;
  priority: Priority;
  category: string;
  dueDate: string;
  handleTextChange: (e: ChangeEvent<HTMLInputElement>) => void;
  handlePriorityChange: (e: ChangeEvent<HTMLSelectElement>) => void;
  handleCategoryChange: (e: ChangeEvent<HTMLInputElement>) => void;
  handleDueDateChange: (e: ChangeEvent<HTMLInputElement>) => void;
  handleSubmit: (e: FormEvent<HTMLFormElement>) => void;
}

interface UseTodoFormViewModelProps {
  onAdd: (todo: CreateTodoInput) => void;
}

/**
 * ViewModel for TodoForm component.
 * Manages form state and validation logic.
 */
export const useTodoFormViewModel = ({ onAdd }: UseTodoFormViewModelProps): TodoFormViewModel => {
  const [text, setText] = useState('');
  const [priority, setPriority] = useState<Priority>(Priority.MEDIUM);
  const [category, setCategory] = useState('');
  const [dueDate, setDueDate] = useState('');

  const handleTextChange = useCallback((e: ChangeEvent<HTMLInputElement>) => {
    setText(e.target.value);
  }, []);

  const handlePriorityChange = useCallback((e: ChangeEvent<HTMLSelectElement>) => {
    setPriority(e.target.value as Priority);
  }, []);

  const handleCategoryChange = useCallback((e: ChangeEvent<HTMLInputElement>) => {
    setCategory(e.target.value);
  }, []);

  const handleDueDateChange = useCallback((e: ChangeEvent<HTMLInputElement>) => {
    setDueDate(e.target.value);
  }, []);

  const resetForm = useCallback(() => {
    setText('');
    setPriority(Priority.MEDIUM);
    setCategory('');
    setDueDate('');
  }, []);

  const handleSubmit = useCallback(
    (e: FormEvent<HTMLFormElement>) => {
      e.preventDefault();

      const trimmedText = text.trim();

      if (!trimmedText) {
        return;
      }

      const newTodo: CreateTodoInput = {
        text: trimmedText,
        priority,
        category: category.trim(),
        dueDate: dueDate || null,
      };

      onAdd(newTodo);
      resetForm();
    },
    [text, priority, category, dueDate, onAdd, resetForm]
  );

  return {
    text,
    priority,
    category,
    dueDate,
    handleTextChange,
    handlePriorityChange,
    handleCategoryChange,
    handleDueDateChange,
    handleSubmit,
  };
};
