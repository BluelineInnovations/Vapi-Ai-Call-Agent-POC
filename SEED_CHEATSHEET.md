# Demo Citation Seed Cheatsheet

**Fake PII for demos only.** Use these identities when testing the Vapi agent or curling the API.

## Single-citation happy paths

| Scenario | Citation # | Plate | State | Name on citation | Notes |
| --- | --- | --- | --- | --- | --- |
| Primary demo | `VP-10482` | `ABC1234` | GA | Maria Hernandez | Emerson GA, unpaid $125 + $25 late |
| Tennessee | `VP-20591` | `TN7K442` | TN | James Whitaker | Knoxville TN, unpaid $100 |
| Partial pay | `VP-30817` | `VA8821K` | VA | Aisha Patel | Stafford County VA, partial |

## Multi-citation plates (agent should announce count, then CSR handoff)

| Plate | State | Name | Citation count | Citation numbers |
| --- | --- | --- | --- | --- |
| `MULTI99` | FL | Robert Davis | **3** | `VP-40101`, `VP-40102`, `VP-40103` |
| `OH55ZX9` | OH | Linda Nguyen | **2** | `VP-50221`, `VP-50222` |

## Suggested live-call scripts

1. **Citation + correct name:** Ask about citation → give `VP-10482` → name `Maria Hernandez` → hear amount/due date.
2. **Citation + wrong name ×3:** `VP-10482` → wrong names three times → CSR message → end call.
3. **Unique plate:** Plate `TN7K442` → name `James Whitaker` → details.
4. **Multi plate:** Plate `MULTI99` → agent says 3 citations → needs human CSR.
5. **Neither ID:** Decline citation and plate → CSR message.

## Curl smoke tests

```bash
export DEMO_API_KEY='(from .env.local or Vercel)'
export BASE_URL='http://localhost:3000' # or your Vercel URL

curl -s "$BASE_URL/api/health"

curl -s -H "Authorization: Bearer $DEMO_API_KEY" \
  "$BASE_URL/api/citations/VP-10482" | jq

curl -s -H "Authorization: Bearer $DEMO_API_KEY" \
  "$BASE_URL/api/citations?plate=MULTI99&state=FL" | jq
```
