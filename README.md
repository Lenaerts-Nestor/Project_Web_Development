
# Web Development Project

## Project Overview
This project is a simple website that allows users to log in and view data from a MongoDB database. Administrators have additional privileges to modify data values and images. The primary focus of this project is on backend development rather than frontend design. to see the site : https://project-webontwikkeling-lenaerts-nestor.onrender.com
## Technical Stack
- Backend: Node.js with Express.js
- Frontend: EJS templating engine
- Database: MongoDB
- Authentication: Express-session with MongoDB session store
- Additional tools: TypeScript, Bcrypt for password hashing
  
## Learning Objectives
This project was developed to meet the following learning objectives:

1. **Design and Framework Selection**
   - Make informed proposals for web frameworks
   - Align with colleagues and stakeholders
   - Consider technical and functional requirements

2. **Full-Stack Development**
   - Develop both front-end and back-end components
   - Create HTML UIs based on wireframes/mock-ups
   - Develop a Single-Page web application
   - Work with a NoSQL database (MongoDB)

3. **Development Environment and Collaboration**
   - Set up the necessary software and frameworks
   - Use Git for version control
   - Apply collaboration principles in version control

4. **Coding Standards and Testing**
   - Adhere to coding conventions for web applications
   - Utilize appropriate testing tools
   - Test both front-end and back-end components
   - Understand the differences between cookies, sessions, and tokens

5. **Maintenance and Improvement**
   - Implement improvements based on feedback
   - Maintain and update both front-end and back-end components

## Setup Instructions

### Prerequisites
- Docker Desktop installed on your machine
- Git installed on your machine

### Steps to Run the Project
1. Clone the repository:
   ```
   git clone [repository-url]
   cd project-webontwikkeling-lenaerts-nestor
   ```

2. Install dependencies:
   ```
   npm install
   ```

3. Start the project:
   ```
   npm start
   ```

   This will start the server using nodemon, which will automatically restart the server when changes are detected.

## Security Considerations
This project implements several security best practices:
- Password hashing using Bcrypt
- Session management with express-session
- HTTPS support (ensure proper SSL configuration)

## Future Improvements
- Enhance frontend design and user experience
- Implement more comprehensive testing
- Expand administrator features
