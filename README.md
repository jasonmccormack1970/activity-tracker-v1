# Activity Tracker

A simple application to track your activities and the time spent on them.

<img width="736" height="608" alt="image" src="https://github.com/user-attachments/assets/d7f8df4e-5afe-464f-84a0-79f2fc499887" />


## Description
Activity Tracker is a client-side web application built with React and TypeScript. It allows you to create, manage, and time your daily tasks and activities. All your data is stored securely in your browser's local storage, ensuring privacy and offline access.

### Key Features
* **Create & Manage Activities:** Easily add new activities with names and descriptions. Edit or delete them as needed.
* **Time Tracking:** Start and stop a timer for any activity. The total time is automatically calculated and saved.
* **Status Management:** Organize your activities with statuses: "To Do", "In Progress", or "Done".
* **Responsive Layout:** Switch between a detailed card view and a compact list view.
* **Data Export:** Export all your activity data to a CSV file for backup or analysis.
* **Persistent Storage:** Your activities are saved in local storage, so they're available whenever you open the app in the same browser.

## Local Setup and Running the Application

This project is set up to run directly in the browser without a complex build process, using Babel for on-the-fly TypeScript and JSX transpilation.

### Prerequisites

*   A modern web browser.
*   A simple local web server. A local server is necessary because browsers enforce security policies (CORS) that restrict loading JavaScript modules directly from the local file system (`file://`).
*   **An active internet connection is required for the initial load.** The application loads external libraries (like React and Tailwind CSS) from a Content Delivery Network (CDN).

You can use any local web server you prefer. Here are two simple options:

*   **For Node.js users:** The `serve` package is a great choice.
*   **For Python users:** Python comes with a built-in `http.server` module.

### Instructions

1.  **Get the Code**

    Download the project files (e.g., as a ZIP from GitHub) and unzip them, or clone the repository using Git.

    ```bash
    # Example of cloning with Git
    git clone https://github.com/jasonmccormack1970/activity-tracker-v1.git
    cd activity-tracker-v1
    ```

2.  **Start the Local Server**

    Open a terminal in the root directory of the project (the one containing `index.html`), and run one of the following commands:

    *   **Using `npx` (comes with Node.js):**
        ```bash
        npx serve
        ```

    *   **Using Python 3:**
        ```bash
        python3 -m http.server
        ```
        *(On some systems, the command might be `python` instead of `python3`).*

3.  **Launch the App**

    Your terminal will display a local URL, typically `http://localhost:3000` for `serve` or `http://localhost:8000` for Python's server. Open this URL in your web browser.

The Activity Tracker application should now be running!
