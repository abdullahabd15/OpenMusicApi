const autoBind = require('auto-bind');

class Listener {
  constructor(playlistService, mailSender) {
    this._playlistService = playlistService;
    this._mailSender = mailSender;

    autoBind(this);
  }

  async listen(message) {
    try {
      const { playlistId, targetEmail } = JSON.parse(message.content.toString());
      const playlist = await this._playlistService.getPlaylistWithSongs(playlistId);
      await this._mailSender.sendMail(targetEmail, JSON.stringify(playlist));
    } catch (error) {
      // eslint-disable-next-line no-console
      console.log(error);
    }
  }
}

module.exports = Listener;
