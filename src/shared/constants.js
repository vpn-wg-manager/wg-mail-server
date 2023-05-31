const STATUS = {
  normal: 'normal',
  disabled: 'disabled',
  enabled: 'enabled'
}

const EMAIL_STATUS = {
  waiting: 'waiting',
  sending: 'sending',
  sent: 'sent',
  error: 'error',
}

const EMAIL_TYPE = {
  create_vpn: 'create_vpn',
  disable_after_week: 'disable_after_week',
  disable_after_day: 'disable_after_day'
}


module.exports = {
  STATUS,
  EMAIL_STATUS,
  EMAIL_TYPE
}
