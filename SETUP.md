# Bot Setup Guide

This guide will help you set up the Translator Bot for your Discord server.

## Quick Start

### 1. Bot Invitation

Use this URL template to invite the bot to your Discord server:

```
https://discord.com/api/oauth2/authorize?client_id=YOUR_BOT_CLIENT_ID&permissions=3148800&scope=bot%20applications.commands
```

Replace `YOUR_BOT_CLIENT_ID` with your actual bot's client ID from the Discord Developer Portal.

### 2. Required Permissions

The bot needs these permissions (included in the URL above):
- ✅ Send Messages
- ✅ Use Slash Commands  
- ✅ Read Message History
- ✅ Connect to Voice Channels
- ✅ Speak in Voice Channels
- ✅ Use Voice Activity

### 3. Discord Developer Portal Setup

1. Go to https://discord.com/developers/applications
2. Select your bot application
3. Navigate to **Bot** section
4. Enable these **Privileged Gateway Intents:**
   - ✅ Server Members Intent
   - ✅ Message Content Intent
   - ✅ Presence Intent (optional)

## Commands

Once the bot is in your server, you can use:

### Slash Commands
- `/setlang <language>` - Set your preferred language (e.g., english, spanish, french)
- `/getlang` - View your current language preference
- `/startvoice` - Join voice channel and start real-time translation
- `/stopvoice` - Stop voice translation and leave channel

### Context Menu
- Right-click any message → "Translate Message"

## Language Codes

The bot supports these language formats:

### Language Names (Recommended)
- `english` → `en`
- `spanish` → `es`
- `french` → `fr`
- `german` → `de`
- `italian` → `it`
- `portuguese` → `pt`
- `russian` → `ru`
- `japanese` → `ja`
- `chinese` → `zh`
- `korean` → `ko`
- `arabic` → `ar`

### Direct ISO Codes
You can also use ISO 639-1 codes directly: `en`, `es`, `fr`, `de`, etc.

## Features

### Auto-Translation
1. Set your preferred language with `/setlang`
2. The bot will automatically translate messages to your language via DM
3. Only messages in different languages will be translated

### Voice Translation
1. Join a voice channel
2. Use `/startvoice` command
3. Speak in the channel - the bot will translate speech to text and then to your preferred language
4. Use `/stopvoice` to stop the service

### Manual Translation
- Right-click any message and select "Translate Message"
- Works without setting a preferred language

## Analytics Dashboard

If you're running the bot yourself, access the dashboard at:
- URL: `http://localhost:3000` (or your configured port)
- Login: See your `.env` file for credentials
- Features: Real-time metrics, language statistics, usage graphs

## Troubleshooting

### "Application did not respond" Error
1. Check that all intents are enabled in Discord Developer Portal
2. Ensure the bot has proper permissions in your server
3. Wait a few minutes for Discord to sync the changes
4. Try kicking and re-inviting the bot

### Commands Not Appearing
1. Make sure `applications.commands` scope is included in the invite URL
2. Check that the bot is online and properly deployed
3. Server administrators may need to update integration permissions

### Voice Features Not Working
1. Ensure the bot has Connect and Speak permissions
2. Check that you're in a voice channel when using `/startvoice`
3. Voice features require Google Cloud Speech-to-Text API setup

## Support

- 🐛 **Report Issues:** https://github.com/honeybadger2121-home/translatorbot/issues
- 💡 **Feature Requests:** https://github.com/honeybadger2121-home/translatorbot/issues
- 📧 **Email Support:** BRS8519@gmail.com
- 📖 **Documentation:** https://github.com/honeybadger2121-home/translatorbot

## Legal

- **Terms of Service:** https://github.com/honeybadger2121-home/translatorbot/blob/main/TERMS.md
- **Privacy Policy:** https://github.com/honeybadger2121-home/translatorbot/blob/main/PRIVACY.md

## Development

Want to contribute or host your own instance?
- **Source Code:** https://github.com/honeybadger2121-home/translatorbot
- **License:** MIT License
- **Setup Instructions:** See README.md in the repository

---

**Version:** 1.0.0  
**Last Updated:** August 27, 2025
