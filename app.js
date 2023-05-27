require("dotenv").config();
const express = require('express');
const { exec } = require('child_process');
const {User} = require("./model");
const {STATUS} = require("./constants");


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
    try {
      const users = await User.find();
      exec('echo "./runner.sh -g" > runner.pipe')
      res.status(200);
      res.send(users);
    } catch (e) {
      res.status(400)
      console.log('error')
    }
  });

  app.post('/user', async (req, res)=>{
    try {
      const {data: users} = req.body
      const mappedUsers = users.map(user =>{
        const {name, email} = user;
        return {
            name,
            email,
            status: STATUS.normal,
            createdDate: new Date().getTime(),
            updatedDate: new Date().getTime()
        }
      });
      await User.insertMany(mappedUsers)
      res.status(200)
      res.send('Success')
    } catch (e) {
      res.status(400)
      console.log('error', e)
    }
  });

  app.put('/user', async (req,res) => {
    try {
      const {names, action} = req.body.data;
      for (const name of names) {
        if (action === STATUS.disabled) {
          await User.findOneAndUpdate({name, status: {$in: [STATUS.enabled, STATUS.normal]}}, {status: STATUS.disabled, updatedDate: new Date().getTime()})
        } else if (action === STATUS.enabled) {
          await User.findOneAndUpdate({name, status: {$in: [STATUS.disabled, STATUS.normal]}}, {status: STATUS.enabled, updatedDate: new Date().getTime()})
        }
      }
      const namesString = names.join(" ");
      if (action === STATUS.disabled) {
        exec(`echo "./runner.sh -r ${namesString}" > runner.pipe`)
      } else if (action === STATUS.enabled) {
        exec(`echo "./runner.sh -s ${namesString}" > runner.pipe`)
      }
      res.status(200)
      res.send('Success')
    } catch (e) {
      res.status(400)
      console.log('error')
    }
  })

  app.listen(PORT, (error) =>{
      if(!error)
        console.log("Server is Successfully Running, and App is listening on port "+ PORT)
      else
        console.log("Error occurred, server can't start", error);
    }
  );
})()

