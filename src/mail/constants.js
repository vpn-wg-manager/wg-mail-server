const WIREGUARD_LINK = {
  ios: 'https://apps.apple.com/ru/app/wireguard/id1441195209',
  android: 'https://play.google.com/store/apps/details?id=com.wireguard.android',
  windows_installer: 'https://download.wireguard.com/windows-client/wireguard-installer.exe',
  macos: 'https://itunes.apple.com/us/app/wireguard/id1451685025?ls=1&mt=12',
  officialSite: 'https://www.wireguard.com/install/'

}

const DEFAULT_TEXT_BOTTOM = `<br><br>
<p>Приложениe:</p>
<p><a href="${WIREGUARD_LINK.ios}">Wireguard ios</a></p>
<p><a href="${WIREGUARD_LINK.android}">Wireguard android</a></p>
<p><a href="${WIREGUARD_LINK.macos}">Wireguard macOS</a></p>
<p><a href="${WIREGUARD_LINK.windows_installer}">Wireguard windows installer</a></p>
<p><a href="${WIREGUARD_LINK.officialSite}">other installers (official site)</a></p>
`

module.exports = {
  DEFAULT_TEXT_BOTTOM
}
