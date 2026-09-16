# Citation Demo API

Proof-of-concept TypeScript API for wiring a Vapi voice agent to citation lookups, as if connecting to a real Violation Payment data source.

**All seed records are fake demo PII.**

## What it provides

| Method | Path | Auth | Purpose |
| --- | --- | --- | --- |
| `GET` | `/api/health` | none | Liveness + citation count |
| `GET` | `/api/citations/:citationNumber` | Bearer / `x-api-key` | Lookup by citation number |
| `GET` | `/api/citations?plate=&state=` | Bearer / `x-api-key` | Lookup by plate (`state` optional) |

Successful lookups return:

```json
{
  "count": 1,
  "citations": [{
    "citationNumber": "82KX9M2A",
    "firstName": "Maria",
    "lastName": "Hernandez",
    "jurisdiction": "Emerson, GA",
    "location": "North Side High School",
    "...": "..."
  }]
}
```

Citation numbers follow `BL-{1–3 digits}{6 alphanumeric}` (e.g. `BL-82KX9M2A`). The API stores/looks up the **core** without requiring `BL-`; both `82KX9M2A` and `BL-82KX9M2A` work.

See [SEED_CHEATSHEET.md](./SEED_CHEATSHEET.md) for demo identities (including multi-citation plates).

## Security model

- Set `DEMO_API_KEY` in `.env.local` (local) and Vercel project env (production).
- Citation routes require `Authorization: Bearer <DEMO_API_KEY>` or `x-api-key: <DEMO_API_KEY>`.
- Vapi API Request tools should send the same header — the same pattern used for a real backend secret.
- Do not commit real keys. `.env.local` is gitignored.

## Local development

```bash
cp .env.example .env.local
# set DEMO_API_KEY to a long random secret

npm install
npm run dev
```

Smoke test:

```bash
source .env.local
curl -s http://localhost:3000/api/health
curl -s -H "Authorization: Bearer $DEMO_API_KEY" \
  http://localhost:3000/api/citations/VP-10482
```

## Deploy to Vercel

### GitHub Actions (preferred)

Pushes to `main` deploy production. Pull requests and non-`main` branches deploy previews.

Required GitHub Actions secrets (Settings → Secrets and variables → Actions):

| Secret | Source |
| --- | --- |
| `VERCEL_TOKEN` | Vercel personal/team token (`vercel tokens add`) |
| `VERCEL_ORG_ID` | `.vercel/project.json` → `orgId` |
| `VERCEL_PROJECT_ID` | `.vercel/project.json` → `projectId` |

Workflows live in [`.github/workflows/`](./.github/workflows/).

**Note:** CI detaches `.git` before `vercel deploy` because Vercel blocks deployments when the commit author email is not a member of the Vercel project. Longer-term, add your Git author email on the Vercel account (or invite that user to the team) if you want native Git-linked deploys.

SSO deployment protection was disabled on this project so Vapi can call the public API without Vercel login.

### Manual CLI deploy

```bash
npm i -g vercel
vercel login
vercel link
vercel env add DEMO_API_KEY production
vercel --prod
```

**Production URL:** [https://citation-demo-api.vercel.app](https://citation-demo-api.vercel.app)

**GitHub:** [BluelineInnovations/Vapi-Ai-Call-Agent-POC](https://github.com/BluelineInnovations/Vapi-Ai-Call-Agent-POC)

Vapi API Request tools (already wired to **Violation Payment Processing Agent**):

| Tool | ID | Endpoint |
| --- | --- | --- |
| `lookup_citation_by_number` | `4a90b931-15af-4675-a55b-b674a71e34e3` | `GET /api/citations/{{citationNumber}}` |
| `lookup_citation_by_plate` | `296439d2-43cb-47be-a4d5-be9711a27d4b` | `GET /api/citations?plate={{plate}}&state={{state}}` |

Auth header on tools: `Authorization: Bearer <DEMO_API_KEY>` (same secret as Vercel env).

## Vapi agent behavior (this demo)

1. Ask for citation number **or** license plate. If neither → say a human CSR is needed → end call.
2. Lookup via tools. Never invent balances.
3. If plate returns `count > 1` → tell the caller how many citations they have → CSR handoff message → end call.
4. If exactly one citation → ask first and last name; LLM compares to payload (max 3 tries) → then speak basic details, or CSR handoff after failures.

Live phone transfer is **out of scope** for this demo (message only). Telephony cutover for a real DID is documented in [docs/VOIP_STRATEGY.md](./docs/VOIP_STRATEGY.md) (BYO SIP trunk; Twilio not required).

## Web-call test scripts

Use Vapi dashboard web call against **Violation Payment Processing Agent**:

1. Citation `VP-10482` + name Maria Hernandez → details
2. Citation `VP-10482` + three wrong names → CSR message
3. Plate `TN7K442` + James Whitaker → details
4. Plate `MULTI99` → “3 citations” + CSR message
5. No citation / no plate → CSR message
