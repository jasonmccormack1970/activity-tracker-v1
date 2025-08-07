import React, { useState, useEffect, useCallback, useRef } from 'react';
import ReactDOM from 'react-dom/client';

// =================================================================================
// From: utils.ts
// =================================================================================

function formatTime(milliseconds: number): string {
  if (milliseconds < 0) milliseconds = 0;
  const totalSeconds = Math.floor(milliseconds / 1000);
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;
  const pad = (num: number) => num.toString().padStart(2, '0');
  return `${pad(hours)}:${pad(minutes)}:${pad(seconds)}`;
}

// =================================================================================
// From: types.ts
// =================================================================================

enum ActivityStatus {
  TODO = 'To Do',
  IN_PROGRESS = 'In Progress',
  DONE = 'Done',
}

interface Activity {
  id: string;
  name: string;
  description: string;
  status: ActivityStatus;
  createdAt: string;
  totalTimeSpent: number;
  isTiming: boolean;
  lastStartTime: number | null;
}

type ActivityFormData = Pick<Activity, 'name' | 'description' | 'status'> & { id?: string };

type ViewMode = 'card' | 'list';

// =================================================================================
// From: constants.ts
// =================================================================================

const LOCAL_STORAGE_KEY = 'activities-db-v1';
const VIEW_MODE_KEY = 'activity-view-mode-v1';

const DEMO_ACTIVITIES: Activity[] = [
    {
        id: 'demo-4',
        name: 'Refactor Legacy User Module',
        description: "Plan and refactor the old User module to align with new coding standards and improve performance. This is a big task, needs careful planning.",
        status: ActivityStatus.TODO,
        createdAt: new Date(Date.now() - 1 * 60 * 60 * 1000).toISOString(), // 1 hour ago
        totalTimeSpent: 0,
        isTiming: false,
        lastStartTime: null,
    },
    {
        id: 'demo-3',
        name: 'Code Review for PR #128 - Caching Layer',
        description: "Review pull request from a junior developer for the new caching layer implementation. Check for performance, readability, and adherence to style guides.",
        status: ActivityStatus.TODO,
        createdAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(), // 1 day ago
        totalTimeSpent: 3600000, // 1 hour
        isTiming: false,
        lastStartTime: null,
    },
    {
        id: 'demo-2',
        name: 'Implement Authentication Service API',
        description: "Developing the REST endpoints for user registration, login, and token refresh. Using JWT for authentication.",
        status: ActivityStatus.IN_PROGRESS,
        createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(), // 3 days ago
        totalTimeSpent: 18900000, // 5.25 hours
        isTiming: true,
        lastStartTime: Date.now() - 60000 * 15, // Active timer, started 15 mins ago
    },
    {
        id: 'demo-1',
        name: 'System Design for Project Phoenix',
        description: "Initial system architecture and design brainstorming for the new microservices-based backend. Covered database schema, service boundaries, and communication protocols.",
        status: ActivityStatus.DONE,
        createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(), // 5 days ago
        totalTimeSpent: 12600000, // 3.5 hours
        isTiming: false,
        lastStartTime: null,
    },
    {
        id: 'demo-5',
        name: 'Setup CI/CD Pipeline for Staging',
        description: "Configured GitHub Actions pipeline for automated builds, running tests, and deploying the main branch to the staging environment.",
        status: ActivityStatus.DONE,
        createdAt: new Date(Date.now() - 8 * 24 * 60 * 60 * 1000).toISOString(), // 8 days ago
        totalTimeSpent: 28800000, // 8 hours
        isTiming: false,
        lastStartTime: null,
    },
];

// =================================================================================
// From: hooks/useLocalStorage.ts
// =================================================================================

