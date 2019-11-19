const express = require("express");
const router = express.Router();
const {body} = require("express-validator")
const feedController = require("../controllers/feed");


router.get("/posts", feedController.getPosts);

router.post("/posts",[
    body('title').trim().isLength({min: 5}),
    body('content').trim().isLength({min: 5}),
],feedController.createPost);

// router.post("/posts",[
//     body('title').trim().isLength({min: 5}),
//     body('content').trim().isLength({min: 5}),
//     body('email').trim().isEmail().isLength({min: 10})
// ],feedController.createPost);




module.exports = router;