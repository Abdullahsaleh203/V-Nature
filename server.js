const express = require('express');
const Route = require('express.Router');
const app = express();

const PORT = process.env.PORT || 3000;




app.listen(PORT, () => {
    console.log('Server is running on port 3000');
});
