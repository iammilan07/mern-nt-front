const express = require('express');
const axios = require('axios');
const dotenv = require('dotenv');

dotenv.config();

const router = express.Router();

router.post('/', async (req, res) => {
    const { text } = req.body;

    try {
        const response = await axios.post(
            'https://api.openai.com/v1/engines/davinci-codex/completions',
            {
                prompt: `Summarize the following text:\n\n${text}`,
                max_tokens: 100, // Adjust the token limit based on your needs
                n: 1,
                stop: ['\n'],
                temperature: 0.5
            },
            {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`
                }
            }
        );

        const summary = response.data.choices[0].text.trim();
        res.json({ summary });
    } catch (error) {
        console.error('Error summarizing text:', error.response ? error.response.data : error.message);
        res.status(500).json({ error: 'Failed to summarize text', details: error.response ? error.response.data : error.message });
    }
});

module.exports = router;
