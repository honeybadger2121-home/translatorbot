const { ContextMenuCommandBuilder, ApplicationCommandType } = require('discord.js');
const db = require('./db');
const { detectLanguage, translate } = require('./translate');

module.exports = {
  data: new ContextMenuCommandBuilder()
    .setName('Translate Message')
    .setType(ApplicationCommandType.Message),
  async execute(interaction) {
    try {
      await interaction.deferReply({ ephemeral: true });

      const original = interaction.targetMessage.content;
      if (!original || original.trim() === '') {
        return interaction.editReply('This message has no text content to translate.');
      }

      const userLang = db.getUserLang(interaction.user.id) || 'en';

      const srcLang = await detectLanguage(original);
      if (srcLang === userLang) {
        return interaction.editReply('This message is already in your preferred language.');
      }

      const translated = await translate(original, userLang);
      await interaction.editReply({
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
    } catch (error) {
      console.error('Translation error:', error);
      try {
        if (interaction.deferred) {
          await interaction.editReply({ content: 'There was an error translating this message. Please try again later.' });
        } else {
          await interaction.reply({ content: 'There was an error translating this message. Please try again later.', ephemeral: true });
        }
      } catch (replyError) {
        console.error('Error sending error message:', replyError);
      }
    }
  }
};
