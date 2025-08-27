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
    const lang = interaction.options.getString('language').toLowerCase();
    db.setUserLang(interaction.user.id, lang);
    await interaction.reply(`Your preferred language has been set to \`${lang}\`.`);
  }
};
