require("dotenv").config();
const express = require('express');
const { exec } = require('child_process');
const { customAlphabet } = require('nanoid');
const { mongoose } = require('./db.config');
const {User} = require("./model");
const {STATUS} = require("./constants");
const nanoid = customAlphabet('abcdefghijklmnopqrstuvwxyz', 10);


(async function() {
  const app = express();
  const PORT = 3000;

  app.use(express.static('public'));
  app.use(express.json());
  app.use(express.urlencoded());


  app.get('/test', (req, res)=>{
    res.status(200);
    res.send("test route");
  });

  app.get('/ping', (req, res)=>{
    res.status(200);
    res.send("pong");
  });

  app.get('/user', async (req, res)=>{
    const users = await User.find();
    exec('echo "./runner.sh -g" > runner.pipe')
    res.status(200);
    res.send(users);
  });

  app.post('/user', async (req, res)=>{
    try {
      const {email, phone} = req.body
      const name = nanoid();
      const user = new User({
        name,
        email,
        phone,
        status: STATUS.normal,
        createdDate: new Date().getTime(),
        updatedDate: new Date().getTime()
      })
      await user.save()
      exec(`echo "./runner.sh -s ${name}" > runner.pipe`)
      res.status(200)
      res.send('Success')
    } catch (e) {
      res.status(400)
      console.log('error')
    }
  });

  app.delete('/user/:name', async (req, res)=>{
    try {
      const user = await User.findOne({name: req.params.name.toLowerCase()}).exec();
      await User.findOneAndUpdate({name: req.params.name.toLowerCase()}, {status: STATUS.disabled})
      exec(`echo "./runner.sh -r ${user.name}" > runner.pipe`)
      res.status(200)
      res.send('Success')
    }catch (e) {
      res.status(400)
      console.log('error')
    }
  });

  app.get('/user/:name/approve', async (req, res)=>{
    try {
      const user = await User.findOne({name: req.params.name.toLowerCase()}).exec();
      await User.findOneAndUpdate({name: req.params.name.toLowerCase()}, {status: STATUS.enabled})
      exec(`echo "./runner.sh -s ${user.name}" > runner.pipe`)
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

