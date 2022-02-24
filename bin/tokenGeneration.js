import jwt from 'jsonwebtoken';

let refreshTokens = [];

export const generateAccessToken = user => {
    console.log('generateAccessToken user', user);
    return jwt.sign(user, process.env.ACCESS_TOKEN_SECRET, {
        expiresIn: '15m'
    });
};

export const generateRefreshToken = user => {
    console.log('generateRefreshToken user', user);
    const refreshToken = jwt.sign(user, process.env.REFRESH_TOKEN_SECRET, {
        expiresIn: '20m'
    });

    return refreshToken;
};

export const validateToken = (req, res, next) => {
    // get token from response header
    const authHeader = req.headers['authorization'];

    // the request header contains the token "Bearer <token>",
    // split the string and use the second value in the split array
    const token = authHeader.split(' ')[1];

    if (token === null) res.sendStatus(400).send('Token not present');

    jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, user) => {
        console.log('jwt.verify user', user);
        if (err) {
            res.status(403).send('Token invalid');
        } else {
            // user: { user: 'Kyle', iat: 1629837426, exp: 1629838326 }
            //  iat: “issued at” helps identify the date/time issued
            //  exp: “expires at” helps identify the date/time the token will expire
            req.user = user;

            // proceed to next action in calling function
            next();
        }
    })
};
