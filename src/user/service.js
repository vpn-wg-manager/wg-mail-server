const {UserRepository} = require('./repository')
const {STATUS} = require("../shared/constants");

class UserService {
  static async findMany(params) {
    try {
      const innerParams = {};
      if (params?.ids) innerParams._id = {$in: [...params.ids.split(',')]}
      if (params?.emails) innerParams.email = {$in: [...params.emails.split(',')]}
      if (params?.statuses) innerParams.status = {$in: [...params.statuses.split(',')]}
      if (params?.names) innerParams.name = {$in: [...params.names.split(',')]}
      return UserRepository.findAll(innerParams)
    } catch (e) {
      throw e
    }
  }

  static async createMany(data) {
    try {
      const mappedUsers = data.map(user =>{
        const {name, email} = user;
        return {
          name,
          email,
          status: STATUS.normal,
          createdDate: new Date().getTime(),
          updatedDate: new Date().getTime()
        }
      });
      return UserRepository.saveMany(mappedUsers)
    } catch (e) {
      throw e
    }
  }

  static async updateMany({names, action}) {
    try {
      const res = []
      let status;
      switch (action) {
        case STATUS.enabled:
          status = STATUS.enabled
          break;
        case STATUS.disabled:
          status = STATUS.disabled;
          break
        case STATUS.normal:
          status = STATUS.normal;
          break
        default:
          status = STATUS.normal
          break;
      }
      for (const name of names) {
        const updatedOne = await UserRepository.updateOne({name, status})
        if (updatedOne) res.push(updatedOne)
      }
      return res;
    } catch (e) {
      throw e
    }
  }
}

module.exports = {
  UserService
}
