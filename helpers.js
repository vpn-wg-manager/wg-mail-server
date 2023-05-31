require("dotenv").config();
const {MAIL_USER} = process.env;

const configureParams = (params) => {
  const {email, fileName, subject, text} = params
  const peerName = `peer_${fileName}`;
  const getPath = (ext) => {
    return `./vpn_files/${peerName}/${peerName}.${ext}`
  }
  return {
    from: MAIL_USER,
    to: email,
    subject,
    text,
    attachments: [
      {
        path: getPath('conf')
      },
      {
        path: getPath('png')
      }
    ]
  }
}

module.exports = {
  configureParams
}
