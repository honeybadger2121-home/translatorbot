const { ContextMenuCommandBuilder, ApplicationCommandType } = require('discord.js');
const db = require('./db');
const { detectLanguage, translate } = require('./translate');

module.exports = {
  data: new ContextMenuCommandBuilder()
    .setName('Translate Message')
    .setType(ApplicationCommandType.Message),
  async execute(interaction) {
    await interaction.deferReply({ ephemeral: true });

    const original = interaction.targetMessage.content;
    const userLang = db.getUserLang(interaction.user.id) || 'en';

    const srcLang = await detectLanguage(original);
    if (srcLang === userLang) {
      return interaction.editReply('This message is already in your preferred language.');
    }

    const translated = await translate(original, userLang);
    interaction.editReply({
      embeds: [
        {
          title: `Translation (${srcLang} → ${userLang})`,
          fields: [
            { name: 'Original', value: original },
            { name: 'Translated', value: translated }
          ],
          color: 0x00AE86,
          timestamp: new Date()
        }
      ]
    });
  }
};
