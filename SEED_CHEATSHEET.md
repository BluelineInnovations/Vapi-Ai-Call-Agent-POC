# Demo Citation Seed Cheatsheet

**Fake PII for demos only.** Citation numbers are stored **without** the `BL-` prefix. Callers may say either form; the API and agent accept both.

Format: `BL-` + 1–3 digits + 6 alphanumeric characters  
Examples: `BL-82KX9M2A` or just `82KX9M2A`

## Single-citation happy paths

| Scenario | Citation # (with BL) | Core (API) | Plate | State | Name | Agency | Location |
| --- | --- | --- | --- | --- | --- | --- | --- |
| Primary demo | `BL-82KX9M2A` | `82KX9M2A` | `ABC1234` | GA | Maria Hernandez | Emerson, GA | North Side High School |
| Tennessee | `BL-7H3P9QA` | `7H3P9QA` | `TN7K442` | TN | James Whitaker | Knoxville, TN | Knoxville Central High School |
| Partial pay | `BL-308R4T6YX` | `308R4T6YX` | `VA8821K` | VA | Aisha Patel | Stafford County, VA | Stafford High School |

## Multi-citation plates (announce count → CSR handoff)

| Plate | State | Name | Count | Citation cores |
| --- | --- | --- | --- | --- |
| `MULTI99` | FL | Robert Davis | **3** | `40A2B3C1`, `41D4E5F2`, `42G6H7J3` |
| `OH55ZX9` | OH | Linda Nguyen | **2** | `50K8L9M1`, `51N0P1Q2` |

## Suggested live-call scripts

1. **Citation + correct name:** Give `BL-82KX9M2A` (or `82KX9M2A`) → agent must ask for name → `Maria Hernandez` → then details (include location).
2. **Citation without BL:** Give `82KX9M2A` → same flow.
3. **Wrong name ×3:** After lookup → wrong names three times → CSR message.
4. **Unique plate:** `TN7K442` → name `James Whitaker` → details.
5. **Multi plate:** `MULTI99` → “3 citations” → CSR.
6. **Neither ID:** Decline both → CSR.

## Curl smoke tests

```bash
export DEMO_API_KEY='(from .env.local or Vercel)'
export BASE_URL='https://citation-demo-api.vercel.app'

curl -s -H "Authorization: Bearer $DEMO_API_KEY" \
  "$BASE_URL/api/citations/82KX9M2A" | jq

# BL- prefix also works on the API
curl -s -H "Authorization: Bearer $DEMO_API_KEY" \
  "$BASE_URL/api/citations/BL-82KX9M2A" | jq

curl -s -H "Authorization: Bearer $DEMO_API_KEY" \
  "$BASE_URL/api/citations?plate=MULTI99" | jq
```
