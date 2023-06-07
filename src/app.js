require("dotenv").config();
const express = require('express');
const { exec } = require('child_process');
const {UserService} = require("./user/service");
const {STATUS, EMAIL_STATUS, EMAIL_TYPE} = require("./shared/constants");
const mailService = require('../mailService');
const {MailService} = require("./mail/service");
const {DEFAULT_TEXT_BOTTOM} = require("./mail/constants");


(async function() {
  const app = express();
  const PORT = process.env.PORT || 3050;

  app.use(express.json());
  app.use(express.urlencoded());

  const transporter = await mailService.create();

  app.get('/ping', (req, res)=>{
    res.status(200);
    res.send("pong");
  });

  app.get('/user', async (req, res)=>{
    try {
      const users = await UserService.findMany(req.query);
      exec('echo "./runner.sh -g" > runner.pipe')
      res.status(200);
      res.send(users);
    } catch (e) {
      res.status(400)
      res.send({error: e})
    }
  });

  app.post('/user', async (req, res)=>{
    try {
      const {data: users} = req.body
      const savedUsers = await UserService.createMany(users)
      res.status(200)
      res.send(savedUsers)
    } catch (e) {
      res.status(400)
      res.send({error: e})
    }
  });

  app.put('/user', async (req,res) => {
    try {
      const {names, action} = req.body.data;
      const updatedUsers = await UserService.updateMany({names, action})
      await MailService.createMany(updatedUsers, EMAIL_TYPE.create_vpn)
      const namesString = updatedUsers.map(user => user.name).join(" ");
      if (action === STATUS.disabled) {
        exec(`echo "./runner.sh -r ${namesString}" > runner.pipe`)
      } else if (action === STATUS.enabled) {
        exec(`echo "./runner.sh -s ${namesString}" > runner.pipe`)
      }
      res.status(200)
      res.send(updatedUsers)
    } catch (e) {
      res.status(400)
      res.send({error: e})
    }
  })

  // TODO for HOST cron
  app.post('/email', async (req,res) => {
    try {
      const {email, name, type} = req.body.data
      await MailService.createOne({email, name, type})
      res.status(200)
    } catch (e) {
      res.status(400)
      res.send({error: e})
    }
  })

  setInterval(async () => {
    try {
      const waitingMail = await MailService.findOne({status: EMAIL_STATUS.waiting})
      if (!waitingMail?._id) return;
      let subject = ''
      let html = ''
      if (waitingMail.type === EMAIL_TYPE.create_vpn) {
        subject = 'Доступ впн!';
        html = `<p>В приложении файлы для доступа к впн.</p>
${DEFAULT_TEXT_BOTTOM}
`
      }
      if (waitingMail.type === EMAIL_TYPE.disable_after_week) {
        subject = 'Осталось 7 дней впн.';
        html=`<p>Осталось 7 дней. Свяжитесь с менеджером для продления.</p>
${DEFAULT_TEXT_BOTTOM}
`
      }
      if (waitingMail.type === EMAIL_TYPE.disable_after_week) {
        subject = 'Остался один день впн.';
        html=`<p>Осталcя 1 день. Свяжитесь с менеджером для продления.</p>
${DEFAULT_TEXT_BOTTOM}
`
      }
      const params = {
        name: waitingMail.name,
        email: waitingMail.client_email,
        // TODO DISABLE FOR DEV
        fileName: waitingMail.type === EMAIL_TYPE.create_vpn ? waitingMail.name : undefined,
        subject,
        html,
      }
      await MailService.sendToMail(transporter, params)
    } catch (e) {
      console.log('error',e)
    }
    // TODO increase time
  }, 1000 * 30)


  app.listen(PORT, (error) =>{
      if(!error)
        console.log("Server is Successfully Running, and App is listening on port "+ PORT)
      else
        console.log("Error occurred, server can't start", error);
    }
  );
})()

