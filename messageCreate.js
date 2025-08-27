const db = require('./db');
const { detectLanguage, translate } = require('./translate');

module.exports = {
  name: 'messageCreate',
  async execute(message) {
    // ignore bots and DMs
    if (message.author.bot || !message.guild) return;

    // fetch user preference
    const targetLang = db.getUserLang(message.author.id);
    if (!targetLang) return;

    try {
      // detect original language
      const detected = await detectLanguage(message.content);
      if (detected === targetLang) return;

      // perform translation
      const translated = await translate(message.content, targetLang);

      // send user a DM with the result
      await message.author.send({
        embeds: [
          {
            title: 'Translation',
            fields: [
              { name: 'Original', value: message.content },
              { name: `Translated (${detected} → ${targetLang})`, value: translated }
            ],
            timestamp: new Date(),
            color: 0x00AE86
          }
        ]
      });
    } catch (err) {
      console.error('Translation error:', err);
    }
  }
};
