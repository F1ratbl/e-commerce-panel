# e-commerce-panel

Local development uses the sibling guidorasdk workspace directly, while live builds load the published browser bundle from the Guidora CDN URL.

Environment variables:

```bash
VITE_GUIDORA_ENABLED=true
VITE_GUIDORA_API_BASE_URL=http://127.0.0.1:8000/api/guide
VITE_GUIDORA_API_KEY=
VITE_GUIDORA_SDK_CDN_URL=https://cdn.jsdelivr.net/npm/@guidora/sdk@0.1.0/dist/index.global.js

# local dev only, used by the Vite proxy for /__guidora/*
GUIDORA_DASHBOARD_ORIGIN=http://localhost:3000
```

Local workflow:

```bash
cd ../guidorasdk && npm run dev
cd ../guidorafe && npm run dev
cd ../e-commerce-panel && npm run dev
```

If `VITE_GUIDORA_API_KEY` is empty during local development, the panel asks the local Guidora dashboard for the active public key through the Vite proxy. In live environments, set `VITE_GUIDORA_API_KEY` and `VITE_GUIDORA_API_BASE_URL` explicitly.
