import React from 'react';
import { ViewMode } from '../types.ts';
import { ActivityIcon, ExportIcon, PlusIcon, GridViewIcon, ListViewIcon } from './Icons.tsx';

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

export default Header;
