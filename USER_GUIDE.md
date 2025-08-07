# Activity Tracker User Guide

Welcome to the Activity Tracker! This guide will walk you through all the features to help you get the most out of the application.

## 1. Overview

The Activity Tracker is a simple yet powerful tool to help you manage your tasks and track the time you spend on them. All your data is stored locally in your browser, so it's private and available even if you're offline.

## 2. The Main Screen

When you first open the app, you'll see the main dashboard. It consists of:

*   **Header:** At the top, containing the app title and primary controls.
*   **Activity Area:** The main section where all your activities are displayed.

If you are a new user, you'll see a welcome message with a button to create your first activity.

## 3. Core Features

### Creating a New Activity

1.  Click the **"New Activity"** button in the header (or the floating `+` button on mobile).
2.  A form will appear. Fill in the following details:
    *   **Activity Name:** A short, descriptive title for your task (required).
    *   **Description:** More details about the activity (optional).
    *   **Status:** The initial status of the activity (`To Do`, `In Progress`, or `Done`). The default is `To Do`.
3.  Click **"Save Activity"** to add it to your list.

### Viewing Your Activities

You can view your activities in two different formats:

*   **Card View (Default):** Displays each activity as a detailed card. This is great for seeing all the information at a glance.
*   **List View:** Displays each activity as a compact row. This is useful when you have many activities and want to see more of them on the screen at once.

You can switch between these views using the toggle buttons in the header.

### Time Tracking

Each activity has its own timer to track how much time you've spent on it.

*   **Start Timer:** Click the **Play icon** (▶️) on an activity card or row. This will start the timer. If the activity's status was "To Do", it will automatically change to "In Progress".
*   **Stop Timer:** Click the **Stop icon** (⏹️) to pause the timer. The time spent during that session will be added to the activity's total time.
*   **Total Time:** The total accumulated time is always visible for each activity, displayed in an `HH:MM:SS` format.

### Managing Activities

On each activity card or row, you'll find controls to manage it:

*   **Edit Activity:** Click the **Edit icon** (a pencil) to open the form and modify the activity's name, description, or status.
*   **Delete Activity:** Click the **Delete icon** (a trash can). A confirmation pop-up will appear to prevent accidental deletion. Click "Delete" to permanently remove the activity.

### Sorting

Your activities are automatically sorted to help you focus on what's important:
1.  Activities currently **In Progress** appear first.
2.  Followed by activities that are **To Do**.
3.  Completed **Done** activities are listed last.

Within each status group, newer activities are shown at the top.

### Exporting Your Data

You can save a backup of your data at any time.

1.  Click the **"Export CSV"** button in the header.
2.  A CSV file named `activity_tracker_export.csv` will be downloaded to your computer.
3.  This file contains all your activity details, including the total time spent, which you can open in a spreadsheet program like Excel or Google Sheets.

## 4. Data Storage & Offline Use

Your activity list is automatically saved in your web browser's Local Storage. This allows the application to work offline after it has been loaded.

*   **Internet Connection:** An internet connection is required to load the application for the first time.
*   **Offline Functionality:** Once the app is loaded, you can create, edit, delete, and time your activities without an internet connection. All changes will be saved to your browser.
*   **Data Persistence:** Your data persists even if you close the browser tab or shut down your computer.
*   **Privacy:** The data is private to your browser on your device.
*   **Backup Warning:** Clearing your browser's cache or site data for this application will erase all your activities. Use the **Export CSV** feature regularly to create backups!
