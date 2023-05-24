require("dotenv").config();
const express = require('express');
const { exec } = require('child_process');
const mongoose = require("mongoose").default;
const { customAlphabet } = require('nanoid');
// const customAlphabet = import(() => require('nanoid/async'))
const nanoid = customAlphabet('abcdefghijklmnopqrstuvwxyz', 10);


(async function() {
  const app = express();
  const PORT = 3000;
  await mongoose.connect(process.env.MONGODB_URI);
  const userSchema = new mongoose.Schema({
    name: {
      type: String,
      required: true,
      unique: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    phone: {
      type: String,
      required: true,
      unique: true,
    },
    createdDate: Date,
    updatedDate: Date,
  });
  const User = mongoose.model('User', userSchema);

  app.use(express.json());       // to support JSON-encoded bodies
  app.use(express.urlencoded());


  app.get('/ping', (req, res)=>{
    res.status(200);
    res.send("pong");
  });

  app.get('/user', async (req, res)=>{
    const users = await User.find();
    exec('cd ../wireguard && sh runner.sh -g')
    res.status(200);
    res.send(users);
  });

  app.post('/user', async (req, res)=>{
    try {
      const {email, phone} = req.body
      const name = await nanoid();
      const user = new User({
        name,
        email,
        phone,
        createdDate: new Date().getTime(),
        updatedDate: new Date().getTime()
      })
      await user.save()
      exec(`cd ../wireguard && sh runner.sh -s ${name}`)
      res.status(200)
      res.send('Success')
    } catch (e) {
      res.status(400)
      console.log('error')
    }
  });

  app.delete('/user/:name', async (req, res)=>{
    try {
      const user = await User.findOne({name: req.params.name}).exec();
      await User.findOneAndDelete({name: req.params.name})
      exec(`cd ../wireguard && sh runner.sh -r ${user.name}`)
      res.status(200)
      res.send('Success')
    }catch (e) {
      res.status(400)
      console.log('error')
    }
  });

  app.listen(PORT, (error) =>{
      if(!error)
        console.log("Server is Successfully Running, and App is listening on port "+ PORT)
      else
        console.log("Error occurred, server can't start", error);
    }
  );
})()

