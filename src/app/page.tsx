export default function Home() {
  return (
    <main style={{ fontFamily: "system-ui", padding: "2rem", maxWidth: 640 }}>
      <h1>Citation Demo API</h1>
      <p>
        Demo backend for Vapi citation lookups. Seed data is fake PII only.
      </p>
      <ul>
        <li>
          <code>GET /api/health</code>
        </li>
        <li>
          <code>GET /api/citations/:citationNumber</code> (API key required)
        </li>
        <li>
          <code>GET /api/citations?plate=&amp;state=</code> (API key required)
        </li>
      </ul>
      <p>
        See <code>README.md</code> and <code>SEED_CHEATSHEET.md</code> in the
        repo.
      </p>
    </main>
  );
}
