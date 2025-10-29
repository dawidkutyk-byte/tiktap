# TikTap - Next.js prototype (client-only)

This document contains a minimal **Next.js** prototype for a client-side app that connects to a ServerTap-like Minecraft plugin and simulates TikTok gifts locally. The prototype is intentionally simple so you can run it quickly and iterate.

---

## Project structure (all files below)

### package.json
```json
{
  "name": "tiktap-prototype",
  "version": "0.1.0",
  "private": true,
  "scripts": {
    "dev": "next dev -p 3000",
    "build": "next build",
    "start": "next start -p 3000"
  },
  "dependencies": {
    "next": "13.5.4",
    "react": "18.2.0",
    "react-dom": "18.2.0"
  }
}
```

---

### pages/_app.js
```jsx
import '../styles/globals.css'

export default function App({ Component, pageProps }) {
  return <Component {...pageProps} />
}
```

---

### styles/globals.css
```css
:root{
  --bg:#0f172a;
  --card:#0b1220;
  --muted:#9aa4b2;
  --accent:#7c3aed;
  --success:#16a34a;
}
*{box-sizing:border-box}
html,body,#__next{height:100%}
body{
  margin:0;
  font-family:Inter, ui-sans-serif, system-ui, -apple-system, 'Segoe UI', Roboto, 'Helvetica Neue', Arial;
  background:linear-gradient(180deg,var(--bg) 0%, #020617 100%);
  color:#e6eef8;
}
.container{max-width:1100px;margin:32px auto;padding:20px}
.header{display:flex;align-items:center;justify-content:space-between;margin-bottom:18px}
.card{background:linear-gradient(180deg, rgba(255,255,255,0.02), rgba(255,255,255,0.01));padding:16px;border-radius:10px;box-shadow:0 6px 18px rgba(2,6,23,0.6);}
.grid{display:grid;grid-template-columns:1fr 420px;gap:16px}
.input{width:100%;padding:10px;border-radius:8px;border:1px solid rgba(255,255,255,0.04);background:transparent;color:inherit}
.label{font-size:12px;color:var(--muted);margin-bottom:6px}
.btn{padding:10px 12px;border-radius:8px;border:0;background:var(--accent);color:white;cursor:pointer}
.smallBtn{padding:8px 10px;border-radius:8px;border:0;background:#1f2937;color:white;cursor:pointer}
.rulesList{margin-top:12px}
.rule{display:flex;gap:8px;align-items:center;margin-bottom:8px}
.textarea{width:100%;min-height:44px;padding:8px;border-radius:8px;background:transparent;border:1px solid rgba(255,255,255,0.04);color:inherit}
.log{height:220px;overflow:auto;background:#031226;padding:10px;border-radius:8px;font-family:monospace;font-size:13px}
.statusDot{display:inline-block;width:10px;height:10px;border-radius:50%}

.footer{margin-top:12px;color:var(--muted);font-size:13px}
```

---

