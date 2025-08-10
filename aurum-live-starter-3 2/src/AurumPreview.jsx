import React, { useMemo, useRef, useState, useEffect } from "react";

const THEME = {
  bg: "#0b0c0f",
  panel: "#0e1015",
  panel2: "#12141b",
  border: "#1d2130",
  text: "#e6e7eb",
  muted: "#9aa3b2",
  gold400: "#f5d47a",
  gold500: "#f1c550",
  gold600: "#d6ab3a",
  glow: "rgba(241,197,80,0.25)",
  gradient: "linear-gradient(180deg, rgba(241,197,80,0.08), rgba(0,0,0,0))",
};

const presenceColors = { online: "#22c55e", away: "#f59e0b", offline: "#64748b" };
function initials(name){
  const p = (name||'').trim().split(/\s+/);
  return (p[0]?.[0]||'').toUpperCase() + (p[1]?.[0]||'').toUpperCase();
}
function Avatar({ name, size=28, presence='offline' }){
  const bg = '#1f2937';
  const style = { width:size, height:size, borderRadius:9999, background:bg, color:'#e6e7eb', display:'grid', placeItems:'center', fontSize: Math.max(10, size*0.38), position:'relative', border:`1px solid ${THEME.border}` };
  return (
    <div style={style}>
      {initials(name||'U')}
      <span style={{ position:'absolute', width:Math.max(6,size*0.32), height:Math.max(6,size*0.32), borderRadius:9999, background:presenceColors[presence], right:-2, bottom:-2, border:'2px solid #0e1015' }} />
    </div>
  )
}

function Reply({ r, onReplyTo, onDm }) {
  return (
    <div className="pl-3 border-l" style={{ borderColor: THEME.border }}>
      <div className="text-xs flex items-center gap-2" style={{ color: THEME.muted }}>
        <Avatar name={r.author} size={18} presence={'online'} />
        <button onClick={() => onDm(r.author)} className="underline decoration-dotted hover:opacity-90">{r.author}</button>
      </div>
      {r.content && <div className="text-sm" style={{ color: THEME.text }}>{r.content}</div>}
      {r.image && (<img src={r.image} alt="upload" className="max-h-32 rounded mt-1" style={{ border: `1px solid ${THEME.border}` }} />)}
      <div className="mt-1"><button onClick={() => onReplyTo(r)} className="text-xs" style={{ color: THEME.muted }}>Reply</button></div>
    </div>
  );
}

function Message({ m, onReplyTo, onDm, onHover }) {
  return (
    <div className="space-y-1 rounded-md p-3" style={{ background: "#0e1015cc", border: `1px solid ${THEME.border}`, boxShadow: `0 8px 24px -12px ${THEME.glow}` }}>
      <div className="text-xs flex items-center gap-2" style={{ color: THEME.muted }}>
        <Avatar name={m.author} presence={'online'} />
        <button onClick={() => onDm(m.author)} className="underline decoration-dotted hover:opacity-90">{m.author}</button>
        <span>·</span>
        <button onClick={() => onReplyTo(m)} className="hover:opacity-90">Reply</button>
      </div>
      {m.content && <div className="text-sm" style={{ color: THEME.text }}>{m.content}</div>}
      {m.image && (<img src={m.image} alt="upload" className="max-h-40 rounded" style={{ border: `1px solid ${THEME.border}` }} />)}
      {!!m.replies?.length && (<div className="space-y-2 mt-2">{m.replies.map((r) => <Reply key={r.id} r={r} onReplyTo={onReplyTo} onDm={onDm} />)}</div>)}
    </div>
  );
}

