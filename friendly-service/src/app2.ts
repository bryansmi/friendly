import { Express } from 'express';
import express = require('express');


const server: Express = express();

async function main(): Promise<any> {
    console.log('Starting friendly-service...');
    const port = 1337; 

    server.use((req,res, next) => {
        if (!req.secure) {
            const secureUrl = "https://" + req.headers['host'] + req.url; 
            res.writeHead(301, { "Location":  secureUrl });
            res.end();
        }
        next();
    });

    server.get( "/", (req, res) => {
        res.send("Welcome to friendly-service! Send me a valid request or I won't be friendly!");
    } );

    server.listen(port, () => {
        console.log(`friendly-service server started at https://localhost:${port}` );
    } );
}

main()
.then((res) => {
    console.log('Success: Finishing friendly-service.');
    return 0;
})
.catch((err) => {
    console.log('Error: Something went wrong and friendly-service stopped.');
    console.error(err);
    return 1;
});

export server;