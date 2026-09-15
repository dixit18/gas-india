import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { schools, polls, vote, flames } from '../lib/api.js';
import { STR } from '../lib/i18n.js';
import { Card } from '../components/ui.jsx';

export default function Home({ lang, setLang }) {
  const t = STR[lang];
  const [tab, setTab] = useState('polls');
  const [list, setList] = useState([]);
  const [mine, setMine] = useState([]);
  const [me, setMe] = useState('Aarav');
  const [msg, setMsg] = useState('');
  const load = async () => {
    const s = await schools().catch(() => []);
    const sid = (s[0]?._id) || 'demo-college';
    setList(await polls(sid).catch(() => []));
    if (me) setMine(await flames(me).catch(() => []));
  };
  useEffect(() => { load(); }, []);
  const pick = async (pid, i) => {
    await vote(pid, { optionIdx: i, voterKey: me + '-web', grade: 'FY' }).catch((e) => setMsg(e.response?.data?.error || 'error'));
    setMsg(t.sent);
    load();
  };
  return (
    <div className="max-w-xl mx-auto px-4 py-8">
      <div className="flex justify-end"><button onClick={() => setLang(lang === 'en' ? 'hi' : 'en')} className="text-sm underline min-h-[44px]">{lang === 'en' ? 'Hindi' : 'English'}</button></div>
      <motion.div initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }}>
        <p className="text-sm font-semibold text-[hsl(var(--primary))]">{t.tag}</p>
        <h1 className="text-4xl sm:text-5xl font-extrabold mt-2">{t.hero}</h1>
        <p className="text-zinc-500 mt-2">{t.sub}</p>
      </motion.div>
      <div className="flex gap-2 mt-5">
        {['polls', 'flames'].map((k) => (
          <button key={k} onClick={() => setTab(k)} className={'min-h-[44px] px-4 rounded-2xl border ' + (tab === k ? 'bg-[hsl(var(--primary))] text-white' : '')}>{t[k]}</button>
        ))}
        <input value={me} onChange={(e) => setMe(e.target.value)} placeholder="My name" className="ml-auto w-28 min-h-[44px] rounded-xl border px-3 bg-transparent text-sm" />
      </div>
      {msg && <p className="text-sm mt-2 text-[hsl(var(--primary))]">{msg}</p>}
      {tab === 'polls' && (
        <div className="grid gap-3 mt-4">
          {list.map((p) => (
            <Card key={p._id}>
              <p className="font-semibold">{p.question}</p>
              <div className="grid grid-cols-2 gap-2 mt-3">
                {p.options.map((o, i) => (
                  <button key={i} onClick={() => pick(p._id, i)} className="min-h-[44px] rounded-xl border px-3 text-sm active:scale-95 hover:border-[hsl(var(--primary))]">{o}</button>
                ))}
              </div>
            </Card>
          ))}
          {list.length === 0 && <p className="text-sm text-zinc-500">No polls yet.</p>}
        </div>
      )}
      {tab === 'flames' && (
        <div className="grid gap-2 mt-4">
          {mine.map((f) => (
            <Card key={f._id}><p className="text-2xl">🔥</p><p className="text-sm mt-1">{f.question}</p><p className="text-xs text-zinc-500">from {f.fromHint}</p></Card>
          ))}
          {mine.length === 0 && <p className="text-sm text-zinc-500">No flames yet — vote and get voted.</p>}
        </div>
      )}
    </div>
  );
}
