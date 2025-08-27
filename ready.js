const { REST, Routes } = require('discord.js');
require('dotenv').config();

module.exports = {
  name: 'clientReady',
  once: true,
  async execute(client) {
    console.log(`Logged in as ${client.user.tag}`);

    const commands = [];
    const commandFiles = ['setLang.js', 'getLang.js', 'startVoice.js', 'stopVoice.js', 'translateMessage.js', 'autoTranslate.js'];
    
    console.log('Loading commands...');
    for (const file of commandFiles) {
      try {
        const command = require(`./${file}`);
        commands.push(command.data.toJSON());
        console.log(`✅ Loaded command: ${command.data.name}`);
      } catch (error) {
        console.error(`❌ Failed to load command ${file}:`, error);
      }
    }

    try {
      const rest = new REST({ version: '10' }).setToken(process.env.DISCORD_TOKEN);
      console.log('Registering slash commands...');
      
      const data = await rest.put(
        Routes.applicationCommands(client.user.id),
        { body: commands }
      );
      
      console.log(`✅ Successfully registered ${data.length} slash commands.`);
    } catch (error) {
      console.error('❌ Failed to register commands:', error);
    }
  }
};
