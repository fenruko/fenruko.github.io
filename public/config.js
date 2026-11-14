/* Runtime configuration for the rift.cool site.
 *
 * Plain JavaScript on purpose, so the API host can be changed here (or at
 * deploy time) without rebuilding the site. Same values the dashboard uses.
 *
 * apiBase           The bot's API root, including "/api".
 * discordClientId   OAuth2 application id used for "Log in with Discord".
 */
window.RIFT_CONFIG = {
  apiBase: "https://api.rift.cool/api",
  discordClientId: "1329184069426348052",
};
