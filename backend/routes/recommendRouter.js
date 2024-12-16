const express = require("express");
const recommendRouter = express.Router();
const { userItemData , getRecommendation} = require("../middlewares/recommendation.js");
const { getAllUser } = require("../middlewares/getAllUser.js");


recommendRouter.route("/recommend/:userId").get(getAllUser,userItemData,getRecommendation);

module.exports = recommendRouter;
