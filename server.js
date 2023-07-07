// server.js
const express = require('express');
const bodyParser = require('body-parser')
const mongoose = require('mongoose');
const { google } = require('googleapis');
const cors = require('cors')
const creds = require('./credentials.json')
const dotenv = require('dotenv');

const Leave = require('./leave.model');
const moment = require('moment/moment');

// Load environment variables from .env file
dotenv.config();

const app = express();
const port = process.env.PORT || 3001;


var corsOptions = {
    origin: "*",
    // methods: ['POST', 'PUT', 'GET', 'OPTIONS', 'HEAD'],
};


app.use(cors(corsOptions));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));


// Connect to MongoDB
mongoose
    .connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => {
        console.log('Connected to MongoDB');
    })
    .catch((error) => {
        console.error('Error connecting to MongoDB:', error);
    });


const SCOPES = creds.scope;
const GOOGLE_PRIVATE_KEY = creds.private_key;
const GOOGLE_CLIENT_EMAIL = creds.client_email
const GOOGLE_PROJECT_NUMBER = creds.project_id
const GOOGLE_CALENDAR_ID = creds.calendar_id

const auth = new google.auth.GoogleAuth({
    keyFile: './credentials.json',
    scopes: creds.scope, //full access to edit calendar
});

const jwtClient = new google.auth.JWT(
    GOOGLE_CLIENT_EMAIL,
    null,
    GOOGLE_PRIVATE_KEY,
    SCOPES
);


// Initialize Google Calendar API
const calendar = google.calendar({
    version: 'v3',
    project: GOOGLE_PROJECT_NUMBER,
    auth: jwtClient
});


app.get('/api', (req, res) => {

    calendar.events.list({
        calendarId: GOOGLE_CALENDAR_ID,
        timeMin: (new Date()).toISOString(),
        maxResults: 10,
        singleEvents: true,
        orderBy: 'startTime',
    }, (error, result) => {
        if (error) {
            res.send(JSON.stringify({ error: error }));
        } else {
            if (result.data.items.length) {
                res.send(JSON.stringify({ events: result.data.items }));
            } else {
                res.send(JSON.stringify({ message: 'No upcoming events found.' }));
            }
        }
    });
});


app.get('/api/leaves', async (req, res) => {

    let year = moment().format('YYYY')

    let leaves = await Leave.find({
        $and: [
            { startDate: { $gte: new Date(year, 1, 1) } },
            { endDate: { $lt: new Date(year, 12, 0) } }
        ]
    }).sort({ updatedAt: -1 });
    return res.status(200).json(leaves)
});


// API endpoint to save leave data
app.post('/api/leaves', async (req, res) => {
    try {

        const leave = new Leave(req.body);


        // Insert leave data into Google Calendar
        const event = {
            summary: `${leave.leaveType} Leave - ${leave.employeeName}`,
            start: {
                date: leave.startDate.toISOString().split('T')[0],
            },
            end: {
                date: leave.endDate.toISOString().split('T')[0],
            },
        };


        auth.getClient().then(a => {
            calendar.events.insert({
                auth: a,
                calendarId: GOOGLE_CALENDAR_ID,
                resource: event,
            }, function (err, event) {
                if (err) {
                    console.log('There was an error contacting the Calendar service: ' + err);
                    return;
                }
                // console.log('Event created: %s', event.data);
                // res.jsonp("Event successfully created!");
                // Create a new Leave document
                // Save the leave data to MongoDB
                leave.eventId = event.data.id;
                console.log('Leave data saved and added to Google Calendar:', event.data);
                leave.save();
                res.status(200).json({ message: 'Leave data saved successfully' });
            });
        })

        // const calendarResponse = await googleCalendar.events.insert({
        //     calendarId: 'primary',
        //     resource: event,
        // });

    } catch (error) {
        console.error('Error saving leave data:', error);
        res.status(500).json({ error: 'Error saving leave data' });
    }
});

app.put('/api/leaves/:id', async (req, res) => {
    try {
        if (!req.params.id) return res.status(404).json({ message: 'Not Found!' })
        // Create a new Leave document
        let leave = await Leave.findByIdAndUpdate(req.params.id, req.body, { new: true })
        // Save the leave data to MongoDB

        // Insert leave data into Google Calendar
        const event = {
            summary: `${leave.leaveType} Leave - ${leave.employeeName}`,
            start: {
                date: leave.startDate.toISOString().split('T')[0],
            },
            end: {
                date: leave.endDate.toISOString().split('T')[0],
            },
        };

        auth.getClient().then(a => {
            calendar.events.update({
                auth: a,
                calendarId: GOOGLE_CALENDAR_ID,
                resource: event,
                eventId: leave.eventId
            }, function (err, event) {
                if (err) {
                    console.log('There was an error contacting the Calendar service: ' + err);
                    return;
                }
                // console.log('Event created: %s', event.data);
                // res.jsonp("Event successfully created!");
                // Create a new Leave document
                // Save the leave data to MongoDB
            });
        })

        res.status(200).json({ message: 'Leave data updated successfully' });

    } catch (error) {
        console.error('Error saving leave data:', error);
        res.status(500).json({ error: 'Error saving leave data' });
    }
});

app.delete('/api/leaves/:id', async (req, res) => {
    try {
        if (!req.params.id) return res.status(404).json({ message: 'Not Found!' });
        let leave = await Leave.findById(req.params.id);
        if (!leave) return res.status(404).json({ message: 'Not Found!' });

        if (leave.eventId) {

            // Create a new Leave document
            auth.getClient().then(a => {
                calendar.events.delete({
                    auth: a,
                    calendarId: GOOGLE_CALENDAR_ID,
                    eventId: leave.eventId,
                }, function (err, event) {
                    if (err) {
                        console.log('There was an error contacting the Calendar service: ' + err);
                        return;
                    }
                    // console.log('Event created: %s', event.data);
                    // res.jsonp("Event successfully created!");
                    // Create a new Leave document
                    // Save the leave data to MongoDB
                });
            })
        }


        await Leave.findByIdAndDelete(req.params.id)
        // Save the leave data to MongoDB

        // Insert leave data into Google Calendar

        res.status(200).json({ message: 'Leave data deleted successfully' });

    } catch (error) {
        console.error('Error saving leave data:', error);
        res.status(500).json({ error: 'Error saving leave data' });
    }
});


// Start the server
app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});
