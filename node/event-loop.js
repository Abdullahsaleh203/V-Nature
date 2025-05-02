const fs = require('fs');
const crypto = require('crypto');
setTimeout(() => { console.log('setTimeout 1') }, 100);
setImmediate(() => { console.log('setImmediate 2') });
const start = Date.now();
fs.readFile('data.txt', () => {
    console.log('I/O completed')

    setTimeout(() => { console.log('setTimeout I/O completed') }, 3000);
    setImmediate(() => { console.log('setImmediate 20') });
});
crypto.pbkdf2('password', 'salt', 100000, 1024, 'sha512', () => {
    console.log('crypto completed');
    console.log('crypto:', Date.now() - start);
    setTimeout(() => { console.log('setTimeout crypto completed') }, 3000);
    setImmediate(() => { console.log('setImmediate 3') });
});
console.log("hello from top level code");
