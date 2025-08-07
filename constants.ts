import { Activity, ActivityStatus } from './types.ts';

export const LOCAL_STORAGE_KEY = 'activities-db-v1';
export const VIEW_MODE_KEY = 'activity-view-mode-v1';

// Demo Data for First Load
export const DEMO_ACTIVITIES: Activity[] = [
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