function useLocalStorage<T>(key: string, initialValue: T): [T, React.Dispatch<React.SetStateAction<T>>] {
  const [storedValue, setStoredValue] = useState<T>(() => {
    if (typeof window === 'undefined') {
      return initialValue;
    }
    try {
      const item = window.localStorage.getItem(key);
      if (item === null || (key === LOCAL_STORAGE_KEY && item === '[]')) {
          return initialValue;
      }
      return item ? JSON.parse(item) : initialValue;
    } catch (error) {
      console.error('Error reading from localStorage', error);
      return initialValue;
    }
  });

  useEffect(() => {
    try {
      const valueToStore = JSON.stringify(storedValue);
      window.localStorage.setItem(key, valueToStore);
    } catch (error) {
      console.error('Error writing to localStorage', error);
    }
  }, [key, storedValue]);

  return [storedValue, setStoredValue];
}


// =================================================================================
// From: components/Icons.tsx
// =================================================================================

const ExportIcon = (props: React.SVGProps<SVGSVGElement>) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75V16.5M16.5 12 12 16.5m0 0L7.5 12m4.5 4.5V3" />
    </svg>
);

const PlusIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
  </svg>
);

const EditIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}>
    <path strokeLinecap="round" strokeLinejoin="round" d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L10.582 16.07a4.5 4.5 0 0 1-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 0 1 1.13-1.897l8.932-8.931Zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0 1 15.75 21H5.25A2.25 2.25 0 0 1 3 18.75V8.25A2.25 2.25 0 0 1 5.25 6H10" />
  </svg>
);

const DeleteIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}>
    <path strokeLinecap="round" strokeLinejoin="round" d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0" />
  </svg>
);

const ActivityIcon = (props: React.SVGProps<SVGSVGElement>) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h3.75M9 15h3.75M9 18h3.75m3 .75H18a2.25 2.25 0 0 0 2.25-2.25V6.108c0-1.135-.845-2.098-1.976-2.192a48.424 48.424 0 0 0-1.123-.08m-5.801 0c-.065.21-.1.433-.1.664 0 .414.336.75.75.75h4.5a.75.75 0 0 0 .75-.75 2.25 2.25 0 0 0-.1-.664m-5.8 0A2.251 2.251 0 0 1 5.25 6h.008a2.25 2.25 0 0 1 2.242 2.135l.002.006a2.25 2.25 0 0 1-.004.006l-.002.006a2.25 2.25 0 0 1-2.242-2.135m5.801 0a2.25 2.25 0 0 0-2.25-2.25H5.25a2.25 2.25 0 0 0-2.25 2.25v10.5A2.25 2.25 0 0 0 5.25 19.5h10.5a2.25 2.25 0 0 0 2.25-2.25V6.75a2.25 2.25 0 0 0-2.25-2.25H12" />
    </svg>
);

const PlayIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" {...props}>
    <path fillRule="evenodd" d="M4.5 5.653c0-1.426 1.529-2.33 2.779-1.643l11.54 6.647c1.295.742 1.295 2.545 0 3.286L7.279 20.99c-1.25.717-2.779-.217-2.779-1.643V5.653Z" clipRule="evenodd" />
  </svg>
);

const StopIcon = (props: React.SVGProps<SVGSVGElement>) => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" {...props}>
        <path fillRule="evenodd" d="M4.5 7.5a3 3 0 0 1 3-3h9a3 3 0 0 1 3 3v9a3 3 0 0 1-3 3h-9a3 3 0 0 1-3-3v-9Z" clipRule="evenodd" />
    </svg>
);

const ClockIcon = (props: React.SVGProps<SVGSVGElement>) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
    </svg>
);

const WarningIcon = (props: React.SVGProps<SVGSVGElement>) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126ZM12 15.75h.007v.008H12v-.008Z" />
    </svg>
);

