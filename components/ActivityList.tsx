import React from 'react';
import { Activity, ViewMode } from '../types.ts';
import ActivityItem from './ActivityItem.tsx';
import ActivityListItem from './ActivityListItem.tsx';

interface ActivityListProps {
  activities: Activity[];
  onEdit: (activity: Activity) => void;
  onDelete: (id: string) => void;
  onToggleTimer: (id: string) => void;
  viewMode: ViewMode;
}

const ActivityList: React.FC<ActivityListProps> = ({ activities, onEdit, onDelete, onToggleTimer, viewMode }) => {
  const ActivityComponent = viewMode === 'card' ? ActivityItem : ActivityListItem;

  if (viewMode === 'list') {
    return (
        <div className="flex flex-col gap-3">
            {activities.map(activity => (
                <ActivityListItem
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
        <ActivityItem
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

export default ActivityList;
