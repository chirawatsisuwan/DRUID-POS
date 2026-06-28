/* ═══════════════════════════════════════════════════════════════
   DRUID Cafe & Bar — POS v3 PWA
   Full-featured iOS PWA Point of Sale
═══════════════════════════════════════════════════════════════ */
const { useState, useMemo, useRef, useEffect, useCallback, useReducer } = React;

/* ══════════ THEME ══════════ */
const T = {
  bg:"#080a08", bg2:"#0d100d", bg3:"#111411", surface:"#161b16",
  border:"#243024", border2:"#1a1f1a",
  green:"#4ade80", greenDim:"#2a5c3a", greenGlow:"#4ade8028",
  gold:"#c8a96e", red:"#e05252", blue:"#5da8e0", purple:"#9b72e0",
  text:"#e4ebe4", textMid:"#7a957a", textDim:"#3d4e3d",
  font:"'Space Grotesk','Prompt',sans-serif",
  mono:"'JetBrains Mono',monospace",
};

/* ══════════ CONSTANTS ══════════ */
const CATS = ["ALL","COFFEE","DRINK","FOOD","DESSERT","BAR"];
const EXP_CATS = ["วัตถุดิบ","ค่าใช้จ่ายประจำ","อุปกรณ์","พนักงาน","การตลาด","ซ่อมบำรุง","อื่นๆ"];
const MONTHS = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];
const ROLES  = { owner:"OWNER", manager:"MANAGER", staff:"STAFF" };

const USERS = [
  { id:1, name:"Owner",   pin:"1234", role:"owner"   },
  { id:2, name:"Manager", pin:"2222", role:"manager" },
  { id:3, name:"Staff A", pin:"3333", role:"staff"   },
  { id:4, name:"Staff B", pin:"4444", role:"staff"   },
];

const INIT_MENU = [
  { id:1,  name:"Americano",      cat:"COFFEE",  price:65,  stock:50, emoji:"☕", img:"https://images.unsplash.com/photo-1551030173-122aabc4489c?w=300&q=80",  presets:["Hot","Iced","Extra shot","No sugar","Oat milk"] },
  { id:2,  name:"Latte",          cat:"COFFEE",  price:75,  stock:50, emoji:"🥛", img:"https://images.unsplash.com/photo-1561882468-9110e03e0f78?w=300&q=80",  presets:["Hot","Iced","Oat milk","No sugar","Extra shot"] },
  { id:3,  name:"Cappuccino",     cat:"COFFEE",  price:75,  stock:50, emoji:"☕", img:"https://images.unsplash.com/photo-1572442388796-11668a67e53d?w=300&q=80", presets:["Hot","Dry","Wet","Extra foam"] },
  { id:4,  name:"Matcha Latte",   cat:"COFFEE",  price:85,  stock:30, emoji:"🍵", img:"https://images.unsplash.com/photo-1536256263959-770b48d82b0a?w=300&q=80", presets:["Hot","Iced","Less sweet","No sugar"] },
  { id:5,  name:"Thai Iced Tea",  cat:"DRINK",   price:55,  stock:40, emoji:"🧋", img:"https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=300&q=80",  presets:["Less sweet","No milk","Extra ice"] },
  { id:6,  name:"Cold Brew",      cat:"COFFEE",  price:95,  stock:40, emoji:"🧊", img:"https://images.unsplash.com/photo-1461023058943-07fcbe16d735?w=300&q=80", presets:["Extra ice","With milk","Black"] },
  { id:7,  name:"Chocolate Cake", cat:"DESSERT", price:95,  stock:15, emoji:"🍰", img:"https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=300&q=80", presets:["Warm","With cream","Extra sauce"] },
  { id:8,  name:"Egg Tart",       cat:"DESSERT", price:55,  stock:25, emoji:"🥧", img:"https://images.unsplash.com/photo-1621236378699-8597faf6a176?w=300&q=80", presets:["Warm","Cold"] },
  { id:9,  name:"Croissant",      cat:"FOOD",    price:65,  stock:20, emoji:"🥐", img:"https://images.unsplash.com/photo-1555507036-ab1f4038808a?w=300&q=80",   presets:["Toasted","With butter","With jam"] },
  { id:10, name:"Sandwich",       cat:"FOOD",    price:120, stock:15, emoji:"🥪", img:"https://images.unsplash.com/photo-1528735602780-2552fd46c7af?w=300&q=80",  presets:["No onion","Extra sauce","Toasted"] },
  { id:11, name:"Pasta",          cat:"FOOD",    price:180, stock:10, emoji:"🍝", img:"https://images.unsplash.com/photo-1621996346565-e3dbc646d9a9?w=300&q=80",  presets:["No chili","Extra cheese","Al dente"] },
  { id:12, name:"Salad",          cat:"FOOD",    price:135, stock:12, emoji:"🥗", img:"https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=300&q=80",  presets:["No dressing","Extra dressing"] },
  { id:13, name:"Draft Beer",     cat:"BAR",     price:120, stock:40, emoji:"🍺", img:"https://images.unsplash.com/photo-1608270586620-248524c67de9?w=300&q=80", presets:["Half pint","Full pint","Cold glass"] },
  { id:14, name:"Whisky Soda",    cat:"BAR",     price:180, stock:30, emoji:"🥃", img:"https://images.unsplash.com/photo-1527281400683-1aae777175f8?w=300&q=80", presets:["Less soda","More ice","Double"] },
];
const INIT_RAW = [
  { id:1, name:"Coffee Beans",  unit:"g",   qty:2000, minQty:500,  cost:1.2,  emoji:"☕" },
  { id:2, name:"Milk",          unit:"ml",  qty:5000, minQty:1000, cost:0.08, emoji:"🥛" },
  { id:3, name:"Sugar",         unit:"g",   qty:3000, minQty:500,  cost:0.05, emoji:"🍬" },
  { id:4, name:"Flour",         unit:"g",   qty:4000, minQty:1000, cost:0.06, emoji:"🌾" },
  { id:5, name:"Paper Cup",     unit:"pcs", qty:200,  minQty:50,   cost:2.5,  emoji:"🥤" },
  { id:6, name:"Matcha Powder", unit:"g",   qty:500,  minQty:100,  cost:3.0,  emoji:"🍃" },
];
const INIT_TABLES = [
  { id:1, label:"A1", zone:"indoor",  status:"empty", x:70,  y:50,  seats:4 },
  { id:2, label:"A2", zone:"indoor",  status:"empty", x:210, y:50,  seats:4 },
  { id:3, label:"A3", zone:"indoor",  status:"empty", x:350, y:50,  seats:2 },
  { id:4, label:"B1", zone:"indoor",  status:"empty", x:70,  y:180, seats:4 },
  { id:5, label:"B2", zone:"indoor",  status:"empty", x:210, y:180, seats:6 },
  { id:6, label:"B3", zone:"indoor",  status:"empty", x:350, y:180, seats:4 },
  { id:7, label:"O1", zone:"outdoor", status:"empty", x:70,  y:50,  seats:2 },
  { id:8, label:"O2", zone:"outdoor", status:"empty", x:190, y:50,  seats:2 },
  { id:9, label:"O3", zone:"outdoor", status:"empty", x:310, y:50,  seats:4 },
  {id:10, label:"O4", zone:"outdoor", status:"empty", x:70,  y:180, seats:2 },
  {id:11, label:"O5", zone:"outdoor", status:"empty", x:190, y:180, seats:4 },
];
const INIT_HAPPY = [
  { id:1, label:"Afternoon Special", days:[1,2,3,4,5], start:"14:00", end:"17:00", discount:15, active:true },
  { id:2, label:"Happy Hour",        days:[5,6,0],     start:"18:00", end:"21:00", discount:20, active:true },
];

/* ══════════ HELPERS ══════════ */
const fp    = n => (n||0).toLocaleString("th-TH");
const fd    = d => new Date(d).toLocaleString("th-TH",{day:"2-digit",month:"short",year:"numeric",hour:"2-digit",minute:"2-digit"});
const fdate = d => new Date(d).toLocaleDateString("th-TH",{day:"2-digit",month:"short",year:"numeric"});
const iso   = d => new Date(d).toISOString().slice(0,10);

function useLS(key, init) {
  const [v, setV] = useState(() => {
    try { const s = localStorage.getItem(key); return s ? JSON.parse(s) : (typeof init === "function" ? init() : init); }
    catch { return typeof init === "function" ? init() : init; }
  });
  useEffect(() => { try { localStorage.setItem(key, JSON.stringify(v)); } catch {} }, [key, v]);
  return [v, setV];
}

function getActiveHH(hhs) {
  const d = new Date(), hhmm = d.getHours()*60 + d.getMinutes(), dow = d.getDay();
  return hhs.find(h => {
    if (!h.active) return false;
    if (!h.days.includes(dow)) return false;
    const [sh,sm] = h.start.split(":").map(Number);
    const [eh,em] = h.end.split(":").map(Number);
    return hhmm >= sh*60+sm && hhmm < eh*60+em;
  }) || null;
}

/* ══════════ UI PRIMITIVES ══════════ */
function Modal({ children, onClose, wide, xl }) {
  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => { document.body.style.overflow = ""; };
  }, []);
  return (
    <div onClick={onClose}
      style={{ position:"fixed",inset:0,background:"#000000bb",display:"flex",alignItems:"flex-end",
        justifyContent:"center",zIndex:500,backdropFilter:"blur(8px)",
        WebkitBackdropFilter:"blur(8px)", padding:"0" }}>
      <div onClick={e => e.stopPropagation()}
        style={{ background:T.bg3, border:`1px solid ${T.border}`, borderRadius:"16px 16px 0 0",
          padding:22, width:"100%", maxWidth:xl?900:wide?640:500,
          maxHeight:"92vh", overflowY:"auto",
          paddingBottom:`calc(22px + env(safe-area-inset-bottom))`,
          boxShadow:"0 -20px 60px #000c",
          animation:"slideUp .25s ease" }}>
        {/* Drag handle */}
        <div style={{ width:40,height:4,background:T.border,borderRadius:2,margin:"-6px auto 16px",cursor:"pointer" }} onClick={onClose}/>
        {children}
      </div>
    </div>
  );
}

function Toast({ t }) {
  if (!t) return null;
  const col = t.e ? T.red : t.warn ? T.gold : T.green;
  return (
    <div style={{ position:"fixed", top:"calc(58px + env(safe-area-inset-top))", right:14, left:14,
      background:T.bg3, color:col, padding:"11px 16px", borderRadius:10, zIndex:900,
      fontWeight:700, fontSize:13, fontFamily:T.font, letterSpacing:.3,
      border:`1px solid ${col}44`, boxShadow:"0 8px 32px #000c",
      display:"flex", alignItems:"center", gap:8 }}>
      <span style={{ fontSize:16 }}>{t.e ? "✕" : t.warn ? "⚠" : "✓"}</span>
      {t.msg}
    </div>
  );
}

function Btn({ v="sec", sm, children, sx, ...p }) {
  const base = { padding:sm?"6px 14px":"11px 20px", borderRadius:8, border:"none", cursor:"pointer",
    fontSize:sm?12:14, fontFamily:T.font, fontWeight:700, letterSpacing:.4,
    transition:"all .15s", WebkitTapHighlightColor:"transparent",
    minHeight:sm?32:44, display:"inline-flex", alignItems:"center", justifyContent:"center", gap:6, ...sx };
  const vs = {
    pri:   { background:T.green, color:T.bg, boxShadow:`0 0 14px ${T.greenGlow}` },
    danger:{ background:"#2a1010", color:T.red, border:`1px solid #3a1818` },
    ghost: { background:"transparent", color:T.textMid, border:`1px solid ${T.border}` },
    sec:   { background:T.surface, color:T.text, border:`1px solid ${T.border}` },
    gold:  { background:"#1e1800", color:T.gold, border:`1px solid #3a3010` },
    blue:  { background:"#0f1a2a", color:T.blue, border:`1px solid #1a2a3a` },
  };
  return <button style={{ ...base, ...vs[v] }} {...p}>{children}</button>;
}

function Field({ label, textarea, hint, ...p }) {
  const s = { background:T.surface, border:`1px solid ${T.border}`, borderRadius:8,
    color:T.text, padding:"10px 13px", fontSize:14, fontFamily:T.font,
    width:"100%", outline:"none", WebkitAppearance:"none" };
  return (
    <div style={{ marginBottom:12 }}>
      {label && <div style={{ fontSize:10,color:T.textDim,marginBottom:5,letterSpacing:1.5,textTransform:"uppercase" }}>{label}</div>}
      {textarea ? <textarea style={{...s,resize:"vertical",minHeight:72}} {...p}/> : <input style={s} {...p}/>}
      {hint && <div style={{ fontSize:10,color:T.textDim,marginTop:4 }}>{hint}</div>}
    </div>
  );
}

function SL({ children, color }) {
  return <div style={{ fontSize:10,letterSpacing:2.5,color:color||T.textDim,fontWeight:700,marginBottom:10,textTransform:"uppercase" }}>{children}</div>;
}

function Kpi({ label, value, color, sub }) {
  return (
    <div style={{ padding:14,background:T.surface,border:`1px solid ${T.border2}`,borderRadius:10,textAlign:"center",minHeight:76 }}>
      <div style={{ fontSize:20,fontWeight:700,color:color||T.text,fontFamily:T.mono,lineHeight:1 }}>{value}</div>
      {sub && <div style={{ fontSize:10,color:color||T.textMid,fontFamily:T.mono,marginTop:2 }}>{sub}</div>}
      <div style={{ fontSize:9,color:T.textDim,marginTop:5,letterSpacing:1.5 }}>{label}</div>
    </div>
  );
}

/* ══════════ INSTALL PROMPT BANNER ══════════ */
function InstallBanner({ prompt, onDismiss }) {
  if (!prompt) return null;
  return (
    <div style={{ background:"#1a2a1a", border:`1px solid ${T.green}44`, borderRadius:10,
      padding:"12px 14px", margin:"8px 14px", display:"flex", alignItems:"center", gap:12 }}>
      <span style={{ fontSize:28 }}>📲</span>
      <div style={{ flex:1 }}>
        <div style={{ fontSize:13,fontWeight:700,color:T.green }}>Install DRUID POS</div>
        <div style={{ fontSize:11,color:T.textMid }}>Add to Home Screen for the best experience</div>
      </div>
      <Btn v="pri" sm onClick={() => { prompt.prompt(); onDismiss(); }}>INSTALL</Btn>
      <button onClick={onDismiss} style={{ background:"transparent",border:"none",color:T.textDim,cursor:"pointer",fontSize:18,padding:4 }}>✕</button>
    </div>
  );
}

