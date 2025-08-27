const { SlashCommandBuilder } = require('discord.js');
const db = require('./db');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('getlang')
    .setDescription('View your preferred language.'),
  async execute(interaction) {
    try {
      const lang = db.getUserLang(interaction.user.id) || 'not set';
      await interaction.reply(`Your preferred language is currently: \`${lang}\`.`);
    } catch (error) {
      console.error('Error getting language:', error);
      await interaction.reply({ content: 'There was an error retrieving your language preference.', ephemeral: true });
    }
  }
};
