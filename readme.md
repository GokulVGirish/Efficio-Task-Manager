# Installation
Run the following command to clone the repository
```
git clone https://github.com/GokulVGirish/Efficio-Task-Manager.git
```
Go to ```frontend``` and ```backend``` directory to install packages
```
cd frontend
npm install
```
```
cd backend
npm install
```
# Configuration
Create ```.env``` file inside ```backend``` directory and copy the following code

```
MONGO_URI=Your mongodb URI
GMAIL_USERNAME=your gmail address 
GMAIL_PASSWORD=password created inside 'App Password' section under google accounts setting
PORT=8000
JWT_SECRET=a random secret key eg. thisisasecretkey
```
# Run the App
Go to ```backend``` and ```frontend``` directory and start the server
```
cd backend
nodemon server
```
```
cd frontend
npm start
```


Efficio is a web application designed to help users efficiently manage their tasks and projects. It provides a user-friendly interface to create, update, and delete tasks while visualizing progress through charts. The application leverages real-time communication via Socket.IO to enhance collaboration and task management.

Tech Stack
Frontend: React, Chart.js, CSS (or Tailwind CSS)
Backend: Node.js, Express
Database: MongoDB
Real-Time Communication: Socket.IO

Real-Time Features
The application uses Socket.IO for real-time updates. When a task is created, updated, or deleted, all tasks are update real time.


