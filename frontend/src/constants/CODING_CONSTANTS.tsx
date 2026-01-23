// Animation Time
export const ANIMATION_TIME = 1500;
export const SLOW_ANIMATION_TIME = 3000;

// Versions
export const VERSION1 = 'v1';
export const VERSION2 = 'v2';

// API-Helpers
const logged_user = localStorage.getItem('logged_user');
export const BODY_TO_SEND = JSON.stringify({ username: logged_user });


// Content for script
export const SCRIPT_CONTENT = {
    function: [
        "    def {step}():", // First occurrence
        "\n    def {step}():" // Subsequent occurrences
    ],
    screenshot: [
        "        app.save_screenshot()", // First occurrence (if needed)
        "        app.save_screenshot()"  // Subsequent occurrences (identical here)
    ],
    slowdown: [
        "        app.slowdown()",
        "        app.slowdown()"
    ],
    findtag: [
        "        app.driver.find_element('id', '{identifier}')",
        "        app.driver.find_element('id', '{identifier}')"
    ],
    findclass: [
        "        app.driver.find_element('class_name', '{identifier}')",
        "        app.driver.find_element('class_name', '{identifier}')"
    ]
};


// Content for README
export const MD_TEXT = `
# Project Overview

**ATF (Automation Testing Framework)** is a comprehensive, end-to-end automation platform designed to streamline the creation, execution, and management of test scripts. Built with a modern technology stack—**React** for the frontend and **Python** for the backend—ATF empowers a diverse range of stakeholders, including testers, developers, administrators, and maintenance teams, to collaborate efficiently throughout the testing lifecycle.

A key differentiator of ATF is its seamless integration with **Generative AI (GenAI)**, specifically leveraging Ollama LLaMA 3, to automate the generation of boilerplate code and accelerate script development.

---

## Key Features


- **Script Execution & Result Reporting:**  
  Execute automation scripts and generate detailed, actionable reports for each test run.


  - **AI-Assisted Script Creation:**  
  Utilize GenAI (Ollama LLaMA 3) to automatically generate boilerplate code, reducing manual effort and ensuring consistency across scripts.


  - **Test Case Management:**  
  Upload, organize, and manage test cases (including CSV import), enabling traceability and efficient test coverage.


  - **Infrastructure & User Management:**  
  Configure application-level settings, manage users, assign roles, and control access to various modules.


  - **Log Monitoring:**  
  Access and monitor both error and application logs to facilitate rapid troubleshooting and system health checks.


  - **CramerForms Module:**  
  A specialized module dedicated to device and location management, tailored for Cramer-based automation scenarios.

---

## User Roles & Capabilities

### 1. Tester


- Execute pre-defined automation scripts.

- View comprehensive execution results and reports.

- Benefit from a user-friendly interface focused on test execution and result analysis.

### 2. Developer


- Create, edit, and maintain automation scripts.

- Import test requirements via CSV to guide script development.

- Leverage GenAI (Ollama LLaMA 3), trained on historical scripts, to auto-generate boilerplate code and accelerate development.

- **Developer Workspace:**  
  Developers are provided with a three-canvas interface for streamlined workflow:

  - **Existing Scripts Canvas:**  
    Browse and select from existing scripts. Selecting a script displays its content in the editor. Includes workflow options such as:

    - Insert function definitions

    - Add screenshot capture logic

    - Insert timed delays (slowdown)

    - Add tag-finding logic

  - **Test Cases Canvas:**  
    Upload, manage, and select test cases to work on.
    
  - **Script Editor Canvas:**  
    Edit and update the full content of selected scripts with real-time feedback.

### 3. Administrator


- Manage global application settings (e.g., application name, branding/logo).

- Create and manage applications and user accounts.

- Assign and modify user roles to control access and permissions.

### 4. Maintenance


- Access and review error and system logs for proactive issue detection.

- Monitor overall application health and system status.

### 5. CramerForms


- Utilize a dedicated module for Cramer-based automation.

- Manage device and location creation (feature under active development).

- Benefit from specialized tools for telecom and network automation scenarios.

---

## Technology Stack


- **Frontend:** React (modern, component-based UI)

- **Backend:** Python (robust, scalable API and business logic)

- **AI Integration:** GenAI (Ollama LLaMA 3) for intelligent code generation and automation assistance

---

## Work in Progress


- The **CramerForms Module** is currently under active development, with ongoing enhancements to device and location management capabilities.

`;