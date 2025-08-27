const { SlashCommandBuilder } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('startvoice')
    .setDescription('Join your voice channel and start real-time translation.'),
  async execute(interaction, client) {
    const memberVc = interaction.member.voice.channel;
    if (!memberVc) {
      return interaction.reply({ content: 'You must be in a voice channel.', ephemeral: true });
    }

    // Delegate to voice handler
    client.emit('voiceTranslateStart', interaction, memberVc);
    await interaction.reply({ content: 'Joining & translating speech…', ephemeral: true });
  }
};
