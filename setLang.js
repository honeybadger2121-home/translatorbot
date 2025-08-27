const { SlashCommandBuilder } = require('discord.js');
const db = require('./db');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('setlang')
    .setDescription('Set your preferred language (ISO code, e.g. en, es, fr).')
    .addStringOption(option =>
      option
        .setName('language')
        .setDescription('ISO language code')
        .setRequired(true)),
  async execute(interaction) {
    const langInput = interaction.options.getString('language').toLowerCase();
    
    // Map common language names to codes
    const languageMap = {
      'english': 'en',
      'spanish': 'es',
      'french': 'fr',
      'german': 'de',
      'italian': 'it',
      'portuguese': 'pt',
      'russian': 'ru',
      'japanese': 'ja',
      'chinese': 'zh',
      'korean': 'ko',
      'arabic': 'ar'
    };
    
    const lang = languageMap[langInput] || langInput;
    
    try {
      db.setUserLang(interaction.user.id, lang);
      await interaction.reply(`Your preferred language has been set to \`${lang}\`.`);
    } catch (error) {
      console.error('Error setting language:', error);
      await interaction.reply({ content: 'There was an error setting your language. Please try again.', ephemeral: true });
    }
  }
};
