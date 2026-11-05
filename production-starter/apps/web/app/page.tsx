export default function HomePage() {
  return (
    <main className="shell">
      <div className="notice" role="note">
        EDUCATIONAL MOCKUP ONLY — no accounts, identity checks, wallets, funds, financial services, or returns. Do not enter sensitive information.
      </div>
      <header className="topbar">
        <a className="brand" href="/">ProfessionalMining</a>
        <nav aria-label="Main navigation"><a href="#topics">Topics</a><a href="#about">About</a></nav>
      </header>
      <section className="hero">
        <p className="eyebrow">Digital asset learning mockup</p>
        <h1>Understand the ideas behind digital assets.</h1>
        <p className="lead">A clean interface concept for learning common blockchain terms and safe digital practices. No accounts, payments, financial services, or investment claims are offered.</p>
        <a className="button" href="#topics">Explore educational topics</a>
      </section>
      <section id="topics" className="card"><h2>Topics</h2><p>Blockchain basics, wallet safety, and risk awareness—presented for general education, not financial advice.</p></section>
      <section id="about" className="card"><h2>About this mockup</h2><p>No personal information is requested or stored. There are no live balances, market prices, account records, returns, wallet connections, or identity-verification forms.</p></section>
      <footer>Educational design mockup only. Not an offer of financial products or services.</footer>
    </main>
  );
}