const GridViewIcon = (props: React.SVGProps<SVGSVGElement>) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6A2.25 2.25 0 0 1 6 3.75h2.25A2.25 2.25 0 0 1 10.5 6v2.25a2.25 2.25 0 0 1-2.25 2.25H6A2.25 2.25 0 0 1 3.75 8.25V6ZM3.75 15.75A2.25 2.25 0 0 1 6 13.5h2.25a2.25 2.25 0 0 1 2.25 2.25V18A2.25 2.25 0 0 1 8.25 20.25H6A2.25 2.25 0 0 1 3.75 18v-2.25ZM13.5 6A2.25 2.25 0 0 1 15.75 3.75h2.25A2.25 2.25 0 0 1 20.25 6v2.25A2.25 2.25 0 0 1 18 10.5h-2.25A2.25 2.25 0 0 1 13.5 8.25V6ZM13.5 15.75A2.25 2.25 0 0 1 15.75 13.5h2.25a2.25 2.25 0 0 1 2.25 2.25V18a2.25 2.25 0 0 1-2.25 2.25h-2.25a2.25 2.25 0 0 1-2.25-2.25v-2.25Z" />
    </svg>
);

const ListViewIcon = (props: React.SVGProps<SVGSVGElement>) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
    </svg>
);


// =================================================================================
// From: components/ConfirmationModal.tsx
// =================================================================================

interface ConfirmationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  message: string;
}

const ConfirmationModal: React.FC<ConfirmationModalProps> = ({ isOpen, onClose, onConfirm, title, message }) => {
    const modalRef = useRef<HTMLDivElement>(null);

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

    useEffect(() => {
        if (isOpen && modalRef.current) {
            const focusableElements = modalRef.current.querySelectorAll<HTMLElement>(
                'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
            );
            const firstElement = focusableElements[0];
            const lastElement = focusableElements[focusableElements.length - 1];

            const handleTabKeyPress = (e: KeyboardEvent) => {
                if (e.key === 'Tab') {
                    if (e.shiftKey) { 
                        if (document.activeElement === firstElement) {
                            lastElement.focus();
                            e.preventDefault();
                        }
                    } else { 
                        if (document.activeElement === lastElement) {
                            firstElement.focus();
                            e.preventDefault();
                        }
                    }
                }
            };
            
            const confirmButton = Array.from(focusableElements).find(el => el.textContent === 'Delete');
            (confirmButton || firstElement)?.focus();

            modalRef.current.addEventListener('keydown', handleTabKeyPress);
            
            return () => {
                modalRef.current?.removeEventListener('keydown', handleTabKeyPress);
            };
        }
    }, [isOpen]);

    if (!isOpen) return null;

    return (
        <div 
            className="fixed inset-0 bg-black/70 z-50 flex items-center justify-center p-4"
            onClick={onClose}
            role="dialog"
            aria-modal="true"
            aria-labelledby="confirmation-modal-title"
        >
            <div
                ref={modalRef}
                className="bg-gray-800 rounded-xl shadow-2xl w-full max-w-md transform transition-all p-6"
                onClick={e => e.stopPropagation()}
            >
                <div className="flex items-start space-x-4">
                    <div className="mx-auto flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-full bg-red-900/50 sm:mx-0 sm:h-10 sm:w-10">
                        <WarningIcon className="h-6 w-6 text-red-400" aria-hidden="true" />
                    </div>
                    <div className="flex-grow">
                        <h3 className="text-lg leading-6 font-bold text-white" id="confirmation-modal-title">
                            {title}
                        </h3>
                        <div className="mt-2">
                            <p className="text-sm text-gray-300">
                                {message}
                            </p>
                        </div>
                    </div>
                </div>
                <div className="mt-6 flex justify-end gap-4">
                    <button
                        type="button"
                        onClick={onClose}
                        className="px-4 py-2 bg-gray-600 text-white font-semibold rounded-lg hover:bg-gray-500 transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-800 focus:ring-gray-500"
                    >
                        Cancel
                    </button>
                    <button
                        type="button"
                        onClick={onConfirm}
                        className="px-4 py-2 bg-red-600 text-white font-semibold rounded-lg hover:bg-red-700 transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-800 focus:ring-red-500"
                    >
                        Delete
                    </button>
                </div>
            </div>
        </div>
    );
};

