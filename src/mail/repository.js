const {Mail: MailModel} = require('./model')

class MailRepository {
  static async findOne(params) {
    return MailModel.findOne(params).exec()
  }

  static async updateOne({name, status, response}) {
    const params = {name, status}
    if (response) params.response = response;
    const updated = await MailModel.findOneAndUpdate({name, status: {$ne: status}}, {...params, updatedDate: new Date().getTime()})
    if (updated) {
      return this.findOne({name})
    }
  }

  static async saveMany(params) {
    await MailModel.insertMany(params)
  }
}

module.exports = {
  MailRepository
}
