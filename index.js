require('dotenv').config();
const { Client, GatewayIntentBits, Collection } = require('discord.js');
const fs = require('fs');
const path = require('path');
const voiceTranslate = require('./voiceTranslate');
const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
    GatewayIntentBits.GuildVoiceStates
  ]
});

// load slash commands
client.commands = new Collection();
const commandFiles = ['setLang.js', 'getLang.js', 'startVoice.js', 'stopVoice.js', 'translateMessage.js'];
for (const file of commandFiles) {
  const command = require(`./${file}`);
  client.commands.set(command.data.name, command);
}

// load events
const eventFiles = ['ready.js', 'messageCreate.js'];
for (const file of eventFiles) {
  const event = require(`./${file}`);
  if (event.once) {
    client.once(event.name, (...args) => event.execute(...args));
  } else {
    client.on(event.name, (...args) => event.execute(...args, client));
  }
}

// handle slash interactions
client.on('interactionCreate', async interaction => {
  console.log(`Received interaction: ${interaction.type} - ${interaction.commandName || 'unknown'}`);
  
  if (!interaction.isCommand() && !interaction.isContextMenuCommand()) return;
  const cmd = client.commands.get(interaction.commandName);
  if (!cmd) {
    console.log(`Command not found: ${interaction.commandName}`);
    return;
  }
  
  try {
    console.log(`Executing command: ${interaction.commandName}`);
    await cmd.execute(interaction, client);
  } catch (error) {
    console.error('Command error:', error);
    const reply = { content: 'There was an error executing that command.', ephemeral: true };
    try {
      if (interaction.deferred || interaction.replied) {
        await interaction.editReply(reply);
      } else {
        await interaction.reply(reply);
      }
    } catch (replyError) {
      console.error('Error sending error reply:', replyError);
    }
  }
});

// register context menus + slash commands
const commands = [];
[
  'setLang.js', 'getLang.js',
  'startVoice.js', 'stopVoice.js',
  'translateMessage.js'
].forEach(file => {
  const cmd = require(`./${file}`);
  client.commands.set(cmd.data.name, cmd);
  commands.push(cmd.data.toJSON());
});

// register voice translator
voiceTranslate(client);

client.login(process.env.DISCORD_TOKEN);