// =================================================================================
// From: components/ActivityFormModal.tsx
// =================================================================================

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

  useEffect(() => {
    if (isOpen && modalRef.current) {
      const focusableElements = modalRef.current.querySelectorAll<HTMLElement>(
        'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
      );
      const firstElement = focusableElements[0];
      const lastElement = focusableElements[focusableElements.length - 1];

      const handleTabKeyPress = (e: KeyboardEvent) => {
        if (e.key === 'Tab') {
          if (e.shiftKey) {
            if (document.activeElement === firstElement) {
              lastElement.focus();
              e.preventDefault();
            }
          } else { 
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

// =================================================================================
// From: components/ActivityItem.tsx
// =================================================================================

interface ActivityItemProps {
  activity: Activity;
  onEdit: (activity: Activity) => void;
  onDelete: (id: string) => void;
  onToggleTimer: (id: string) => void;
}

const statusColors: { [key in ActivityStatus]: string } = {
  [ActivityStatus.TODO]: 'bg-yellow-400/20 text-yellow-300 ring-yellow-400/30',
  [ActivityStatus.IN_PROGRESS]: 'bg-blue-400/20 text-blue-300 ring-blue-400/30',
  [ActivityStatus.DONE]: 'bg-green-400/20 text-green-300 ring-green-400/30',
};

const ActivityItem: React.FC<ActivityItemProps> = ({ activity, onEdit, onDelete, onToggleTimer }) => {
  const { id, name, description, status, createdAt, isTiming, lastStartTime, totalTimeSpent } = activity;
  const [displayedTime, setDisplayedTime] = useState(totalTimeSpent || 0);

  useEffect(() => {
    let interval: number | undefined;
    if (isTiming && lastStartTime) {
      const updateTimer = () => {
        const now = Date.now();
        const elapsed = now - lastStartTime;
        setDisplayedTime(totalTimeSpent + elapsed);
      };
      
      updateTimer();
      interval = window.setInterval(updateTimer, 1000);
    } else {
      setDisplayedTime(totalTimeSpent);
    }

    return () => window.clearInterval(interval);
  }, [isTiming, lastStartTime, totalTimeSpent]);
  
  return (
    <div className="bg-gray-800 rounded-lg shadow-lg overflow-hidden transition-all duration-300 hover:shadow-indigo-500/30 hover:-translate-y-1 flex flex-col">
      <div className="p-5 flex-grow">
        <div className="flex justify-between items-start mb-2">
          <h3 className="text-lg font-bold text-gray-100 pr-2 flex-1">{name}</h3>
        </div>
        
        <div className="flex justify-between items-center mb-4 p-3 bg-gray-900/50 rounded-lg">
          <div className="flex items-center gap-2 text-gray-400">
            <ClockIcon className="w-6 h-6" />
            <span className="text-xl font-mono text-gray-200 tracking-wider" aria-label="Total time spent">
              {formatTime(displayedTime)}
            </span>
          </div>
          <button
            onClick={() => onToggleTimer(id)}
            className={`p-3 rounded-full transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-800 ${
              isTiming
                ? 'bg-red-600 hover:bg-red-700 text-white focus:ring-red-500'
                : 'bg-green-600 hover:bg-green-700 text-white focus:ring-green-500'
            }`}
            aria-label={isTiming ? 'Stop timer' : 'Start timer'}
          >
            {isTiming ? <StopIcon className="w-6 h-6" /> : <PlayIcon className="w-6 h-6" />}
          </button>
        </div>

        <p className="text-gray-400 text-sm mb-4 h-16 overflow-y-auto">{description}</p>
        <p className="text-xs text-gray-500">
          Created: {new Date(createdAt).toLocaleDateString()}
        </p>
      </div>
      <div className="bg-gray-800/50 p-3 flex justify-between items-center gap-2 border-t border-gray-700">
        <span
            className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${statusColors[status]} ring-1 ring-inset`}
          >
            {status}
        </span>
        <div className="flex items-center gap-2">
            <button
              onClick={() => onEdit(activity)}
              className="p-2 text-gray-400 hover:text-white hover:bg-gray-700 rounded-md transition-colors"
              aria-label="Edit activity"
            >
              <EditIcon className="w-5 h-5" />
            </button>
            <button
              onClick={() => onDelete(id)}
              className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-500/10 rounded-md transition-colors"
              aria-label="Delete activity"
            >
              <DeleteIcon className="w-5 h-5" />
            </button>
        </div>
      </div>
    </div>
  );
};
const MemoizedActivityItem = React.memo(ActivityItem);


// =================================================================================
// From: components/ActivityListItem.tsx
// =================================================================================

interface ActivityListItemProps {
  activity: Activity;
  onEdit: (activity: Activity) => void;
  onDelete: (id: string) => void;
  onToggleTimer: (id: string) => void;
}

const ActivityListItem: React.FC<ActivityListItemProps> = ({ activity, onEdit, onDelete, onToggleTimer }) => {
  const { id, name, description, status, isTiming, lastStartTime, totalTimeSpent } = activity;
  const [displayedTime, setDisplayedTime] = useState(totalTimeSpent || 0);

  useEffect(() => {
    let interval: number | undefined;
    if (isTiming && lastStartTime) {
      const updateTimer = () => {
        const now = Date.now();
        const elapsed = now - lastStartTime;
        setDisplayedTime(totalTimeSpent + elapsed);
      };
      updateTimer();
      interval = window.setInterval(updateTimer, 1000);
    } else {
      setDisplayedTime(totalTimeSpent);
    }

    return () => window.clearInterval(interval);
  }, [isTiming, lastStartTime, totalTimeSpent]);
  
  return (
    <div className="bg-gray-800 rounded-lg p-3 flex flex-col md:flex-row md:items-center gap-3 transition-all duration-200 hover:bg-gray-700/50 hover:shadow-indigo-500/20">
        <div className="flex-1 min-w-0">
            <h3 className="text-md font-bold text-gray-100 truncate">{name}</h3>
            {description && (
                <p className="text-gray-400 text-sm break-words mt-1 hidden sm:block">
                    {description}
                </p>
            )}
        </div>
        
        <div className="flex items-center flex-wrap gap-x-4 gap-y-2 md:gap-x-5 justify-start md:justify-end">
            <div className="flex-shrink-0" style={{ width: '7rem' }}>
                <span className={`inline-flex items-center w-full justify-center px-2.5 py-1 rounded-full text-xs font-medium ${statusColors[status]} ring-1 ring-inset`}>
                    {status}
                </span>
            </div>
            
            <div className="flex items-center gap-2 text-gray-400 flex-shrink-0" style={{ width: '8rem' }}>
                <ClockIcon className="w-5 h-5" />
                <span className="text-md font-mono text-gray-200 tracking-wider" aria-label="Total time spent">
                    {formatTime(displayedTime)}
                </span>
            </div>

            <div className="flex items-center gap-1 flex-shrink-0">
                <button
                    onClick={() => onToggleTimer(id)}
                    className={`p-2 rounded-full transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-800 ${
                    isTiming
                        ? 'bg-red-600 hover:bg-red-700 text-white focus:ring-red-500'
                        : 'bg-green-600 hover:bg-green-700 text-white focus:ring-green-500'
                    }`}
                    aria-label={isTiming ? 'Stop timer' : 'Start timer'}
                >
                    {isTiming ? <StopIcon className="w-5 h-5" /> : <PlayIcon className="w-5 h-5" />}
                </button>
                <button
                    onClick={() => onEdit(activity)}
                    className="p-2 text-gray-400 hover:text-white hover:bg-gray-700 rounded-md transition-colors"
                    aria-label="Edit activity"
                >
                    <EditIcon className="w-5 h-5" />
                </button>
                <button
                    onClick={() => onDelete(id)}
                    className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-500/10 rounded-md transition-colors"
                    aria-label="Delete activity"
                >
                    <DeleteIcon className="w-5 h-5" />
                </button>
            </div>
        </div>
    </div>
  );
};
const MemoizedActivityListItem = React.memo(ActivityListItem);


// =================================================================================
// From: components/ActivityList.tsx
// =================================================================================

interface ActivityListProps {
  activities: Activity[];
  onEdit: (activity: Activity) => void;
  onDelete: (id: string) => void;
  onToggleTimer: (id: string) => void;
  viewMode: ViewMode;
}

const ActivityList: React.FC<ActivityListProps> = ({ activities, onEdit, onDelete, onToggleTimer, viewMode }) => {
  if (viewMode === 'list') {
    return (
        <div className="flex flex-col gap-3">
            {activities.map(activity => (
                <MemoizedActivityListItem
                    key={activity.id}
                    activity={activity}
                    onEdit={onEdit}
                    onDelete={onDelete}
                    onToggleTimer={onToggleTimer}
                />
            ))}
        </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {activities.map(activity => (
        <MemoizedActivityItem
          key={activity.id}
          activity={activity}
          onEdit={onEdit}
          onDelete={onDelete}
          onToggleTimer={onToggleTimer}
        />
      ))}
    </div>
  );
};

// =================================================================================
// From: components/NoActivities.tsx
// =================================================================================

interface NoActivitiesProps {
  onNewActivity: () => void;
}

const NoActivities: React.FC<NoActivitiesProps> = ({ onNewActivity }) => {
  return (
    <div className="text-center py-20 px-6">
        <ActivityIcon className="mx-auto h-20 w-20 text-gray-600" />
        <h3 className="mt-4 text-2xl font-semibold text-gray-300">No activities yet</h3>
        <p className="mt-2 text-md text-gray-500">Get started by creating your first activity.</p>
        <div className="mt-8">
            <button
                type="button"
                onClick={onNewActivity}
                className="inline-flex items-center gap-2 bg-indigo-600 text-white font-semibold px-6 py-3 rounded-lg hover:bg-indigo-700 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-900 focus:ring-indigo-500"
            >
                <PlusIcon className="w-5 h-5" />
                Create New Activity
            </button>
        </div>
    </div>
  );
};


// =================================================================================
// From: components/Header.tsx
// =================================================================================

interface HeaderProps {
  onNewActivity: () => void;
  onExport: () => void;
  viewMode: ViewMode;
  onViewChange: (mode: ViewMode) => void;
}

const Header: React.FC<HeaderProps> = ({ onNewActivity, onExport, viewMode, onViewChange }) => {
  return (
    <header className="bg-gray-800/80 backdrop-blur-sm sticky top-0 z-10 shadow-md">
      <div className="container mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center space-x-3">
            <ActivityIcon className="w-8 h-8 text-indigo-400" />
            <h1 className="text-xl sm:text-2xl font-bold text-gray-100 tracking-tight">
              Activity Tracker
            </h1>
          </div>
          <div className="flex items-center gap-2 sm:gap-4">
            <div className="flex items-center bg-gray-700 rounded-lg p-1">
                <button
                    onClick={() => onViewChange('card')}
                    className={`p-1.5 rounded-md transition-colors duration-200 ${viewMode === 'card' ? 'bg-indigo-600 text-white' : 'text-gray-400 hover:text-white hover:bg-gray-600'}`}
                    aria-label="Card View"
                >
                    <GridViewIcon className="w-5 h-5" />
                </button>
                <button
                    onClick={() => onViewChange('list')}
                    className={`p-1.5 rounded-md transition-colors duration-200 ${viewMode === 'list' ? 'bg-indigo-600 text-white' : 'text-gray-400 hover:text-white hover:bg-gray-600'}`}
                    aria-label="List View"
                >
                    <ListViewIcon className="w-5 h-5" />
                </button>
            </div>
            <div className="hidden md:flex items-center gap-4">
                <button
                onClick={onExport}
                className="inline-flex items-center gap-2 bg-gray-600 text-white font-semibold px-4 py-2 rounded-lg hover:bg-gray-700 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-800 focus:ring-gray-500"
                >
                <ExportIcon className="w-5 h-5" />
                Export CSV
                </button>
                <button
                onClick={onNewActivity}
                className="inline-flex items-center gap-2 bg-indigo-600 text-white font-semibold px-4 py-2 rounded-lg hover:bg-indigo-700 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-800 focus:ring-indigo-500"
                >
                <PlusIcon className="w-5 h-5" />
                New Activity
                </button>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};


// =================================================================================
// From: App.tsx
// =================================================================================

function App() {
  const [activities, setActivities] = useLocalStorage<Activity[]>(LOCAL_STORAGE_KEY, DEMO_ACTIVITIES);
  const [viewMode, setViewMode] = useLocalStorage<ViewMode>(VIEW_MODE_KEY, 'card');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingActivity, setEditingActivity] = useState<Activity | null>(null);
  const [activityToDelete, setActivityToDelete] = useState<Activity | null>(null);

  useEffect(() => {
    const now = Date.now();
    setActivities(prevActivities => {
      let hasChanges = false;
      const updatedActivities = prevActivities.map(act => {
        const totalTimeSpent = act.totalTimeSpent || 0;
        const isTiming = act.isTiming || false;
        
        if (isTiming && act.lastStartTime) {
          hasChanges = true;
          const elapsedTime = now - act.lastStartTime;
          return {
            ...act,
            isTiming,
            totalTimeSpent: totalTimeSpent + elapsedTime,
            lastStartTime: now,
          };
        }
        return { ...act, totalTimeSpent, isTiming };
      });

      return hasChanges ? updatedActivities : prevActivities;
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleOpenModal = useCallback(() => {
    setEditingActivity(null);
    setIsModalOpen(true);
  }, []);

  const handleCloseModal = useCallback(() => {
    setIsModalOpen(false);
    setEditingActivity(null);
  }, []);

  const handleSaveActivity = useCallback((activityData: ActivityFormData) => {
    if (activityData.id) {
      setActivities(prev =>
        prev.map(act => (act.id === activityData.id ? { ...act, ...activityData } : act))
      );
    } else {
      const newActivity: Activity = {
        ...activityData,
        id: crypto.randomUUID(),
        createdAt: new Date().toISOString(),
        totalTimeSpent: 0,
        isTiming: false,
        lastStartTime: null,
      };
      setActivities(prev => [newActivity, ...prev]);
    }
    handleCloseModal();
  }, [setActivities, handleCloseModal]);

  const handleEditActivity = useCallback((activity: Activity) => {
    setEditingActivity(activity);
    setIsModalOpen(true);
  }, []);

  const handleDeleteActivity = useCallback((id: string) => {
    const activity = activities.find(act => act.id === id);
    if (activity) {
      setActivityToDelete(activity);
    }
  }, [activities]);

  const handleConfirmDelete = useCallback(() => {
    if (activityToDelete) {
      setActivities(prev => prev.filter(act => act.id !== activityToDelete.id));
      setActivityToDelete(null);
    }
  }, [activityToDelete, setActivities]);

  const handleCancelDelete = useCallback(() => {
    setActivityToDelete(null);
  }, []);

  const handleToggleTimer = useCallback((id: string) => {
    const now = Date.now();
    setActivities(prev =>
      prev.map(act => {
        if (act.id === id) {
          if (act.isTiming) {
            const elapsedTime = now - (act.lastStartTime || now);
            return {
              ...act,
              isTiming: false,
              lastStartTime: null,
              totalTimeSpent: (act.totalTimeSpent || 0) + elapsedTime,
            };
          } else {
            const newStatus = act.status === ActivityStatus.TODO ? ActivityStatus.IN_PROGRESS : act.status;
            return {
              ...act,
              status: newStatus,
              isTiming: true,
              lastStartTime: now,
            };
          }
        }
        return act;
      })
    );
  }, [setActivities]);
  
  const handleExportData = useCallback(() => {
    if (activities.length === 0) {
      alert("No activities to export.");
      return;
    }

    const escapeCsvField = (field: string | number | null): string => {
        const str = String(field ?? '');
        if (str.includes(',') || str.includes('"') || str.includes('\n')) {
            return `"${str.replace(/"/g, '""')}"`;
        }
        return str;
    };

    const headers = [
        'ID', 'Name', 'Description', 'Status', 'Created At',
        'Total Time Spent (ms)', 'Formatted Time (HH:MM:SS)'
    ];

    const sortedForExport = [...activities].sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime());

    const csvRows = [headers.join(',')];

    sortedForExport.forEach(act => {
        const row = [
            escapeCsvField(act.id),
            escapeCsvField(act.name),
            escapeCsvField(act.description),
            escapeCsvField(act.status),
            escapeCsvField(act.createdAt),
            escapeCsvField(act.totalTimeSpent),
            escapeCsvField(formatTime(act.totalTimeSpent)),
        ];
        csvRows.push(row.join(','));
    });

    const csvString = csvRows.join('\n');
    const blob = new Blob([csvString], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", "activity_tracker_export.csv");
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);

  }, [activities]);
  
  const handleViewChange = useCallback((mode: ViewMode) => {
    setViewMode(mode);
  }, [setViewMode]);

  const sortedActivities = [...activities].sort((a, b) => {
    const statusOrder = { [ActivityStatus.IN_PROGRESS]: 1, [ActivityStatus.TODO]: 2, [ActivityStatus.DONE]: 3 };
    if (statusOrder[a.status] !== statusOrder[b.status]) {
        return statusOrder[a.status] - statusOrder[b.status];
    }
    return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
  });

  return (
    <div className="min-h-screen bg-gray-900 font-sans">
      <Header 
        onNewActivity={handleOpenModal} 
        onExport={handleExportData} 
        viewMode={viewMode}
        onViewChange={handleViewChange}
      />

      <main className="container mx-auto max-w-5xl p-4 sm:p-6 lg:p-8">
        {sortedActivities.length > 0 ? (
          <ActivityList
            activities={sortedActivities}
            onEdit={handleEditActivity}
            onDelete={handleDeleteActivity}
            onToggleTimer={handleToggleTimer}
            viewMode={viewMode}
          />
        ) : (
          <NoActivities onNewActivity={handleOpenModal} />
        )}
      </main>

      <button
        onClick={handleOpenModal}
        className="fixed bottom-6 right-6 z-20 bg-indigo-600 hover:bg-indigo-700 text-white p-4 rounded-full shadow-lg transition-transform transform hover:scale-110 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-900 focus:ring-indigo-500 md:hidden"
        aria-label="Add new activity"
      >
        <PlusIcon className="w-6 h-6" />
      </button>

      {isModalOpen && (
        <ActivityFormModal
          isOpen={isModalOpen}
          onClose={handleCloseModal}
          onSave={handleSaveActivity}
          activity={editingActivity}
        />
      )}

      {activityToDelete && (
        <ConfirmationModal
          isOpen={!!activityToDelete}
          onClose={handleCancelDelete}
          onConfirm={handleConfirmDelete}
          title="Delete Activity"
          message={`Are you sure you want to permanently delete "${activityToDelete.name}"? This action cannot be undone.`}
        />
      )}
    </div>
  );
}


// =================================================================================
// Entry Point
// =================================================================================

const rootElement = document.getElementById('root');
if (!rootElement) {
  throw new Error("Could not find root element to mount to");
}

const root = ReactDOM.createRoot(rootElement);
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
