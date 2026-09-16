'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { CATEGORIES, CASES_DATA, CaseItem } from '@/data/cases';

export default function HomePage() {
  const router = useRouter();
  const [step, setStep] = useState<'intro' | 'category' | 'topic'>('intro');
  const [selectedCategory, setSelectedCategory] = useState<string>('');

  const filteredCases = CASES_DATA.filter((c) => c.category === selectedCategory);

  return (
    <main className="min-h-screen bg-black text-white flex flex-col items-center justify-center p-6 text-center">
      {/* 1단계: 메인 랜딩 */}
      {step === 'intro' && (
        <div className="w-full max-w-lg flex flex-col items-center">
          <h1 className="text-3xl font-extrabold tracking-wider mb-4 uppercase">
            THE EXPERIENCE PROJECT
          </h1>
          <p className="text-gray-400 text-sm leading-relaxed mb-10">
            타인을 이해하는 일은,<br />
            내가 모르는 그의 삶을 상상하는 것부터 시작된다.
          </p>
          <button
            onClick={() => setStep('category')}
            className="w-full bg-white hover:bg-gray-200 text-black font-semibold py-4 rounded-xl transition-all"
          >
            시작하기
          </button>
        </div>
      )}

      {/* 2단계: 카테고리 선택 */}
      {step === 'category' && (
        <div className="w-full max-w-md flex flex-col items-center">
          <h2 className="text-xl font-bold mb-8">카테고리를 선택해 주세요</h2>
          <div className="w-full flex flex-col gap-3">
            {CATEGORIES.map((cat) => (
              <button
                key={cat}
                onClick={() => {
                  setSelectedCategory(cat);
                  setStep('topic');
                }}
                className="w-full bg-[#161618] hover:bg-[#222225] text-gray-200 font-medium py-4 px-6 rounded-xl border border-[#26262a] text-left transition-all"
              >
                {cat}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* 3단계: 주제 선택 */}
      {step === 'topic' && (
        <div className="w-full max-w-md flex flex-col items-center">
          <h2 className="text-xl font-bold mb-8">주제를 선택해 주세요</h2>
          <div className="w-full flex flex-col gap-3">
            {filteredCases.map((c) => (
              <button
                key={c.id}
                onClick={() => router.push(`/cases/${c.id}`)}
                className="w-full bg-[#161618] hover:bg-[#222225] text-left p-5 rounded-xl border border-[#26262a] transition-all flex flex-col gap-1"
              >
                <span className="text-xs text-[#818cf8] font-mono">{c.id}</span>
                <span className="text-base font-semibold text-white">{c.title}</span>
              </button>
            ))}
          </div>
          <button
            onClick={() => setStep('category')}
            className="mt-6 text-xs text-gray-500 underline"
          >
            카테고리 다시 선택
          </button>
        </div>
      )}
    </main>
  );
}
