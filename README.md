<div align="center">
    <img src="cover.png" alt="DorksRestAPI" />
</div>

# DorksRestAPI
> A REST API for bypassing Amino's Play Integrity Check and KeyStore. Fully open source and free to use.

### *Our telegram channel is https://t.me/aminodorks*

## Quick Start

[Install Bun](https://bun.sh/install)
[Install Node.js](https://nodejs.org/en/download/)
[Install TypeScript](https://www.typescriptlang.org/)

### Install modules

```bash
bun install
bun remove frida
npm i frida
```

### Configure your .env file like
```
PORT=3000
DATABASE_URL="sqlite:memory"
ADMIN_TOKEN="YOUR_ADMIN_TOKEN"
PROCESS_NAME="Amino"
PACKAGE_NAME="com.narvii.amino.master"
FRIDA_SERVER_PATH="PATH_TO_FRIDA_SERVER"
```

### Then run

```bash
bun dev
```

## Documentation

[View Documentation](https://aminodorks.agency/api/v2/docs)


## License

MIT