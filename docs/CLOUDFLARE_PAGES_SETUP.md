# Cloudflare Pages Configuration

## Build Settings

To properly deploy this site with Cloudflare Pages Functions, configure the following settings in your Cloudflare Pages dashboard:

### Build Configuration

1. **Framework preset**: None
2. **Build command**: `npm run build`
3. **Build output directory**: `.` (current directory)
4. **Root directory**: (leave empty or `/`)

### Environment Variables

Make sure to set the following environment variables in your Cloudflare Pages project settings:

- `RESEND_API_KEY`: Your Resend API key for sending emails
- `CONTACT_EMAIL`: The email address where contact form submissions should be sent
- `NODE_VERSION`: `18` (already set in wrangler.toml)

### How It Works

1. Cloudflare Pages will run `npm install` in the root directory (installs wrangler and resend)
2. Then it runs `npm run build` which executes: `cd functions && npm install && cd ..`
3. This installs the `resend` dependency in the `functions` directory
4. Cloudflare Pages then bundles the Functions with their dependencies
5. The site is deployed with working email functionality

### Functions Directory Structure

```
functions/
├── package.json          # Contains resend dependency
├── node_modules/         # Installed during build (not committed)
└── api/
    └── send-email.js     # Email sending endpoint
```

### Testing Locally

To test the Functions locally:

```bash
# Install dependencies
npm install
npm run build

# Start local dev server
npm run dev

# The Functions will be available at:
# http://localhost:8788/api/send-email
```

### Troubleshooting

If deployment fails:

1. Check that the build command is set to `npm run build` in Cloudflare Pages settings
2. Verify that environment variables are set correctly
3. Check the build logs for any errors
4. Ensure the `functions/package.json` file exists in the repository

### Notes

- The `functions/node_modules` directory is NOT committed to git (it's in .gitignore)
- Dependencies are installed fresh on each deployment
- This approach avoids bundling issues with TypeScript declaration files