function ChatComposer({ onSend, onUpload, placeholder = "Message…" }) {
  const [val, setVal] = useState("");
  const fileRef = useRef(null);

  const send = (e) => {
    e?.preventDefault();
    const msg = val.trim();
    if (!msg) return;
    onSend({ content: msg });
    setVal("");
  };

  const choose = () => fileRef.current?.click();
  const picked = (e) => {
    const f = e.target.files?.[0];
    if (!f) return;
    const url = URL.createObjectURL(f);
    onUpload({ name: f.name, type: f.type, url });
    e.target.value = "";
  };

  return (
    <form onSubmit={send} className="flex gap-2 p-3" style={{ borderTop: `1px solid ${THEME.border}`, boxShadow: `0 -10px 30px -20px ${THEME.glow}` }}>
      <input className="flex-1 rounded px-3 py-2" style={{ background: THEME.panel2, color: THEME.text, border: `1px solid ${THEME.border}`, outline: "none" }} placeholder={placeholder} value={val} onChange={(e) => setVal(e.target.value)} />
      <input ref={fileRef} type="file" className="hidden" onChange={picked} />
      <button type="button" onClick={choose} className="rounded px-3 py-2" style={{ background: THEME.panel2, color: THEME.text, border: `1px solid ${THEME.border}` }}>Upload</button>
      <button className="rounded px-4 py-2 font-semibold" style={{ background: THEME.gold600, color: "#000", boxShadow: `0 8px 24px ${THEME.glow}` }}>Send</button>
    </form>
  );
}

function LoginModal({ onClose, onAuthed }) {
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [sent, setSent] = useState(false);

  const sendLink = (e) => {
    e.preventDefault();
    if (!email.trim()) return;
    setSent(true);
    setTimeout(() => { onAuthed({ email, name: name || email.split('@')[0] }); onClose(); }, 900);
  };

  return (
    <div className="fixed inset-0 grid place-items-center" style={{ background: "rgba(0,0,0,0.6)" }}>
      <form onSubmit={sendLink} className="rounded-xl p-6 w-[92%] max-w-md" style={{ background: THEME.panel2, border: `1px solid ${THEME.border}`, boxShadow: `0 30px 80px ${THEME.glow}` }}>
        <h2 className="text-xl font-semibold" style={{ color: THEME.gold500 }}>Sign in to W&W</h2>
        <p className="text-sm mt-1" style={{ color: THEME.muted }}>We’ll send a magic link to your email. (Preview simulates this.)</p>
        <div className="mt-4 space-y-2">
          <input className="w-full rounded px-3 py-2" style={{ background: THEME.panel, color: THEME.text, border: `1px solid ${THEME.border}` }} placeholder="Name" value={name} onChange={(e) => setName(e.target.value)} />
          <input type="email" className="w-full rounded px-3 py-2" style={{ background: THEME.panel, color: THEME.text, border: `1px solid ${THEME.border}` }} placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} />
        </div>
        <button className="mt-4 w-full rounded px-3 py-2 font-semibold" style={{ background: THEME.gold600, color: '#000', boxShadow: `0 30px 80px ${THEME.glow}` }}>{sent ? 'Sent…' : 'Send magic link'}</button>
      </form>
    </div>
  );
}

const LeftRailIcon = ({ title, active, onClick, path }) => (
  <button title={title} onClick={onClick} className="w-10 h-10 grid place-items-center rounded-lg" style={{ border:`1px solid ${active?THEME.border:'transparent'}`, background: active? '#0a0b0e' : 'transparent' }}>
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none"><path d={path} stroke="#e6e7eb" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
  </button>
);

