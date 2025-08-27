const { joinVoiceChannel, EndBehaviorType, createAudioReceiver } = require('@discordjs/voice');
const speech = require('@google-cloud/speech');
const db = require('./db');
const { translate } = require('./translate');
const prism = require('prism-media');
const speechClient = new speech.SpeechClient();

const activeSessions = new Map();

module.exports = (client) => {
  client.on('voiceTranslateStart', async (interaction, voiceChannel) => {
    const connection = joinVoiceChannel({
      channelId: voiceChannel.id,
      guildId: voiceChannel.guild.id,
      adapterCreator: voiceChannel.guild.voiceAdapterCreator
    });

    const receiver = connection.receiver;
    const languageCode = db.getUserLang(interaction.user.id) || 'en';

    const requestConfig = {
      encoding: 'LINEAR16',
      sampleRateHertz: 48000,
      languageCode: 'auto'
    };
    const request = { config: requestConfig, interimResults: false };

    const recognizeStream = speechClient
      .streamingRecognize(request)
      .on('data', async (data) => {
        const text = data.results[0] && data.results[0].alternatives[0].transcript;
        if (!text) return;
        const translated = await translate(text, languageCode);

        interaction.channel.send({
          embeds: [
            {
              title: 'Voice Translation',
              fields: [
                { name: 'Speech', value: text },
                { name: `Translated → ${languageCode}`, value: translated }
              ],
              color: 0xFFA500,
              timestamp: new Date()
            }
          ]
        });
      })
      .on('error', console.error);

    // Pipe each user’s audio into the speech recognize stream
    receiver.speaking.on('start', (userId) => {
  const opusStream = receiver.subscribe(userId, { end: { behavior: EndBehaviorType.AfterSilence, duration: 1000 } });
  // Decode Opus → PCM (signed 16-bit LE, 48kHz)
  const decoder = new prism.opus.Decoder({ frameSize: 960, channels: 1, rate: 48000 });
  const pcmStream = opusStream.pipe(decoder);
  pcmStream.pipe(recognizeStream, { end: false });
    });

    activeSessions.set(interaction.guildId, connection);
  });

  client.on('voiceTranslateStop', (interaction) => {
    const conn = activeSessions.get(interaction.guildId);
    if (conn) conn.destroy();
    activeSessions.delete(interaction.guildId);
  });
};
