import express from "express";

// This will help us connect to the database
import db from "../db/connection.js";

// This help convert the id from string to ObjectId for the _id.
import { ObjectId } from "mongodb";

//JWT is used for userAuth
import jwt from "jsonwebtoken";

//bcrypt used for hashing passwords
import bcrypt from 'bcrypt';

/*------------------------------------
-------------GET REQUESTS-------------
------------------------------------*/

// router is an instance of the express router.
const router = express.Router();
router.use(express.json());


//Get a list of all users
router.get("/users", async (req, res) => {
  let collection = await db.collection("profiles");
  let results = await collection.find({}).toArray();
  res.send(results).status(200);
});


// Get list of users within a gender preference
router.get("/gendered-users", async (req, res) => {
  const genderPreference = req.query.genderPreference;
  try {
    const collection = db.collection("profiles");
    let query = {};

    if (genderPreference === "Men") {
        query.gender = { $eq: "Man" };
    } else if (genderPreference === "Women") {
        query.gender = { $eq: "Woman" };
    } else {
        // Handle unexpected gender preference values
        return res.status(400).send("Invalid gender preference");
    }

      const foundUsers = await collection.find(query).toArray();
      res.json(foundUsers);
  } catch (error) {
      console.log(error);
      res.status(500).send("Error fetching users");
  }
});


// This section will help you get a single profile by id
router.get("/:id", async (req, res) => {
  let collection = await db.collection("profiles");
  let query = { _id: new ObjectId(req.params.id) };
  let result = await collection.findOne(query);

  if (!result) res.send("Not found").status(404);
  else res.send(result).status(200);
});


//Get a list of all users
router.post("/matches", async (req, res) => {

  const ids = req.body
  const objectIds = ids.map(_id => ObjectId.createFromHexString(_id));

  try {
    let collection = await db.collection("profiles");

    const pipeline =
      [
        {
          '$match': {
            '_id': {
              '$in': objectIds
            }
          }
        }
      ]

      const result = await collection.aggregate(pipeline).toArray()
      res.json(result)

  } catch (error) {
    console.log(error)
  }

});


/*------------------------------------
-------------POST REQUESTS------------
------------------------------------*/

// This section will register new accounts
router.post("/register", async (req, res) => {
	
	const importPassword = req.body.password
	let hashedPassword;
	const importEmail = req.body.email
	const sanitizedEmail = importEmail.toLowerCase()
	
	try {
		hashedPassword = await bcrypt.hash(importPassword,10);

    //Check if user is already registered
    let collection = await db.collection("profiles");
    let existingUser = await collection.findOne({email: sanitizedEmail})
    if (existingUser) {
      return res.status(409).send('User already exists. Please login')
    }

		let newDocument = {
			email: sanitizedEmail,
			hashed_password: hashedPassword,
      name: req.body.name,
      birth_day: req.body.birth_day,
      birth_month: req.body.birth_month,
      birth_year: req.body.birth_year,
      gender: req.body.gender,
      gender_preference: req.body.gender_preference,
      img_url_1: req.body.img_url_1,
      img_url_2: req.body.img_url_2,
      img_url_3: req.body.img_url_3,
      img_url_4: req.body.img_url_4,
      img_url_5: req.body.img_url_5,
      img_url_6: req.body.img_url_6,
      bio: req.body.bio,
      matches: [],
      blocked_users: [],
		};

		let result = await collection.insertOne(newDocument);
    
    //Token for UserAuth
    const token = jwt.sign({ _id: result.insertedId, email: sanitizedEmail }, process.env.JWT_SECRET, {
      expiresIn: 60 * 24, //Token expires in 24 hours
    })

		res.status(201).json({ token, insertedId: result.insertedId });

		} catch (err) {
			console.error(err);
			res.status(500).send("Error adding profile");
		}
});


// This section will login a user
router.post("/login", async (req, res) => {
	
	const importPassword = req.body.password
	const importEmail = req.body.email
	const sanitizedEmail = importEmail.toLowerCase()
	
	try {
	
    const collection =  db.collection("profiles");

    const user = await collection.findOne({ email: sanitizedEmail })

    if (user) {
      const correctPassword = await bcrypt.compare(importPassword, user.hashed_password)
      if (correctPassword) {
        //token for UserAuth
        const token = jwt.sign({ _id: user._id, email: sanitizedEmail }, process.env.JWT_SECRET, {
          expiresIn: 60 * 24, //Token expires in 24 hours
        })
        
        res.status(200).json({ token, _id: user._id, user});

      } else {
        res.status(400).send("Invalid Credentials");
      }
    } else {
      res.status(400).send("Invalid Credentials");
    }

		} catch (err) {
			console.error(err);
			res.status(500).send("Error logging in");
		}
});

/*------------------------------------
-------------PATCH REQUESTS-----------
------------------------------------*/

// This section will create a profile (to an account)
router.patch("/:id", async (req, res) => {
  try {
    const query = { _id: new ObjectId(req.params.id) };
    const updates = {
      $set: {
	  name: req.body.name,
	  birth_day: req.body.birth_day,
	  birth_month: req.body.birth_month,
	  birth_year: req.body.birth_year,
	  gender: req.body.gender,
	  gender_preference: req.body.gender_preference,
	  img_url_1: req.body.img_url_1,
	  img_url_2: req.body.img_url_2,
	  img_url_3: req.body.img_url_3,
	  img_url_4: req.body.img_url_4,
	  img_url_5: req.body.img_url_5,
	  img_url_6: req.body.img_url_6,
	  bio: req.body.bio,
      },
    };

    let collection = await db.collection("profiles");
    let result = await collection.updateOne(query, updates);
    res.send(result).status(200);
  } catch (err) {
    console.error(err);
    res.status(500).send("Error updating profile");
  }
});


// This section will add a new match
router.put("/match/:id/:matchid", async (req, res) => {

  try {
    const query = { _id: new ObjectId(req.params.id) };

    const updates = {
      $push: {
       matches: { _id: new ObjectId(req.params.matchid) }
      }
    };

    const collection = db.collection("profiles");
    const result = await collection.updateOne(query, updates);

    res.send(result)
  } catch (err) {
    console.error(err);
    res.status(500).send("Error adding match");
  }
});

// This section will block a user
router.put("/block/:id/:blockid", async (req, res) => {
  try {
    const query = { _id: new ObjectId(req.params.id) };

    const updates = {
      $pull: { matches: { _id: new ObjectId(req.params.blockid) } },
      $addToSet: { blocked_users: { _id: new ObjectId(req.params.blockid) } }
    };

    const collection = db.collection("profiles");
    const result = await collection.updateOne(query, updates);

    res.send(result);
  } catch (err) {
    console.error(err);
    res.status(500).send("Error blocking user");
  }
});

/*------------------------------------
------------DELETE REQUESTS-----------
------------------------------------*/

// This section will help you delete a record
router.delete("/:id", async (req, res) => {
  try {
    const query = { _id: new ObjectId(req.params.id) };

    const collection = db.collection("profiles");
    let result = await collection.deleteOne(query);

    res.send(result).status(200);
  } catch (err) {
    console.error(err);
    res.status(500).send("Error deleting profile");
  }
});

export default router;