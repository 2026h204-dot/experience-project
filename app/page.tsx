'use client';

import React, { useState } from 'react';
import { CASES_DATA, CATEGORIES, EVALUATION_OPTIONS, CaseItem } from '../data/cases';

type Step = 'home' | 'category' | 'list' | 'detail';

export default function HomePage() {
  const [step, setStep] = useState<Step>('home');
  const [selectedCategory, setSelectedCategory] = useState<string>('');
  const [currentCase, setCurrentCase] = useState<CaseItem | null>(null);

  const [evalA, setEvalA] = useState<string | null>(null);
  const [evalB, setEvalB] = useState<string | null>(null);

  // 단계 이동 처리
  const goStart = () => setStep('category');
  
  const selectCategory = (cat: string) => {
    setSelectedCategory(cat);
    setStep('list');
  };

  const selectCase = (c: CaseItem) => {
    setCurrentCase(c);
    setEvalA(null);
    setEvalB(null);
    setStep('detail');
  };

  const goBack = () => {
    if (step === 'detail') setStep('list');
    else if (step === 'list') setStep('category');
    else if (step === 'category') setStep('home');
  };

  const filteredCases = CASES_DATA.filter(c => c.category === selectedCategory);

  return (
    <div className="bg-black text-white min-h-screen font-sans flex flex-col justify-between max-w-md mx-auto px-6 py-8 border-x border-zinc-900">
      
      {/* 1. 홈 화면 (시작하기) */}
      {step === 'home' && (
        <div className="flex-1 flex flex-col justify-between my-auto py-12">
          <div className="space-y-4 text-left">
            <p className="text-xs tracking-widest text-zinc-500 uppercase">THE EXPERIENCE PROJECT</p>
            <h1 className="text-3xl font-extrabold tracking-tight leading-tight">
              입장 바꿔<br />생각하기
            </h1>
            <p className="text-sm text-zinc-400 font-light leading-relaxed pt-2">
              갈등 상황 속 서로 다른 두 인물의 입장을 살펴보고, 나만의 시선으로 세상을 바라봅니다.
            </p>
          </div>

          <button
            onClick={goStart}
            className="w-full py-4 bg-white text-black font-semibold text-sm rounded-none hover:bg-zinc-200 transition active:scale-[0.99]"
          >
            시작하기
          </button>
        </div>
      )}

      {/* 2. 카테고리 선택 화면 */}
      {step === 'category' && (
        <div className="flex-1 flex flex-col justify-between py-4">
          <div>
            <button onClick={goBack} className="text-xs text-zinc-500 mb-8 hover:text-white transition">
              ← 뒤로가기
            </button>
            <p className="text-xs text-zinc-500 uppercase mb-2">STEP 01</p>
            <h2 className="text-2xl font-bold tracking-tight mb-8">카테고리 선택</h2>

            <div className="space-y-3">
              {CATEGORIES.map(cat => (
                <button
                  key={cat}
                  onClick={() => selectCategory(cat)}
                  className="w-full text-left p-5 border border-zinc-800 hover:border-white transition flex justify-between items-center group"
                >
                  <span className="text-sm font-medium">{cat}</span>
                  <span className="text-xs text-zinc-600 group-hover:text-white transition">→</span>
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* 3. 사례 선택 목록 화면 */}
      {step === 'list' && (
        <div className="flex-1 flex flex-col justify-between py-4">
          <div>
            <button onClick={goBack} className="text-xs text-zinc-500 mb-8 hover:text-white transition">
              ← 카테고리로 돌아가기
            </button>
            <p className="text-xs text-zinc-500 uppercase mb-2">{selectedCategory}</p>
            <h2 className="text-2xl font-bold tracking-tight mb-6">사례 선택</h2>

            <div className="space-y-4">
              {filteredCases.map(item => (
                <div
                  key={item.id}
                  onClick={() => selectCase(item)}
                  className="p-5 border border-zinc-800 hover:border-white transition cursor-pointer space-y-2"
                >
                  <h3 className="text-base font-bold">{item.title}</h3>
                  <p className="text-xs text-zinc-500">
                    A: {item.personA.name} ({item.personA.role})<br />
                    B: {item.personB.name} ({item.personB.role})
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* 4. 사례 상세 및 5단계 평가 화면 */}
      {step === 'detail' && currentCase && (
        <div className="flex-1 flex flex-col justify-between py-4 space-y-8">
          <div>
            <button onClick={goBack} className="text-xs text-zinc-500 mb-6 hover:text-white transition">
              ← 사례 목록으로 돌아가기
            </button>

            <div className="border-b border-zinc-800 pb-4 mb-6">
              <span className="text-[10px] text-zinc-500 uppercase tracking-wider">{currentCase.category}</span>
              <h2 className="text-xl font-bold mt-1">{currentCase.title}</h2>
            </div>

            {/* 인물 A 카드 */}
            <div className="mb-8 border border-zinc-800 p-5 space-y-3">
              <div>
                <span className="text-[10px] text-zinc-500 uppercase tracking-widest">PERSON A</span>
                <h3 className="text-base font-bold">{currentCase.personA.name}</h3>
                <p className="text-xs text-zinc-400">{currentCase.personA.role}</p>
              </div>
              <p className="text-xs text-zinc-300 leading-relaxed bg-zinc-950 p-3 border border-zinc-900">
                "{currentCase.storyA}"
              </p>

              <div className="pt-2">
                <p className="text-[11px] text-zinc-500 mb-2">잘못 여부 평가:</p>
                <div className="space-y-1">
                  {EVALUATION_OPTIONS.map(opt => (
                    <button
                      key={opt}
                      onClick={() => setEvalA(opt)}
                      className={`w-full text-left px-3 py-2 text-xs border transition ${
                        evalA === opt
                          ? 'bg-white text-black font-bold border-white'
                          : 'border-zinc-800 text-zinc-400 hover:border-zinc-600'
                      }`}
                    >
                      {opt}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* 인물 B 카드 */}
            <div className="mb-8 border border-zinc-800 p-5 space-y-3">
              <div>
                <span className="text-[10px] text-zinc-500 uppercase tracking-widest">PERSON B</span>
                <h3 className="text-base font-bold">{currentCase.personB.name}</h3>
                <p className="text-xs text-zinc-400">{currentCase.personB.role}</p>
              </div>
              <p className="text-xs text-zinc-300 leading-relaxed bg-zinc-950 p-3 border border-zinc-900">
                "{currentCase.storyB}"
              </p>

              <div className="pt-2">
                <p className="text-[11px] text-zinc-500 mb-2">잘못 여부 평가:</p>
                <div className="space-y-1">
                  {EVALUATION_OPTIONS.map(opt => (
                    <button
                      key={opt}
                      onClick={() => setEvalB(opt)}
                      className={`w-full text-left px-3 py-2 text-xs border transition ${
                        evalB === opt
                          ? 'bg-white text-black font-bold border-white'
                          : 'border-zinc-800 text-zinc-400 hover:border-zinc-600'
                      }`}
                    >
                      {opt}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* 완료 요약 및 뒤로가기 */}
            {evalA && evalB && (
              <div className="p-4 border border-zinc-700 bg-zinc-950 text-center space-y-3">
                <p className="text-xs text-zinc-400">평가가 완료되었습니다.</p>
                <button
                  onClick={goBack}
                  className="w-full py-3 bg-white text-black text-xs font-bold hover:bg-zinc-200 transition"
                >
                  다른 사례 선택하기
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      <footer className="text-center pt-8 border-t border-zinc-900">
        <p className="text-[10px] text-zinc-600">THE EXPERIENCE PROJECT © 2026</p>
      </footer>
    </div>
  );
}
