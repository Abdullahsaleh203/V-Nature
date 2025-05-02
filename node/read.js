const fs = require('fs');

fs.readFile('data.txt', 'utf8', (err, data) => {
    if (err) {
        console.error(err);
        return;
    }
    console.log("Done reading file");
    fs.writeFile('data2.txt', data, (err) => {
        if (err) {
            console.error(err);
            return;
        }
    });
});
