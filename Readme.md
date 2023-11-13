DB Configurations and .env File:-

PORT = 4000
DB_NAME = sportsbet
DB_USERNAME = root
DB_PASSWORD = password
DB_PORT = 3306
JWT_SECRET_KEY = 123ajsbdj123
ACCOUNT_SID = ACc4b0baa05d1bea127ca08bf29a062d45
AUTH_TOKEN = 07c6cbd7e0ff24713d0c7ee7bd3100af
TWILIO_NUMBER = +17745045538
Avatar_Base_URL="http://159.65.156.19:4000"
ADMIN_METAMASK_WALLET = 0xa206051882eff86621f4344f68f8180c94d611a0
COMMISION_PERCENTAGE = 2

Commands for DATABASE :-

CREATE DATABASE sportsbet;

Command for creating the migration :-
npx sequelize-cli db:migrate
