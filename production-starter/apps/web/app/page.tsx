export default function HomePage() {
  return (
    <main className="shell">
      <div className="notice" role="note">
        Product framework preview — no real accounts, KYC submissions, wallets, deposits, withdrawals, or investment services are available.
      </div>
      <header className="topbar">
        <a className="brand" href="/">ProfessionalMining</a>
        <nav aria-label="Main navigation">
          <a href="#about">About</a>
          <a href="#plans">Plans</a>
          <a href="mailto:cryptotradinginvestment802@gmail.com">Contact</a>
        </nav>
      </header>
      <section className="hero">
        <p className="eyebrow">Digital asset education</p>
        <h1>A clear, responsible view of digital assets.</h1>
        <p className="lead">This framework preview is for product and architecture review. It does not offer mining, trading, staking, custody, or guaranteed returns.</p>
        <a className="button" href="mailto:cryptotradinginvestment802@gmail.com">Contact support</a>
      </section>
      <section id="about" className="card">
        <h2>Responsible product foundation</h2>
        <p>Private account features are not enabled in this preview. A production launch requires independent security, privacy, and jurisdiction-specific legal review.</p>
      </section>
      <section id="plans" className="card">
        <h2>Plans</h2>
        <p>No paid plans or financial products are offered in this framework preview.</p>
      </section>
      <footer>Contact: <a href="mailto:cryptotradinginvestment802@gmail.com">cryptotradinginvestment802@gmail.com</a></footer>
    </main>
  );
}
