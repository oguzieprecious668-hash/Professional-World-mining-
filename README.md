<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8" />
  <meta name<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width,initial-scale=1" />
  <title>Multi Timezone Digital Clock</title>
  <style>
    :root{--bg:#0f1724;--card:#0b1220;--accent:#06b6d4;--muted:#94a3b8;color-scheme:dark}
    *{box-sizing:border-box}
    body{margin:0;font-family:system-ui,-apple-system,Segoe UI,Roboto,"Helvetica Neue",Arial;background:var(--bg);color:white;display:flex;min-height:100vh;align-items:center;justify-content:center;padding:24px}
    .app{width:100%;max-width:900px}
    header{display:flex;align-items:center;gap:12px;margin-bottom:18px}
    h1{font-size:1.25rem;margin:0}
    .grid{display:grid;grid-template-columns:repeat(auto-fit,minmax(220px,1fr));gap:12px}
    .card{background:linear-gradient(180deg,rgba(255,255,255,0.02),transparent);padding:14px;border-radius:8px;border:1px solid rgba(255,255,255,0.03);box-shadow:0 6px 18px rgba(2,6,23,0.5)}
    .tz-name{display:flex;align-items:center;justify-content:space-between;font-weight:600;margin-bottom:8px;color:var(--muted)}
    .time{font-family:ui-monospace, SFMono-Regular, Menlo, Monaco, "Roboto Mono", "Helvetica Neue", monospace;font-size:1.5rem;line-height:1}
    .controls{display:flex;gap:8px;flex-wrap:wrap;margin-bottom:12px}
    input[type="text"]{padding:8px;border-radius:6px;border:1px solid rgba(255,255,255,0.06);background:transparent;color:inherit;min-width:200px}
    button{background:var(--accent);border:none;color:#021025;padding:8px 10px;border-radius:6px;cursor:pointer;font-weight:600}
    button.ghost{background:transparent;border:1px solid rgba(255,255,255,0.04);color:var(--muted);padding:6px 10px}
    small{color:var(--muted)}
    .remove{background:transparent;border:none;color:#ff7b7b;cursor:pointer;font-weight:700}
    footer{margin-top:14px;color:var(--muted);font-size:0.9rem}
    @media (max-width:420px){.time{font-size:1.25rem}}
  </style>
</head>
<body>
  <main class="app" role="main" aria-labelledby="title">
    <header>
      <h1 id="title">Multi Timezone Clock</h1>
      <small id="localTz"></small>
    </header>

    <section class="controls" aria-label="Controls">
      <form id="addForm" style="display:flex;gap:8px;flex-wrap:wrap;align-items:center">
        <input id="tzInput" placeholder="Add timezone (e.g. Europe/London)" aria-label="Timezone" />
        <button type="submit">Add</button>
        <button id="presetBtn" class="ghost" type="button">Add common set</button>
      </form>
      <small>Use IANA timezone names. Example: America/New_York, Europe/London, Asia/Tokyo.</small>
    </section>

    <section class="grid" id="clocks" aria-live="polite"></section>

    <footer>
      Tip: If an added timezone is invalid your browser will show an error; check exact IANA name. Your selection is saved to localStorage.
    </footer>
  </main>

  <script>
    // Defaults
    const DEFAULT_ZONES = [
      { id: 'local', label: 'Local', tz: Intl.DateTimeFormat().resolvedOptions().timeZone || 'UTC' },
      { id: 'utc', label: 'UTC', tz: 'UTC' },
      { id: 'ny', label: 'New York', tz: 'America/New_York' },
      { id: 'lon', label: 'London', tz: 'Europe/London' },
      { id: 'tok', label: 'Tokyo', tz: 'Asia/Tokyo' }
    ];

    const STORAGE_KEY = 'multi-tz-clocks';
    const clocksEl = document.getElementById('clocks');
    const tzInput = document.getElementById('tzInput');
    const addForm = document.getElementById('addForm');
    const presetBtn = document.getElementById('presetBtn');
    const localTzEl = document.getElementById('localTz');

    let zones = loadZones();

    function loadZones() {
      try {
        const raw = localStorage.getItem(STORAGE_KEY);
        if (raw) return JSON.parse(raw);
      } catch(e) { /* ignore */ }
      return DEFAULT_ZONES;
    }

    function saveZones() {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(zones));
    }

    function fmtDate(date, timeZone) {
      // show time with seconds and short timezone name
      const opts = { hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: false, timeZone, timeZoneName: 'short' };
      return new Intl.DateTimeFormat(undefined, opts).format(date);
    }

    function createClockCard(zone) {
      const card = document.createElement('article');
      card.className = 'card';
      card.dataset.tz = zone.tz;

      const header = document.createElement('div');
      header.className = 'tz-name';

      const name = document.createElement('div');
      name.innerHTML = `${escapeHtml(zone.label)} <small style="margin-left:6px;color:var(--muted);font-weight:500">${escapeHtml(zone.tz)}</small>`;

      const removeBtn = document.createElement('button');
      removeBtn.className = 'remove';
      removeBtn.title = 'Remove timezone';
      removeBtn.textContent = '✕';
      removeBtn.addEventListener('click', () => {
        zones = zones.filter(z => z.id !== zone.id);
        saveZones();
        render();
      });

      header.appendChild(name);
      header.appendChild(removeBtn);

      const timeEl = document.createElement('div');
      timeEl.className = 'time';
      timeEl.id = `time-${zone.id}`;

      card.appendChild(header);
      card.appendChild(timeEl);
      return card;
    }

    function render() {
      clocksEl.innerHTML = '';
      zones.forEach(zone => {
        try {
          // validate timezone by constructing a formatter (will throw for invalid tz)
          new Intl.DateTimeFormat(undefined, { timeZone: zone.tz });
        } catch (e) {
          // mark invalid but still render
          zone.invalid = true;
        }
        clocksEl.appendChild(createClockCard(zone));
      });
      updateLocalTzLabel();
      tick(); // immediate update
    }

    function updateLocalTzLabel() {
      const local = Intl.DateTimeFormat().resolvedOptions().timeZone || 'UTC';
      localTzEl.textContent = `Local timezone: ${local}`;
    }

    function tick() {
      const now = new Date();
      zones.forEach(zone => {
        const el = document.getElementById(`time-${zone.id}`);
        if (!el) return;
        try {
          el.textContent = fmtDate(now, zone.tz);
        } catch (e) {
          el.textContent = 'Invalid timezone';
        }
      });
    }

    function uid() {
      return Math.random().toString(36).slice(2,9);
    }

    addForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const tz = tzInput.value.trim();
      if (!tz) return;
      try {
        // validate
        new Intl.DateTimeFormat(undefined, { timeZone: tz });
      } catch (err) {
        alert('Invalid timezone name. Use an IANA timezone like "America/New_York".');
        return;
      }
      const label = tz.includes('/') ? tz.split('/').slice(-1)[0].replace('_',' ') : tz;
      zones.push({ id: uid(), label, tz });
      saveZones();
      tzInput.value = '';
      render();
    });

    presetBtn.addEventListener('click', () => {
      // Example: add common set (Sydney, Los Angeles, Berlin)
      const presets = [
        { id: uid(), label: 'Sydney', tz: 'Australia/Sydney' },
        { id: uid(), label: 'Los Angeles', tz: 'America/Los_Angeles' },
        { id: uid(), label: 'Berlin', tz: 'Europe/Berlin' }
      ];
      zones = zones.concat(presets);
      saveZones();
      render();
    });

    // Escape helper for labels
    function escapeHtml(s){ return String(s).replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c])); }

    // Initial render and timer
    render();
    setInterval(tick, 1000);
  </script>
