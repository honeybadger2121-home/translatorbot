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
    
    // Handle "none", "off", "disable" to turn off auto-translation
    if (['none', 'off', 'disable', 'stop'].includes(langInput)) {
      try {
        db.setUserLang(interaction.user.id, null);
        await interaction.reply({
          embeds: [{
            title: '❌ Auto-Translation Disabled',
            description: 'You will no longer receive automatic translations via DM',
            fields: [
              { name: 'Manual Translation:', value: 'You can still use:\n• `/translate` command\n• Right-click → "Translate Message"' },
              { name: 'Re-enable:', value: 'Use `/setlang <language>` to turn auto-translation back on' }
            ],
            color: 0xFF0000
          }]
        });
        return;
      } catch (error) {
        console.error('Error disabling language:', error);
        await interaction.reply({ content: 'There was an error disabling auto-translation. Please try again.', ephemeral: true });
        return;
      }
    }
    
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
      await interaction.reply({
        embeds: [{
          title: '✅ Auto-Translation Enabled',
          description: `Your preferred language has been set to **${lang}**`,
          fields: [
            { name: 'What happens now:', value: '• You\'ll receive automatic translations via DM\n• Only messages in other languages will be translated\n• Messages in your language will be ignored' },
            { name: 'Privacy:', value: 'Translations are sent as private DMs to you only' },
            { name: 'Disable:', value: 'Use `/setlang off` to turn off auto-translation' }
          ],
          color: 0x00FF00
        }]
      });
    } catch (error) {
      console.error('Error setting language:', error);
      await interaction.reply({ content: 'There was an error setting your language. Please try again.', ephemeral: true });
    }
  }
};