/* ══════════ PIN SCREEN ══════════ */
function PinScreen({ onLogin }) {
  const [sel, setSel] = useState(null);
  const [pin, setPin] = useState("");
  const [err, setErr] = useState(false);
  const [shake, setShake] = useState(false);

  const press = d => {
    const np = pin + d;
    setPin(np); setErr(false);
    if (np.length === 4) {
      const u = USERS.find(u => u.id === sel?.id && u.pin === np);
      if (u) { onLogin(u); }
      else {
        setErr(true); setShake(true);
        setTimeout(() => { setPin(""); setErr(false); setShake(false); }, 700);
      }
    }
  };

  return (
    <div style={{ minHeight:"100vh", minHeight:"100dvh", background:T.bg, display:"flex",
      flexDirection:"column", alignItems:"center", justifyContent:"center",
      padding:"20px 20px calc(20px + env(safe-area-inset-bottom))",
      paddingTop:"calc(20px + env(safe-area-inset-top))", fontFamily:T.font }}>
      <div style={{ fontSize:32,fontWeight:700,letterSpacing:6,color:T.green }}>DRUID</div>
      <div style={{ fontSize:10,letterSpacing:5,color:T.textDim,marginBottom:48 }}>CAFE &amp; BAR · POS</div>

      {!sel ? (
        <div style={{ width:"100%", maxWidth:320 }}>
          <SL>SELECT STAFF</SL>
          <div style={{ display:"flex", flexDirection:"column", gap:8 }}>
            {USERS.map(u => (
              <button key={u.id} onClick={() => setSel(u)}
                style={{ padding:"15px 20px", borderRadius:12, border:`1px solid ${T.border}`,
                  background:T.surface, color:T.text, cursor:"pointer", fontSize:15,
                  fontFamily:T.font, fontWeight:600, letterSpacing:.5, textAlign:"left",
                  display:"flex", justifyContent:"space-between", alignItems:"center",
                  WebkitTapHighlightColor:"transparent" }}>
                <span>{u.name}</span>
                <span style={{ fontSize:10,color:T.textDim,letterSpacing:1 }}>{ROLES[u.role]}</span>
              </button>
            ))}
          </div>
        </div>
      ) : (
        <div style={{ width:"100%", maxWidth:300, textAlign:"center" }}>
          <div style={{ fontSize:13,color:T.textMid,marginBottom:4 }}>
            Welcome, <span style={{ color:T.green,fontWeight:700 }}>{sel.name}</span>
          </div>
          <div style={{ fontSize:10,letterSpacing:2,color:T.textDim,marginBottom:28 }}>ENTER PIN</div>

          {/* PIN dots */}
          <div style={{ display:"flex",justifyContent:"center",gap:16,marginBottom:36,
            animation:shake?"shake .3s ease":"none" }}>
            {[0,1,2,3].map(i => (
              <div key={i} style={{ width:16,height:16,borderRadius:"50%",
                background:pin.length>i?(err?T.red:T.green):T.border,
                transition:"background .15s",
                boxShadow:pin.length>i?`0 0 12px ${err?T.red:T.green}55`:"none" }}/>
            ))}
          </div>

          {/* Numpad — iPad/iPhone optimized large touch targets */}
          <div style={{ display:"grid", gridTemplateColumns:"repeat(3,1fr)", gap:10 }}>
            {[1,2,3,4,5,6,7,8,9,"",0,"⌫"].map((d,i) => (
              <button key={i} onClick={() => d==="⌫"?setPin(p=>p.slice(0,-1)):d!==""&&pin.length<4&&press(String(d))}
                style={{ padding:"18px 0", borderRadius:12,
                  border:`1px solid ${d==="⌫"?T.red+"44":T.border}`,
                  background:d===""?"transparent":d==="⌫"?"#1a0a0a":T.surface,
                  color:d==="⌫"?T.red:T.text, cursor:d===""?"default":"pointer",
                  fontSize:22, fontFamily:T.mono, fontWeight:600,
                  opacity:d===""?0:1, WebkitTapHighlightColor:"transparent",
                  transition:"all .1s", minHeight:64 }}>
                {d}
              </button>
            ))}
          </div>
          <button onClick={() => { setSel(null); setPin(""); }}
            style={{ marginTop:24,fontSize:12,color:T.textDim,background:"transparent",
              border:"none",cursor:"pointer",fontFamily:T.font,letterSpacing:1 }}>
            ← BACK
          </button>
        </div>
      )}

      <style>{`@keyframes shake{0%,100%{transform:translateX(0)}25%{transform:translateX(-8px)}75%{transform:translateX(8px)}}`}</style>
    </div>
  );
}

/* ══════════ ITEM NOTE MODAL ══════════ */
function NoteModal({ item, existing, onSave, onClose }) {
  const [note, setNote] = useState(existing || "");
  const presets = item?.presets || [];
  const toggle = p => setNote(n => {
    const parts = n.split(",").map(s => s.trim()).filter(Boolean);
    const idx = parts.indexOf(p);
    if (idx >= 0) parts.splice(idx, 1); else parts.push(p);
    return parts.join(", ");
  });
  const active = p => note.split(",").map(s => s.trim()).includes(p);
  return (
    <Modal onClose={onClose}>
      <SL>ORDER NOTE — {item?.name}</SL>
      {presets.length > 0 && (
        <div style={{ display:"flex",flexWrap:"wrap",gap:8,marginBottom:14 }}>
          {presets.map(p => (
            <button key={p} onClick={() => toggle(p)}
              style={{ padding:"7px 14px",borderRadius:20,
                border:`1px solid ${active(p)?T.green:T.border}`,
                background:active(p)?T.greenGlow:"transparent",
                color:active(p)?T.green:T.textMid,
                cursor:"pointer",fontSize:13,fontFamily:T.font,fontWeight:600,
                minHeight:36, WebkitTapHighlightColor:"transparent" }}>
              {p}
            </button>
          ))}
        </div>
      )}
      <Field label="Custom note" value={note} onChange={e=>setNote(e.target.value)} textarea placeholder="e.g. No sugar, extra ice..."/>
      <div style={{ display:"flex",gap:8 }}>
        <Btn v="ghost" sx={{ flex:1 }} onClick={onClose}>CANCEL</Btn>
        <Btn v="pri" sx={{ flex:1 }} onClick={() => onSave(note)}>SAVE NOTE</Btn>
      </div>
    </Modal>
  );
}

