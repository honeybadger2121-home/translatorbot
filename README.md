# Translator Bot

A Discord bot for real-time translation with voice support, auto-translation, and analytics dashboard.

## 🌟 Features

- **🔄 Auto-Translation**: Automatically translate messages without manual intervention
  - Personal auto-translation via DM
  - Server-wide auto-translation with channel replies
  - Smart language detection
- **⚡ Slash Commands**: Set and get preferred languages with enhanced UI
- **🖱️ Message Translation**: Right-click context menu to translate any message
- **🎤 Voice Translation**: Real-time voice channel translation
- **📊 Analytics Dashboard**: Web dashboard with real-time metrics
- **💾 Caching**: Redis caching with in-memory fallback
- **🌍 Multi-language Support**: Automatic language detection and name mapping

## 🚀 Quick Start

### 1. Invite the Bot
Use this URL to invite the bot to your Discord server:
```
https://discord.com/oauth2/authorize?client_id=1410373247362662462&permissions=277061113856&integration_type=0&scope=bot+applications.commands
```

### 2. Enable Auto-Translation
```
/setlang english
```
Now all messages in other languages will be automatically translated and sent to you via DM!

### 3. (Optional) Enable Server-Wide Translation
```
/autotranslate enable english
```
All messages will now be translated for everyone in the server.

## 📖 Commands

### Personal Auto-Translation
- `/setlang <language>` - Enable auto-translation (e.g., `/setlang english`)
- `/setlang off` - Disable auto-translation
- `/getlang` - View your current language settings

### Server-Wide Auto-Translation (Admin only)
- `/autotranslate enable <language>` - Enable server-wide translation
- `/autotranslate disable` - Disable server-wide translation  
- `/autotranslate status` - Check current server settings

### Voice Translation
- `/startvoice` - Join your voice channel and start real-time translation
- `/stopvoice` - Stop voice translation and leave channel

### Manual Translation
- Right-click message → "Translate Message" - Translate any message

## 🌍 Supported Languages

The bot accepts both language names and ISO codes:

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

## 🎯 How Auto-Translation Works

### Personal Auto-Translation
1. User sets preferred language: `/setlang english`
2. When someone writes in Spanish: "Hola, ¿cómo estás?"
3. User automatically receives DM: "Translation: Hello, how are you?"
4. Messages in English are ignored (no translation needed)

### Server-Wide Auto-Translation
1. Admin enables: `/autotranslate enable english`
2. When someone writes in any foreign language
3. Bot adds 🔄 reaction to original message
4. Bot posts translation reply that auto-deletes after 15 seconds
5. Keeps chat clean while providing translations

## 🛠️ Setup (Self-Hosting)

### 1. Clone Repository
```bash
git clone https://github.com/honeybadger2121-home/translatorbot.git
cd translatorbot
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Configure Environment
```bash
cp .env.example .env
```

Edit `.env` with your Discord bot token and other settings:
```env
DISCORD_TOKEN=your_discord_bot_token_here
REDIS_URL=redis://localhost:6379
DASH_PORT=3000
ADMIN_USER=admin
ADMIN_PASS=your_secure_password_here
DASH_ALLOW_IPS=127.0.0.1,::1
```

### 4. Start the Bot
```bash
npm start
```

## 📊 Analytics Dashboard

Access the web dashboard at `http://localhost:3000` (or your configured port).

**Features:**
- Real-time translation metrics
- Language detection statistics
- Performance monitoring
- Live usage graphs

**Login:** Use credentials from your `.env` file

## 🔧 Available Scripts

| Script | Description |
|--------|-------------|
| `npm start` | Start the Discord bot |
| `npm run dev` | Start in development mode |
| `npm run dashboard` | Start only the web dashboard |
| `npm run help` | Show all available commands |

## 🎛️ Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `DISCORD_TOKEN` | Your Discord bot token | Required |
| `REDIS_URL` | Redis connection URL | redis://localhost:6379 |
| `DASH_PORT` | Dashboard port | 3000 |
| `ADMIN_USER` | Dashboard admin username | admin |
| `ADMIN_PASS` | Dashboard admin password | supersecret |
| `DASH_ALLOW_IPS` | Allowed IPs for dashboard | 127.0.0.1,::1 |

## 🔐 Required Discord Permissions

Your bot needs these permissions:
- ✅ Send Messages
- ✅ Use Slash Commands
- ✅ Read Message History
- ✅ Connect to Voice Channels
- ✅ Speak in Voice Channels
- ✅ Use Voice Activity

**Important:** Enable these intents in Discord Developer Portal:
- ✅ Server Members Intent
- ✅ Message Content Intent
- ✅ Presence Intent (optional)

## 🔧 Requirements

- **Node.js 16+**
- **Discord Bot Token** with required permissions
- **Optional:** Redis for enhanced caching and metrics

## 🆘 Troubleshooting

### "Application did not respond" Error
1. Check Discord Developer Portal intents are enabled
2. Verify bot has proper permissions in your server
3. Wait 2-3 minutes for Discord to sync changes
4. Try removing and re-inviting the bot

### Commands Not Appearing
1. Ensure `applications.commands` scope is in invite URL
2. Check bot is online and properly deployed
3. Server admins may need to update integration permissions

### Voice Features Not Working
1. Ensure bot has Connect and Speak permissions
2. Check you're in a voice channel when using `/startvoice`
3. Voice features require Google Cloud Speech-to-Text API setup

## 📞 Support

- 🐛 **Report Issues:** [GitHub Issues](https://github.com/honeybadger2121-home/translatorbot/issues)
- 💡 **Feature Requests:** [GitHub Issues](https://github.com/honeybadger2121-home/translatorbot/issues)
- 📧 **Email Support:** BRS8519@gmail.com
- 📖 **Documentation:** [GitHub Repository](https://github.com/honeybadger2121-home/translatorbot)

## 📜 Legal

- **Terms of Service:** [TERMS.md](TERMS.md)
- **Privacy Policy:** [PRIVACY.md](PRIVACY.md)
- **Setup Guide:** [SETUP.md](SETUP.md)

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Make your changes
4. Commit your changes (`git commit -m 'Add amazing feature'`)
5. Push to the branch (`git push origin feature/amazing-feature`)
6. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

**🌐 Translator Bot** - Making Discord conversations accessible in any language!

**Version:** 2.0.0 | **Last Updated:** August 27, 2025
