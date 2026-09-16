# VoIP strategy for Vapi (non-Twilio)

## Goal

Use Blue Line’s **existing VoIP / carrier phone number** with the Violation Payment Processing Agent—without migrating the DID to Twilio.

Vapi does not require Twilio. The supported path is **Bring Your Own SIP Trunk (BYOC)**.

## Recommended approach: BYO SIP trunk

```text
Caller (PSTN)
    → existing VoIP / PBX / carrier (keeps the DID)
    → SIP forward to Vapi
    → Violation Payment Processing Agent
    → Demo citation API (and later production APIs)
```

| Layer | Owner | Role |
| --- | --- | --- |
| Phone number (DID) | Current VoIP provider | Number stays where it is today |
| SIP trunk / PBX | Current VoIP / IT | Forwards inbound INVITEs to Vapi |
| Voice agent | Vapi | Answers, tools, lookups, CSR handoff messaging |
| Citation data | Demo API (then production) | Account lookup after ID + name gate |

## Why not “just paste the VoIP login into Vapi”?

Vapi needs **SIP signaling** to your carrier or PBX. A softphone-only account with no SIP trunk, DID forwarding, or SBC will not work until the provider can route SIP to Vapi.

Twilio is optional. Alternatives that already work with Vapi’s BYO model include Telnyx, Plivo, Zadarma, DIDHub, FreeSWITCH/Asterisk fronting any carrier, and other SIP-capable PBXs.

## Prerequisites (collect from VoIP / IT)

- SIP gateway hostname or **IPv4** (inbound matching requires numeric IP when inbound is enabled)
- Auth method: prefer **username/password**; IP allowlisting alone is fragile on shared SBCs
- DID in E.164 (or provider format) and permission to change inbound routing
- Ability to **allowlist Vapi signaling IPs** and open media ports

### Vapi network allowlist (US org)

| Purpose | Value |
| --- | --- |
| SIP host | `sip.vapi.ai` |
| Signaling IPs | `44.229.228.186/32`, `44.238.177.138/32` |
| RTP | UDP `40000`–`60000` (dynamic media IPs) |

EU orgs use `sip.eu.vapi.ai` / `api.eu.vapi.ai` and the EU IP set—keep API region and SIP host matched. See [Vapi SIP trunking](https://docs.vapi.ai/advanced/sip/sip-trunk).

## Implementation steps

### 1. Create SIP trunk credential in Vapi

Create a credential with `provider: "byo-sip-trunk"`:

- `gateways[].ip` — provider SIP host or inbound IPv4
- `outboundAuthenticationPlan` — username/password when required
- Set `inboundEnabled` / `outboundEnabled` per use case (inbound CS line vs outbound dialer)

Save the returned **credential ID**.

### 2. Import the existing number in Vapi

Create a phone number with `provider: "byo-phone-number"`:

- `number` — the existing DID
- `credentialId` — trunk from step 1
- `assistantId` — `eb72397e-b75f-4d63-93ac-b5ee1d7bc0ac` (Violation Payment Processing Agent), or a squad when ready

### 3. Point the carrier / PBX at Vapi

Forward inbound calls for that DID to:

```text
{phoneNumber}@{credentialId}.sip.vapi.ai
```

(Example pattern from Vapi docs; exact URI format may vary slightly by provider UI.)

Ensure all provider **signaling IPs** used for inbound are listed on the Vapi trunk so INVITEs are not rejected (`401` unauthorized).

### 4. Test

1. **Inbound:** Call the real DID from a mobile; agent should answer and run citation/plate → name gate → details.  
2. **Outbound (optional):** Place a test call via Vapi API using `phoneNumberId` if outbound is in scope.  
3. Confirm demo tools still hit `https://citation-demo-api.vercel.app` with `DEMO_API_KEY`.

## Call transfers (later)

This POC currently **says** CSR handoff and ends the call; it does not warm-transfer.

When live transfer is required:

- Prefer SIP REFER / SIP transfer destinations (`sip:+1…@your-provider-domain`) back into the VoIP queue or agent extension
- Enable SIP REFER on the provider if needed
- Add a Vapi `transferCall` tool with SIP destinations—not only a spoken “I’ll transfer you”

## Phased rollout

| Phase | Scope |
| --- | --- |
| **Now (POC)** | Web / Vapi test calls; BYO SIP design agreed; no production cutover |
| **Pilot** | One DID forwarded to Vapi after hours or on a pilot queue; monitor quality and name-gate behavior |
| **Production** | Full inbound on the customer-facing number; CSR SIP transfer; production citation API (replace demo) |
| **Optional** | Outbound reminder/collections campaigns on the same trunk |

## Risks and decisions

| Risk | Mitigation |
| --- | --- |
| Softphone-only VoIP, no SIP forward | Involve IT/carrier early; confirm SIP trunk or DID URI routing exists |
| IP-only auth on shared SBC | Prefer digest auth or a dedicated termination URI |
| Wrong org region (US vs EU) | Match `api` + `sip` hosts |
| Audio one-way / no media | Open RTP UDP range; verify NAT/firewall |
| Commit-author / deploy confusion | Unrelated to telephony; keep number change as a controlled IT change window |
| Dual systems answering the same DID | Never point the live DID at Vapi until pilot routing is validated |

## Decision needed from stakeholders

1. **Provider name** (RingCentral, 8x8, Spectrum Enterprise, FreeSWITCH, etc.)  
2. **Inbound only** vs inbound + outbound  
3. **Pilot DID** vs production customer number  
4. **CSR transfer target** (queue SIP URI / extension) when transfers leave “message only” mode  

Once those are known, document provider-specific click-paths in this folder (e.g. `docs/voip-{provider}.md`) and execute steps 1–4.

## References

- [Vapi SIP trunking](https://docs.vapi.ai/advanced/sip/sip-trunk)  
- [Troubleshoot SIP trunk credentials](https://docs.vapi.ai/advanced/sip/troubleshoot-sip-trunk-credential-errors)  
- [Demo API / agent wiring](./VAPI_WIRING.md)  
- [Citation demo cheatsheet](../SEED_CHEATSHEET.md)
