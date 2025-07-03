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

**Example:**
```
GET /api/release/techwithanirudh/my-app/v1.0.0/app.zip
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
pnpm install

# Start development server
pnpm run start

# Deploy to Vercel
pnpm run deploy
```

## Usage Examples

```bash
# Download a release asset
curl https://your-domain.vercel.app/api/release/techwithanirudh/my-app/v1.0.0/app.zip

# Check allowed owners
curl https://your-domain.vercel.app/api/health
```

## Security

- Only repositories from owners listed in `allowedOwners` can be accessed
- Requests for unauthorized owners return 403 Forbidden
- All GitHub API errors are properly handled and returned
