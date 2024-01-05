const amqp = require('amqplib');
const Listener = require('./listener');
const MailSender = require('./mail_sender');
const PlaylistService = require('./playlist_service');

require('dotenv').config();

const init = async () => {
  const mailSender = new MailSender();
  const playlistService = new PlaylistService();
  const listener = new Listener(playlistService, mailSender);
  const connection = await amqp.connect(process.env.RABBITMQ_SERVER);
  const channel = await connection.createChannel();
  await channel.assertQueue('export:playlist', { durable: true });
  await channel.consume('export:playlist', listener.listen, { noAck: true });
};

init();
