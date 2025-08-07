import React, { useState, useEffect } from 'react';
import { Activity, ActivityStatus } from '../types.ts';
import { formatTime } from '../utils.ts';
import { EditIcon, DeleteIcon, PlayIcon, StopIcon, ClockIcon } from './Icons.tsx';

interface ActivityListItemProps {
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
        {/* Name and Description */}
        <div className="flex-1 min-w-0">
            <h3 className="text-md font-bold text-gray-100 truncate">{name}</h3>
            {description && (
                <p className="text-gray-400 text-sm break-words mt-1 hidden sm:block">
                    {description}
                </p>
            )}
        </div>
        
        {/* Details and Actions */}
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

export default React.memo(ActivityListItem);