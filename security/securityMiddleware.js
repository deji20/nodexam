const router = require("express").Router();

//routing for projects
router.use((req, res, next) => {
    console.log(req.session);
    if(req.session.loginSession){
        next()
    }else{
        res.status(401).send("");
    }
});

module.exports = router;