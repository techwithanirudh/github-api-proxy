# GitHub Releases Server

A configurable proxy server for serving GitHub release assets from approved repository owners. This server allows you to control which GitHub organizations/users can have their release assets served through your proxy.

## Features

- 🔒 **Owner Allowlist**: Only serve releases from configured GitHub owners
- 🚀 **Fast Edge Runtime**: Runs on Vercel's edge runtime for global performance
- 🔧 **Easy Configuration**: Simple config file to manage allowed owners
- 📦 **Asset Proxying**: Proper MIME type detection and header handling
- 🩺 **Health Checks**: Built-in health and info endpoints

## Configuration

Edit `api/config.ts` to configure allowed owners:

```typescript
export const allowedOwners = [
  'techwithanirudh',
  'another-owner',
  'some-organization',
];
```

## API Endpoints

### Get Release Asset
```
GET /api/release/:owner/:repo/:tag/:asset
```

**Parameters:**
- `owner`: GitHub repository owner (must be in allowedOwners list)
- `repo`: Repository name
- `tag`: Release tag (or "latest" for the most recent release)
- `asset`: Asset filename

**Examples:**
```
# Specific release tag
GET /api/release/techwithanirudh/my-app/v1.0.0/app.zip

# Latest release (automatically resolves to actual tag)
GET /api/release/techwithanirudh/my-app/latest/app.zip
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

# Deploy to Cloudflare
bun run deploy
```

[For generating/synchronizing types based on your Worker configuration run](https://developers.cloudflare.com/workers/wrangler/commands/#types):

```bash
bun run cf-typegen
```

## Usage Examples

```bash
# Download a specific release asset
curl https://your-domain.cloudflare.dev/api/release/techwithanirudh/my-app/v1.0.0/app.zip

# Download from the latest release
curl https://your-domain.cloudflare.dev/api/release/techwithanirudh/my-app/latest/app.zip

# Check allowed owners
curl https://your-domain.cloudflare.dev/api/health
```

## Security

- Only repositories from owners listed in `allowedOwners` can be accessed
- Requests for unauthorized owners return 403 Forbidden
- All GitHub API errors are properly handled and returned