export default function AurumPreview() {
  const [user, setUser] = useState(null);
  const [showLogin, setShowLogin] = useState(true);

  const [activeChannel, setActiveChannel] = useState("general");
  const [activeDm, setActiveDm] = useState(null);
  const [leftTab, setLeftTab] = useState('channels');
  const isDM = !!activeDm;

  const [profileUser, setProfileUser] = useState(null);
  const [showSettings, setShowSettings] = useState(false);

  const members = useMemo(() => ([
    { email: 'admin@you', name: 'Admin', presence:'online' },
    { email: 'mod@you', name: 'Moderator', presence:'away' },
    { email: 'alice@you', name: 'Alice', presence:'online' },
    { email: 'bob@you', name: 'Bob', presence:'offline' },
    { email: 'charlie@you', name: 'Charlie', presence:'away' },
    { email: 'diana@you', name: 'Diana', presence:'online' },
  ]), []);

  const [messages, setMessages] = useState({
    general: [
      { id: 1, author: "admin@you", content: "Welcome to W&W — Gold & Black." },
      { id: 2, author: "mod@you", content: "Upload an image to preview attachments.", replies: [{ id: '2-1', author: 'alice@you', content: 'Copy that!' }] },
    ],
    announcements: [ { id: 1, author: "system", content: "Stripe + S3 are wired in the downloadable build." } ],
    media: [],
  });

  const [dmThreads, setDmThreads] = useState({
    'alice@you': [{ id: 1001, author: 'alice@you', content: 'Hey there!' }, { id: 1002, author: 'you', content: 'Hi!' }]
  });

  const sendToChannel = (payload) => {
    const newMsg = { id: Date.now(), author: user?.email || 'you', ...payload };
    setMessages((m) => ({ ...m, [activeChannel]: [ ...(m[activeChannel] || []), newMsg ] }));
  };
  const uploadToChannel = ({ url, type }) => sendToChannel({ image: url, content: type?.startsWith('image/') ? '' : url });

  const sendDm = (otherEmail, payload) => {
    setDmThreads((t) => {
      const cur = t[otherEmail] || [];
      return { ...t, [otherEmail]: [ ...cur, { id: Date.now(), author: user?.email || 'you', ...payload } ] };
    });
    setActiveDm({ email: otherEmail });
  };
  const uploadToDm = (otherEmail, f) => sendDm(otherEmail, { image: f.url, content: f.type?.startsWith('image/') ? '' : f.url });

  const channelList = [
    { key: "general", label: "# general" },
    { key: "announcements", label: "# announcements" },
    { key: "media", label: "# media" },
  ];

  const [replyTarget, setReplyTarget] = useState(null);

  const RightPane = () => {
    if (isDM && activeDm) {
      const thread = dmThreads[activeDm.email] || [];
      return (
        <>
          <div className="overflow-auto p-4 space-y-3" style={{ background: THEME.panel2 }}>
            {thread.map((m) => (
              <Message key={m.id} m={m} onReplyTo={()=>{}} onDm={(email) => setActiveDm({ email })} />
            ))}
          </div>
          <ChatComposer placeholder={`Message @${activeDm.email}`} onSend={(p) => sendDm(activeDm.email, p)} onUpload={(f) => uploadToDm(activeDm.email, f)} />
        </>
      );
    }
    return (
      <>
        <div className="overflow-auto p-4 space-y-3" style={{ background: THEME.panel2 }}>
          {(messages[activeChannel] || []).map((m) => (
            <Message key={m.id} m={m} onReplyTo={(msg) => setReplyTarget(msg)} onDm={(email) => setActiveDm({ email })} />
          ))}
        </div>
        <ChatComposer onSend={sendToChannel} onUpload={uploadToChannel} />
      </>
    );
  };

  const SettingsDrawer = ({ onClose }) => {
    const [notifications, setNotifications] = useState(true);
    const [compact, setCompact] = useState(false);
    return (
      <div className="fixed left-0 bottom-0 right-0 md:left-auto md:right-0 md:top-0 md:h-full md:w-[420px] p-4" style={{ background: THEME.panel, borderTop:`1px solid ${THEME.border}`, borderLeft:`1px solid ${THEME.border}`, boxShadow:`0 -20px 60px -40px ${THEME.glow}` }}>
        <div className="flex items-center gap-2">
          <div className="font-semibold" style={{ color: THEME.gold500 }}>Settings</div>
          <button onClick={onClose} className="ml-auto rounded px-2 py-1" style={{ border:`1px solid ${THEME.border}`, background: THEME.panel2 }}>Close</button>
        </div>
        <div className="mt-3 grid gap-3">
          <div className="rounded p-3" style={{ background: THEME.panel2, border:`1px solid ${THEME.border}` }}>
            <div className="font-medium">Notifications</div>
            <label className="mt-2 flex items-center gap-2 text-sm"><input type="checkbox" checked={notifications} onChange={()=>setNotifications(v=>!v)} /> Enable push notifications</label>
          </div>
          <div className="rounded p-3" style={{ background: THEME.panel2, border:`1px solid ${THEME.border}` }}>
            <div className="font-medium">Layout</div>
            <label className="mt-2 flex items-center gap-2 text-sm"><input type="checkbox" checked={compact} onChange={()=>setCompact(v=>!v)} /> Compact mode</label>
          </div>
          <div className="rounded p-3" style={{ background: THEME.panel2, border:`1px solid ${THEME.border}` }}>
            <div className="font-medium">Account</div>
            {user ? (
              <>
                <div className="text-sm mt-1" style={{ color: THEME.muted }}>Signed in as <span style={{ color: THEME.gold500 }}>{user.email}</span></div>
                <button onClick={()=>{ setUser(null); onClose(); }} className="mt-2 rounded px-3 py-2" style={{ border:`1px solid ${THEME.border}` }}>Sign out</button>
              </>
            ) : (
              <div className="text-sm mt-1" style={{ color: THEME.muted }}>Not signed in</div>
            )}
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="w-full h-full" style={{ background: THEME.bg, color: THEME.text }}>
      {showLogin && <LoginModal onClose={() => setShowLogin(false)} onAuthed={(u)=> setUser(u)} />}
      <div className="grid" style={{ gridTemplateColumns: "64px minmax(0, 260px) 1fr", height: "100vh" }}>
        {/* Icon Rail */}
        <aside className="p-2 flex flex-col justify-between" style={{ background: THEME.panel, borderRight: `1px solid ${THEME.border}` }}>
          <div className="flex flex-col gap-2">
            <LeftRailIcon title="Channels" active={leftTab==='channels'} onClick={()=>setLeftTab(leftTab==='channels'? null : 'channels')} path="M4 7h16M4 12h10M4 17h16" />
            <LeftRailIcon title="Messages" active={leftTab==='messages'} onClick={()=>setLeftTab(leftTab==='messages'? null : 'messages')} path="M21 15v-6a2 2 0 0 0-2-2H5a2 2 0 0 0-2 2v9l3-3h13a2 2 0 0 0 2-2z" />
            <LeftRailIcon title="Members" active={leftTab==='members'} onClick={()=>setLeftTab(leftTab==='members'? null : 'members')} path="M16 11a4 4 0 1 0-8 0 4 4 0 0 0 8 0ZM3 21a7 7 0 0 1 18 0" />
            <LeftRailIcon title="Apps" active={leftTab==='apps'} onClick={()=>setLeftTab(leftTab==='apps'? null : 'apps')} path="M4 4h7v7H4zM13 4h7v7h-7zM4 13h7v7H4zM13 13h7v7h-7z" />
          </div>
          <div className="pb-1">
            <LeftRailIcon title="Settings" active={false} onClick={()=>setShowSettings(true)} path="M12 15.5A3.5 3.5 0 1 0 12 8.5a3.5 3.5 0 0 0 0 7z M19.4 15a1 1 0 0 0 .2-1.1l-1-1.7a7.8 7.8 0 0 0 0-1.4l1-1.7a1 1 0 0 0-.2-1.1l-1.1-1.1a1 1 0 0 0-1.1-.2l-1.7 1a7.8 7.8 0 0 0-1.4 0l-1.7 1a1 1 0 0 0 1.1-.2l1.1-1.1z" />
          </div>
        </aside>

        {/* Sidebar Content */}
        <aside className="p-3 hidden md:block" style={{ background: THEME.panel, borderRight: `1px solid ${THEME.border}` }}>
          <div className="mb-3 rounded-xl p-3" style={{ background: THEME.panel2, border: `1px solid ${THEME.border}`, boxShadow: `inset 0 1px 0 rgba(255,255,255,0.03), 0 10px 40px -20px ${THEME.glow}` }}>
            <div className="font-bold leading-tight" style={{ color: THEME.gold500 }}>{user?.name || 'W&W GLOBAL ALLIANCE'}</div>
            <div className="text-[11px]" style={{ color: THEME.muted }}>{user?.email || 'Excellence • Power • Legacy'}</div>
            <div className="mt-2 flex gap-2 items-center">
              {!user && (
                <button onClick={() => setShowLogin(true)} className="rounded px-3 py-1 text-xs" style={{ border: `1px solid ${THEME.border}`, background: THEME.panel2, color: THEME.text }}>Sign in</button>
              )}
              {user && (
                <button onClick={() => { setUser(null); setShowLogin(true); }} className="rounded px-3 py-1 text-xs" style={{ border: `1px solid ${THEME.border}`, background: THEME.panel2, color: THEME.text }}>Sign out</button>
              )}
            </div>
          </div>

          {/* Subscription */}
          <div className="mb-3 p-3 rounded-lg" style={{ background: THEME.panel2, border: `1px solid ${THEME.border}`, backgroundImage: THEME.gradient }}>
            <div className="text-xs" style={{ color: THEME.muted }}>Subscription</div>
            <button className="mt-2 w-full rounded px-3 py-2 font-semibold" style={{ background: THEME.gold600, color: "#000", boxShadow: `0 10px 30px ${THEME.glow}` }}>Join (Stripe)</button>
          </div>

          {/* Panels */}
          {leftTab === 'channels' && (
            <div>
              <div className="text-xs" style={{ color: THEME.muted }}>Channels</div>
              <nav className="mt-2 space-y-1">
                {channelList.map((c) => (
                  <button key={c.key} onClick={() => { setActiveChannel(c.key); setActiveDm(null); }} className="w-full text-left px-3 py-2 rounded" style={{ background: activeChannel === c.key && !isDM ? "#0a0b0e" : "transparent", border: `1px solid ${(activeChannel === c.key && !isDM) ? THEME.border : "transparent"}`, color: THEME.text }}>
                    {c.label}
                  </button>
                ))}
              </nav>
            </div>
          )}

          {leftTab === 'messages' && (
            <div>
              <div className="text-xs" style={{ color: THEME.muted }}>Messages</div>
              <div className="mt-4 text-xs" style={{ color: THEME.muted }}>Active threads</div>
              <div className="mt-1 space-y-1 overflow-auto" style={{ maxHeight: '50%' }}>
                {Object.keys(dmThreads).length ? Object.keys(dmThreads).map(email => (
                  <button key={email} onClick={()=>setActiveDm({email})} className="w-full text-left px-3 py-2 rounded" style={{ background:'transparent', border:`1px solid ${THEME.border}`, color: THEME.text }}>
                    @{email}
                  </button>
                )) : <div className="text-xs" style={{ color: THEME.muted }}>No threads yet</div>}
              </div>
            </div>
          )}

          {leftTab === 'members' && (
            <div>
              <div className="text-xs" style={{ color: THEME.muted }}>Members</div>
              <div className="mt-2 grid gap-2" style={{ gridTemplateColumns:'1fr' }}>
                {members.map(m => (
                  <div key={m.email} className="rounded-lg p-3" style={{ background: THEME.panel2, border:`1px solid ${THEME.border}` }}>
                    <div className="flex items-center gap-3">
                      <Avatar name={m.name} presence={m.presence} />
                      <div>
                        <div className="font-medium">{m.name}</div>
                        <div className="text-xs" style={{ color: THEME.muted }}>@{m.email}</div>
                      </div>
                    </div>
                    <div className="mt-2 flex gap-2">
                      <button onClick={()=>setActiveDm({email:m.email})} className="rounded px-3 py-1 text-xs" style={{ background: THEME.gold600, color:'#000' }}>Message</button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {leftTab === 'apps' && (
            <div>
              <div className="text-xs" style={{ color: THEME.muted }}>Apps & Integrations</div>
              <div className="mt-2 text-xs" style={{ color: THEME.muted }}>Coming soon: webhooks, bots, and OAuth installs.</div>
            </div>
          )}
        </aside>

        {/* Main */}
        <main className="grid" style={{ gridTemplateRows: "1fr auto" }}>
          <RightPane />
        </main>
      </div>

      {showSettings && (
        <SettingsDrawer onClose={()=>setShowSettings(false)} />
      )}
    </div>
  );
}
