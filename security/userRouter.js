const router = require("express").Router();
const userRepo = require("./userRepository");

router.post("/", async (req, res) => {
    let user = req.body;
    console.log(user);
    if(await userRepo.verifyUser(user)){
        req.session.loginSession = true;
        res.status(204).send("");
    }else{
        res.status(403).send("");
    };
})

router.post("/create", async (req, res) => {
    let user = req.body;
    result = await userRepo.create(user);
    console.log(result);
    result ? res.status(200).send("") : res.status("403").send("");
})

module.exports = router;