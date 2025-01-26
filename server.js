const express = require('express');
const fs = require('fs');
// const path = require('path');
// const url = require('url');
// const slugify = require('slugify');

const app = express();
// app.use(express.json());
// import url from 'url';
// import path from 'path';

// const __filename = url.fileURLToPath(import.meta.url);
// const __dirname = path.dirname(__filename);
// console.log(__filename);
// console.log(__dirname);

const PORT = process.env.PORT || 3000;

const read = JSON.parse(
    fs.readFileSync(`${__dirname}/dev-data/data/tours.json`

    ));

app.get('/test', (req, res) => { 
    res.status(200).json({
        status: 'success',
        read
    })

});




app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
