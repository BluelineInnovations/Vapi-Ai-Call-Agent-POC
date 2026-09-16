# Vapi ↔ Demo API wiring

## Production API
- Base: `https://citation-demo-api.vercel.app`
- Health: `GET /api/health` (no auth)
- Lookups require `DEMO_API_KEY` via `Authorization: Bearer …`

## Tools on Violation Payment Processing Agent
Assistant ID: `eb72397e-b75f-4d63-93ac-b5ee1d7bc0ac`

| Tool name | Tool ID |
| --- | --- |
| `end_processing_center_call` | `2d32183e-fcda-44f8-b601-592228bdf534` |
| `lookup_citation_by_number` | `4a90b931-15af-4675-a55b-b674a71e34e3` |
| `lookup_citation_by_plate` | `296439d2-43cb-47be-a4d5-be9711a27d4b` |

## Rotate the demo API key
1. Generate a new secret and set it in Vercel (`vercel env add DEMO_API_KEY`) and `.env.local`.
2. Redeploy.
3. Update the `Authorization` header `value` on both Vapi apiRequest tools (Dashboard → Tools, or PATCH `/tool/:id`).
