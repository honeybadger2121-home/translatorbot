# Translator Bot

A Discord bot for real-time translation with voice support and analytics dashboard.

## Features

- **Slash Commands**: Set and get preferred languages
- **Message Translation**: Right-click context menu to translate messages
- **Voice Translation**: Real-time voice channel translation
- **Analytics Dashboard**: Web dashboard with real-time metrics
- **Caching**: Redis caching with in-memory fallback
- **Multi-language Support**: Automatic language detection

## Setup

1. Clone the repository:
```bash
git clone https://github.com/honeybadger2121-home/translatorbot.git
cd translatorbot
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables:
```bash
cp .env.example .env
```

Edit `.env` with your Discord bot token and other settings.

4. Start the bot:
```bash
npm start
```

## Commands

- `/setlang <language>` - Set your preferred language (e.g., en, es, fr)
- `/getlang` - View your current preferred language
- `/startvoice` - Join your voice channel and start real-time translation
- `/stopvoice` - Stop voice translation and leave channel
- Right-click message → "Translate Message" - Translate any message

## Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `DISCORD_TOKEN` | Your Discord bot token | Required |
| `REDIS_URL` | Redis connection URL | redis://localhost:6379 |
| `DASH_PORT` | Dashboard port | 3000 |
| `ADMIN_USER` | Dashboard admin username | admin |
| `ADMIN_PASS` | Dashboard admin password | supersecret |
| `DASH_ALLOW_IPS` | Allowed IPs for dashboard | 127.0.0.1,::1 |

## Dashboard

Access the analytics dashboard at `http://localhost:3000` (or your configured port).

## Scripts

- `npm start` - Start the Discord bot
- `npm run dev` - Start in development mode
- `npm run dashboard` - Start only the web dashboard
- `npm run help` - Show available commands

## Requirements

- Node.js 16+ 
- Discord Bot Token with required permissions
- Optional: Redis for caching and metrics

## Discord Permissions

Your bot needs these permissions:
- Send Messages
- Use Slash Commands
- Connect to Voice Channels
- Speak in Voice Channels
- Use Voice Activity

## License

MIT License
