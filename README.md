# Commun

## Installation

#### Clone the repository

```bash
git clone https://github.com/communcom/commun
cd commun
```

#### Create .env file

```bash
cp .env.example .env
```

Add variables

### Development

Installing dependencies and run dev server:

```bash
yarn
yarn dev 
# or
yarn dev:fast # build without icons 
```

You now have your development environment:

- web on [localhost:3000](http://localhost:3000) - nextjs with commun
- ui on [localhost:6060](http://localhost:6060) - styleguidist

## Contribution

Be sure that the `prettier` and `eslint` extensions are installed and enabled in your code editor

## Environment

- `WEB_DISABLE_SSR` - disables initial server-side rendering.

### Production

If you want to test it locally in production mode, just run the following commands:

```bash
docker-compose up
```

You now have your production:

- web on [localhost:3000](http://localhost:3000) - nextjs with commun

### Issues

To report a non-critical issue, please file an issue on this GitHub project.

If you find a security issue please report details to: https://github.com/communcom/commun/issues

We will evaluate the risk and make a patch available before filing the issue.
