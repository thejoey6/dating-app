import express from "express";

// This will help us connect to the database
import db from "../db/connection.js";

// This help convert the id from string to ObjectId for the _id.
import { ObjectId } from "mongodb";

// router is an instance of the express router.
const router = express.Router();
router.use(express.json());

/*------------------------------------
-------------GET REQUESTS-------------
------------------------------------*/


//Retrieve sent messages from sender to recipient
router.get("/sent", async (req, res) => {
    try {
    let collection = await db.collection("messages");

        const query = {
            sender_user_ID: new ObjectId(req.query.senderId), 
            recipient_user_ID: new ObjectId(req.query.recipientId)
        }

        const messages = await collection.find(query).toArray()
        res.status(200).json(messages);
    } catch (error) {
        console.log(error)
    }
});

//Send a new message
router.post("/send", async (req, res) => {

    const time = req.body.timestamp
    const sender = req.body.sender_user_ID
    const recipient = req.body.recipient_user_ID
    const text = req.body.message

    try {

        const newDocument = {
            timestamp: time,
            sender_user_ID: ObjectId.createFromHexString(sender),
            recipient_user_ID: ObjectId.createFromHexString(recipient),
            message: text,
        }

        let collection = await db.collection("messages");
        const result = await collection.insertOne(newDocument);
        res.status(200).send(result);
    } catch (error) {
        console.log(error)
    }

})



export default router;