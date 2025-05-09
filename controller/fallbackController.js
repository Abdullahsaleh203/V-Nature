// Fallback handlers for database connection issues
const fallbackHandlers = {
    // Fallback function for when database is unreachable
    getFallbackHomePage: (req, res) => {
        console.log('Using fallback home page due to database connection issues');
        res.status(200).render('error', {
            title: 'Something went wrong',
            msg: 'We are currently experiencing technical difficulties. Please try again later.'
        });
    },

    // Show database error page
    getDbErrorPage: (req, res) => {
        res.status(500).render('error', {
            title: 'Database Error',
            msg: 'Unable to connect to database. Our team has been notified and is working on a fix.'
        });
    }
};

module.exports = fallbackHandlers;
