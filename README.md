# flux-gitops-bot

> A Github bot that will automatically suggest changes to a [Flux](https://fluxcd.io) [helmrelease](https://fluxcd.io/flux/components/helm/helmreleases/) when a helm chart is updated.

## Usage

Annotate your `Chart.yaml` to point to the helmrelease you want to update:

```yaml
...
annotations:
    acme.org/gitops: "<github-location-of-your-helmrelease>"
```

On every pull request that updates the chart, the bot will suggest changes to the helmrelease.

See [example folder](./example/) for a full example.

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