### pages/index.js
```jsx
import { useEffect, useState, useRef } from 'react'

const DEFAULT_RULES = [
  { id: 1, gift: 'rose', command: '/say Dzięki za różę, %player%!' },
  { id: 2, gift: 'universe', command: '/give %player% diamond 1' },
]

export default function Home(){
  const [serverIp, setServerIp] = useState('127.0.0.1')
  const [port, setPort] = useState('25565')
  const [apiKey, setApiKey] = useState('')
  const [tiktokUser, setTiktokUser] = useState('twoj_username')
  const [connected, setConnected] = useState(false)
  const [rules, setRules] = useState(()=>{
    try{const v=localStorage.getItem('tapt_rules'); return v?JSON.parse(v):DEFAULT_RULES}catch(e){return DEFAULT_RULES}
  })
  const [logs, setLogs] = useState([])
  const logRef = useRef(null)
  const [testing, setTesting] = useState(false)

  useEffect(()=>{
    localStorage.setItem('tapt_rules', JSON.stringify(rules))
  },[rules])

  useEffect(()=>{ if(logRef.current) logRef.current.scrollTop = logRef.current.scrollHeight },[logs])

  function addLog(text, level='info'){
    const ts = new Date().toLocaleTimeString()
    setLogs(l=>[...l, {ts,text,level}])
  }

  async function testConnection(){
    setTesting(true)
    addLog('Test połączenia z ServerTap...')
    const base = `http://${serverIp}:${port}`
    try{
      const res = await fetch(base + '/v1/server', { method:'GET', headers: { 'x-api-key': apiKey }})
      if(!res.ok) throw new Error('Nieudane: ' + res.status)
      const json = await res.json()
      addLog('ServerTap odpowiedział: ' + JSON.stringify(json))
      setConnected(true)
    }catch(e){
      addLog('Błąd połączenia: ' + e.message)
      setConnected(false)
    }finally{ setTesting(false) }
  }

  function addRule(){
    const id = Date.now()
    setRules(r=>[...r, {id,gift:'new_gift',command:'/say Hello %player%'}])
  }
  function updateRule(id, patch){
    setRules(r=>r.map(x=> x.id===id? {...x,...patch}:x))
  }
  function removeRule(id){ setRules(r=>r.filter(x=>x.id!==id)) }

  async function simulateGift(giftName, fromUser='tester'){
    addLog(`Otrzymano symulowany gift '${giftName}' od ${fromUser}`)
    const matched = rules.filter(r=>r.gift.toLowerCase() === giftName.toLowerCase())
    if(matched.length===0){ addLog('Brak reguł dla tego gifta', 'warn'); return }
    for(const rule of matched){
      const command = rule.command.replace(/%player%/g, fromUser)
      addLog(`Wysyłanie komendy do ServerTap: ${command}`)
      const base = `http://${serverIp}:${port}`
      try{
        const res = await fetch(base + '/v1/execute', {
          method: 'POST',
          headers: { 'Content-Type':'application/json', 'x-api-key': apiKey },
          body: JSON.stringify({ action: 'runCommand', command })
        })
        if(!res.ok) throw new Error('Status ' + res.status)
        const json = await res.json()
        addLog('ServerTap -> ' + JSON.stringify(json), 'success')
      }catch(e){
        addLog('Błąd wysyłki do serwera: ' + e.message, 'error')
      }
    }
  }

  return (
    <div className="container">
      <div className="header">
        <h1>🎛️ TikTap — Prototype</h1>
        <div style={{textAlign:'right'}}>
          <div style={{fontSize:12,color:'var(--muted)'}}>Local prototype · Client-only</div>
          <div style={{marginTop:6}}>
            <span className="statusDot" style={{background: connected? 'var(--success)': '#ef4444', marginRight:8}}></span>
            <strong>{connected? 'Połączono z ServerTap':'Niepołączono'}</strong>
          </div>
        </div>
      </div>

      <div className="grid">
        <div>
          <div className="card">
            <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:12}}>
              <div>
                <div className="label">TikTok username</div>
                <input className="input" value={tiktokUser} onChange={e=>setTiktokUser(e.target.value)} />
              </div>
              <div>
                <div className="label">Server IP</div>
                <input className="input" value={serverIp} onChange={e=>setServerIp(e.target.value)} />
              </div>
              <div>
                <div className="label">Port</div>
                <input className="input" value={port} onChange={e=>setPort(e.target.value)} />
              </div>
              <div>
                <div className="label">API key</div>
                <input className="input" value={apiKey} onChange={e=>setApiKey(e.target.value)} />
              </div>
            </div>

            <div style={{display:'flex',gap:8,marginTop:12}}>
              <button className="btn" onClick={testConnection} disabled={testing}>{testing? 'Testing...':'Test połączenia'}</button>
              <button className="smallBtn" onClick={()=>{ localStorage.removeItem('tapt_rules'); setRules(DEFAULT_RULES); addLog('Zresetowano reguły') }}>Reset reguł</button>
            </div>

            <hr style={{margin:'14px 0',borderColor:'rgba(255,255,255,0.03)'}} />

            <div>
              <div style={{display:'flex',justifyContent:'space-between',alignItems:'center'}}>
                <h3 style={{margin:0}}>Mapowanie gift → komenda</h3>
                <button className="smallBtn" onClick={addRule}>+ Dodaj regułę</button>
              </div>

              <div className="rulesList">
                {rules.map(rule=> (
                  <div key={rule.id} className="rule">
                    <div style={{flex:'0 0 140px'}}>
                      <div className="label">Gift</div>
                      <input className="input" value={rule.gift} onChange={e=>updateRule(rule.id,{gift:e.target.value})} />
                    </div>
                    <div style={{flex:1}}>
                      <div className="label">Komenda</div>
                      <input className="input" value={rule.command} onChange={e=>updateRule(rule.id,{command:e.target.value})} />
                    </div>
                    <div style={{display:'flex',flexDirection:'column',gap:6}}>
                      <button className="smallBtn" onClick={()=>simulateGift(rule.gift, 'test_user')}>Test</button>
                      <button className="smallBtn" onClick={()=>removeRule(rule.id)}>Usuń</button>
                    </div>
                  </div>
                ))}
              </div>

            </div>

          </div>

          <div style={{marginTop:12}} className="card">
            <h3 style={{marginTop:0}}>Symulacja giftów</h3>
            <div style={{display:'flex',gap:8}}>
              <input className="input" placeholder="nazwa gifta (np. rose)" id="simGift" />
              <input className="input" placeholder="nick darczyńcy" id="simUser" />
              <button className="btn" onClick={() => {
                const gift = document.getElementById('simGift').value || 'rose'
                const who = document.getElementById('simUser').value || 'tester'
                simulateGift(gift, who)
              }}>Wyślij gift testowy</button>
            </div>
            <div className="footer">Podpowiedź: użyj pola <code>%player%</code> w komendzie aby podstawić nick darczyńcy.</div>
          </div>

        </div>

        <div>
          <div className="card">
            <h3 style={{marginTop:0}}>Logi</h3>
            <div className="log" ref={logRef}>
              {logs.map((l,i)=> (
                <div key={i} style={{marginBottom:6}}>
                  <span style={{color:'var(--muted)',marginRight:8}}>[{l.ts}]</span>
                  <span>{l.text}</span>
                </div>
              ))}
            </div>
            <div style={{marginTop:10,display:'flex',gap:8}}>
              <button className="smallBtn" onClick={()=>{ setLogs([]) }}>Wyczyść</button>
            </div>
          </div>

          <div style={{marginTop:12}} className="card">
            <h3 style={{marginTop:0}}>Pomoc / uwagi</h3>
            <ul style={{color:'var(--muted)'}}>
              <li>Ten prototyp symuluje eventy lokalnie (brak połączenia z TikTok).</li>
              <li>ServerTap musi udostępniać endpointy: <code>GET /v1/server</code> oraz <code>POST /v1/execute</code> (z headerem <code>x-api-key</code>).</li>
              <li>Jeśli serwer jest za NAT/em lub nie ma CORS — użyj tunelu (ngrok) lub prostego proxy.</li>
            </ul>
          </div>
        </div>

      </div>

      <div style={{textAlign:'center',marginTop:18,color:'var(--muted)'}}>Gotowe — uruchom projekt: <code>npm install</code> → <code>npm run dev</code></div>

    </div>
  )
}
```

---

### README (run)
```md
# TikTap - Next.js prototype

1. Zainstaluj zależności:

```bash
npm install
```

2. Uruchom w trybie deweloperskim:

```bash
npm run dev
```

3. Otwórz http://localhost:3000

Uwaga: aplikacja wysyła zapytania bezpośrednio z przeglądarki do `http://<IP>:<PORT>/v1/...`. Jeśli twój ServerTap nie obsługuje CORS lub serwer jest za NAT/em — użyj ngrok lub uruchom prosty proxy.
```

---

## Co zrobiłem tutaj
- Przygotowałem prostą stronę Next.js, klient-side only, z:
  - formularzem konfiguracji (IP, port, API key, username),
  - edytorem reguł gift→komenda,
  - symulatorem giftów (wysyła żądania do ServerTap),
  - logami i zapisem reguł w localStorage.

---

Jeśli chcesz, mogę teraz:
- Dodać autentyczne połączenie z TikTok (wymaga proxy / serwera),
- Dodać autoryzację (PIN),
- Zmienić endpointy/format payloadu do twojego pluginu ServerTap (wyślij dokumentację API pluginu).