/* ══════════ KDS VIEW ══════════ */
function KDSView({ queue, onBump }) {
  const pending = queue.filter(o => o.kdsStatus !== "done");
  const done    = queue.filter(o => o.kdsStatus === "done");
  return (
    <div style={{ flex:1,overflowY:"auto",padding:16 }}>
      <div style={{ display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:14 }}>
        <SL>KITCHEN DISPLAY</SL>
        <div style={{ display:"flex",gap:10,fontSize:11 }}>
          <span style={{ color:T.red }}>{pending.filter(o=>Math.floor((Date.now()-o.id)/60000)>=10).length} URGENT</span>
          <span style={{ color:T.gold }}>{pending.filter(o=>o.kdsStatus==="cooking").length} COOKING</span>
          <span style={{ color:T.textDim }}>{pending.filter(o=>o.kdsStatus==="new").length} WAITING</span>
        </div>
      </div>
      {pending.length === 0 && (
        <div style={{ textAlign:"center",marginTop:80,color:T.textDim }}>
          <div style={{ fontSize:48,marginBottom:12 }}>✓</div>
          <div style={{ fontSize:13,letterSpacing:2 }}>ALL CLEAR</div>
        </div>
      )}
      <div style={{ display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(280px,1fr))",gap:12 }}>
        {pending.map(o => {
          const age = Math.floor((Date.now()-o.id)/60000);
          const urgent = age >= 10;
          return (
            <div key={o.id} style={{ background:T.surface,
              border:`2px solid ${o.kdsStatus==="cooking"?T.gold:urgent?T.red:T.border}`,
              borderRadius:12,padding:14,
              boxShadow:urgent?`0 0 20px ${T.red}33`:o.kdsStatus==="cooking"?`0 0 20px ${T.gold}33`:"none" }}>
              <div style={{ display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:10 }}>
                <span style={{ fontFamily:T.mono,fontWeight:700,fontSize:15,color:T.green }}>
                  #{String(o.id).slice(-4)}
                </span>
                <div style={{ display:"flex",gap:6,alignItems:"center" }}>
                  {o.tableLabel && (
                    <span style={{ background:T.greenGlow,color:T.green,fontSize:10,padding:"2px 8px",borderRadius:20,fontWeight:700 }}>
                      {o.tableLabel}
                    </span>
                  )}
                  <span style={{ fontSize:10,color:urgent?T.red:T.textDim,fontFamily:T.mono,fontWeight:urgent?700:400 }}>
                    {age}m {urgent?"⚠":""}
                  </span>
                </div>
              </div>
              <div style={{ marginBottom:12 }}>
                {o.items.map((it,i) => (
                  <div key={i} style={{ display:"flex",justifyContent:"space-between",marginBottom:5,fontSize:14 }}>
                    <span style={{ fontWeight:600 }}>{it.name} <span style={{ color:T.textDim }}>×{it.qty}</span></span>
                    {it.note && <span style={{ fontSize:11,color:T.gold,maxWidth:130,textAlign:"right",overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap" }}>{it.note}</span>}
                  </div>
                ))}
              </div>
              <div style={{ display:"flex",gap:8 }}>
                {o.kdsStatus==="new" && <Btn v="gold" sm sx={{ flex:1,minHeight:40 }} onClick={()=>onBump(o.id,"cooking")}>🔥 START</Btn>}
                {o.kdsStatus==="cooking" && <Btn v="pri" sm sx={{ flex:1,minHeight:40 }} onClick={()=>onBump(o.id,"done")}>✓ DONE</Btn>}
              </div>
            </div>
          );
        })}
      </div>
      {done.length > 0 && (
        <div style={{ marginTop:24 }}>
          <SL>COMPLETED ({done.length})</SL>
          <div style={{ display:"flex",flexWrap:"wrap",gap:7 }}>
            {done.slice(0,20).map(o => (
              <div key={o.id} style={{ background:T.bg3,border:`1px solid ${T.border2}`,borderRadius:7,
                padding:"5px 10px",fontSize:11,color:T.textDim,fontFamily:T.mono }}>
                #{String(o.id).slice(-4)} {o.tableLabel||""} ✓
              </div>
            ))}
          </div>
        </div>
      )}
    </div>

  );
}
/* ══════════════════════════════════════════════════════════════
   DruidPOS — Main Component (Part 2)
   Requires app-part1.jsx to be loaded first
══════════════════════════════════════════════════════════════ */

function DruidPOS() {
  /* ── AUTH ── */
  const [user, setUser] = useState(null);
  const [view, setView] = useState("pos");

  /* ── PERSISTENT STATE ── */
  const [menu,       setMenu]       = useLS("druid_menu",    INIT_MENU);
  const [rawMat,     setRawMat]     = useLS("druid_raw",     INIT_RAW);
  const [tables,     setTables]     = useLS("druid_tables",  INIT_TABLES);
  const [orders,     setOrders]     = useLS("druid_orders",  []);
  const [expenses,   setExpenses]   = useLS("druid_expenses",[]);
  const [customers,  setCustomers]  = useLS("druid_customers",[
    { id:1, name:"Alex", phone:"081-234-5678", points:320, visits:12, totalSpent:8400, since:new Date().toISOString() },
    { id:2, name:"Sam",  phone:"089-876-5432", points:80,  visits:4,  totalSpent:1800, since:new Date().toISOString() },
  ]);
  const [happyHours, setHappyHours] = useLS("druid_happy",   INIT_HAPPY);
  const [daySession, setDaySession] = useLS("druid_session", null);

  /* ── UI STATE ── */
  const [tableZone,    setTableZone]    = useState("indoor");
  const [cart,         setCart]         = useState([]);
  const [cartTable,    setCartTable]    = useState(null);
  const [selectedCust, setSelectedCust] = useState(null);
  const [catFilter,    setCatFilter]    = useState("ALL");
  const [menuSearch,   setMenuSearch]   = useState("");
  const [discount,     setDiscount]     = useState({ type:"none", value:0 });
  const [payModal,     setPayModal]     = useState(false);
  const [payMethod,    setPayMethod]    = useState("cash");
  const [received,     setReceived]     = useState("");
  const [splitCount,   setSplitCount]   = useState(1);
  const [receipt,      setReceipt]      = useState(null);
  const [receiptModal, setReceiptModal] = useState(false);
  const [voidModal,    setVoidModal]    = useState(null);
  const [voidReason,   setVoidReason]   = useState("");
  const [noteModal,    setNoteModal]    = useState(null);
  const [editItem,     setEditItem]     = useState(null);
  const [addMenuModal, setAddMenuModal] = useState(false);
  const [newItem,      setNewItem]      = useState({ name:"",cat:"COFFEE",price:"",stock:"",emoji:"☕",img:"" });
  const [editRaw,      setEditRaw]      = useState(null);
  const [addRawModal,  setAddRawModal]  = useState(false);
  const [newRaw,       setNewRaw]       = useState({ name:"",unit:"g",qty:"",minQty:"",cost:"",emoji:"📦" });
  const [addExpModal,  setAddExpModal]  = useState(false);
  const [newExp,       setNewExp]       = useState({ desc:"",amount:"",cat:EXP_CATS[0],date:iso(new Date()) });
  const [dragTbl,      setDragTbl]      = useState(null);
  const [dragOff,      setDragOff]      = useState({ x:0, y:0 });
  const [addTblModal,  setAddTblModal]  = useState(false);
  const [newTbl,       setNewTbl]       = useState({ label:"",seats:4 });
  const [editTblModal, setEditTblModal] = useState(null);
  const [rptMode,      setRptMode]      = useState("day");
  const [rptDate,      setRptDate]      = useState(iso(new Date()));
  const [rptMonth,     setRptMonth]     = useState(new Date().toISOString().slice(0,7));
  const [rptYear,      setRptYear]      = useState(String(new Date().getFullYear()));
  const [custSearch,   setCustSearch]   = useState("");
  const [addCustModal, setAddCustModal] = useState(false);
  const [newCust,      setNewCust]      = useState({ name:"",phone:"" });
  const [openDayModal, setOpenDayModal] = useState(false);
  const [closeDayModal,setCloseDayModal]= useState(false);
  const [openingCash,  setOpeningCash]  = useState("");
  const [kdsQueue,     setKdsQueue]     = useState([]);
  const [toast,        setToast]        = useState(null);
  const [clock,        setClock]        = useState(new Date());
  const [installPrompt,setInstallPrompt]= useState(null);
  const [showInstall,  setShowInstall]  = useState(false);
  const [isOnline,     setIsOnline]     = useState(navigator.onLine);
  const [editHH,       setEditHH]       = useState(null);
  const [kdsNotif,     setKdsNotif]     = useState(0);

  /* ── REFS ── */
  const printRef = useRef(null);

  /* ── EFFECTS ── */
  useEffect(() => {
    const t = setInterval(() => setClock(new Date()), 30000);
    return () => clearInterval(t);
  }, []);

  // PWA install prompt
  useEffect(() => {
    const handler = e => { e.preventDefault(); setInstallPrompt(e); setShowInstall(true); };
    window.addEventListener("beforeinstallprompt", handler);
    return () => window.removeEventListener("beforeinstallprompt", handler);
  }, []);

  // Online/offline detection
  useEffect(() => {
    const on  = () => { setIsOnline(true);  showToast("Back online ✓"); };
    const off = () => { setIsOnline(false); showToast("Offline mode — data saved locally", false, true); };
    window.addEventListener("online",  on);
    window.addEventListener("offline", off);
    return () => { window.removeEventListener("online",on); window.removeEventListener("offline",off); };
  }, []);

  // KDS badge count
  useEffect(() => {
    setKdsNotif(kdsQueue.filter(o => o.kdsStatus !== "done").length);
  }, [kdsQueue]);

  // Request notification permission
  useEffect(() => {
    if ("Notification" in window && Notification.permission === "default") {
      Notification.requestPermission();
    }
  }, []);

  const showToast = (msg, e, warn) => {
    setToast({ msg, e, warn });
    setTimeout(() => setToast(null), 3000);
  };

  const can = action => {
    if (!user) return false;
    if (user.role === "owner") return true;
    if (user.role === "manager") return !["settings"].includes(action);
    return ["pos","kds","tables"].includes(action);
  };

  /* ── HAPPY HOUR ── */
  const activeHH = useMemo(() => getActiveHH(happyHours), [happyHours, clock]);

  /* ── CART CALCS ── */
  const cartSub    = cart.reduce((s,c) => s + c.price*c.qty, 0);
  const hhDisc     = activeHH ? Math.round(cartSub * activeHH.discount/100) : 0;
  const manualDisc = discount.type==="percent" ? Math.round(cartSub*discount.value/100)
                   : discount.type==="baht"    ? Math.min(discount.value, cartSub) : 0;
  const totalDisc  = Math.min(hhDisc + manualDisc, cartSub);
  const cartTotal  = cartSub - totalDisc;
  const cartCount  = cart.reduce((s,c) => s + c.qty, 0);
  const vatAmt     = Math.round(cartTotal * 7 / 107);

  const addToCart = item => {
    if (item.stock <= 0) { showToast("Out of stock", true); return; }
    setCart(p => {
      const ex = p.find(c => c.id === item.id);
      if (ex) return p.map(c => c.id===item.id ? {...c,qty:c.qty+1} : c);
      return [...p, { ...item, qty:1, note:"" }];
    });
  };
  const updQty     = (id,d) => setCart(p => p.map(c => c.id===id ? {...c,qty:c.qty+d} : c).filter(c => c.qty > 0));
  const setNote    = (id,note) => setCart(p => p.map(c => c.id===id ? {...c,note} : c));

  /* ── PAYMENT ── */
  const handlePay = () => {
    if (payMethod==="cash" && (isNaN(parseFloat(received)) || parseFloat(received) < cartTotal/splitCount)) {
      showToast("Insufficient amount", true); return;
    }
    const o = {
      id:Date.now(), items:[...cart], subtotal:cartSub, discountAmt:totalDisc,
      hhDisc, manualDisc, hhLabel:activeHH?.label||null,
      discDesc:discount.type==="percent"?`${discount.value}%`:discount.type==="baht"?`฿${discount.value}`:"-",
      total:cartTotal, splitCount, perPerson:splitCount>1?Math.ceil(cartTotal/splitCount):null,
      payMethod, received:payMethod==="cash"?parseFloat(received)*splitCount:cartTotal,
      change:payMethod==="cash"?parseFloat(received)*splitCount-cartTotal:0,
      vatAmt, date:new Date().toISOString(),
      tableLabel:cartTable?.label||null,
      customerId:selectedCust?.id||null, customerName:selectedCust?.name||null,
      kdsStatus:"new", voided:false, staff:user?.name||"",
    };
    setOrders(p => [o,...p]);
    setKdsQueue(p => [o,...p]);
    setMenu(p => p.map(m => { const ci=cart.find(c=>c.id===m.id); return ci?{...m,stock:m.stock-ci.qty}:m; }));
    // Customer points: ฿10 = 1 point
    if (selectedCust) {
      const pts = Math.floor(cartTotal/10);
      setCustomers(p => p.map(c => c.id===selectedCust.id
        ? {...c, points:c.points+pts, visits:c.visits+1, totalSpent:(c.totalSpent||0)+cartTotal}
        : c));
      showToast(`+${pts} pts for ${selectedCust.name} 🌟`);
    }
    if (daySession) setDaySession(p => ({...p, sales:(p.sales||0)+cartTotal, txCount:(p.txCount||0)+1}));
    setReceipt(o); setCart([]); setReceived(""); setDiscount({type:"none",value:0}); setSplitCount(1);
    setSelectedCust(null); setCartTable(null); setPayModal(false); setReceiptModal(true);
    // Push notification to kitchen (if native)
    if ("Notification" in window && Notification.permission === "granted") {
      new Notification("New Order — DRUID", {
        body: o.items.map(i=>i.name+"×"+i.qty).join(", "),
        icon: "/icons/icon-192.png", tag:"new-order",
      });
    }
  };

  /* ── VOID ── */
  const handleVoid = () => {
    if (!voidReason.trim()) { showToast("Enter void reason", true); return; }
    setOrders(p => p.map(o => o.id===voidModal.id
      ? {...o, voided:true, voidReason, voidBy:user?.name, voidAt:new Date().toISOString()}
      : o));
    setKdsQueue(p => p.filter(o => o.id !== voidModal.id));
    voidModal.items.forEach(ci => setMenu(p => p.map(m => m.id===ci.id?{...m,stock:m.stock+ci.qty}:m)));
    setVoidModal(null); setVoidReason(""); showToast("Order voided");
  };

  /* ── PRINT ── */
  const handlePrint = () => {
    if (!receipt) return;
    const w = window.open("","_blank","width=380,height=700");
    if (!w) { showToast("Allow popups to print", false, true); return; }
    w.document.write(`<!DOCTYPE html><html><head><title>Receipt</title>
    <meta name="viewport" content="width=device-width"/>
    <style>
      *{margin:0;padding:0;box-sizing:border-box}
      body{font-family:'Courier New',monospace;font-size:12px;padding:16px;max-width:280px;margin:0 auto}
      .logo{text-align:center;font-size:22px;font-weight:900;letter-spacing:5px;margin-bottom:2px}
      .sub{text-align:center;font-size:9px;letter-spacing:4px;color:#666;margin-bottom:10px}
      hr{border:none;border-top:1px dashed #ccc;margin:7px 0}
      .row{display:flex;justify-content:space-between;padding:2px 0;font-size:12px}
      .bold{font-weight:700;font-size:13px}.green{color:#2d6e47;font-weight:700}
      .muted{color:#888;font-size:10px}.center{text-align:center}
      .note{color:#888;font-size:10px;margin-left:10px;margin-bottom:2px}
    </style></head><body>
    <div class="logo">DRUID</div>
    <div class="sub">CAFE &amp; BAR · CRAFT SPIRIT RITUAL</div><hr/>
    <p class="muted center">${fd(receipt.date)}</p>
    ${receipt.tableLabel?`<p class="muted center">TABLE ${receipt.tableLabel}</p>`:""}
    ${receipt.customerName?`<p class="muted center">MEMBER: ${receipt.customerName}</p>`:""}
    <hr/>
    ${receipt.items.map(i=>`
      <div class="row"><span>${i.name} ×${i.qty}</span><span>฿${fp(i.price*i.qty)}</span></div>
      ${i.note?`<div class="note">↳ ${i.note}</div>`:""}`).join("")}
    <hr/>
    ${receipt.hhDisc>0?`<div class="row muted"><span>⚡ ${receipt.hhLabel||"Happy Hour"}</span><span>-฿${fp(receipt.hhDisc)}</span></div>`:""}
    ${receipt.manualDisc>0?`<div class="row muted"><span>Discount (${receipt.discDesc})</span><span>-฿${fp(receipt.manualDisc)}</span></div>`:""}
    <div class="row bold"><span>TOTAL</span><span>฿${fp(receipt.total)}</span></div>
    <div class="row muted"><span>VAT 7% (included)</span><span>฿${fp(receipt.vatAmt)}</span></div>
    ${receipt.splitCount>1?`<div class="row muted"><span>Split ÷${receipt.splitCount}</span><span>฿${fp(receipt.perPerson)} each</span></div>`:""}
    ${receipt.payMethod==="cash"?`
      <div class="row muted"><span>Received</span><span>฿${fp(receipt.received)}</span></div>
      <div class="row green"><span>Change</span><span>฿${fp(receipt.change)}</span></div>`:""}
    <div class="row muted"><span>Method</span><span>${receipt.payMethod==="cash"?"Cash":receipt.payMethod==="transfer"?"Transfer":"QR"}</span></div>
    <div class="row muted"><span>Staff</span><span>${receipt.staff}</span></div>
    <hr/><p class="center muted">Thank you · DRUID Cafe &amp; Bar</p>
    <script>window.onload=()=>{window.print();setTimeout(()=>window.close(),500);}<\/script>
    </body></html>`);
    w.document.close();
  };

  /* ── TABLE DRAG (touch + mouse) ── */
  const onTblDown   = (e,t) => { const pt = e.touches?.[0]||e; setDragTbl(t.id); setDragOff({x:pt.clientX-t.x, y:pt.clientY-t.y}); e.preventDefault(); };
  const onBoardMove = e => {
    if (!dragTbl) return;
    const pt = e.touches?.[0]||e;
    const b  = e.currentTarget.getBoundingClientRect();
    setTables(p => p.map(t => t.id===dragTbl
      ? {...t, x:Math.max(0,Math.min(pt.clientX-b.left-dragOff.x, b.width-82)),
               y:Math.max(0,Math.min(pt.clientY-b.top-dragOff.y,  b.height-82))}
      : t));
  };
  const onBoardUp = () => setDragTbl(null);

  /* ── REPORT FILTERS ── */
  const rptFilter = useCallback(arr => arr.filter(o => {
    const d = new Date(o.date);
    if (rptMode==="day")   return iso(d) === rptDate;
    if (rptMode==="month") return d.toISOString().slice(0,7) === rptMonth;
    if (rptMode==="year")  return String(d.getFullYear()) === rptYear;
    return true;
  }), [rptMode, rptDate, rptMonth, rptYear]);

  const rptOrders  = useMemo(() => rptFilter(orders).filter(o => !o.voided), [orders,rptFilter]);
  const rptVoided  = useMemo(() => rptFilter(orders).filter(o => o.voided),  [orders,rptFilter]);
  const rptExp     = useMemo(() => rptFilter(expenses), [expenses,rptFilter]);
  const rptRevenue = rptOrders.reduce((s,o) => s+o.total, 0);
  const rptExpTot  = rptExp.reduce((s,e) => s+e.amount, 0);
  const rptProfit  = rptRevenue - rptExpTot;
  const topItems   = useMemo(() => {
    const c = {};
    rptOrders.forEach(o => o.items.forEach(i => { c[i.name]=(c[i.name]||0)+i.qty; }));
    return Object.entries(c).sort((a,b) => b[1]-a[1]).slice(0,5);
  }, [rptOrders]);
  const payBreak   = useMemo(() => {
    const b = { cash:0, transfer:0, qr:0 };
    rptOrders.forEach(o => { b[o.payMethod]=(b[o.payMethod]||0)+o.total; });
    return b;
  }, [rptOrders]);
  const monthChart = useMemo(() => {
    if (rptMode!=="year") return [];
    const m = Array(12).fill(0);
    rptOrders.forEach(o => { m[new Date(o.date).getMonth()] += o.total; });
    return m;
  }, [rptOrders,rptMode]);
  const dailyChart = useMemo(() => {
    if (rptMode!=="month") return [];
    const d = {};
    rptOrders.forEach(o => { const k=iso(o.date); d[k]=(d[k]||0)+o.total; });
    return Object.entries(d).sort();
  }, [rptOrders,rptMode]);
  const maxChart   = Math.max(...(rptMode==="year" ? monthChart : dailyChart.map(d=>d[1])), 1);

  const exportCSV = type => {
    let csv="", fn="";
    if (type==="orders") {
      csv = "Date,Table,Staff,Items,Subtotal,Discount,Total,VAT,Method\n";
      rptOrders.forEach(o => { csv += `"${fd(o.date)}","${o.tableLabel||""}","${o.staff}","${o.items.map(i=>i.name+"×"+i.qty+(i.note?`[${i.note}]`:"")).join("/")}",${o.subtotal},${o.discountAmt},${o.total},${o.vatAmt},${o.payMethod}\n`; });
      fn = "druid_sales.csv";
    } else if (type==="expenses") {
      csv = "Date,Description,Category,Amount\n";
      rptExp.forEach(e => { csv += `"${fd(e.date)}","${e.desc}","${e.cat}",${e.amount}\n`; });
      fn = "druid_expenses.csv";
    } else {
      csv = "Metric,Value\n";
      csv += `Revenue,${rptRevenue}\nExpenses,${rptExpTot}\nProfit,${rptProfit}\nOrders,${rptOrders.length}\nVoided,${rptVoided.length}\n`;
      fn = "druid_summary.csv";
    }
    const blob = new Blob(["\uFEFF"+csv], { type:"text/csv;charset=utf-8;" });
    const a = document.createElement("a"); a.href=URL.createObjectURL(blob); a.download=fn; a.click();
    showToast(`Exported ${fn}`);
  };

  const filtMenu = menu.filter(m =>
    (catFilter==="ALL" || m.cat===catFilter) &&
    m.name.toLowerCase().includes(menuSearch.toLowerCase())
  );

  /* ══════════════════════════ RENDER GUARD ══════════════════════════ */
  if (!user) return React.createElement(PinScreen, { onLogin: u => { setUser(u); showToast(`Welcome, ${u.name}`); }});

  const NAVITEMS = [
    ["pos","POS",null,true],
    ["kds","KDS",kdsNotif>0?kdsNotif:null,true],
    ["tables","FLOOR",null,true],
    ["menu","MENU",null,can("menu")],
    ["stock","STOCK",null,can("menu")],
    ["rawmat","SUPPLY",null,can("menu")],
    ["expenses","LEDGER",null,can("report")],
    ["report","REPORT",null,can("report")],
    ["customers","CRM",null,can("report")],
    ["settings","SETTINGS",null,can("settings")],
  ].filter(n => n[3]);

  /* ════════════════════════════ FULL RENDER ════════════════════════════ */
  return (
    <div style={{ fontFamily:T.font, height:"100vh", height:"100dvh",
      background:T.bg, color:T.text, display:"flex", flexDirection:"column",
      overflow:"hidden" }}>

      <style>{`
        *{box-sizing:border-box;-webkit-tap-highlight-color:transparent}
        ::-webkit-scrollbar{width:3px;height:3px}
        ::-webkit-scrollbar-thumb{background:${T.border};border-radius:2px}
        input,textarea,select{font-size:16px!important} /* prevent iOS zoom */
        @keyframes slideUp{from{transform:translateY(100%);opacity:0}to{transform:translateY(0);opacity:1}}
        @keyframes popIn{from{transform:scale(.94);opacity:0}to{transform:scale(1);opacity:1}}
        .pop{animation:popIn .2s ease both}
        .scroll{-webkit-overflow-scrolling:touch}
      `}</style>

      {/* ── OFFLINE BANNER ── */}
      {!isOnline && (
        <div style={{ background:"#1a1200",border:`1px solid ${T.gold}44`,padding:"6px 16px",
          fontSize:11,color:T.gold,textAlign:"center",letterSpacing:.5 }}>
          ⚡ OFFLINE MODE — Data saved locally
        </div>
      )}

      {/* ── INSTALL BANNER ── */}
      {showInstall && <InstallBanner prompt={installPrompt} onDismiss={()=>setShowInstall(false)}/>}

      {/* ── NAV ── */}
      <nav style={{ background:T.bg2, borderBottom:`1px solid ${T.border2}`,
        paddingTop:`calc(8px + env(safe-area-inset-top))`,
        paddingLeft:`calc(12px + env(safe-area-inset-left))`,
        paddingRight:`calc(12px + env(safe-area-inset-right))`,
        paddingBottom:8, display:"flex", alignItems:"center", gap:2, flexShrink:0,
        overflowX:"auto" }}>
        <div style={{ display:"flex",alignItems:"baseline",gap:5,marginRight:16,flexShrink:0 }}>
          <span style={{ fontSize:15,fontWeight:700,letterSpacing:3,color:T.green }}>DRUID</span>
          <span style={{ fontSize:8,color:T.textDim,letterSpacing:2 }}>CAFE&amp;BAR</span>
        </div>
        {NAVITEMS.map(([v,l,badge]) => (
          <button key={v} onClick={() => setView(v)}
            style={{ position:"relative",padding:"5px 11px",borderRadius:6,border:"none",
              cursor:"pointer",fontSize:10,fontFamily:T.font,fontWeight:700,letterSpacing:.8,
              flexShrink:0,minHeight:34,transition:"all .2s",WebkitTapHighlightColor:"transparent",
              background:view===v?`${T.green}18`:"transparent",
              color:view===v?T.green:T.textDim,
              borderBottom:view===v?`2px solid ${T.green}`:"2px solid transparent" }}>
            {l}
            {badge && (
              <span style={{ position:"absolute",top:2,right:2,background:T.red,color:"#fff",
                fontSize:9,fontWeight:700,minWidth:16,height:16,borderRadius:8,
                display:"flex",alignItems:"center",justifyContent:"center",padding:"0 3px" }}>
                {badge}
              </span>
            )}
          </button>
        ))}
        <div style={{ marginLeft:"auto",display:"flex",alignItems:"center",gap:8,flexShrink:0 }}>
          {activeHH && (
            <div style={{ background:"#1a1400",border:`1px solid ${T.gold}44`,borderRadius:6,
              padding:"3px 8px",fontSize:9,color:T.gold,fontWeight:700,letterSpacing:.3 }}>
              ⚡{activeHH.discount}%
            </div>
          )}
          <div style={{ display:"flex",alignItems:"center",gap:5,padding:"3px 8px",
            background:T.surface,borderRadius:6,border:`1px solid ${T.border2}` }}>
            <div style={{ width:5,height:5,borderRadius:"50%",
              background:user.role==="owner"?T.gold:user.role==="manager"?T.blue:T.green }}/>
            <span style={{ fontSize:10,color:T.textMid,fontWeight:600 }}>{user.name}</span>
            <button onClick={() => { setUser(null); setCart([]); }}
              style={{ background:"transparent",border:"none",color:T.textDim,
                cursor:"pointer",fontSize:13,padding:"0 0 0 3px",lineHeight:1 }}>✕</button>
          </div>
          {daySession
            ? <button onClick={() => setCloseDayModal(true)}
                style={{ padding:"3px 9px",borderRadius:5,border:`1px solid ${T.red}33`,
                  background:"#1a0808",color:T.red,cursor:"pointer",fontSize:9,
                  fontFamily:T.font,fontWeight:700,letterSpacing:.5 }}>CLOSE DAY</button>
            : <button onClick={() => setOpenDayModal(true)}
                style={{ padding:"3px 9px",borderRadius:5,border:`1px solid ${T.green}44`,
                  background:T.greenGlow,color:T.green,cursor:"pointer",fontSize:9,
                  fontFamily:T.font,fontWeight:700,letterSpacing:.5 }}>OPEN DAY</button>
          }
        </div>
      </nav>

      <Toast t={toast}/>

      {/* ═══════════════════ POS ═══════════════════ */}
      {view==="pos" && (
        <div style={{ display:"flex",flex:1,overflow:"hidden" }}>
          {/* Menu Grid */}
          <div className="scroll" style={{ flex:1,overflowY:"auto",padding:14 }}>
            <div style={{ display:"flex",gap:8,marginBottom:12,alignItems:"center",flexWrap:"wrap" }}>
              <div style={{ position:"relative",flex:1,minWidth:130 }}>
                <span style={{ position:"absolute",left:10,top:"50%",transform:"translateY(-50%)",color:T.textDim }}>⌕</span>
                <input style={{ background:T.surface,border:`1px solid ${T.border}`,borderRadius:8,
                  color:T.text,padding:"9px 10px 9px 30px",fontSize:14,fontFamily:T.font,
                  width:"100%",outline:"none",WebkitAppearance:"none" }}
                  placeholder="Search..." value={menuSearch} onChange={e=>setMenuSearch(e.target.value)}/>
              </div>
            </div>
            {/* Category pills */}
            <div style={{ display:"flex",gap:6,marginBottom:12,overflowX:"auto",paddingBottom:4 }}>
              {CATS.map(c => (
                <button key={c} onClick={() => setCatFilter(c)}
                  style={{ padding:"7px 14px",borderRadius:20,border:"none",cursor:"pointer",
                    fontSize:11,fontFamily:T.font,fontWeight:700,letterSpacing:.3,
                    flexShrink:0,minHeight:34,transition:"all .2s",WebkitTapHighlightColor:"transparent",
                    background:catFilter===c?T.green:T.surface,
                    color:catFilter===c?T.bg:T.textMid,
                    boxShadow:catFilter===c?`0 0 10px ${T.greenGlow}`:"none" }}>
                  {c}
                </button>
              ))}
            </div>
            {activeHH && (
              <div style={{ marginBottom:10,padding:"9px 12px",background:"#100e00",
                border:`1px solid ${T.gold}44`,borderRadius:9,display:"flex",alignItems:"center",gap:8 }}>
                <span style={{ fontSize:18 }}>⚡</span>
                <div>
                  <div style={{ fontSize:12,fontWeight:700,color:T.gold }}>{activeHH.label} — {activeHH.discount}% OFF</div>
                  <div style={{ fontSize:10,color:T.textDim }}>{activeHH.start}–{activeHH.end}</div>
                </div>
              </div>
            )}
            <div style={{ display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(145px,1fr))",gap:10 }}>
              {filtMenu.map((item,idx) => (
                <div key={item.id} className="pop"
                  onClick={() => addToCart(item)}
                  style={{ animationDelay:`${idx*20}ms`,position:"relative",borderRadius:10,
                    overflow:"hidden",cursor:item.stock>0?"pointer":"not-allowed",
                    opacity:item.stock>0?1:.45,border:`1px solid ${T.border2}`,
                    background:T.surface,WebkitTapHighlightColor:"transparent",
                    transition:"border-color .2s,box-shadow .2s" }}>
                  <div style={{ height:100,background:T.bg3,position:"relative",overflow:"hidden" }}>
                    {item.img
                      ? <img src={item.img} alt={item.name} style={{ width:"100%",height:"100%",objectFit:"cover",display:"block" }} onError={e=>{e.target.style.display="none";}}/>
                      : <div style={{ height:"100%",display:"flex",alignItems:"center",justifyContent:"center",fontSize:36 }}>{item.emoji}</div>
                    }
                    {item.stock<=0 && (
                      <div style={{ position:"absolute",inset:0,background:"#000a",display:"flex",alignItems:"center",justifyContent:"center" }}>
                        <span style={{ color:T.red,fontSize:10,fontWeight:700,letterSpacing:1 }}>SOLD OUT</span>
                      </div>
                    )}
                    <div style={{ position:"absolute",top:5,right:5,background:item.stock<5?"#2a0a0a":"#0a1a0a",
                      border:`1px solid ${item.stock<5?T.red:T.greenDim}`,borderRadius:4,
                      padding:"1px 5px",fontSize:9,color:item.stock<5?T.red:T.green,fontFamily:T.mono }}>
                      {item.stock}
                    </div>
                    {activeHH && (
                      <div style={{ position:"absolute",top:5,left:5,background:"#1a1000",
                        border:`1px solid ${T.gold}`,borderRadius:4,padding:"1px 5px",
                        fontSize:9,color:T.gold,fontWeight:700 }}>-{activeHH.discount}%</div>
                    )}
                  </div>
                  <div style={{ padding:"8px 10px 10px" }}>
                    <div style={{ fontSize:12,fontWeight:600,marginBottom:2,whiteSpace:"nowrap",overflow:"hidden",textOverflow:"ellipsis" }}>{item.name}</div>
                    <div style={{ display:"flex",justifyContent:"space-between",alignItems:"center" }}>
                      <span style={{ fontSize:9,color:T.textDim }}>{item.cat}</span>
                      <span style={{ fontSize:14,fontWeight:700,color:T.green,fontFamily:T.mono }}>฿{fp(item.price)}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Cart Panel */}
          <div style={{ width:290,background:T.bg2,borderLeft:`1px solid ${T.border2}`,
            display:"flex",flexDirection:"column",flexShrink:0 }}>
            <div style={{ padding:"10px 12px 8px",borderBottom:`1px solid ${T.border2}` }}>
              <div style={{ display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:7 }}>
                <span style={{ fontSize:10,fontWeight:700,letterSpacing:2,color:T.green }}>ORDER</span>
                {cartCount>0 && <span style={{ fontSize:10,color:T.textDim,fontFamily:T.mono }}>{cartCount} items</span>}
              </div>
              <div style={{ display:"flex",gap:5 }}>
                <select style={{ flex:1,background:T.surface,border:`1px solid ${T.border}`,
                  color:cartTable?T.green:T.textDim,borderRadius:6,fontSize:12,padding:"6px 7px",
                  fontFamily:T.font,outline:"none",WebkitAppearance:"none" }}
                  value={cartTable?.id||""} onChange={e=>{const t=tables.find(t=>t.id===parseInt(e.target.value));setCartTable(t||null);}}>
                  <option value="">No table</option>
                  {tables.map(t=><option key={t.id} value={t.id}>{t.label}</option>)}
                </select>
                <select style={{ flex:1,background:T.surface,border:`1px solid ${T.border}`,
                  color:selectedCust?T.blue:T.textDim,borderRadius:6,fontSize:12,padding:"6px 7px",
                  fontFamily:T.font,outline:"none",WebkitAppearance:"none" }}
                  value={selectedCust?.id||""} onChange={e=>{const c=customers.find(c=>c.id===parseInt(e.target.value));setSelectedCust(c||null);}}>
                  <option value="">No member</option>
                  {customers.map(c=><option key={c.id} value={c.id}>{c.name}</option>)}
                </select>
              </div>
            </div>
            <div className="scroll" style={{ flex:1,overflowY:"auto",padding:"8px 10px" }}>
              {cart.length===0
                ? <div style={{ color:T.textDim,textAlign:"center",marginTop:40,fontSize:11,letterSpacing:1 }}>EMPTY<br/><span style={{fontSize:10}}>TAP MENU TO ADD</span></div>
                : cart.map(c => (
                  <div key={c.id} style={{ display:"flex",alignItems:"flex-start",gap:7,marginBottom:8,
                    padding:"8px 9px",background:T.surface,borderRadius:8,border:`1px solid ${T.border2}` }}>
                    {c.img ? <img src={c.img} alt={c.name} style={{ width:34,height:34,borderRadius:5,objectFit:"cover",flexShrink:0,marginTop:2 }} onError={e=>{e.target.style.display="none";}}/>
                      : <div style={{ width:34,height:34,borderRadius:5,background:T.bg3,display:"flex",alignItems:"center",justifyContent:"center",fontSize:16,flexShrink:0,marginTop:2 }}>{c.emoji}</div>}
                    <div style={{ flex:1,minWidth:0 }}>
                      <div style={{ fontSize:12,fontWeight:600,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap" }}>{c.name}</div>
                      {c.note && <div style={{ fontSize:10,color:T.gold,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap" }}>↳ {c.note}</div>}
                      <div style={{ display:"flex",alignItems:"center",gap:5,marginTop:4 }}>
                        <button onClick={()=>updQty(c.id,-1)} style={{ width:28,height:28,borderRadius:5,border:`1px solid ${T.border}`,background:"transparent",color:T.textMid,cursor:"pointer",fontSize:16,display:"flex",alignItems:"center",justifyContent:"center" }}>−</button>
                        <span style={{ fontSize:13,width:20,textAlign:"center",fontFamily:T.mono,fontWeight:700 }}>{c.qty}</span>
                        <button onClick={()=>updQty(c.id,1)} style={{ width:28,height:28,borderRadius:5,border:`1px solid ${T.green}`,background:T.greenGlow,color:T.green,cursor:"pointer",fontSize:16,display:"flex",alignItems:"center",justifyContent:"center" }}>+</button>
                        <button onClick={()=>setNoteModal({itemId:c.id,item:menu.find(m=>m.id===c.id)||c,existing:c.note})}
                          style={{ width:28,height:28,borderRadius:5,border:`1px solid ${c.note?T.gold:T.border}`,background:c.note?"#1a1000":"transparent",color:c.note?T.gold:T.textDim,cursor:"pointer",fontSize:13,display:"flex",alignItems:"center",justifyContent:"center" }}>✎</button>
                      </div>
                    </div>
                    <div style={{ color:T.green,fontFamily:T.mono,fontSize:12,fontWeight:700,flexShrink:0,marginTop:2 }}>฿{fp(c.price*c.qty)}</div>
                  </div>
                ))
              }
            </div>
            {/* Discount selector */}
            <div style={{ padding:"8px 10px",borderTop:`1px solid ${T.border2}` }}>
              <div style={{ display:"flex",gap:5,marginBottom:5 }}>
                {[["none","—"],["percent","%"],["baht","฿"]].map(([t,l]) => (
                  <button key={t} onClick={()=>setDiscount({type:t,value:discount.type===t?discount.value:0})}
                    style={{ flex:1,padding:"6px 0",borderRadius:6,
                      border:`1px solid ${discount.type===t?T.green:T.border}`,
                      background:discount.type===t?T.greenGlow:"transparent",
                      color:discount.type===t?T.green:T.textDim,
                      cursor:"pointer",fontSize:12,fontFamily:T.font,fontWeight:700,
                      minHeight:32,WebkitTapHighlightColor:"transparent" }}>{l}</button>
                ))}
              </div>
              {discount.type!=="none" && (
                <input type="number" min="0"
                  style={{ background:T.surface,border:`1px solid ${T.border}`,borderRadius:6,
                    color:T.text,padding:"7px 10px",fontSize:14,fontFamily:T.mono,
                    width:"100%",outline:"none",marginBottom:4 }}
                  placeholder={discount.type==="percent"?"% off":"Amount off"}
                  value={discount.value||""} onChange={e=>setDiscount(p=>({...p,value:parseFloat(e.target.value)||0}))}/>
              )}
              {hhDisc>0 && <div style={{ fontSize:10,color:T.gold,textAlign:"right" }}>⚡ HH -฿{fp(hhDisc)}</div>}
              {manualDisc>0 && <div style={{ fontSize:10,color:T.green,textAlign:"right" }}>Discount -฿{fp(manualDisc)}</div>}
            </div>
            {/* Total + Pay */}
            <div style={{ padding:"8px 12px",paddingBottom:`calc(12px + env(safe-area-inset-bottom))`,borderTop:`1px solid ${T.border2}` }}>
              {totalDisc>0 && <div style={{ display:"flex",justifyContent:"space-between",fontSize:10,color:T.textDim,marginBottom:3,fontFamily:T.mono }}><span>Subtotal</span><span>฿{fp(cartSub)}</span></div>}
              {totalDisc>0 && <div style={{ display:"flex",justifyContent:"space-between",fontSize:10,color:T.green,marginBottom:4,fontFamily:T.mono }}><span>Total discount</span><span>-฿{fp(totalDisc)}</span></div>}
              <div style={{ display:"flex",justifyContent:"space-between",marginBottom:10 }}>
                <span style={{ fontSize:10,letterSpacing:1,color:T.textMid,alignSelf:"flex-end" }}>TOTAL</span>
                <span style={{ fontSize:22,fontWeight:700,color:T.green,fontFamily:T.mono }}>฿{fp(cartTotal)}</span>
              </div>
              <button onClick={()=>setCart([])} style={{ width:"100%",padding:"8px",borderRadius:7,
                border:`1px solid ${T.border}`,background:"transparent",color:T.textDim,
                cursor:"pointer",fontSize:11,fontFamily:T.font,fontWeight:700,letterSpacing:.5,marginBottom:8,minHeight:38 }}>
                CLEAR
              </button>
              <button disabled={cart.length===0} onClick={()=>setPayModal(true)}
                style={{ width:"100%",padding:"13px",borderRadius:8,border:"none",
                  background:cart.length>0?T.green:"#1a2a1a",color:cart.length>0?T.bg:T.textDim,
                  cursor:cart.length>0?"pointer":"not-allowed",fontSize:14,fontFamily:T.font,
                  fontWeight:700,letterSpacing:1,boxShadow:cart.length>0?`0 0 18px ${T.greenGlow}`:"none",
                  transition:"all .2s",minHeight:50,WebkitTapHighlightColor:"transparent" }}>
                CHARGE  ฿{fp(cartTotal)}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ═══════════════════ KDS ═══════════════════ */}
      {view==="kds" && (
        <KDSView queue={kdsQueue} onBump={(id,status) => {
          setKdsQueue(p => p.map(o => o.id===id ? {...o,kdsStatus:status} : o));
          showToast(status==="cooking" ? "Cooking started 🔥" : "Order done ✓");
        }}/>
      )}

      {/* ═══════════════════ FLOOR ═══════════════════ */}
      {view==="tables" && (
        <div style={{ flex:1,display:"flex",flexDirection:"column",overflow:"hidden" }}>
          <div style={{ padding:"8px 14px",borderBottom:`1px solid ${T.border2}`,display:"flex",gap:8,alignItems:"center",background:T.bg2,flexWrap:"wrap" }}>
            {[["indoor","INDOOR 🏠"],["outdoor","OUTDOOR 🌿"]].map(([z,l])=>(
              <Btn key={z} v={tableZone===z?"pri":"ghost"} sm onClick={()=>setTableZone(z)}>{l}</Btn>
            ))}
            <div style={{ marginLeft:"auto",display:"flex",gap:12,fontSize:10 }}>
              {[["empty",T.textDim,"EMPTY"],["occupied",T.green,"BUSY"],["reserved",T.gold,"RESERVED"]].map(([s,c,l])=>(
                <span key={s} style={{ display:"flex",alignItems:"center",gap:4,color:T.textDim }}>
                  <span style={{ width:7,height:7,borderRadius:"50%",background:c }}/>
                  {l} ({tables.filter(t=>t.zone===tableZone&&t.status===s).length})
                </span>
              ))}
            </div>
          </div>
          <div style={{ flex:1,position:"relative",overflow:"hidden",userSelect:"none",
            background:tableZone==="indoor"?T.bg:"#050e05",
            backgroundImage:tableZone==="indoor"?`linear-gradient(${T.border2} 1px,transparent 1px),linear-gradient(90deg,${T.border2} 1px,transparent 1px)`:undefined,
            backgroundSize:"60px 60px" }}
            onMouseMove={onBoardMove} onMouseUp={onBoardUp} onMouseLeave={onBoardUp}
            onTouchMove={onBoardMove} onTouchEnd={onBoardUp}>
            {tables.filter(t=>t.zone===tableZone).map(t=>{
              const isOcc=t.status==="occupied", isRes=t.status==="reserved";
              return (
                <div key={t.id}
                  onMouseDown={e=>onTblDown(e,t)}
                  onTouchStart={e=>onTblDown(e,t)}
                  style={{ position:"absolute",left:t.x,top:t.y,width:82,height:82,
                    borderRadius:tableZone==="outdoor"?"50%":11,cursor:"grab",
                    background:isOcc?"#0f2a0f":isRes?"#1a1800":T.surface,
                    border:`2px solid ${isOcc?T.green:isRes?T.gold:T.border}`,
                    display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",
                    boxShadow:isOcc?`0 0 16px ${T.green}44`:"0 2px 10px #0007",
                    zIndex:dragTbl===t.id?10:1,WebkitTapHighlightColor:"transparent" }}>
                  <div style={{ fontSize:16 }}>{isOcc?"👥":tableZone==="outdoor"?"☀️":"🪑"}</div>
                  <div style={{ fontSize:12,fontWeight:700,color:isOcc?T.green:isRes?T.gold:T.text }}>{t.label}</div>
                  <div style={{ fontSize:9,color:T.textDim,fontFamily:T.mono }}>{t.seats}p</div>
                </div>
              );
            })}
          </div>
          <div style={{ padding:"8px 10px",borderTop:`1px solid ${T.border2}`,background:T.bg2,
            display:"flex",flexWrap:"wrap",gap:5,maxHeight:100,overflowY:"auto",alignItems:"center",
            paddingBottom:`calc(8px + env(safe-area-inset-bottom))` }}>
            <Btn v="pri" sm onClick={()=>{setNewTbl({label:"",seats:4});setAddTblModal(true);}}>+ TABLE</Btn>
            {tables.filter(t=>t.zone===tableZone).map(t=>(
              <div key={t.id} style={{ background:T.surface,borderRadius:6,padding:"4px 8px",fontSize:11,display:"flex",alignItems:"center",gap:4,border:`1px solid ${T.border2}` }}>
                <span style={{ fontWeight:700,fontFamily:T.mono,minWidth:22 }}>{t.label}</span>
                <select style={{ background:"#111",border:`1px solid ${T.border}`,color:T.text,borderRadius:4,fontSize:11,padding:"2px 3px",outline:"none",WebkitAppearance:"none" }}
                  value={t.status} onChange={e=>setTables(p=>p.map(tb=>tb.id===t.id?{...tb,status:e.target.value}:tb))}>
                  <option value="empty">Empty</option><option value="occupied">Busy</option><option value="reserved">Reserved</option>
                </select>
                <button onClick={()=>setEditTblModal({...t})} style={{ background:"transparent",border:"none",cursor:"pointer",color:T.textDim,fontSize:12,padding:2 }}>✏️</button>
                <button onClick={()=>{ if(t.status==="occupied"){showToast("Table is occupied",true);return;} setTables(p=>p.filter(tb=>tb.id!==t.id)); showToast(`${t.label} removed`); }} style={{ background:"transparent",border:"none",cursor:"pointer",color:T.red,fontSize:12,padding:2 }}>✕</button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ═══════════════════ MENU MGMT ═══════════════════ */}
      {view==="menu" && (
        <div className="scroll" style={{ flex:1,overflowY:"auto",padding:14 }}>
          <div style={{ display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:12 }}>
            <SL>MENU MANAGEMENT</SL>
            <Btn v="pri" sm onClick={()=>setAddMenuModal(true)}>+ NEW ITEM</Btn>
          </div>
          {menu.map(item=>(
            <div key={item.id} style={{ display:"flex",alignItems:"center",gap:10,padding:"10px 12px",
              background:T.surface,border:`1px solid ${T.border2}`,borderRadius:9,marginBottom:7 }}>
              {item.img?<img src={item.img} alt={item.name} style={{ width:46,height:46,borderRadius:7,objectFit:"cover",flexShrink:0 }} onError={e=>{e.target.style.display="none";}}/>
                :<div style={{ width:46,height:46,borderRadius:7,background:T.bg3,display:"flex",alignItems:"center",justifyContent:"center",fontSize:22,flexShrink:0 }}>{item.emoji}</div>}
              <div style={{ flex:1 }}>
                <div style={{ fontWeight:600,fontSize:13 }}>{item.name}</div>
                <div style={{ display:"flex",gap:5,marginTop:4,flexWrap:"wrap" }}>
                  <span style={{ background:T.greenGlow,color:T.green,fontSize:9,padding:"1px 7px",borderRadius:20,fontWeight:700 }}>{item.cat}</span>
                  <span style={{ background:"#1a1600",color:T.gold,fontSize:9,padding:"1px 7px",borderRadius:20,fontWeight:700 }}>฿{item.price}</span>
                  <span style={{ background:item.stock<5?"#2a1010":"#0d180d",color:item.stock<5?T.red:T.textMid,fontSize:9,padding:"1px 7px",borderRadius:20 }}>stock:{item.stock}</span>
                </div>
              </div>
              <Btn v="ghost" sm onClick={()=>setEditItem({...item})}>EDIT</Btn>
              <Btn v="danger" sm onClick={()=>{setMenu(p=>p.filter(m=>m.id!==item.id));showToast("Removed");}}>DEL</Btn>
            </div>
          ))}
        </div>
      )}

      {/* ═══════════════════ STOCK ═══════════════════ */}
      {view==="stock" && (
        <div className="scroll" style={{ flex:1,overflowY:"auto",padding:14 }}>
          <SL>MENU STOCK</SL>
          <div style={{ display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(180px,1fr))",gap:9 }}>
            {menu.map(item=>(
              <div key={item.id} style={{ padding:12,background:T.surface,border:`1px solid ${item.stock<5?T.red+"44":T.border2}`,borderRadius:9 }}>
                <div style={{ display:"flex",alignItems:"center",gap:8,marginBottom:10 }}>
                  {item.img?<img src={item.img} alt={item.name} style={{ width:36,height:36,borderRadius:5,objectFit:"cover" }} onError={e=>{e.target.style.display="none";}}/>
                    :<div style={{ width:36,height:36,borderRadius:5,background:T.bg3,display:"flex",alignItems:"center",justifyContent:"center",fontSize:20 }}>{item.emoji}</div>}
                  <div><div style={{ fontWeight:600,fontSize:12 }}>{item.name}</div><div style={{ fontSize:9,color:T.textDim }}>{item.cat}</div></div>
                </div>
                <div style={{ display:"flex",alignItems:"center",gap:5 }}>
                  <button onClick={()=>setMenu(p=>p.map(m=>m.id===item.id?{...m,stock:Math.max(0,m.stock-1)}:m))} style={{ width:30,height:30,borderRadius:6,border:`1px solid ${T.border}`,background:"transparent",color:T.textMid,cursor:"pointer",fontSize:16,display:"flex",alignItems:"center",justifyContent:"center" }}>−</button>
                  <input type="number" style={{ background:T.bg3,border:`1px solid ${T.border}`,borderRadius:5,color:T.text,padding:"5px 0",textAlign:"center",width:54,fontSize:14,fontFamily:T.mono,outline:"none" }} value={item.stock} onChange={e=>setMenu(p=>p.map(m=>m.id===item.id?{...m,stock:parseInt(e.target.value)||0}:m))}/>
                  <button onClick={()=>setMenu(p=>p.map(m=>m.id===item.id?{...m,stock:m.stock+10}:m))} style={{ flex:1,height:30,borderRadius:6,border:`1px solid ${T.green}`,background:T.greenGlow,color:T.green,cursor:"pointer",fontSize:11,fontFamily:T.font,fontWeight:700 }}>+10</button>
                  {item.stock<5&&<span style={{ color:T.red,fontSize:12 }}>⚠</span>}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ═══════════════════ SUPPLY ═══════════════════ */}
      {view==="rawmat" && (
        <div className="scroll" style={{ flex:1,overflowY:"auto",padding:14 }}>
          <div style={{ display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:12 }}>
            <SL>SUPPLY INVENTORY</SL>
            <Btn v="pri" sm onClick={()=>setAddRawModal(true)}>+ ADD</Btn>
          </div>
          <div style={{ display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(220px,1fr))",gap:9 }}>
            {rawMat.map(r=>{
              const pct=Math.min(100,Math.round(r.qty/Math.max(r.qty,r.minQty*2)*100));
              const low=r.qty<=r.minQty;
              return(
                <div key={r.id} style={{ padding:12,background:T.surface,border:`1px solid ${low?T.red+"44":T.border2}`,borderRadius:9 }}>
                  <div style={{ display:"flex",alignItems:"center",gap:8,marginBottom:9 }}>
                    <span style={{ fontSize:24 }}>{r.emoji}</span>
                    <div style={{ flex:1 }}><div style={{ fontWeight:600,fontSize:13 }}>{r.name}</div><div style={{ fontSize:9,color:T.textDim }}>฿{r.cost}/{r.unit}</div></div>
                    {low&&<span style={{ color:T.red,fontSize:14 }}>⚠</span>}
                  </div>
                  <div style={{ background:T.bg3,borderRadius:3,height:4,marginBottom:7,overflow:"hidden" }}>
                    <div style={{ width:pct+"%",height:"100%",background:low?T.red:T.green,borderRadius:3 }}/>
                  </div>
                  <div style={{ display:"flex",justifyContent:"space-between",fontSize:11,marginBottom:9 }}>
                    <span style={{ color:low?T.red:T.green,fontWeight:700,fontFamily:T.mono }}>{r.qty} {r.unit}</span>
                    <span style={{ color:T.textDim,fontFamily:T.mono }}>min {r.minQty}</span>
                  </div>
                  <div style={{ display:"flex",gap:5 }}>
                    <input type="number" style={{ background:T.bg3,border:`1px solid ${T.border}`,borderRadius:5,color:T.text,padding:"5px 0",textAlign:"center",width:62,fontSize:13,fontFamily:T.mono,outline:"none" }} value={r.qty} onChange={e=>setRawMat(p=>p.map(x=>x.id===r.id?{...x,qty:parseInt(e.target.value)||0}:x))}/>
                    <button onClick={()=>setRawMat(p=>p.map(x=>x.id===r.id?{...x,qty:x.qty+100}:x))} style={{ flex:1,padding:"5px",borderRadius:5,border:`1px solid ${T.green}`,background:T.greenGlow,color:T.green,cursor:"pointer",fontSize:11,fontFamily:T.font,fontWeight:700 }}>+100</button>
                    <Btn v="ghost" sm onClick={()=>setEditRaw({...r})}>✏</Btn>
                    <Btn v="danger" sm onClick={()=>{setRawMat(p=>p.filter(x=>x.id!==r.id));showToast("Removed");}}>✕</Btn>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* ═══════════════════ LEDGER ═══════════════════ */}
      {view==="expenses" && (
        <div className="scroll" style={{ flex:1,overflowY:"auto",padding:14 }}>
          <div style={{ display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:12 }}>
            <SL>EXPENSE LEDGER</SL>
            <Btn v="pri" sm onClick={()=>setAddExpModal(true)}>+ LOG</Btn>
          </div>
          <div style={{ display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(160px,1fr))",gap:8,marginBottom:14 }}>
            {[
              {l:"TODAY",v:`฿${fp(expenses.filter(e=>iso(e.date)===iso(new Date())).reduce((s,e)=>s+e.amount,0))}`,c:T.red},
              {l:"THIS MONTH",v:`฿${fp(expenses.filter(e=>new Date(e.date).toISOString().slice(0,7)===new Date().toISOString().slice(0,7)).reduce((s,e)=>s+e.amount,0))}`,c:T.gold},
              {l:"ALL TIME",v:`฿${fp(expenses.reduce((s,e)=>s+e.amount,0))}`,c:T.textMid},
            ].map(k=><Kpi key={k.l} label={k.l} value={k.v} color={k.c}/>)}
          </div>
          {expenses.map(e=>(
            <div key={e.id} style={{ display:"flex",alignItems:"center",gap:10,padding:"10px 12px",background:T.surface,border:`1px solid ${T.border2}`,borderRadius:9,marginBottom:7 }}>
              <div style={{ flex:1 }}>
                <div style={{ fontSize:13,fontWeight:600 }}>{e.desc}</div>
                <div style={{ display:"flex",gap:7,marginTop:3 }}>
                  <span style={{ background:"#0f1a2a",color:T.blue,fontSize:9,padding:"1px 7px",borderRadius:20 }}>{e.cat}</span>
                  <span style={{ fontSize:9,color:T.textDim,fontFamily:T.mono }}>{fdate(e.date)}</span>
                </div>
              </div>
              <span style={{ color:T.red,fontWeight:700,fontSize:14,fontFamily:T.mono }}>฿{fp(e.amount)}</span>
              <Btn v="danger" sm onClick={()=>setExpenses(p=>p.filter(x=>x.id!==e.id))}>✕</Btn>
            </div>
          ))}
        </div>
      )}

      {/* ═══════════════════ REPORT ═══════════════════ */}
      {view==="report" && (
        <div className="scroll" style={{ flex:1,overflowY:"auto",padding:14 }}>
          <div style={{ display:"flex",gap:7,alignItems:"center",marginBottom:12,flexWrap:"wrap" }}>
            <SL>SALES REPORT</SL>
            {[["day","DAY"],["month","MONTH"],["year","YEAR"]].map(([v,l])=>(
              <button key={v} onClick={()=>setRptMode(v)} style={{ padding:"6px 14px",borderRadius:6,border:`1px solid ${rptMode===v?T.green:T.border}`,background:rptMode===v?T.greenGlow:"transparent",color:rptMode===v?T.green:T.textDim,cursor:"pointer",fontSize:11,fontFamily:T.font,fontWeight:700,minHeight:34 }}>{l}</button>
            ))}
            {rptMode==="day"   && <input type="date"  style={{ background:T.surface,border:`1px solid ${T.border}`,borderRadius:6,color:T.text,padding:"6px 10px",fontSize:13,fontFamily:T.font,outline:"none" }} value={rptDate}  onChange={e=>setRptDate(e.target.value)}/>}
            {rptMode==="month" && <input type="month" style={{ background:T.surface,border:`1px solid ${T.border}`,borderRadius:6,color:T.text,padding:"6px 10px",fontSize:13,fontFamily:T.font,outline:"none" }} value={rptMonth} onChange={e=>setRptMonth(e.target.value)}/>}
            {rptMode==="year"  && <input type="number" style={{ background:T.surface,border:`1px solid ${T.border}`,borderRadius:6,color:T.text,padding:"6px 10px",fontSize:13,fontFamily:T.mono,width:88,outline:"none" }} value={rptYear} onChange={e=>setRptYear(e.target.value)}/>}
            <div style={{ marginLeft:"auto",display:"flex",gap:5 }}>
              {[["orders","↓ SALES"],["expenses","↓ EXP"],["summary","↓ SUMMARY"]].map(([t,l])=>(
                <Btn key={t} v="ghost" sm onClick={()=>exportCSV(t)}>{l}</Btn>
              ))}
            </div>
          </div>
          <div style={{ display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(135px,1fr))",gap:8,marginBottom:12 }}>
            <Kpi label="REVENUE"   value={`฿${fp(rptRevenue)}`} color={T.green}/>
            <Kpi label="EXPENSES"  value={`฿${fp(rptExpTot)}`}  color={T.red}/>
            <Kpi label="PROFIT"    value={`฿${fp(rptProfit)}`}  color={rptProfit>=0?T.green:T.red}/>
            <Kpi label="ORDERS"    value={rptOrders.length}       color={T.textMid}/>
            <Kpi label="AVG ORDER" value={`฿${fp(Math.round(rptRevenue/Math.max(rptOrders.length,1)))}`} color={T.gold}/>
            <Kpi label="VOIDED"    value={rptVoided.length}       color={T.red} sub={rptVoided.length>0?`฿${fp(rptVoided.reduce((s,o)=>s+o.total,0))}`:null}/>
          </div>
          {/* Chart */}
          {(rptMode==="month"&&dailyChart.length>0||rptMode==="year") && (
            <div style={{ padding:14,background:T.surface,border:`1px solid ${T.border2}`,borderRadius:9,marginBottom:10 }}>
              <SL>{rptMode==="month"?"DAILY":"MONTHLY"} REVENUE</SL>
              <div style={{ display:"flex",alignItems:"flex-end",gap:rptMode==="year"?5:3,height:72,overflowX:"auto" }}>
                {rptMode==="year"
                  ? monthChart.map((v,i)=>(
                    <div key={i} style={{ flex:1,display:"flex",flexDirection:"column",alignItems:"center",gap:3 }}>
                      <div style={{ width:"100%",background:v>0?T.green:T.border2,borderRadius:"3px 3px 0 0",height:(v/maxChart*60)+"px",minHeight:2,boxShadow:v>0?`0 0 6px ${T.greenGlow}`:"none" }}/>
                      <div style={{ fontSize:8,color:T.textDim,fontFamily:T.mono }}>{MONTHS[i]}</div>
                    </div>
                  ))
                  : dailyChart.map(([d,v])=>(
                    <div key={d} style={{ flex:"0 0 auto",width:20,display:"flex",flexDirection:"column",alignItems:"center",gap:3 }}>
                      <div style={{ width:13,background:v>0?T.green:T.border2,borderRadius:"3px 3px 0 0",height:(v/maxChart*60)+"px",minHeight:2 }}/>
                      <div style={{ fontSize:7,color:T.textDim,fontFamily:T.mono }}>{d.slice(8)}</div>
                    </div>
                  ))
                }
              </div>
            </div>
          )}
          <div style={{ display:"grid",gridTemplateColumns:"1fr 1fr",gap:10,marginBottom:10 }}>
            <div style={{ padding:12,background:T.surface,border:`1px solid ${T.border2}`,borderRadius:9 }}>
              <SL>PAYMENT MIX</SL>
              {[["cash","CASH",T.green],["transfer","TRANSFER",T.blue],["qr","QR",T.purple]].map(([k,l,c])=>(
                <div key={k} style={{ marginBottom:9 }}>
                  <div style={{ display:"flex",justifyContent:"space-between",fontSize:11,marginBottom:3 }}><span style={{ color:c }}>{l}</span><span style={{ fontFamily:T.mono,color:T.text }}>฿{fp(payBreak[k]||0)}</span></div>
                  <div style={{ background:T.bg3,borderRadius:2,height:3,overflow:"hidden" }}>
                    <div style={{ width:(rptRevenue>0?(payBreak[k]||0)/rptRevenue*100:0)+"%",height:"100%",background:c,transition:"width .5s" }}/>
                  </div>
                </div>
              ))}
            </div>
            <div style={{ padding:12,background:T.surface,border:`1px solid ${T.border2}`,borderRadius:9 }}>
              <SL>TOP SELLERS</SL>
              {topItems.length===0?<div style={{ color:T.textDim,fontSize:11 }}>No data</div>
                :topItems.map(([n,q],i)=>(
                  <div key={n} style={{ display:"flex",justifyContent:"space-between",padding:"4px 0",borderBottom:`1px solid ${T.border2}`,fontSize:11 }}>
                    <span style={{ color:i===0?T.gold:T.textMid }}>#{i+1} {n}</span>
                    <span style={{ color:T.green,fontWeight:700,fontFamily:T.mono }}>{q}</span>
                  </div>
                ))
              }
            </div>
          </div>
        </div>
      )}

      {/* ═══════════════════ CRM ═══════════════════ */}
      {view==="customers" && (
        <div className="scroll" style={{ flex:1,overflowY:"auto",padding:14 }}>
          <div style={{ display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:12 }}>
            <SL>MEMBER CRM</SL>
            <Btn v="pri" sm onClick={()=>setAddCustModal(true)}>+ ADD</Btn>
          </div>
          <input style={{ background:T.surface,border:`1px solid ${T.border}`,borderRadius:8,color:T.text,padding:"9px 12px",fontSize:14,fontFamily:T.font,width:"100%",outline:"none",marginBottom:12,WebkitAppearance:"none" }} placeholder="Search..." value={custSearch} onChange={e=>setCustSearch(e.target.value)}/>
          <div style={{ display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(200px,1fr))",gap:9 }}>
            {customers.filter(c=>c.name.toLowerCase().includes(custSearch.toLowerCase())||c.phone.includes(custSearch)).map(c=>(
              <div key={c.id} style={{ padding:14,background:T.surface,border:`1px solid ${T.border2}`,borderRadius:10 }}>
                <div style={{ display:"flex",alignItems:"center",gap:9,marginBottom:12 }}>
                  <div style={{ width:40,height:40,borderRadius:"50%",background:T.greenGlow,border:`1px solid ${T.green}`,display:"flex",alignItems:"center",justifyContent:"center",fontSize:18,fontWeight:700,color:T.green,flexShrink:0 }}>
                    {c.name[0].toUpperCase()}
                  </div>
                  <div>
                    <div style={{ fontWeight:700,fontSize:13 }}>{c.name}</div>
                    <div style={{ fontSize:11,color:T.textDim,fontFamily:T.mono }}>{c.phone}</div>
                  </div>
                </div>
                <div style={{ display:"grid",gridTemplateColumns:"1fr 1fr 1fr",gap:6,marginBottom:10 }}>
                  {[
                    {l:"POINTS",v:c.points,c:T.green},
                    {l:"VISITS",v:c.visits,c:T.textMid},
                    {l:"SPENT",v:`฿${fp(c.totalSpent||0)}`,c:T.gold},
                  ].map(k=>(
                    <div key={k.l} style={{ background:T.bg3,borderRadius:6,padding:"7px 5px",textAlign:"center" }}>
                      <div style={{ fontSize:13,fontWeight:700,color:k.c,fontFamily:T.mono }}>{k.v}</div>
                      <div style={{ fontSize:8,color:T.textDim,letterSpacing:1 }}>{k.l}</div>
                    </div>
                  ))}
                </div>
                <div style={{ display:"flex",gap:6 }}>
                  <Btn v="ghost" sm sx={{ flex:1 }} onClick={()=>{ const pts=50; if(c.points<pts){showToast("Not enough points",true);return;} setCustomers(p=>p.map(x=>x.id===c.id?{...x,points:x.points-pts}:x)); showToast(`Redeemed ${pts}pts`); }}>
                    Redeem 50pts
                  </Btn>
                  <Btn v="danger" sm onClick={()=>setCustomers(p=>p.filter(x=>x.id!==c.id))}>✕</Btn>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ═══════════════════ SETTINGS ═══════════════════ */}
      {view==="settings" && (
        <div className="scroll" style={{ flex:1,overflowY:"auto",padding:14 }}>
          <SL>SETTINGS</SL>
          <div style={{ display:"grid",gridTemplateColumns:"1fr 1fr",gap:12 }}>
            {/* Staff */}
            <div style={{ padding:14,background:T.surface,border:`1px solid ${T.border2}`,borderRadius:10 }}>
              <SL>STAFF & PINS</SL>
              {USERS.map(u=>(
                <div key={u.id} style={{ display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:8,paddingBottom:8,borderBottom:`1px solid ${T.border2}` }}>
                  <div><div style={{ fontSize:13,fontWeight:600 }}>{u.name}</div><div style={{ fontSize:9,color:T.textDim,letterSpacing:1 }}>{ROLES[u.role]}</div></div>
                  <span style={{ fontFamily:T.mono,fontSize:12,color:T.textDim,letterSpacing:3 }}>{u.pin}</span>
                </div>
              ))}
            </div>
            {/* Happy Hour */}
            <div style={{ padding:14,background:T.surface,border:`1px solid ${T.border2}`,borderRadius:10 }}>
              <SL>HAPPY HOUR</SL>
              {happyHours.map(h=>(
                <div key={h.id} style={{ marginBottom:10,padding:10,background:T.bg3,borderRadius:7 }}>
                  <div style={{ display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:5 }}>
                    <span style={{ fontSize:12,fontWeight:600,color:h.active?T.gold:T.textDim }}>{h.label}</span>
                    <button onClick={()=>setHappyHours(p=>p.map(x=>x.id===h.id?{...x,active:!x.active}:x))}
                      style={{ padding:"3px 9px",borderRadius:4,border:`1px solid ${h.active?T.gold:T.border}`,background:h.active?"#1a1400":"transparent",color:h.active?T.gold:T.textDim,cursor:"pointer",fontSize:10,fontFamily:T.font,fontWeight:700 }}>
                      {h.active?"ON":"OFF"}
                    </button>
                  </div>
                  <div style={{ fontSize:10,color:T.textDim }}>⏰ {h.start}–{h.end} · -{h.discount}% · {["Sun","Mon","Tue","Wed","Thu","Fri","Sat"].filter((_,i)=>h.days.includes(i)).join(", ")}</div>
                </div>
              ))}
            </div>
            {/* PWA Install */}
            <div style={{ padding:14,background:T.surface,border:`1px solid ${T.border2}`,borderRadius:10 }}>
              <SL>iOS INSTALL GUIDE</SL>
              <div style={{ fontSize:12,color:T.textMid,lineHeight:1.8 }}>
                <div>1️⃣ Open in <span style={{ color:T.green }}>Safari</span></div>
                <div>2️⃣ Tap <span style={{ color:T.green }}>Share</span> button (⬆)</div>
                <div>3️⃣ Tap <span style={{ color:T.green }}>"Add to Home Screen"</span></div>
                <div>4️⃣ Tap <span style={{ color:T.green }}>Add</span></div>
                <div style={{ marginTop:8,fontSize:11,color:T.textDim }}>Works on iPhone &amp; iPad as fullscreen app</div>
              </div>
            </div>
            {/* Data */}
            <div style={{ padding:14,background:T.surface,border:`1px solid ${T.border2}`,borderRadius:10 }}>
              <SL>DATA MANAGEMENT</SL>
              <div style={{ fontSize:11,color:T.textMid,marginBottom:10,lineHeight:1.6 }}>Data stored in <span style={{ color:T.green,fontFamily:T.mono }}>localStorage</span>. Export regularly as backup.</div>
              <div style={{ display:"flex",gap:6,flexWrap:"wrap" }}>
                <Btn v="ghost" sm onClick={()=>{ const d={orders,expenses,customers,menu,rawMat,tables}; const b=new Blob([JSON.stringify(d,null,2)],{type:"application/json"}); const a=document.createElement("a");a.href=URL.createObjectURL(b);a.download=`druid_backup_${iso(new Date())}.json`;a.click(); showToast("Backup downloaded"); }}>↓ BACKUP</Btn>
                <Btn v="danger" sm onClick={()=>{ if(window.confirm("Clear all orders?")){setOrders([]);setKdsQueue([]);showToast("Orders cleared");} }}>Clear Orders</Btn>
                <Btn v="danger" sm onClick={()=>{ if(window.confirm("Reset menu?")){setMenu(INIT_MENU);showToast("Menu reset");} }}>Reset Menu</Btn>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ════════════════════════ ALL MODALS ════════════════════════ */}

      {/* PAY */}
      {payModal && (
        <Modal onClose={()=>setPayModal(false)}>
          <SL color={T.green}>PAYMENT</SL>
          {cart.map(c=>(
            <div key={c.id} style={{ display:"flex",justifyContent:"space-between",fontSize:12,marginBottom:4,color:T.textMid,fontFamily:T.mono }}>
              <span>{c.name} ×{c.qty}{c.note?` (${c.note})`:""}</span><span>฿{fp(c.price*c.qty)}</span>
            </div>
          ))}
          <div style={{ borderTop:`1px solid ${T.border}`,margin:"10px 0",paddingTop:10 }}>
            {hhDisc>0&&<div style={{ display:"flex",justifyContent:"space-between",fontSize:11,color:T.gold,marginBottom:2,fontFamily:T.mono }}><span>⚡ {activeHH?.label}</span><span>-฿{fp(hhDisc)}</span></div>}
            {manualDisc>0&&<div style={{ display:"flex",justifyContent:"space-between",fontSize:11,color:T.textDim,marginBottom:2,fontFamily:T.mono }}><span>Discount</span><span>-฿{fp(manualDisc)}</span></div>}
            <div style={{ display:"flex",justifyContent:"space-between",fontWeight:700 }}>
              <span style={{ fontSize:11,color:T.textMid,alignSelf:"flex-end" }}>TOTAL</span>
              <span style={{ fontSize:26,color:T.green,fontFamily:T.mono }}>฿{fp(cartTotal)}</span>
            </div>
            <div style={{ textAlign:"right",fontSize:10,color:T.textDim,fontFamily:T.mono }}>incl. VAT ฿{fp(vatAmt)}</div>
          </div>
          {/* Split */}
          <div style={{ marginBottom:14 }}>
            <SL>SPLIT BILL</SL>
            <div style={{ display:"flex",alignItems:"center",gap:10 }}>
              <button onClick={()=>setSplitCount(p=>Math.max(1,p-1))} style={{ width:36,height:36,borderRadius:8,border:`1px solid ${T.border}`,background:"transparent",color:T.textMid,cursor:"pointer",fontSize:20,display:"flex",alignItems:"center",justifyContent:"center" }}>−</button>
              <span style={{ fontSize:22,fontWeight:700,minWidth:28,textAlign:"center",fontFamily:T.mono,color:splitCount>1?T.green:T.textMid }}>{splitCount}</span>
              <button onClick={()=>setSplitCount(p=>p+1)} style={{ width:36,height:36,borderRadius:8,border:`1px solid ${T.green}`,background:T.greenGlow,color:T.green,cursor:"pointer",fontSize:20,fontWeight:700,display:"flex",alignItems:"center",justifyContent:"center" }}>+</button>
              <span style={{ fontSize:12,color:T.textDim }}>way{splitCount>1?"s":""}</span>
              {splitCount>1&&<span style={{ marginLeft:"auto",fontSize:15,fontWeight:700,color:T.green,fontFamily:T.mono }}>฿{fp(Math.ceil(cartTotal/splitCount))}/person</span>}
            </div>
          </div>
          {/* Method */}
          <div style={{ display:"flex",gap:7,marginBottom:14 }}>
            {[["cash","💵 CASH"],["transfer","🏦 TRANSFER"],["qr","📱 QR"]].map(([v,l])=>(
              <button key={v} onClick={()=>setPayMethod(v)}
                style={{ flex:1,padding:"10px 0",borderRadius:8,border:`1px solid ${payMethod===v?T.green:T.border}`,background:payMethod===v?T.greenGlow:"transparent",color:payMethod===v?T.green:T.textDim,cursor:"pointer",fontSize:11,fontFamily:T.font,fontWeight:700,minHeight:44,WebkitTapHighlightColor:"transparent" }}>
                {l}
              </button>
            ))}
          </div>
          {payMethod==="cash"&&<>
            <Field label={splitCount>1?`EACH PERSON (×${splitCount})`:"RECEIVED (฿)"} type="number" value={received} onChange={e=>setReceived(e.target.value)} placeholder="0.00"/>
            {received&&parseFloat(received)*splitCount>=cartTotal&&<div style={{ textAlign:"right",color:T.green,fontWeight:700,fontFamily:T.mono,marginBottom:10,fontSize:15 }}>Change ฿{fp(parseFloat(received)*splitCount-cartTotal)}</div>}
          </>}
          {payMethod==="transfer"&&<div style={{ background:T.bg3,border:`1px solid ${T.border}`,borderRadius:9,padding:14,marginBottom:12,textAlign:"center" }}>
            <div style={{ fontSize:10,color:T.textDim,letterSpacing:1 }}>TRANSFER TO</div>
            <div style={{ fontSize:16,fontWeight:700,color:T.blue,fontFamily:T.mono,marginTop:5 }}>KBANK  123-4-56789-0</div>
            <div style={{ fontSize:20,color:T.green,fontWeight:700,fontFamily:T.mono,marginTop:5 }}>฿{fp(cartTotal)}</div>
          </div>}
          {payMethod==="qr"&&<div style={{ background:T.bg3,border:`1px solid ${T.border}`,borderRadius:9,padding:20,marginBottom:12,textAlign:"center" }}>
            <div style={{ fontSize:52,marginBottom:6 }}>📲</div>
            <div style={{ fontSize:10,color:T.textDim,letterSpacing:1 }}>SCAN QR CODE</div>
            <div style={{ fontSize:20,color:T.green,fontWeight:700,fontFamily:T.mono,marginTop:5 }}>฿{fp(cartTotal)}</div>
          </div>}
          <button onClick={handlePay} style={{ width:"100%",padding:"15px",borderRadius:10,border:"none",background:T.green,color:T.bg,fontFamily:T.font,fontWeight:700,fontSize:15,letterSpacing:1.5,cursor:"pointer",boxShadow:`0 0 20px ${T.greenGlow}`,minHeight:52 }}>
            CONFIRM PAYMENT
          </button>
        </Modal>
      )}

      {/* RECEIPT */}
      {receiptModal && receipt && (
        <Modal onClose={()=>setReceiptModal(false)}>
          <div style={{ textAlign:"center",marginBottom:12 }}>
            <div style={{ fontSize:10,color:T.green,letterSpacing:3,fontWeight:700 }}>PAYMENT COMPLETE ✓</div>
            {receipt.splitCount>1&&<div style={{ fontSize:12,color:T.gold,marginTop:4 }}>Split ÷{receipt.splitCount} · ฿{fp(receipt.perPerson)}/person</div>}
          </div>
          <div ref={printRef} style={{ background:"#fff",color:"#111",borderRadius:8,padding:"16px 14px",marginBottom:12,fontFamily:"monospace" }}>
            <div style={{ textAlign:"center",fontSize:18,fontWeight:700,letterSpacing:4 }}>DRUID</div>
            <div style={{ textAlign:"center",fontSize:9,letterSpacing:4,color:"#888",marginBottom:10 }}>CAFE & BAR</div>
            <hr style={{ border:"1px dashed #ccc",margin:"6px 0" }}/>
            <div style={{ fontSize:10,color:"#888",textAlign:"center" }}>{fd(receipt.date)}</div>
            {receipt.tableLabel&&<div style={{ fontSize:10,color:"#888",textAlign:"center" }}>TABLE {receipt.tableLabel}</div>}
            {receipt.customerName&&<div style={{ fontSize:10,color:"#555",textAlign:"center" }}>MEMBER: {receipt.customerName}</div>}
            <hr style={{ border:"1px dashed #ccc",margin:"6px 0" }}/>
            {receipt.items.map(i=>(
              <div key={i.id}>
                <div style={{ display:"flex",justifyContent:"space-between",fontSize:12,marginBottom:i.note?1:3 }}><span>{i.name} ×{i.qty}</span><span>฿{fp(i.price*i.qty)}</span></div>
                {i.note&&<div style={{ fontSize:10,color:"#888",marginBottom:3,paddingLeft:10 }}>↳ {i.note}</div>}
              </div>
            ))}
            <hr style={{ border:"1px dashed #ccc",margin:"6px 0" }}/>
            {receipt.hhDisc>0&&<div style={{ display:"flex",justifyContent:"space-between",fontSize:10,color:"#888" }}><span>⚡ {receipt.hhLabel}</span><span>-฿{fp(receipt.hhDisc)}</span></div>}
            {receipt.manualDisc>0&&<div style={{ display:"flex",justifyContent:"space-between",fontSize:10,color:"#888" }}><span>Discount ({receipt.discDesc})</span><span>-฿{fp(receipt.manualDisc)}</span></div>}
            <div style={{ display:"flex",justifyContent:"space-between",fontWeight:700,fontSize:14 }}><span>TOTAL</span><span>฿{fp(receipt.total)}</span></div>
            <div style={{ display:"flex",justifyContent:"space-between",fontSize:10,color:"#888" }}><span>VAT 7% incl.</span><span>฿{fp(receipt.vatAmt)}</span></div>
            {receipt.splitCount>1&&<div style={{ display:"flex",justifyContent:"space-between",fontSize:10,color:"#555" }}><span>Per person (÷{receipt.splitCount})</span><span>฿{fp(receipt.perPerson)}</span></div>}
            {receipt.payMethod==="cash"&&<>
              <div style={{ display:"flex",justifyContent:"space-between",fontSize:10,color:"#888" }}><span>Received</span><span>฿{fp(receipt.received)}</span></div>
              <div style={{ display:"flex",justifyContent:"space-between",fontSize:11,color:"#2d6e47",fontWeight:700 }}><span>Change</span><span>฿{fp(receipt.change)}</span></div>
            </>}
            <div style={{ display:"flex",justifyContent:"space-between",fontSize:10,color:"#888" }}><span>Method</span><span>{receipt.payMethod==="cash"?"Cash":receipt.payMethod==="transfer"?"Transfer":"QR"}</span></div>
            <div style={{ display:"flex",justifyContent:"space-between",fontSize:10,color:"#888" }}><span>Staff</span><span>{receipt.staff}</span></div>
            <hr style={{ border:"1px dashed #ccc",margin:"6px 0" }}/>
            <div style={{ textAlign:"center",fontSize:10,color:"#aaa" }}>Thank you · DRUID Cafe & Bar</div>
          </div>
          <div style={{ display:"flex",gap:7 }}>
            <Btn v="pri" sx={{ flex:2,minHeight:48 }} onClick={handlePrint}>🖨 PRINT</Btn>
            <Btn v="danger" sx={{ flex:1,minHeight:48 }} onClick={()=>{setVoidModal(receipt);setReceiptModal(false);}}>VOID</Btn>
            <Btn v="ghost" sx={{ flex:1,minHeight:48 }} onClick={()=>setReceiptModal(false)}>CLOSE</Btn>
          </div>
        </Modal>
      )}

      {/* VOID */}
      {voidModal && (
        <Modal onClose={()=>setVoidModal(null)}>
          <SL color={T.red}>VOID ORDER</SL>
          <div style={{ marginBottom:10,fontSize:12,color:T.textMid }}>Order #{String(voidModal.id).slice(-4)} · ฿{fp(voidModal.total)}</div>
          <Field label="REASON (required)" value={voidReason} onChange={e=>setVoidReason(e.target.value)} placeholder="Wrong order, customer cancel..."/>
          <div style={{ display:"flex",gap:8 }}>
            <Btn v="ghost" sx={{ flex:1 }} onClick={()=>setVoidModal(null)}>CANCEL</Btn>
            <Btn v="danger" sx={{ flex:1 }} onClick={handleVoid}>CONFIRM VOID</Btn>
          </div>
        </Modal>
      )}

      {/* ITEM NOTE */}
      {noteModal && <NoteModal item={noteModal.item} existing={noteModal.existing} onSave={note=>{setNote(noteModal.itemId,note);setNoteModal(null);}} onClose={()=>setNoteModal(null)}/>}

      {/* ADD/EDIT MENU */}
      {(addMenuModal||editItem) && (
        <Modal onClose={()=>{setAddMenuModal(false);setEditItem(null);}}>
          <SL>{editItem?"EDIT ITEM":"NEW ITEM"}</SL>
          {[["name","ITEM NAME","text"],["price","PRICE (฿)","number"],["stock","STOCK","number"],["emoji","EMOJI","text"],["img","IMAGE URL","text"]].map(([k,l,t])=>(
            <Field key={k} label={l} type={t}
              value={editItem?editItem[k]||"":newItem[k]||""}
              onChange={e=>{const v=t==="number"?parseFloat(e.target.value)||0:e.target.value; editItem?setEditItem(p=>({...p,[k]:v})):setNewItem(p=>({...p,[k]:v}));}}
              placeholder={k==="img"?"https://...":undefined}/>
          ))}
          {((editItem?.img)||(newItem?.img)) && (
            <div style={{ marginBottom:12 }}>
              <SL>PREVIEW</SL>
              <img src={editItem?editItem.img:newItem.img} alt="preview" style={{ width:"100%",height:120,objectFit:"cover",borderRadius:8,border:`1px solid ${T.border}` }} onError={e=>{e.target.style.display="none";}}/>
            </div>
          )}
          <div style={{ marginBottom:14 }}>
            <SL>CATEGORY</SL>
            <div style={{ display:"flex",gap:6,flexWrap:"wrap" }}>
              {CATS.filter(c=>c!=="ALL").map(c=>(
                <button key={c} onClick={()=>editItem?setEditItem(p=>({...p,cat:c})):setNewItem(p=>({...p,cat:c}))}
                  style={{ padding:"7px 14px",borderRadius:6,border:`1px solid ${(editItem?editItem.cat:newItem.cat)===c?T.green:T.border}`,background:(editItem?editItem.cat:newItem.cat)===c?T.greenGlow:"transparent",color:(editItem?editItem.cat:newItem.cat)===c?T.green:T.textDim,cursor:"pointer",fontSize:12,fontFamily:T.font,fontWeight:700,minHeight:36 }}>
                  {c}
                </button>
              ))}
            </div>
          </div>
          <div style={{ display:"flex",gap:8 }}>
            <Btn v="ghost" sx={{ flex:1 }} onClick={()=>{setAddMenuModal(false);setEditItem(null);}}>CANCEL</Btn>
            <Btn v="pri" sx={{ flex:1 }} onClick={()=>{
              if(editItem){setMenu(p=>p.map(m=>m.id===editItem.id?editItem:m));setEditItem(null);showToast("Updated");}
              else{if(!newItem.name||!newItem.price){showToast("Fill required fields",true);return;}
                setMenu(p=>[...p,{...newItem,id:Date.now(),price:Number(newItem.price),stock:Number(newItem.stock)||0,presets:[]}]);
                setNewItem({name:"",cat:"COFFEE",price:"",stock:"",emoji:"☕",img:""});
                setAddMenuModal(false);showToast("Item added");}
            }}>SAVE</Btn>
          </div>
        </Modal>
      )}

      {/* ADD/EDIT SUPPLY */}
      {(addRawModal||editRaw) && (
        <Modal onClose={()=>{setAddRawModal(false);setEditRaw(null);}}>
          <SL>{editRaw?"EDIT SUPPLY":"NEW SUPPLY"}</SL>
          {[["name","NAME","text"],["unit","UNIT","text"],["qty","QTY","number"],["minQty","MIN THRESHOLD","number"],["cost","COST/UNIT (฿)","number"],["emoji","EMOJI","text"]].map(([k,l,t])=>(
            <Field key={k} label={l} type={t} value={editRaw?editRaw[k]:newRaw[k]} onChange={e=>{const v=t==="number"?parseFloat(e.target.value)||0:e.target.value;editRaw?setEditRaw(p=>({...p,[k]:v})):setNewRaw(p=>({...p,[k]:v}));}}/>
          ))}
          <div style={{ display:"flex",gap:8 }}>
            <Btn v="ghost" sx={{ flex:1 }} onClick={()=>{setAddRawModal(false);setEditRaw(null);}}>CANCEL</Btn>
            <Btn v="pri" sx={{ flex:1 }} onClick={()=>{
              if(editRaw){setRawMat(p=>p.map(r=>r.id===editRaw.id?editRaw:r));setEditRaw(null);showToast("Updated");}
              else{if(!newRaw.name){showToast("Enter name",true);return;}setRawMat(p=>[...p,{...newRaw,id:Date.now(),qty:Number(newRaw.qty)||0,minQty:Number(newRaw.minQty)||0,cost:Number(newRaw.cost)||0}]);setNewRaw({name:"",unit:"g",qty:"",minQty:"",cost:"",emoji:"📦"});setAddRawModal(false);showToast("Added");}
            }}>SAVE</Btn>
          </div>
        </Modal>
      )}

      {/* ADD EXPENSE */}
      {addExpModal && (
        <Modal onClose={()=>setAddExpModal(false)}>
          <SL>LOG EXPENSE</SL>
          <Field label="DESCRIPTION" value={newExp.desc} onChange={e=>setNewExp(p=>({...p,desc:e.target.value}))} placeholder="e.g. Coffee beans restock"/>
          <Field label="AMOUNT (฿)" type="number" value={newExp.amount} onChange={e=>setNewExp(p=>({...p,amount:e.target.value}))}/>
          <Field label="DATE" type="date" value={newExp.date} onChange={e=>setNewExp(p=>({...p,date:e.target.value}))}/>
          <div style={{ marginBottom:14 }}>
            <SL>CATEGORY</SL>
            <div style={{ display:"flex",gap:6,flexWrap:"wrap" }}>
              {EXP_CATS.map(c=>(
                <button key={c} onClick={()=>setNewExp(p=>({...p,cat:c}))} style={{ padding:"6px 12px",borderRadius:6,border:`1px solid ${newExp.cat===c?T.blue:T.border}`,background:newExp.cat===c?"#0f1a2a":"transparent",color:newExp.cat===c?T.blue:T.textDim,cursor:"pointer",fontSize:11,fontFamily:T.font,fontWeight:600,minHeight:34 }}>{c}</button>
              ))}
            </div>
          </div>
          <div style={{ display:"flex",gap:8 }}>
            <Btn v="ghost" sx={{ flex:1 }} onClick={()=>setAddExpModal(false)}>CANCEL</Btn>
            <Btn v="pri" sx={{ flex:1 }} onClick={()=>{if(!newExp.desc||!newExp.amount){showToast("Fill all fields",true);return;}setExpenses(p=>[{...newExp,id:Date.now(),amount:Number(newExp.amount),date:new Date(newExp.date).toISOString()},...p]);setNewExp({desc:"",amount:"",cat:EXP_CATS[0],date:iso(new Date())});setAddExpModal(false);showToast("Logged");}}>LOG</Btn>
          </div>
        </Modal>
      )}

      {/* ADD/EDIT TABLE */}
      {(addTblModal||editTblModal) && (
        <Modal onClose={()=>{setAddTblModal(false);setEditTblModal(null);}}>
          <SL>{editTblModal?"EDIT TABLE":"ADD TABLE — "+tableZone.toUpperCase()}</SL>
          <Field label="TABLE NAME" value={editTblModal?editTblModal.label:newTbl.label} onChange={e=>editTblModal?setEditTblModal(p=>({...p,label:e.target.value})):setNewTbl(p=>({...p,label:e.target.value}))} placeholder="e.g. C1, VIP1"/>
          <div style={{ marginBottom:16 }}>
            <SL>SEATS</SL>
            <div style={{ display:"flex",alignItems:"center",gap:12 }}>
              <button onClick={()=>editTblModal?setEditTblModal(p=>({...p,seats:Math.max(1,p.seats-1)})):setNewTbl(p=>({...p,seats:Math.max(1,p.seats-1)}))} style={{ width:40,height:40,borderRadius:8,border:`1px solid ${T.border}`,background:"transparent",color:T.text,cursor:"pointer",fontSize:22,display:"flex",alignItems:"center",justifyContent:"center" }}>−</button>
              <span style={{ fontSize:26,fontWeight:700,minWidth:36,textAlign:"center",fontFamily:T.mono,color:T.green }}>{editTblModal?editTblModal.seats:newTbl.seats}</span>
              <button onClick={()=>editTblModal?setEditTblModal(p=>({...p,seats:p.seats+1})):setNewTbl(p=>({...p,seats:p.seats+1}))} style={{ width:40,height:40,borderRadius:8,border:`1px solid ${T.green}`,background:T.greenGlow,color:T.green,cursor:"pointer",fontSize:22,fontWeight:700,display:"flex",alignItems:"center",justifyContent:"center" }}>+</button>
              <span style={{ fontSize:12,color:T.textDim }}>seats</span>
            </div>
          </div>
          {editTblModal && (
            <div style={{ marginBottom:14 }}>
              <SL>STATUS</SL>
              <div style={{ display:"flex",gap:7 }}>
                {[["empty","EMPTY"],["occupied","OCCUPIED"],["reserved","RESERVED"]].map(([v,l])=>(
                  <button key={v} onClick={()=>setEditTblModal(p=>({...p,status:v}))} style={{ flex:1,padding:"9px 0",borderRadius:7,border:`1px solid ${editTblModal.status===v?T.green:T.border}`,background:editTblModal.status===v?T.greenGlow:"transparent",color:editTblModal.status===v?T.green:T.textDim,cursor:"pointer",fontSize:10,fontFamily:T.font,fontWeight:700,minHeight:40 }}>{l}</button>
                ))}
              </div>
            </div>
          )}
          <div style={{ display:"flex",gap:8 }}>
            <Btn v="ghost" sx={{ flex:1 }} onClick={()=>{setAddTblModal(false);setEditTblModal(null);}}>CANCEL</Btn>
            <Btn v="pri" sx={{ flex:1 }} onClick={()=>{
              if(editTblModal){if(!editTblModal.label.trim()){showToast("Enter name",true);return;}setTables(p=>p.map(t=>t.id===editTblModal.id?{...t,...editTblModal,label:editTblModal.label.trim()}:t));setEditTblModal(null);showToast("Updated");}
              else{if(!newTbl.label.trim()){showToast("Enter name",true);return;}if(tables.find(t=>t.label===newTbl.label.trim()&&t.zone===tableZone)){showToast("Name taken",true);return;}const z=tables.filter(t=>t.zone===tableZone);setTables(p=>[...p,{id:Date.now(),label:newTbl.label.trim(),zone:tableZone,status:"empty",seats:newTbl.seats,x:60+(z.length%4)*140,y:60+Math.floor(z.length/4)*140}]);setAddTblModal(false);showToast(`${newTbl.label} added`);setNewTbl({label:"",seats:4});}
            }}>SAVE</Btn>
          </div>
        </Modal>
      )}

      {/* ADD CUSTOMER */}
      {addCustModal && (
        <Modal onClose={()=>setAddCustModal(false)}>
          <SL>NEW MEMBER</SL>
          <Field label="NAME" value={newCust.name} onChange={e=>setNewCust(p=>({...p,name:e.target.value}))}/>
          <Field label="PHONE" value={newCust.phone} onChange={e=>setNewCust(p=>({...p,phone:e.target.value}))} placeholder="08x-xxx-xxxx"/>
          <div style={{ display:"flex",gap:8 }}>
            <Btn v="ghost" sx={{ flex:1 }} onClick={()=>setAddCustModal(false)}>CANCEL</Btn>
            <Btn v="pri" sx={{ flex:1 }} onClick={()=>{if(!newCust.name){showToast("Enter name",true);return;}setCustomers(p=>[...p,{...newCust,id:Date.now(),points:0,visits:0,totalSpent:0,since:new Date().toISOString()}]);setNewCust({name:"",phone:""});setAddCustModal(false);showToast("Member added");}}>ADD</Btn>
          </div>
        </Modal>
      )}

      {/* OPEN DAY */}
      {openDayModal && (
        <Modal onClose={()=>setOpenDayModal(false)}>
          <SL color={T.green}>OPEN DAY SESSION</SL>
          <Field label="OPENING CASH IN DRAWER (฿)" type="number" value={openingCash} onChange={e=>setOpeningCash(e.target.value)} placeholder="0" hint="Used for end-of-day cash reconciliation"/>
          <div style={{ display:"flex",gap:8 }}>
            <Btn v="ghost" sx={{ flex:1 }} onClick={()=>setOpenDayModal(false)}>CANCEL</Btn>
            <Btn v="pri" sx={{ flex:1 }} onClick={()=>{setDaySession({date:new Date().toISOString(),openingCash:Number(openingCash)||0,sales:0,txCount:0,openedBy:user.name});setOpenDayModal(false);showToast(`Day opened · Cash ฿${openingCash||0}`);}}>OPEN DAY</Btn>
          </div>
        </Modal>
      )}

      {/* CLOSE DAY */}
      {closeDayModal && daySession && (
        <Modal onClose={()=>setCloseDayModal(false)}>
          <SL color={T.gold}>CLOSE DAY</SL>
          <div style={{ background:T.bg3,borderRadius:10,padding:14,marginBottom:14 }}>
            <div style={{ display:"grid",gridTemplateColumns:"1fr 1fr",gap:10 }}>
              {[
                {l:"OPENED",v:fd(daySession.date)},
                {l:"BY",v:daySession.openedBy},
                {l:"OPENING CASH",v:`฿${fp(daySession.openingCash)}`},
                {l:"SALES TODAY",v:`฿${fp(daySession.sales)}`},
                {l:"TRANSACTIONS",v:daySession.txCount},
                {l:"EXPECTED CASH",v:`฿${fp(daySession.openingCash+payBreak.cash)}`},
              ].map(r=>(
                <div key={r.l}>
                  <div style={{ fontSize:9,color:T.textDim,letterSpacing:1,marginBottom:2 }}>{r.l}</div>
                  <div style={{ fontSize:14,fontWeight:700,color:T.text,fontFamily:T.mono }}>{r.v}</div>
                </div>
              ))}
            </div>
          </div>
          <div style={{ display:"flex",gap:8 }}>
            <Btn v="ghost" sx={{ flex:1 }} onClick={()=>setCloseDayModal(false)}>CANCEL</Btn>
            <Btn v="danger" sx={{ flex:1 }} onClick={()=>{exportCSV("summary");setDaySession(null);setCloseDayModal(false);showToast("Day closed · Summary exported");}}>CLOSE &amp; EXPORT</Btn>
          </div>
        </Modal>
      )}

    </div>
  );
}
export default DruidPOS;

/* Mount */
/*const root = ReactDOM.createRoot(document.getElementById("root"));
/*root.render(React.createElement(DruidPOS));
