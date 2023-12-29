const Joi = require('joi');

const playlistsSchema = Joi.object({
  name: Joi.string().required(),
});

const songPlaylistSchema = Joi.object({
  songId: Joi.string().max(50).required(),
});

module.exports = { playlistsSchema, songPlaylistSchema };
