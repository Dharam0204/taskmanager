**Neighborhood Help Network – Task Manager Application**

**1. Project Overview**

The Neighborhood Help Network is a web-based application designed to help community members organise and manage everyday assistance activities. It provides a platform for managing tasks across categories such as Gardening, Shopping, Transport and General Help.

The application includes user registration, login, logout, profile management and task management functionality. Users can create, view, update and delete tasks through a user-friendly interface.

This project was developed as part of the QUT IFQ636 Software Lifecycle Management unit.

**2. Key Features**

- User registration and login
- User logout
- User profile updates
- Input validation and email validation
- Create new tasks
- View existing tasks
- Update tasks
- Delete tasks
- Task management through a web-based interface

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

The backend includes automated unit tests using Mocha, Chai and Sinon.

To execute the backend tests:

```bash
cd backend
npm test
```

The tests cover task management operations, including successful responses and error scenarios.

A GitHub Actions workflow is also configured to run the backend tests automatically when changes are pushed to the main branch or when the workflow is manually triggered.

**8. Deployment**

The application was deployed to the university-provided AWS EC2 environment for demonstration and assessment purposes.

Deployment URL: http://54.153.214.46

The application was configured using:

AWS EC2 for hosting

Nginx to serve the frontend and route API requests

PM2 to manage the backend Node.js process

Availability note: The EC2 instance may be stopped outside the assessment demonstration period. Consequently, the public URL may not be continuously accessible. Screenshots in the assignment report provide evidence of the successful deployment and application functionality at the time of testing.

**9. Known Limitations**

- The application is an academic project and is not intended to be a fully production-ready community platform.
- The current implementation focuses on user authentication, profile management and core task management functionality.
- Advanced community features such as real-time messaging, notifications and automated matching of people requesting and providing assistance are not included in the current implementation.
- The GitHub Actions workflow currently automates backend testing; deployment to EC2 is performed separately rather than through an automated deployment pipeline.

**10. Repository**

GitHub repository:

https://github.com/Dharam0204/taskmanager

