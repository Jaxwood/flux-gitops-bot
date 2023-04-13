# flux-gitops-bot

> A Github bot that will automatically suggest changes to a [Flux](https://fluxcd.io) [helmrelease](https://fluxcd.io/flux/components/helm/helmreleases/) when a helm chart is updated.

## Setup

Expose webhook from local machine using [ngrok](https://ngrok.com/):

```sh
ngrok http 3000
```

Update webhook URL in [Github settings](https://github.com/settings/apps).

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
