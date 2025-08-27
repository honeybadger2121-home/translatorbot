const db = require('./db');
const { detectLanguage, translate } = require('./translate');

// Store guild auto-translation settings
const guildSettings = new Map();

module.exports = {
  name: 'messageCreate',
  async execute(message, client) {
    // ignore bots and DMs
    if (message.author.bot || !message.guild) return;

    // skip empty messages or commands
    if (!message.content || message.content.trim() === '' || message.content.startsWith('/')) return;

    try {
      // Auto-translate for users with language preferences
      await handleUserAutoTranslation(message);
      
      // Auto-translate for guild-wide settings (if enabled)
      await handleGuildAutoTranslation(message);
      
    } catch (err) {
      console.error('Auto-translation error:', err);
    }
  }
};

// Handle individual user auto-translation preferences
async function handleUserAutoTranslation(message) {
  const targetLang = db.getUserLang(message.author.id);
  if (!targetLang) return;

  try {
    // detect original language
    const detected = await detectLanguage(message.content);
    if (detected === targetLang) return;

    // perform translation
    const translated = await translate(message.content, targetLang);

    // Try to send DM first, fall back to channel reply if DM fails
    try {
      await message.author.send({
        embeds: [
          {
            title: '🔄 Auto Translation',
            description: `Message from **${message.guild.name}** #${message.channel.name}`,
            fields: [
              { name: 'Original', value: message.content },
              { name: `Translated (${detected} → ${targetLang})`, value: translated }
            ],
            timestamp: new Date(),
            color: 0x00AE86,
            footer: { text: 'Use /setlang to change your language or disable auto-translation' }
          }
        ]
      });
    } catch (dmError) {
      // If DM fails, send a short reply in the channel
      const reply = await message.reply({
        embeds: [
          {
            description: `🔄 **${detected} → ${targetLang}:** ${translated}`,
            color: 0x00AE86
          }
        ]
      });
      
      // Delete the reply after 10 seconds to keep chat clean
      setTimeout(() => {
        reply.delete().catch(() => {});
      }, 10000);
    }
  } catch (err) {
    console.error('User auto-translation error:', err);
  }
}

// Handle guild-wide auto-translation (translate all messages to a common language)
async function handleGuildAutoTranslation(message) {
  const guildLang = guildSettings.get(message.guild.id);
  if (!guildLang) return;

  try {
    const detected = await detectLanguage(message.content);
    if (detected === guildLang) return;

    const translated = await translate(message.content, guildLang);

    // Add a reaction to the original message to show it was translated
    await message.react('🔄');

    // Send translation as a reply
    const reply = await message.reply({
      embeds: [
        {
          description: `🌐 **${detected} → ${guildLang}:** ${translated}`,
          color: 0x4169E1,
          footer: { text: 'Guild auto-translation enabled' }
        }
      ]
    });

    // Delete after 15 seconds to keep chat clean
    setTimeout(() => {
      reply.delete().catch(() => {});
    }, 15000);

  } catch (err) {
    console.error('Guild auto-translation error:', err);
  }
}

// Export functions for guild settings management
module.exports.setGuildLang = (guildId, lang) => {
  guildSettings.set(guildId, lang);
};

module.exports.getGuildLang = (guildId) => {
  return guildSettings.get(guildId);
};

module.exports.disableGuildTranslation = (guildId) => {
  guildSettings.delete(guildId);
};
