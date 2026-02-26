# PackageHealth

PackageHealth is a web app that analyzes repository/package health with a focus on security, dependency risk, and maintainability insights.

## Demo

- Live app: `https://package-health-rho.vercel.app`
- API: `https://package-health-backup.onrender.com/api`

Add screenshots in `docs/screenshots` and reference them here for better discoverability and stars.

## Features

- Analyze public GitHub repositories without login
- Analyze private repositories using a GitHub token
- Analyze `package.json` via URL, paste, or file upload
- Security and vulnerability insight cards
- Repo activity and health visualization

## Tech Stack

- Angular 20
- pnpm
- TypeScript

## Local Development

```bash
pnpm install
pnpm run start
```

Frontend runs at `http://localhost:4200`.

## Build and Test

```bash
pnpm run build
pnpm run test
```

## Contributing

See [CONTRIBUTING.md](./CONTRIBUTING.md).

## Security Note

Never commit `.env` secrets. Use deployment platform secret stores (Vercel/Render/GitHub Actions).
