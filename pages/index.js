import { useRef, useState } from 'react'

export default function Home() {
  const logRef = useRef(null)
  const [logs, setLogs] = useState([])

  const addLog = (text) => {
    const ts = new Date().toLocaleTimeString()
    setLogs(prev => [...prev, { ts, text }])
    if (logRef.current) {
      logRef.current.scrollTop = logRef.current.scrollHeight
    }
  }

  // Test połączenia z ServerTap
  const testConnection = async () => {
    const ip = document.getElementById('serverIP').value
    const port = document.getElementById('serverPort').value
    const key = document.getElementById('apiKey').value

    if (!ip || !port || !key) {
      addLog('⚠️ Wypełnij IP, port i API key!')
      return
    }

    try {
      const res = await fetch(`http://${ip}:${port}/v1/server`, {
        headers: { 'x-api-key': key }
      })
      const data = await res.json()
      addLog(`✅ Połączono z ServerTap: ${JSON.stringify(data)}`)
    } catch (err) {
      addLog(`❌ Błąd połączenia: ${err.message}`)
    }
  }

  // Wysyłanie giftu
  const sendGift = async () => {
    const ip = document.getElementById('serverIP').value
    const port = document.getElementById('serverPort').value
    const key = document.getElementById('apiKey').value
    const user = document.getElementById('username').value
    const gift = document.getElementById('simGift').value || 'rose'
    const who = document.getElementById('simUser').value || 'tester'

    if (!ip || !port || !key || !user) {
      addLog('⚠️ Wypełnij wszystkie pola konfiguracyjne!')
      return
    }

    // Wyślij lokalny log
    addLog(`🎁 Symulacja giftu: ${who} wysłał ${gift}`)

    // Wyślij request do ServerTap
    try {
      const res = await fetch(`http://${ip}:${port}/v1/execute`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-api-key': key
        },
        body: JSON.stringify({
          username: user,
          gift,
          from: who
        })
      })
      const data = await res.json()
      addLog(`✅ ServerTap odpowiedź: ${JSON.stringify(data)}`)
    } catch (err) {
      addLog(`❌ Błąd wysyłki giftu: ${err.message}`)
    }
  }

  return (
    <div className="container">
      <h1>Symulator Giftów + ServerTap</h1>

      <div className="card" style={{ marginBottom: 12 }}>
        <h3>Konfiguracja ServerTap</h3>
        <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginBottom: 8 }}>
          <input className="input" placeholder="IP serwera" id="serverIP" />
          <input className="input" placeholder="Port" id="serverPort" defaultValue="4567" />
          <input className="input" placeholder="API Key" id="apiKey" defaultValue="change_me" />
          <input className="input" placeholder="Username" id="username" />
        </div>
        <button className="btn" onClick={testConnection}>Test połączenia</button>
      </div>

      <div className="card" style={{ marginBottom: 12 }}>
        <h3>Symulator Giftów</h3>
        <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginBottom: 8 }}>
          <input className="input" placeholder="nazwa gifta (np. rose)" id="simGift" />
          <input className="input" placeholder="nick darczyńcy" id="simUser" />
        </div>
        <button className="btn" onClick={sendGift}>Wyślij gift testowy</button>
        <div className="footer" style={{ marginTop: 8 }}>
          Podpowiedź: użyj pola <code>%player%</code> w komendzie, aby podstawić nick darczyńcy.
        </div>
      </div>

      <div className="card">
        <h3>Logi</h3>
        <div className="log" ref={logRef}>
          {logs.map((l, i) => (
            <div key={i} style={{ marginBottom: 6 }}>
              <span style={{ color: 'var(--muted)', marginRight: 8 }}>[{l.ts}]</span>
              <span>{l.text}</span>
            </div>
          ))}
        </div>
        <button className="smallBtn" style={{ marginTop: 10 }} onClick={() => setLogs([])}>Wyczyść</button>
      </div>

      <div className="card" style={{ marginTop: 12 }}>
        <h3>Pomoc / uwagi</h3>
        <ul style={{ color: 'var(--muted)' }}>
          <li>Ten prototyp symuluje eventy lokalnie (brak połączenia z TikTok).</li>
          <li>ServerTap musi udostępniać endpointy: <code>GET /v1/server</code> oraz <code>POST /v1/execute</code> (z headerem <code>x-api-key</code>).</li>
          <li>Jeśli serwer jest za NAT/em lub nie ma CORS — użyj tunelu (ngrok) lub prostego proxy.</li>
        </ul>
      </div>

      <div style={{ textAlign: 'center', marginTop: 18, color: 'var(--muted)' }}>
        Gotowe — uruchom projekt: <code>npm install</code> → <code>npm run dev</code>
      </div>
    </div>
  )
}

