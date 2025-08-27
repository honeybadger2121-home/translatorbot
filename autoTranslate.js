const { SlashCommandBuilder, PermissionFlagsBits } = require('discord.js');
const messageCreate = require('./messageCreate');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('autotranslate')
    .setDescription('Configure guild-wide auto-translation settings')
    .addSubcommand(subcommand =>
      subcommand
        .setName('enable')
        .setDescription('Enable auto-translation for all messages in this guild')
        .addStringOption(option =>
          option
            .setName('language')
            .setDescription('Target language for translations (e.g., english, spanish)')
            .setRequired(true)))
    .addSubcommand(subcommand =>
      subcommand
        .setName('disable')
        .setDescription('Disable guild-wide auto-translation'))
    .addSubcommand(subcommand =>
      subcommand
        .setName('status')
        .setDescription('Check current auto-translation settings'))
    .setDefaultMemberPermissions(PermissionFlagsBits.ManageGuild),

  async execute(interaction) {
    const subcommand = interaction.options.getSubcommand();

    try {
      switch (subcommand) {
        case 'enable':
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
          messageCreate.setGuildLang(interaction.guild.id, lang);
          
          await interaction.reply({
            embeds: [{
              title: '✅ Guild Auto-Translation Enabled',
              description: `All messages will now be automatically translated to **${lang}**`,
              fields: [
                { name: 'How it works:', value: '• Messages in other languages will show a translation reply\n• Original messages get a 🔄 reaction\n• Translation replies auto-delete after 15 seconds' },
                { name: 'Note:', value: 'Individual users can still set personal preferences with `/setlang`' }
              ],
              color: 0x00FF00
            }]
          });
          break;

        case 'disable':
          messageCreate.disableGuildTranslation(interaction.guild.id);
          await interaction.reply({
            embeds: [{
              title: '❌ Guild Auto-Translation Disabled',
              description: 'Guild-wide auto-translation has been turned off',
              fields: [
                { name: 'Individual Settings:', value: 'Users can still receive personal translations via DM using `/setlang`' }
              ],
              color: 0xFF0000
            }]
          });
          break;

        case 'status':
          const currentLang = messageCreate.getGuildLang(interaction.guild.id);
          
          if (currentLang) {
            await interaction.reply({
              embeds: [{
                title: '📊 Auto-Translation Status',
                fields: [
                  { name: 'Guild Auto-Translation:', value: `✅ Enabled (${currentLang})` },
                  { name: 'Individual Settings:', value: 'Users can set personal preferences with `/setlang`' }
                ],
                color: 0x00AE86
              }]
            });
          } else {
            await interaction.reply({
              embeds: [{
                title: '📊 Auto-Translation Status',
                fields: [
                  { name: 'Guild Auto-Translation:', value: '❌ Disabled' },
                  { name: 'Individual Settings:', value: 'Users can still set personal preferences with `/setlang`' },
                  { name: 'Enable:', value: 'Use `/autotranslate enable <language>` to enable guild-wide translation' }
                ],
                color: 0x808080
              }]
            });
          }
          break;
      }
    } catch (error) {
      console.error('Auto-translate command error:', error);
      await interaction.reply({ 
        content: 'There was an error managing auto-translation settings. Please try again.', 
        ephemeral: true 
      });
    }
  }
};
