const {User: UserModel} = require('./model')



class UserRepository {
  static async findAll(params) {
    return UserModel.find(params).exec()
  }

  static async saveMany(users) {
    return UserModel.insertMany(users)
  }

  static async updateOne({name, status}) {
    const wasUpdated = await UserModel.findOneAndUpdate({name, status: {$ne: status}}, {status, updatedDate: new Date().getTime()})
    if (wasUpdated) {
      return UserModel.findOne({name})
    }
  }
}

module.exports = {
  UserRepository
}
