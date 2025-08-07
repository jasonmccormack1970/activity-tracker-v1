import React, { useState, useEffect } from 'react';
import { Activity, ActivityStatus } from '../types.ts';
import { formatTime } from '../utils.ts';
import { EditIcon, DeleteIcon, PlayIcon, StopIcon, ClockIcon } from './Icons.tsx';

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
      // Function to update time
      const updateTimer = () => {
        const now = Date.now();
        const elapsed = now - lastStartTime;
        setDisplayedTime(totalTimeSpent + elapsed);
      };
      
      updateTimer(); // Initial update
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

export default React.memo(ActivityItem);