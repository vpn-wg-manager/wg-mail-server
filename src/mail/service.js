const {MailRepository} = require('./repository')
const {EMAIL_STATUS} = require("../shared/constants");
const {configureParams} = require("./helpers");
const {Mail} = require("./model");

class MailService {
  static async findOne(params) {
    try {
      let innerParams = {};
      if (params?.status) innerParams.status = {$in: params.status}
      return MailRepository.findOne(innerParams)
    } catch (e) {
      throw e
    }
  }

  static async createMany(users, type) {
    try {
      const preparedMails = users.map(user => {
        return {
          client_email: user.email,
          name: user.name,
          status: EMAIL_STATUS.waiting,
          type,
          response:null,
          createdDate: new Date().getTime(),
          updatedDate: null,
        }
      })
      return MailRepository.saveMany(preparedMails)
    } catch (e) {
      throw e
    }
  }

  static async createOne(params) {
    try {
      const mail = {
        client_email: params.email,
        name: params.name,
        status: EMAIL_STATUS.waiting,
        type: params.type,
        response:null,
        createdDate: new Date().getTime(),
        updatedDate: null,
      }
      return MailRepository.saveOne(mail)
    } catch (e) {
      throw e
    }
  }

  static async updateOne({name, status, response}) {
    try {
      const params = {name, status}
      if (response) params.response = response
        await MailRepository.updateOne(params)
    } catch (e) {
      throw e
    }
  }

  static async sendToMail(transporter, {name, email, fileName, subject, html}) {
    try {
      await MailService.updateOne({name, status: EMAIL_STATUS.sending})
      const params = {
        email,
        subject,
        html
      }
      if (fileName) params.fileName = fileName
      const configuredParams = configureParams(params)
      await transporter.sendMail(configureParams(params), async (err, info) => {
        await MailService.updateOne({name, status: EMAIL_STATUS.sent, response: info.response})
      })
    } catch (e) {
      throw e
    }
  }
}

module.exports = {
  MailService
}
