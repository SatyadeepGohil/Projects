const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const { OAuth2Client } = require('google-auth-library');

const app = express();
const PORT = process.env.PORT || 3001;
const CLIENT_ID = '811953116024-fppfvst02ivcqbordtb9p6etr0nsiodm.apps.googleusercontent.com';

app.use(cors({
    origin: 'http://localhost:5173',
}));
app.use(bodyParser.json());

app.post('/auth/google', async (req, res) => {
    const { token } = req.body;

    try {
        const ticket = await client.verifyIdToken({
            idToken: token,
            audience: CLIENT_ID,
        });

        const payload = ticket.getPayload();
        res.status(200).json({
            success: true,
             user: {
                 name: payload.name,
                 email: payload.email,
             },
        });
    } catch (error) {
        console.error("Token verifaction failed:", error);
        res.status(401).json({ success: false, message: 'Invalid token'});
    }
});

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
})