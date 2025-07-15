# Coolify Tweaks API

A server for delivering GitHub release assets for Coolify Tweaks. It bypasses GitHub CDN restrictions and applies custom TweakCN styles.

## Features

- 🚀 **Fast Edge Runtime**: Runs on Vercel's edge runtime for global performance
- 🔧 **Easy Configuration**: Simple config file to manage allowed owners
- 📦 **Asset Proxying**: Proper MIME type detection and header handling
- 🩺 **Health Checks**: Built-in health and info endpoints

## API Endpoints

### Get Release Asset
```
GET /api/release/:tag/?asset=xyz.css&theme=abc.css
```

**Parameters:**
- `tag`: Release tag (or "latest" for the most recent release)
- `asset`: Asset filename
- `theme`: TweakCN Theme

**Examples:**
```
# Download a specific release asset
curl https://localhost:3000/api/release/latest?asset=coolify-tweaks.zip

# Theming
curl https://localhost:3000/api/release/latest?theme=claude.json
curl https://localhost:3000/api/release/latest?theme=claude.json&asset=main.user.css

# Without Theming
curl https://localhost:3000/api/release/latest?asset=main.user.css
```

### Health Check
```
GET /api/health
```

### API Information
```
GET /api/
```

## Development

```bash
# Install dependencies
bun install

# Start development server
bun run dev

# Deploy to Vercel
bun run deploy
```