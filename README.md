
# Leave Application Form & Server API

This is a server API for a leave application form that integrates with Google Calendar. It allows users to submit leave requests and saves the data in a MongoDB database. Additionally, the leave data is inserted into the user's Google Calendar using the Google Calendar API.

## Prerequisites

- Node.js and npm installed on your machine.
- MongoDB database set up and running.
- Google API credentials JSON file for the Google Calendar integration. Please follow the instructions below to obtain the credentials file.

## LIVE DEMO

- [Leave Application Form](https://leaveform.bugtech.solutions/)   

## Setup Instructions

1. Clone the repository:

   ```bash
   git clone [<repository-url>](https://github.com/jGeli/leave-application.git)
   cd leave-application 
   ```

2. Install the dependencies:

   ```bash
   npm install
   ```

3. Google API Credentials:

   - Create a new project on the [Google Developers Console](https://console.developers.google.com/).
   - Enable the Google Calendar API for the project.
   - Create credentials (OAuth 2.0 client ID) and download the JSON file.
   - Rename the downloaded JSON file to `credentials.json`.
   - Place the `credentials.json` file in the root directory of the project.

4. Configuration:

   - Create a `.env` file in the root directory of the project.
   - Add the following configuration variables to the `.env` file:

     ```plaintext
     PORT=3000
     MONGO_URI=<your-mongodb-connection-string>
     GOOGLE_API_KEY=<your-google-api-key>
     ```

     Replace `<your-mongodb-connection-string>` with the connection string for your MongoDB database, and `<your-google-api-key>` with your Google API key.

5. Run the Server API:

   ```bash
   npm start
   ```

   The server is now running on `http://localhost:3000`.

6. Run the Frontend Application:

   - Open a new terminal window.
   - Navigate to the frontend application directory.
   - Install the dependencies:

     ```bash
     npm install
     ```

   - Start the frontend application:

     ```bash
     npm start
     ```

   The frontend application is now running on `http://localhost:8000`.

7. Access the Application:

   Open your web browser and visit `http://localhost:8000` to access the leave application form.

## API Documentation

### Submit a Leave Request

Endpoint: `POST /api/leaves`

Submit a leave request and save the data to the database. The request body should be a JSON object with the following fields:

```json
{
  "employeeName": "John Doe",
  "leaveType": "half-day",
  "startDate": "2023-07-10",
  "endDate": "2023-07-11"
}
```

Note: The `startDate` and `endDate` should be in the format `YYYY-MM-DD`.

---

Please make sure to replace `<repository-url>` with the URL of your repository.

Feel free to customize the instructions and add any additional information specific to your project.
