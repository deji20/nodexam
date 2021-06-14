const express = require("express");
const app = express();
const httpServer = require("http").createServer(app)
const sessions = require("express-session");
const path = require("path");
const fs = require("fs");
const database = require("./database/mongoDatabase");
const template = require("./templates/template");

//getting application configurations
const appConfig = require("./appsettings.json");
//setting a base directory for all routers to reference  

//security
const helmet = require("helmet");
app.use(helmet({
    contentSecurityPolicy:false
}));
app.use(sessions({
    secret:appConfig.sessionSecret,
    resave: false,
    saveUninitialized: false,
    cookie: {
        maxAge: 600000
    }
}))

app.use(express.json({limit: "50mb"}));

//setting up database
database.initConnection(appConfig.Database.ConnectionString).then(() => {
    console.log("db initiated");
    //creating socket.io connection 
    require("./socket")(httpServer);

    //loading html for server side rendering
    const mainHtml = fs.readFileSync(`${__dirname}/views/tooSecond.html`).toString();
    const adminHtml = fs.readFileSync(`${__dirname}/admin/tooSecSidebar.html`).toString();

    //importing rest apis
    const videoApi = require(`${__dirname}/rest/videoRestApi.js`);
    app.use("/api/videos", videoApi);
    
    const login = require("./security/userRouter");

    //serve mainpage
    app.get("/", (req, res) => {
        if(req.session.loginSession){
            res.send(template(mainHtml, {admin: adminHtml}));
        }else{
            res.send(template(mainHtml, {admin: '<h3 id="login" class="z-30 text-sm fixed right-5 top-5 cursor-pointer opacity-50 hover:opacity-100">Login</h3>'}))
        };
    })
    app.use("/login", login);
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