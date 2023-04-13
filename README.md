# flux-gitops-bot

> A Github bot that will automatically suggest changes to a Flux helmrelease when a helm chart is updated.

## Setup

```sh
# Install dependencies
npm install

# Run the bot
npm start
```

## Docker

```sh
# 1. Build container
docker build -t ccoe-gitops-bot .

# 2. Start container
docker run -e APP_ID=<app-id> -e PRIVATE_KEY=<pem-value> ccoe-gitops-bot
```

## Contributing

If you have suggestions for how ccoe-gitops-bot could be improved, or want to report a bug, open an issue! We'd love all and any contributions.

For more, check out the [Contributing Guide](CONTRIBUTING.md).

## License

[ISC](LICENSE) © 2023 Jacob Lorenzen
