```jsx
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
