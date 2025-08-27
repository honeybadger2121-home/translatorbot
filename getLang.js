const { SlashCommandBuilder } = require('discord.js');
const db = require('./db');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('getlang')
    .setDescription('View your preferred language.'),
  async execute(interaction) {
    try {
      const lang = db.getUserLang(interaction.user.id);
      
      if (lang) {
        await interaction.reply({
          embeds: [{
            title: '🌐 Your Language Settings',
            fields: [
              { name: 'Preferred Language:', value: `**${lang}** (Auto-translation enabled)` },
              { name: 'Status:', value: '✅ You will receive automatic translations via DM' },
              { name: 'Change Language:', value: 'Use `/setlang <language>` to change' },
              { name: 'Disable:', value: 'Use `/setlang off` to turn off auto-translation' }
            ],
            color: 0x00AE86
          }]
        });
      } else {
        await interaction.reply({
          embeds: [{
            title: '🌐 Your Language Settings',
            fields: [
              { name: 'Preferred Language:', value: '❌ Not set (Auto-translation disabled)' },
              { name: 'Enable Auto-Translation:', value: 'Use `/setlang <language>` to enable\nExample: `/setlang english`' },
              { name: 'Manual Translation:', value: 'You can still use:\n• Right-click → "Translate Message"\n• Manual translation commands' }
            ],
            color: 0x808080
          }]
        });
      }
    } catch (error) {
      console.error('Error getting language:', error);
      await interaction.reply({ content: 'There was an error retrieving your language preference.', ephemeral: true });
    }
  }
};
