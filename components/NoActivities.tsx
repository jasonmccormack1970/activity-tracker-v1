import React from 'react';
import { PlusIcon, ActivityIcon } from './Icons.tsx';

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

export default NoActivities;
