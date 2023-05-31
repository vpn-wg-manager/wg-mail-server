require("dotenv").config();
const express = require('express');
const { exec } = require('child_process');
const {User, Mail} = require("./model");
const {STATUS, EMAIL_STATUS} = require("./constants");
const mailService = require('./mailService');
const {configureParams} = require("./helpers");

(async function() {
  const app = express();
  const PORT = 3000;

  app.use(express.static('public'));
  app.use(express.json());
  app.use(express.urlencoded());

  // await mailService.main();


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
          const user = await User.findOne({name}).exec();
          if (!user.email || !user.name) return;
          await Mail.create({
            client_email: user.email,
            name: user.name,
            status: EMAIL_STATUS.waiting,
            response: null,
            createdDate: new Date().getTime(),
            updatedDate: null
          })
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

  setInterval(async () => {
    try {
      const waitingMails = await Mail.find({status: EMAIL_STATUS.waiting}).exec()
      console.log('waiting mails', waitingMails)
      for (const mail of waitingMails) {
        await Mail.findOneAndUpdate({name: mail.name}, {
          status: EMAIL_STATUS.sending,
          updatedDate: new Date().getTime()
        })
        const params = {
          email: mail.client_email,
          fileName: mail.name,
          subject: 'Access',
          text: 'some text here!'
        }
        console.log('params', params)
        const transporter = await mailService.main();
        await transporter.sendMail(configureParams(params), async (err, info) => {
          await Mail.findOneAndUpdate({name: mail.name}, {
            status: EMAIL_STATUS.sent,
            response: info.response,
            updatedDate: new Date().getTime()
          })
        })
      }
    } catch (e) {
      console.log('error')
    }
  }, 1000 * 10)


  app.listen(PORT, (error) =>{
      if(!error)
        console.log("Server is Successfully Running, and App is listening on port "+ PORT)
      else
        console.log("Error occurred, server can't start", error);
    }
  );
})()

