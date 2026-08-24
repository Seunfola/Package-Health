# DepVault (formerly PackageHealth)

DepVault is a web app and CLI ecosystem that analyzes repository and package health with a focus on security, dependency risk, and maintainability insights.

## Demo

- Live app: `https://package-health-rho.vercel.app`
- API: `https://package-health-backup-1.onrender.com/api`

## Why DepVault?

Standard scanners like `npm audit` or Google OSV only look at binary states: *Does a known CVE exist right now? Yes or No?*

We outshine them because DepVault is a **Predictive Risk Engine**, not just a vulnerability scanner. We catch things *before* a CVE is even filed because we analyze:

- **Structural Risk**: Is a critical package (w >= 0.3) unmaintained?
- **Freshness & Abandonware**: Has the author ghosted the project for 3 years? (OSV won't flag this, but we will fail it).
- **Toxic Licenses**: Did the maintainer switch to a restrictive GPL license? (npm audit doesn't care, we do).
- **Pre-release Instability**: Is someone trying to sneak a `-beta` tag into production?

Because we built our logic around the centralized registry and layer it with advanced mathematical scoring, DepVault covers **npm, yarn, pnpm, and bun** flawlessly with the exact same, hyper-reliable data pipeline!

## Features

- **DepVault HealthScan**: Vulnerability insight cards powered by our advanced scoring algorithm.
- **DepVault Shield**: A zero-trust package installation interceptor that uses Poisson distribution models to block toxic dependencies before they are installed.
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

## DepVault Shield for Developers

DepVault Shield is the install-time guardrail for the CLI. It evaluates a dependency before installation, shows the package's trust score, explains the reason for a block, and stops the install if the package fails policy.

### Configure the shield

Create a `depvault.json` file in the project you want to protect:

```json
{
  "riskLevel": "high"
}
```

Supported values are `low`, `medium`, and `high`.

### Use it manually

```bash
depvault shield express@4.18.2
depvault shield audit
depvault shield status
```

### Gate every install automatically

To protect every install in a shell, install the hooks:

```bash
depvault hooks install
depvault hooks install --git
```

Then reload your shell and plain install commands will run through the shield first.

### Override intentionally

If you have a valid reason to install a package anyway, use:

```bash
depvault shield express@4.18.2 --force
```

That proceeds with the install but clearly marks it as an intentional override.

## Contributing

See [CONTRIBUTING.md](./CONTRIBUTING.md).

## Security Note

Never commit `.env` secrets. Use deployment platform secret stores (Vercel/Render/GitHub Actions).
