const autoBind = require('auto-bind');
const { successStatus, createdCode, successCode } = require('../../utils/consts');
const ActivityEnums = require('../../utils/activity_enums');

class PlaylistHandler {
  constructor(
    playlistService,
    playlistSongsService,
    playlistActivitiesService,
    collaborationService,
    songService,
    validator,
  ) {
    this._playlistService = playlistService;
    this._playlistSongsService = playlistSongsService;
    this._playlistActivitiesService = playlistActivitiesService;
    this._collaborationService = collaborationService;
    this._songService = songService;
    this._validator = validator;

    autoBind(this);
  }

  async postPlaylistHandler(request, h) {
    this._validator.validatePlaylistsPayload(request.payload);
    const { name } = request.payload;
    const { id } = request.auth.credentials;
    const playlistId = await this._playlistService.addPlaylists(name, id);
    const response = h.response({
      status: successStatus,
      message: 'Playlist added successfully',
      data: { playlistId },
    });
    response.code(createdCode);
    return response;
  }

  async getPlaylistsHandler(request, h) {
    const playlists = await this._playlistService.getPlaylists(request.auth.credentials);
    const response = h.response({
      status: successStatus,
      data: { playlists },
    });
    response.code(successCode);
    return response;
  }

  async deletePlaylistsByIdHandler(request, h) {
    const { id } = request.params;
    const { id: credentialId } = request.auth.credentials;
    await this._playlistService.verifyPlaylistOwner(id, credentialId);
    await this._playlistService.deletePlaylistsById(id);
    const response = h.response({
      status: successStatus,
      message: 'Playlist deleted successfully',
    });
    response.code(successCode);
    return response;
  }

  async postSongToPlaylistHandler(request, h) {
    this._validator.validateSongPlaylistPayload(request.payload);
    const { id } = request.params;
    const { id: credentialId } = request.auth.credentials;
    const { songId } = request.payload;
    await this._playlistService.verifyPlaylistsAccess(id, credentialId, this._collaborationService);
    await this._songService.verifySongExist(songId);
    await this._playlistSongsService.addSongToPlaylist(id, songId);
    await this._playlistActivitiesService.addPlaylistActivity(
      id,
      songId,
      credentialId,
      ActivityEnums.Add,
    );
    const response = h.response({
      status: successStatus,
      message: 'Song has been added to playlist',
    });
    response.code(createdCode);
    return response;
  }

  async getSongsFromPlaylistHandler(request, h) {
    const { id } = request.params;
    const { id: credentialId } = request.auth.credentials;
    await this._playlistService.verifyPlaylistsAccess(id, credentialId, this._collaborationService);
    const playlist = await this._playlistService.getPlaylistById(id);
    const songs = await this._playlistSongsService.getSongsFromPlaylist(id);
    const songsPlaylist = { ...playlist, songs };
    const response = h.response({
      status: successStatus,
      data: {
        playlist: songsPlaylist,
      },
    });
    response.code(successCode);
    return response;
  }

  async deleteSongFromPlaylistHandler(request, h) {
    this._validator.validateSongPlaylistPayload(request.payload);
    const { id } = request.params;
    const { id: credentialId } = request.auth.credentials;
    const { songId } = request.payload;
    await this._playlistService.verifyPlaylistsAccess(id, credentialId, this._collaborationService);
    await this._playlistSongsService.deleteSongFromPlaylist(id, songId);
    await this._playlistActivitiesService.addPlaylistActivity(
      id,
      songId,
      credentialId,
      ActivityEnums.Delete,
    );
    const response = h.response({
      status: successStatus,
      message: 'Song has been deleted from playlist',
    });
    response.code(successCode);
    return response;
  }

  async getPlaylistActivityHandler(request, h) {
    const { id } = request.params;
    const { id: credentialId } = request.auth.credentials;
    await this._playlistService.verifyPlaylistsAccess(id, credentialId, this._collaborationService);
    const activities = await this._playlistActivitiesService.getPlaylistActivities(id);
    const response = h.response({
      status: successStatus,
      data: {
        playlistId: id,
        activities,
      },
    });
    response.code(successCode);
    return response;
  }
}

module.exports = PlaylistHandler;
