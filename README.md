**Neighborhood Help Network – Task Manager Application**

**1. Project Overview**

The Neighborhood Help Network is a web-based application designed to help community members organise and manage everyday assistance activities. It provides a platform for managing requests across categories such as Gardening, Shopping, Transport and General Help.

The application supports two user roles: **Help Seeker and Helper**. Help Seekers can create and manage assistance requests, while Helpers can view available requests, accept them and mark them as completed. The application tracks each request through Available, Accepted and Completed statuses.

The project was developed as part of the QUT IFQ636 Software Lifecycle Management unit.

**2. Key Features**

-User registration with Help Seeker and Helper role selection
-User login and logout
-User profile updates
-Input validation and email validation
-Help Seekers can create, view, update and delete their own requests
-Helpers can view available assistance requests
-Helpers can accept available requests
-Helpers can mark accepted requests as completed
-Request status tracking: Available, Accepted and Completed
-Role-based access control
-MongoDB data persistence through a web-based interface

**3. Technology Stack**

| Component | Technology |
|---|---|
| Frontend | React.js |
| Backend | Node.js and Express.js |
| Database | MongoDB |
| Version Control | Git and GitHub |
| Automated Testing | Mocha, Chai and Sinon |
| CI Workflow | GitHub Actions |
| Cloud Deployment | AWS EC2 |
| Process Management | PM2 |
| Web Server | Nginx |

**4. Application Architecture**

The application follows a client-server architecture.

- **Frontend:** React.js provides the user interface and allows users to interact with the application.
- **Backend:** Node.js and Express.js handle application requests, authentication and task management operations.
- **Database:** MongoDB stores application data.
- **Deployment:** The application is hosted on an AWS EC2 instance. Nginx serves the frontend and forwards API requests to the backend, which is managed using PM2.

The application also implements role-based functionality. User roles are stored in MongoDB and returned during authentication. The backend uses authentication and authorisation checks to restrict operations according to the user's role. Task records store their current status and, where applicable, the Helper who accepted the request. The React frontend displays the appropriate dashboard and available actions for each role.

**5. Prerequisites**

To run the application locally, the following software and services are required:

- Node.js and npm
- Git
- Visual Studio Code or another code editor
- MongoDB database and connection URI

**6. Installation and Setup**

**Step 1 – Clone the repository**

```bash
git clone https://github.com/Dharam0204/taskmanager.git
cd taskmanager
```

**Step 2 – Install dependencies**

Install the root, backend and frontend dependencies:

```bash
npm install
npm install --prefix backend
npm install --prefix frontend
```

**Step 3 – Configure environment variables**

Create a `.env` file inside the backend directory using `.env.example` as a reference.

Configure the required environment variables:

```env
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
PORT=5001
```

Use your own MongoDB connection string and a secure JWT secret. Do not commit the `.env` file or other sensitive credentials to GitHub.

**Step 4 – Start the application**

From the project root directory, run:

```bash
npm start
```

This starts the backend and frontend using the project's configured start scripts.

**7. Automated Testing**

The backend automated test suite contains 21 passing unit tests covering task controller operations, including successful responses and error scenarios. The tests are executed using Mocha, Chai and Sinon.

A GitHub Actions workflow is configured to run the backend tests automatically when changes are pushed to the main branch or when the workflow is manually triggered.

To execute the backend tests:

cd backend
npm test

**8. Deployment**

The application was deployed to the university-provided AWS EC2 environment for demonstration and assessment purposes.

Deployment URL: http://54.153.214.46

The deployment was configured using:

AWS EC2 for hosting

Nginx to serve the frontend and route API requests

PM2 to manage the backend Node.js process

Deployment note: The deployment URL represents the previously deployed version. The latest role-based functionality has been tested locally but has not yet been confirmed on the EC2 deployment.

The EC2 instance may be stopped outside the assessment demonstration period. Consequently, the public URL may not be continuously accessible. Screenshots in the assignment report provide evidence of the deployment and application functionality at the time of testing.

**9. Known Limitations**

- The current implementation focuses on authentication, profile management, role-based assistance requests and the core request lifecycle.
- Advanced community features such as real-time messaging, notifications and automated matching between Help Seekers and Helpers are not included.
- The GitHub Actions workflow automates backend testing; deployment to the university-provided EC2 environment is performed separately rather than through an automated deployment pipeline.

**10. Repository**

GitHub repository:

https://github.com/Dharam0204/taskmanager

