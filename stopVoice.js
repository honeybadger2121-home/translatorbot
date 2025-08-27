
const { SlashCommandBuilder } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('stopvoice')
    .setDescription('Stop real-time voice translation and leave channel.'),
  async execute(interaction, client) {
    client.emit('voiceTranslateStop', interaction);
    await interaction.reply({ content: 'Stopped voice translation.', ephemeral: true });
  }
};