</body>
</html>="viewport" content="width=device-width,initial-scale=1" />
  <title>Multi Timezone Digital Clock</title>
  <style>
    :root{--bg:#0f1724;--card:#0b1220;--accent:#06b6d4;--muted:#94a3b8;color-scheme:dark}
    *{box-sizing:border-box}
    body{margin:0;font-family:system-ui,-apple-system,Segoe UI,Roboto,"Helvetica Neue",Arial;background:var(--bg);color:white;display:flex;min-height:100vh;align-items:center;justify-content:center;padding:24px}
    .app{width:100%;max-width:900px}
    header{display:flex;align-items:center;gap:12px;margin-bottom:18px}
    h1{font-size:1.25rem;margin:0}
    .grid{display:grid;grid-template-columns:repeat(auto-fit,minmax(220px,1fr));gap:12px}
    .card{background:linear-gradient(180deg,rgba(255,255,255,0.02),transparent);padding:14px;border-radius:8px;border:1px solid rgba(255,255,255,0.03);box-shadow:0 6px 18px rgba(2,6,23,0.5)}
    .tz-name{display:flex;align-items:center;justify-content:space-between;font-weight:600;margin-bottom:8px;color:var(--muted)}
    .time{font-family:ui-monospace, SFMono-Regular, Menlo, Monaco, "Roboto Mono", "Helvetica Neue", monospace;font-size:1.5rem;line-height:1}
    .controls{display:flex;gap:8px;flex-wrap:wrap;margin-bottom:12px}
    input[type="text"]{padding:8px;border-radius:6px;border:1px solid rgba(255,255,255,0.06);background:transparent;color:inherit;min-width:200px}
    button{background:var(--accent);border:none;color:#021025;padding:8px 10px;border-radius:6px;cursor:pointer;font-weight:600}
    button.ghost{background:transparent;border:1px solid rgba(255,255,255,0.04);color:var(--muted);padding:6px 10px}
    small{color:var(--muted)}
    .remove{background:transparent;border:none;color:#ff7b7b;cursor:pointer;font-weight:700}
    footer{margin-top:14px;color:var(--muted);font-size:0.9rem}
    @media (max-width:420px){.time{font-size:1.25rem}}
  </style>
</head>
<body>
  <main class="app" role="main" aria-labelledby="title">
    <header>
      <h1 id="title">Multi Timezone Clock</h1>
      <small id="localTz"></small>
    </header>

    <section class="controls" aria-label="Controls">
      <form id="addForm" style="display:flex;gap:8px;flex-wrap:wrap;align-items:center">
        <input id="tzInput" placeholder="Add timezone (e.g. Europe/London)" aria-label="Timezone" />
        <button type="submit">Add</button>
        <button id="presetBtn" class="ghost" type="button">Add common set</button>
      </form>
      <small>Use IANA timezone names. Example: America/New_York, Europe/London, Asia/Tokyo.</small>
    </section>

    <section class="grid" id="clocks" aria-live="polite"></section>

    <footer>
      Tip: If an added timezone is invalid your browser will show an error; check exact IANA name. Your selection is saved to localStorage.
    </footer>
  </main>

  <script>
    // Defaults
    const DEFAULT_ZONES = [
      { id: 'local', label: 'Local', tz: Intl.DateTimeFormat().resolvedOptions().timeZone || 'UTC' },
      { id: 'utc', label: 'UTC', tz: 'UTC' },
      { id: 'ny', label: 'New York', tz: 'America/New_York' },
      { id: 'lon', label: 'London', tz: 'Europe/London' },
      { id: 'tok', label: 'Tokyo', tz: 'Asia/Tokyo' }
    ];

    const STORAGE_KEY = 'multi-tz-clocks';
    const clocksEl = document.getElementById('clocks');
    const tzInput = document.getElementById('tzInput');
    const addForm = document.getElementById('addForm');
    const presetBtn = document.getElementById('presetBtn');
    const localTzEl = document.getElementById('localTz');

    let zones = loadZones();

    function loadZones() {
      try {
        const raw = localStorage.getItem(STORAGE_KEY);
        if (raw) return JSON.parse(raw);
      } catch(e) { /* ignore */ }
      return DEFAULT_ZONES;
    }

    function saveZones() {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(zones));
    }

    function fmtDate(date, timeZone) {
      // show time with seconds and short timezone name
      const opts = { hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: false, timeZone, timeZoneName: 'short' };
      return new Intl.DateTimeFormat(undefined, opts).format(date);
    }

    function createClockCard(zone) {
      const card = document.createElement('article');
      card.className = 'card';
      card.dataset.tz = zone.tz;

      const header = document.createElement('div');
      header.className = 'tz-name';

      const name = document.createElement('div');
      name.innerHTML = `${escapeHtml(zone.label)} <small style="margin-left:6px;color:var(--muted);font-weight:500">${escapeHtml(zone.tz)}</small>`;

      const removeBtn = document.createElement('button');
      removeBtn.className = 'remove';
      removeBtn.title = 'Remove timezone';
      removeBtn.textContent = '✕';
      removeBtn.addEventListener('click', () => {
        zones = zones.filter(z => z.id !== zone.id);
        saveZones();
        render();
      });

      header.appendChild(name);
      header.appendChild(removeBtn);

      const timeEl = document.createElement('div');
      timeEl.className = 'time';
      timeEl.id = `time-${zone.id}`;

      card.appendChild(header);
      card.appendChild(timeEl);
      return card;
    }

    function render() {
      clocksEl.innerHTML = '';
      zones.forEach(zone => {
        try {
          // validate timezone by constructing a formatter (will throw for invalid tz)
          new Intl.DateTimeFormat(undefined, { timeZone: zone.tz });
        } catch (e) {
          // mark invalid but still render
          zone.invalid = true;
        }
        clocksEl.appendChild(createClockCard(zone));
      });
      updateLocalTzLabel();
      tick(); // immediate update
    }

    function updateLocalTzLabel() {
      const local = Intl.DateTimeFormat().resolvedOptions().timeZone || 'UTC';
      localTzEl.textContent = `Local timezone: ${local}`;
    }

    function tick() {
      const now = new Date();
      zones.forEach(zone => {
        const el = document.getElementById(`time-${zone.id}`);
        if (!el) return;
        try {
          el.textContent = fmtDate(now, zone.tz);
        } catch (e) {
          el.textContent = 'Invalid timezone';
        }
      });
    }

    function uid() {
      return Math.random().toString(36).slice(2,9);
    }

    addForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const tz = tzInput.value.trim();
      if (!tz) return;
      try {
        // validate
        new Intl.DateTimeFormat(undefined, { timeZone: tz });
      } catch (err) {
        alert('Invalid timezone name. Use an IANA timezone like "America/New_York".');
        return;
      }
      const label = tz.includes('/') ? tz.split('/').slice(-1)[0].replace('_',' ') : tz;
      zones.push({ id: uid(), label, tz });
      saveZones();
      tzInput.value = '';
      render();
    });

    presetBtn.addEventListener('click', () => {
      // Example: add common set (Sydney, Los Angeles, Berlin)
      const presets = [
        { id: uid(), label: 'Sydney', tz: 'Australia/Sydney' },
        { id: uid(), label: 'Los Angeles', tz: 'America/Los_Angeles' },
        { id: uid(), label: 'Berlin', tz: 'Europe/Berlin' }
      ];
      zones = zones.concat(presets);
      saveZones();
      render();
    });

    // Escape helper for labels
    function escapeHtml(s){ return String(s).replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c])); }

    // Initial render and timer
    render();
    setInterval(tick, 1000);
  </script>
</body>
</html>n# Professional-World-mining-
Professional 
