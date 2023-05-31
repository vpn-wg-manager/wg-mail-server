require("dotenv").config();
const {MAIL_USER} = process.env;

const configureParams = (params) => {
  const {email, fileName, subject, text, html} = params
  const peerName = `peer_${fileName}`;
  const getPath = (ext) => {
    return `./vpn_files/${peerName}/${peerName}.${ext}`
  }
  const res = {
    from: MAIL_USER,
    to: email,
    subject,
  }
  if (text) res.text = text
  if (fileName) res.attachments = [
    {
      path: getPath('conf')
    },
    {
      path: getPath('png')
    }
  ]
  if (html) res.html = html
  return res
}

module.exports = {
  configureParams
}
