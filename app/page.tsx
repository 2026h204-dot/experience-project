'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CASES_DATA, CATEGORIES, CaseItem } from '../data/cases';
import { supabase } from '../lib/supabase';

export default function Home() {
  const [page, setPage] = useState<number>(0);
  const [selectedCategory, setSelectedCategory] = useState<string>('');
  const [selectedCase, setSelectedCase] = useState<CaseItem>(CASES_DATA[0]);

  const [score1A, setScore1A] = useState<number>(5);
  const [score1B, setScore1B] = useState<number>(5);
  const [score2A, setScore2A] = useState<number>(5);
  const [score2B, setScore2B] = useState<number>(5);
  const [score3A, setScore3A] = useState<number>(5);
  const [score3B, setScore3B] = useState<number>(5);

  const [globalStats, setGlobalStats] = useState<{ total: number; changed: number; percentage: number }>({
    total: 0,
    changed: 0,
    percentage: 0,
  });

  useEffect(() => {
    fetchRealtimeStats();
    const channel = supabase
      .channel('schema-db-changes')
      .on(
        'postgres_changes',
        { event: 'INSERT', schema: 'public', table: 'responses' },
        () => { fetchRealtimeStats(); }
      )
      .subscribe();

    return () => { supabase.removeChannel(channel); };
  }, [selectedCase]);

  const fetchRealtimeStats = async () => {
    try {
      const { data, error } = await supabase
        .from('responses')
        .select('changed_mind')
        .eq('case_id', selectedCase.id);

      if (error || !data) return;

      const total = data.length;
      const changed = data.filter((row: any) => row.changed_mind).length;
      const percentage = total > 0 ? Math.round((changed / total) * 100) : 0;

      setGlobalStats({ total, changed, percentage });
    } catch (e) {
      console.error(e);
    }
  };

  const submitFinalData = async () => {
    const hasChanged = score1A !== score3A || score1B !== score3B;
    try {
      await supabase.from('responses').insert([
        {
          case_id: selectedCase.id,
          step2_score_a: score1A,
          step2_score_b: score1B,
          step4_score_a: score2A,
          step4_score_b: score2B,
          step6_score_a: score3A,
          step6_score_b: score3B,
          changed_mind: hasChanged,
        },
      ]);
    } catch (e) {
      console.error("Data save error:", e);
    }
    setPage(9);
  };

  const filteredCases = CASES_DATA.filter((c) => c.category === selectedCategory);

  return (
    <main className="min-h-screen bg-black text-white flex flex-col items-center justify-center p-6 font-sans select-none">
      <div className="w-full max-w-lg mx-auto">
        <AnimatePresence mode="wait">
          {page === 0 && (
            <motion.div key="p0" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="text-center space-y-6">
              <h1 className="text-3xl sm:text-4xl font-black tracking-tight leading-tight">THE EXPERIENCE PROJECT</h1>
              <p className="text-slate-400 text-sm sm:text-base leading-relaxed">
                타인을 이해하는 일은,<br />내가 모르는 그의 삶을 상상하는 것부터 시작된다.
              </p>
              <button onClick={() => setPage(1)} className="w-full py-4 bg-white text-black font-bold rounded-2xl hover:bg-slate-200 transition text-sm tracking-wider">
                시작하기
              </button>
            </motion.div>
          )}

          {page === 1 && (
            <motion.div key="p1" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="space-y-6">
              <h2 className="text-xl font-bold text-center text-slate-300">카테고리를 선택해 주세요</h2>
              <div className="grid grid-cols-1 gap-3">
                {CATEGORIES.map((cat) => (
                  <button key={cat} onClick={() => { setSelectedCategory(cat); setPage(2); }} className="w-full p-4 bg-zinc-900 border border-zinc-800 rounded-2xl text-left font-bold text-sm hover:border-white transition">
                    {cat}
                  </button>
                ))}
              </div>
            </motion.div>
          )}

          {page === 2 && (
            <motion.div key="p2" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="space-y-6">
              <h2 className="text-xl font-bold text-center text-slate-300">주제를 선택해 주세요</h2>
              <div className="grid grid-cols-1 gap-3">
                {filteredCases.map((item) => (
                  <button key={item.id} onClick={() => { setSelectedCase(item); setPage(3); }} className="w-full p-4 bg-zinc-900 border border-zinc-800 rounded-2xl text-left hover:border-white transition space-y-1">
                    <div className="text-xs text-indigo-400 font-mono font-bold">{item.id}</div>
                    <div className="font-bold text-sm">{item.title}</div>
                  </button>
                ))}
              </div>
            </motion.div>
          )}

          {page === 3 && (
            <motion.div key="p3" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="space-y-6">
              <div className="text-xs text-indigo-400 font-mono text-center">사례: {selectedCase.title}</div>
              <div className="bg-zinc-900 border border-zinc-800 p-6 rounded-2xl text-slate-200 text-sm sm:text-base leading-relaxed">
                {selectedCase.conflict}
              </div>
              <button onClick={() => setPage(4)} className="w-full py-4 bg-white text-black font-bold rounded-2xl hover:bg-slate-200 transition text-sm">
                다음
              </button>
            </motion.div>
          )}

          {page === 4 && (
            <motion.div key="p4" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="space-y-6">
              <h2 className="text-xl font-bold text-center">당신은 어떻게 생각하시나요?</h2>
              <p className="text-xs text-zinc-400 text-center">각 인물의 책임 정도를 선택해 주세요 (0~10점)</p>
              <div className="space-y-4 bg-zinc-900 p-5 rounded-2xl border border-zinc-800">
                <ScoreSlider label={`${selectedCase.personA} 책임`} value={score1A} onChange={setScore1A} />
                <ScoreSlider label={`${selectedCase.personB} 책임`} value={score1B} onChange={setScore1B} />
              </div>
              <button onClick={() => { setScore2A(score1A); setScore2B(score1B); setPage(5); }} className="w-full py-4 bg-white text-black font-bold rounded-2xl hover:bg-slate-200 transition text-sm">
                다음
              </button>
            </motion.div>
          )}

          {page === 5 && (
            <motion.div key="p5" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="space-y-6">
              <h2 className="text-lg font-bold text-amber-400">{selectedCase.personA}의 경험:</h2>
              <div className="bg-zinc-900 border border-amber-900/30 p-6 rounded-2xl text-slate-200 text-sm leading-relaxed">
                {selectedCase.experienceA}
              </div>
              <button onClick={() => setPage(6)} className="w-full py-4 bg-white text-black font-bold rounded-2xl hover:bg-slate-200 transition text-sm">
                다음
              </button>
            </motion.div>
          )}

          {page === 6 && (
            <motion.div key="p6" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="space-y-6">
              <h2 className="text-xl font-bold text-center">당신은 어떻게 생각하시나요?</h2>
              <p className="text-xs text-zinc-400 text-center">{selectedCase.personA}의 경험을 읽고 난 후의 생각입니다.</p>
              <div className="space-y-4 bg-zinc-900 p-5 rounded-2xl border border-zinc-800">
                <ScoreSlider label={`${selectedCase.personA} 책임`} value={score2A} onChange={setScore2A} />
                <ScoreSlider label={`${selectedCase.personB} 책임`} value={score2B} onChange={setScore2B} />
              </div>
              <button onClick={() => { setScore3A(score2A); setScore3B(score2B); setPage(7); }} className="w-full py-4 bg-white text-black font-bold rounded-2xl hover:bg-slate-200 transition text-sm">
                다음
              </button>
            </motion.div>
          )}

          {page === 7 && (
            <motion.div key="p7" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="space-y-6">
              <h2 className="text-lg font-bold text-emerald-400">{selectedCase.personB}의 경험:</h2>
              <div className="bg-zinc-900 border border-emerald-900/30 p-6 rounded-2xl text-slate-200 text-sm leading-relaxed">
                {selectedCase.experienceB}
              </div>
              <button onClick={() => setPage(8)} className="w-full py-4 bg-white text-black font-bold rounded-2xl hover:bg-slate-200 transition text-sm">
                다음
              </button>
            </motion.div>
          )}

          {page === 8 && (
            <motion.div key="p8" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="space-y-6">
              <h2 className="text-xl font-bold text-center">당신은 어떻게 생각하시나요?</h2>
              <p className="text-xs text-zinc-400 text-center">양쪽 모두의 맥락을 알게 된 후의 최종 판단입니다.</p>
              <div className="space-y-4 bg-zinc-900 p-5 rounded-2xl border border-zinc-800">
                <ScoreSlider label={`${selectedCase.personA} 책임`} value={score3A} onChange={setScore3A} />
                <ScoreSlider label={`${selectedCase.personB} 책임`} value={score3B} onChange={setScore3B} />
              </div>
              <button onClick={submitFinalData} className="w-full py-4 bg-white text-black font-bold rounded-2xl hover:bg-slate-200 transition text-sm">
                제출하고 결과 보기
              </button>
            </motion.div>
          )}

          {page === 9 && (
            <motion.div key="p9" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="text-center space-y-6">
              <h1 className="text-3xl font-black text-white">감사합니다.</h1>
              <div className="bg-zinc-900 border border-zinc-800 p-8 rounded-3xl space-y-3">
                <p className="text-sm text-zinc-400">실시간 연동 데이터 집계 결과</p>
                <div className="text-4xl font-black text-indigo-400">약 {globalStats.percentage}%</div>
                <p className="text-sm text-zinc-300 font-bold">의 응답자가 맥락을 확인한 후 답을 바꾸었습니다.</p>
                <p className="text-xs text-zinc-500 pt-2 font-mono">(총 {globalStats.total}명의 실시간 참여 데이터 기준)</p>
              </div>
              <button onClick={() => { setPage(1); setScore1A(5); setScore1B(5); setScore2A(5); setScore2B(5); setScore3A(5); setScore3B(5); }} className="w-full py-4 bg-zinc-800 text-white font-bold rounded-2xl hover:bg-zinc-700 transition text-sm">
                다른 주제 체험하기
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </main>
  );
}

function ScoreSlider({ label, value, onChange }: { label: string; value: number; onChange: (v: number) => void }) {
  return (
    <div className="space-y-2">
      <div className="flex justify-between text-xs font-bold text-zinc-300">
        <span>{label}</span>
        <span className="text-indigo-400 font-mono">{value}점</span>
      </div>
      <input type="range" min="0" max="10" value={value} onChange={(e) => onChange(Number(e.target.value))} className="w-full accent-white bg-zinc-800 h-2 rounded-lg cursor-pointer" />
    </div>
  );
}
