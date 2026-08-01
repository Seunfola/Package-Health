# DepVault (formerly PackageHealth)

DepVault is a web app and CLI ecosystem that analyzes repository and package health with a focus on security, dependency risk, and maintainability insights.

## Demo

- Live app: `https://package-health-rho.vercel.app`
- API: `https://package-health-backup.onrender.com/api`

## 🚀 Features

- **DepVault HealthScan**: Vulnerability insight cards powered by our advanced scoring algorithm.
- **DepVault Shield**: A zero-trust package installation interceptor that uses Poisson distribution models to block toxic dependencies.
- **Dynamic Risk Policies**: Enforce strict, balanced, or lenient package security rules.
- **Analysis Engine**: 
  - Analyze public GitHub repositories without login
  - Analyze private repositories using a GitHub token
  - Analyze `package.json` via URL, paste, or file upload
- **Visualization**: Repo activity and health visualization

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
