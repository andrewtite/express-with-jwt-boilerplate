import dotenv from 'dotenv';
import express from 'express';
import bcrypt from 'bcrypt';
import {generateAccessToken, generateRefreshToken} from './tokenGeneration.js';

dotenv.config();
const app = express();
let refreshTokens = [];

// this middleware will allow us to pull req.body.<params>
app.use(express.json());

// get Auth Server port number from .env file
// Auth Server is run of different port from API Server
const port = process.env.TOKEN_SERVER_PORT;

// login endpoint
app.post('/login', async (req, res) => {
    // confirm user exists in list of registered users
    const user = users.find(c => c.user === req.body.name);

    // if user doesn't exist return a 404 response
    if (user === null) res.status(404).send('User does not exist');

    // get access token and refresh token
    if (await bcrypt.compare(req.body.password, user.password)) {
        const accessToken = generateAccessToken({user: req.body.name});
        const refreshToken = generateRefreshToken({user: req.body.name});
        refreshTokens.push(refreshToken);

        res.json({accessToken: accessToken, refreshToken: refreshToken});
    } else {
        res.status(401).send('Password Incorrect!');
    }
});

// refresh token endpoint
app.post('/refreshToken', (req, res) => {
    if (!refreshTokens.includes(req.body.token)) {
        res.status(400).send('Refresh Token Invalid!');
    } else if(!req.body.name) {
        res.status(400).send('User Invalid!');
    } else {
        // remove old refresh token
        refreshTokens = refreshTokens.filter(c => c !== req.body.token);

        // generate new accessToken and refreshToken
        const accessToken = generateAccessToken({user: req.body.name});
        const refreshToken = generateRefreshToken({user: req.body.name});
        refreshTokens.push(refreshToken);

        res.json({accessToken: accessToken, refreshToken: refreshToken});
    }
});

// retire refresh token on logout
app.delete('/logout', (req, res) => {
    refreshTokens = refreshTokens.filter(c => c !== req.body.token);
    res.status(204).send('Logged out!');
});

// create user endpoint
const users = [];
app.post('/createUser', async (req, res) => {
    const user = req.body.name;
    const hashedPassword = await bcrypt.hash(req.body.password, 10);

    users.push({user: user, password: hashedPassword});

    res.status(201).send(users);
});

app.listen(port, () => {
    console.log(`Authorization Server running on ${port}...`)
});