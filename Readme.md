# SportsBet API

Welcome to the SportsBet API repository! This API provides functionality for handling sports betting operations.

### Installation

# 1: Clone the repository

git clone https://github.com/your-username/sportsbet-api.git

# 2: Install dependencies:

npm install

# 3: Start the server (Frontend):

npm start

# 4: Start the server (Backend):

npm run dev

### Database Configurations and .env File

Make sure to create a `.env` file in the backend directory of your project with the following configurations:

PORT=
DB_NAME=
DB_USERNAME=
DB_PASSWORD=
DB_PORT=
JWT_SECRET_KEY=
ACCOUNT_SID=
AUTH_TOKEN=
TWILIO_NUMBER=
Avatar_Base_URL=
ADMIN_METAMASK_WALLET=
COMMISION_PERCENTAGE=

### Commands for Database

CREATE DATABASE DB-NAME;

### Run the migration to set up the database tables

npx sequelize-cli db:migrate
