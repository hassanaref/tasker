# Tasker

Tasker is a Node.js app that uses PostgreSQL as its database. It runs on port 3000.

## Installation

1. Clone the repository: `git clone https://github.com/hassanaref/tasker.git`
2. Navigate to the project directory: `cd tasker`
3. Install the required dependencies: `npm install`
4. Create a `.env` file based on the `.env.example` file and add your database credentials
5. Create the required tables in your PostgreSQL database by running the migrations: `npm run migrate`

## Usage

To start the app, run: `npm start`

By default, the app will be available at `http://localhost:3000`

## License

This project is licensed under the MIT License.