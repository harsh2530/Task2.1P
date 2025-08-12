// Import the required packages
const express = require('express')                 // Web framework to create server
const bodyParser = require('body-parser')          // Helps read form data
require('dotenv').config()                         // Loads variables from .env file
const sgMail = require('@sendgrid/mail')           // SendGrid package to send emails

// Create an Express application
const app = express()

// Middleware (helps handle requests)
app.use(bodyParser.urlencoded({ extended: true }))        // To read data from forms
app.use(bodyParser.json())                                // To read JSON data
app.use(express.static('public'))                         // Serve static files like HTML/CSS/JS

// Set your SendGrid API key (stored in .env file for safety)
sgMail.setApiKey(process.env.SENDGRID_API_KEY)

// Route: When someone visits the main page (GET request)
app.get('/', (req, res) => {
    // Send the HTML form to the browser
    res.sendFile(__dirname + '/index.html')
})

// Route: When someone submits the form (POST request)
app.post('/subscribe', async (req, res) => {
    let email = req.body.email                              // Get email from the form input

     // If the user didn't enter an email, show an error
    if (!email) {
        return res.status(400).json({ error: 'Email is required' })
    }

    // Create the email message
    const msg = {
        to: email,                               // Send the email to the address entered in the form   
        from: process.env.FROM_EMAIL,            // This must be your verified sender email in SendGrid
        subject: 'Welcome to DEV@Deakin!',           // Subject of the email
        text: 'Welcome to DEV@Deakin. We are glad you are here!',             // Plain text version
        html: '<h1> Get ready for exciting updates and opportunities coming your way!</h1>'     // HTML Version
    }

    try {
        // Send the email
        await sgMail.send(msg)
        console.log('Email sent to', email)
        res.status(200).json({ message: 'Subscription successful, email sent!' })
    } catch (err) {
        // Show error in the terminal
        console.error(err)
        res.status(500).json({ error: 'Failed to send email' })
    }
});

// Start the server
const PORT = process.env.PORT || 3000              // Use PORT from .env or default to 3000
app.listen(PORT, () => {
    console.log(`Server running on port https://localhost: ${PORT}`);

});