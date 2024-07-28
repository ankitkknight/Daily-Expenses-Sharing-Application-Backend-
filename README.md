# Daily Expenses Sharing Application

This project is a backend service for a daily-expenses sharing application. It allows users to add expenses and split them using three different methods: Equal, Exact, and Percentage. The application also provides features to retrieve individual expenses, overall expenses, generate balance sheets, and download balance sheets in CSV format.

## Table of Contents

- [Installation](#installation)
- [Setup](#setup)
- [Usage](#usage)
- [API Endpoints](#api-endpoints)
- [License](#license)

## Installation

1. **Clone the Repository**

   git clone git@github.com:ankitkknight/Daily-Expenses-Sharing-Application-Backend-.git
   cd COVIN_ASSIGNMENT

2. Install Dependencies

Ensure you have Node.js installed. Then, install the necessary packages:

npm install

3. Create a .env File
Create a .env file in the root directory of the project with the following content:

MONGODB_USERNAME=<username>
MONGODB_PASSWORD=gYx13QuzPx5nYpkg
MONGODB_CLUSTER_ID=<clusterid>
JWT_SECRET=your_jwt_secret
PORT=4000

4. Start a Server

   "nodemon index.js" or "node index"
   
