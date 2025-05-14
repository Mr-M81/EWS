const axios = require('axios');

const USER_CHECK_URL = 'https://api.usercheck.com/email/';

// Validate email using external API
async function isEmailValid(email) {
    try {
        const response = await axios.get(USER_CHECK_URL + email);
        const data = response.data;

        // Check if response exists and not disposable
        return data && !data.disposable;

    } catch (error) {
        console.error("Error validating email:", error.message);
        return false; // If error, treat as invalid to be safe
    }
}

module.exports = {
    isEmailValid
};
