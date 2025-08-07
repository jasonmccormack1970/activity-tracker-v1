import React, { useState, useCallback, useEffect } from 'react';
import { useLocalStorage } from './hooks/useLocalStorage.ts';
import { LOCAL_STORAGE_KEY, VIEW_MODE_KEY, DEMO_ACTIVITIES } from './constants.ts';
import { Activity, ActivityStatus, ActivityFormData, ViewMode } from './types.ts';
import Header from './components/Header.tsx';
import ActivityList from './components/ActivityList.tsx';
import NoActivities from './components/NoActivities.tsx';
import ActivityFormModal from './components/ActivityFormModal.tsx';
import ConfirmationModal from './components/ConfirmationModal.tsx';
import { PlusIcon } from './components/Icons.tsx';
import { formatTime } from './utils.ts';

function App() {
  const [activities, setActivities] = useLocalStorage<Activity[]>(LOCAL_STORAGE_KEY, DEMO_ACTIVITIES);
  const [viewMode, setViewMode] = useLocalStorage<ViewMode>(VIEW_MODE_KEY, 'card');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingActivity, setEditingActivity] = useState<Activity | null>(null);
  const [activityToDelete, setActivityToDelete] = useState<Activity | null>(null);

  // Effect to "catch up" time for running timers when the app loads/reloads.
  // This ensures that time is not lost if the browser is closed.
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
    // This effect should only run once on mount.
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
            // Stopping timer
            const elapsedTime = now - (act.lastStartTime || now);
            return {
              ...act,
              isTiming: false,
              lastStartTime: null,
              totalTimeSpent: (act.totalTimeSpent || 0) + elapsedTime,
            };
          } else {
            // Starting timer
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

export default App;
