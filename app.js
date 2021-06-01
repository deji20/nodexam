const express = require("express");
const app = express();
const httpServer = require("http").createServer(app)

const path = require("path");
const fs = require("fs");
const database = require("./database/mongoDatabase")

//getting application configurations
const appConfig = require("./appsettings.json");
//setting a base directory for all routers to reference  

app.use(express.json({limit: "50mb"}));

//setting up database
database.initConnection(appConfig.Database.ConnectionString).then(() => {
    console.log("db initiated");
    //creating socket.io connection 
    const io = require("./socket")(httpServer);
    //loading html for server side rendering
    const templateHeader = fs.readFileSync(`${__dirname}/views/templates/header.html`).toString();
    const templateFooter = fs.readFileSync(`${__dirname}/views/templates/footer.html`).toString();

    const mainHtml = fs.readFileSync(`${__dirname}/views/tooSecond.html`).toString();
    const adminHtml = fs.readFileSync(`${__dirname}/admin/tooSecSidebar.html`).toString();

    //importing rest apis
    const videoApi = require(`${__dirname}/rest/videoRestApi.js`);
    app.use("/api/videos", videoApi);

    //serve mainpage
    app.get("/", (req, res) => {
        res.send(templateHeader + mainHtml + adminHtml + templateFooter);
    })
    //setting static files
    app.use("/", express.static(path.join(__dirname, "public/")));

});
httpServer.listen(appConfig.HttpPort, (err) => {
    if(err){
        console.log(err);
    }else{
        console.log("application started on port: " + appConfig.HttpPort);
    }
});