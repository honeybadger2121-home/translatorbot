const { REST, Routes } = require('discord.js');
require('dotenv').config();

module.exports = {
  name: 'clientReady',
  once: true,
  async execute(client) {
    console.log(`Logged in as ${client.user.tag}`);

    const commands = [];
    const commandFiles = ['setLang.js', 'getLang.js', 'startVoice.js', 'stopVoice.js', 'translateMessage.js'];
    for (const file of commandFiles) {
      const command = require(`./${file}`);
      commands.push(command.data.toJSON());
    }

    const rest = new REST({ version: '10' }).setToken(process.env.DISCORD_TOKEN);
    await rest.put(
      Routes.applicationCommands(client.user.id),
      { body: commands }
    );
    console.log('Slash commands registered.');
  }
};
