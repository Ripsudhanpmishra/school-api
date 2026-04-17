# School Management API

A simple REST API built with Node.js, Express, and MySQL to manage school data.

## Tech Stack
- Node.js
- Express.js
- MySQL

## Setup

1. Clone the repository
```bash
git clone https://github.com/Ripsudhanpmishra/school-api/.git
cd school-api
```

2. Install dependencies
```bash
npm install
```

3. Create a `.env` file
```
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=your_password
DB_NAME=school_management
PORT=3000
```

4. Start the server
```bash
node index.js
```

The database and table will be created automatically on first run.

## API Endpoints

### Add a School
```
POST /addSchool
```
**Request Body:**
```json
{
  "name": "Greenwood High School",
  "address": "123 Main Street, Delhi",
  "latitude": 28.6139,
  "longitude": 77.2090
}
```

### List Schools by Proximity
```
GET /listSchools?latitude=28.6139&longitude=77.2090
```
Returns all schools sorted by distance from the given location.
