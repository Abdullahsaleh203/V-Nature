const express = require('express');
// const Route = require('express.Router');
const app = express();
const fs = require('fs');
// app.use(express.json());

const PORT = process.env.PORT || 3000;
app.get('/test', (req, res) => {
    // const read = fs.createReadStream('package.json'); 
    // read.on('data', chunk => {
    //     res.write(chunk);
    // });
    // read.on('end', () => {
    //         res.end();
    //     });
    //     read.on('error', error=>{
    //             console.log(error)
    //             res.end("File not Found !")
    //         })

    const read2 = fs.createReadStream('data.txt');
    read2.pipe(res);

});




app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
