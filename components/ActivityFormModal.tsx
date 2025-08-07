import React, { useState, useEffect, useRef } from 'react';
import { Activity, ActivityStatus, ActivityFormData } from '../types.ts';

interface ActivityFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (activityData: ActivityFormData & { id?: string }) => void;
  activity: Activity | null;
}

const ActivityFormModal: React.FC<ActivityFormModalProps> = ({ isOpen, onClose, onSave, activity }) => {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [status, setStatus] = useState<ActivityStatus>(ActivityStatus.TODO);
  const modalRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (activity) {
      setName(activity.name);
      setDescription(activity.description);
      setStatus(activity.status);
    } else {
      setName('');
      setDescription('');
      setStatus(ActivityStatus.TODO);
    }
  }, [activity, isOpen]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      alert('Activity name cannot be empty.');
      return;
    }
    onSave({ id: activity?.id, name, description, status });
  };

  // Accessibility: Handle keyboard events (Escape key)
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onClose();
      }
    };
    if (isOpen) {
      window.addEventListener('keydown', handleKeyDown);
    }
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, onClose]);

  // Accessibility: Focus trapping
  useEffect(() => {
    if (isOpen && modalRef.current) {
      const focusableElements = modalRef.current.querySelectorAll<HTMLElement>(
        'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
      );
      const firstElement = focusableElements[0];
      const lastElement = focusableElements[focusableElements.length - 1];

      const handleTabKeyPress = (e: KeyboardEvent) => {
        if (e.key === 'Tab') {
          if (e.shiftKey) { // Shift + Tab
            if (document.activeElement === firstElement) {
              lastElement.focus();
              e.preventDefault();
            }
          } else { // Tab
            if (document.activeElement === lastElement) {
              firstElement.focus();
              e.preventDefault();
            }
          }
        }
      };

      firstElement?.focus();
      modalRef.current.addEventListener('keydown', handleTabKeyPress);
      
      return () => {
        modalRef.current?.removeEventListener('keydown', handleTabKeyPress);
      };
    }
  }, [isOpen]);
  
  if (!isOpen) return null;

  return (
    <div 
      className="fixed inset-0 bg-black/70 z-40 flex items-center justify-center p-4"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-labelledby="form-modal-title"
    >
      <div
        ref={modalRef}
        className="bg-gray-800 rounded-xl shadow-2xl w-full max-w-md transform transition-all"
        onClick={e => e.stopPropagation()}
      >
        <div className="p-6">
          <h2 id="form-modal-title" className="text-2xl font-bold text-white mb-6">{activity ? 'Edit Activity' : 'Add New Activity'}</h2>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-300 mb-1">Activity Name</label>
              <input
                type="text"
                id="name"
                value={name}
                onChange={e => setName(e.target.value)}
                className="w-full bg-gray-700 text-white border border-gray-600 rounded-lg px-3 py-2 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition"
                required
              />
            </div>
            <div>
              <label htmlFor="description" className="block text-sm font-medium text-gray-300 mb-1">Description</label>
              <textarea
                id="description"
                value={description}
                onChange={e => setDescription(e.target.value)}
                rows={4}
                className="w-full bg-gray-700 text-white border border-gray-600 rounded-lg px-3 py-2 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition"
              />
            </div>
            <div>
              <label htmlFor="status" className="block text-sm font-medium text-gray-300 mb-1">Status</label>
              <select
                id="status"
                value={status}
                onChange={e => setStatus(e.target.value as ActivityStatus)}
                className="w-full bg-gray-700 text-white border border-gray-600 rounded-lg px-3 py-2 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition"
              >
                {Object.values(ActivityStatus).map(s => (
                  <option key={s} value={s}>{s}</option>
                ))}
              </select>
            </div>
            <div className="flex justify-end gap-4 pt-4">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 bg-gray-600 text-white font-semibold rounded-lg hover:bg-gray-500 transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 bg-indigo-600 text-white font-semibold rounded-lg hover:bg-indigo-700 transition-colors"
              >
                Save Activity
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ActivityFormModal;
