# Commun

## Installation

#### Clone the repository

```bash
git clone https://github.com/GolosChain/Commun
cd Commun
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
```

You now have your development front end proxy on [localhost:9000](http://localhost:9000):

- web on [localhost:3000](http://localhost:3000) - nextjs with commun
- api on [localhost:3001](http://localhost:3001) - express with cyberway api
- ui on [localhost:6060](http://localhost:6060) - styleguidist

### Production

If you want to test it locally in production mode, just run the following commands:

```bash
docker-compose up
```

You now have your production:

- web on [localhost:3000](http://localhost:3000) - nextjs with commun

## Environment

- `WEB_DISABLE_SSR` - отключает первоначальный рендеринг на стороне сервера.

## Issues

To report a non-critical issue, please file an issue on this GitHub project.

If you find a security issue please report details to: https://github.com/GolosChain/Commun/issues

We will evaluate the risk and make a patch available before filing the issue.
