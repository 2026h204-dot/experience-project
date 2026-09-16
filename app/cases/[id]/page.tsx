'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { CASES_DATA } from '@/data/cases';

export default function CaseDetailPage({ params }: { params: { id: string } }) {
  const router = useRouter();
  const caseItem = CASES_DATA.find((c) => c.id === params.id);

  const [step, setStep] = useState<number>(1);
  const [scoreA, setScoreA] = useState<number>(5);
  const [scoreB, setScoreB] = useState<number>(5);

  if (!caseItem) return <div className="p-10 text-center text-white bg-black min-h-screen">사례를 찾을 수 없습니다.</div>;

  return (
    <main className="min-h-screen bg-black text-white flex flex-col items-center justify-center p-6 text-center">
      <div className="w-full max-w-md flex flex-col items-center">
        
        {/* STEP 1: 개요 */}
        {step === 1 && (
          <>
            <p className="text-xs text-[#818cf8] mb-6 font-mono">사례: {caseItem.title}</p>
            <div className="w-full bg-[#161618] border border-[#26262a] rounded-2xl p-6 mb-6 leading-relaxed text-gray-200 font-medium">
              {caseItem.summary}
            </div>
            <button
              onClick={() => setStep(2)}
              className="w-full bg-white text-black font-semibold py-4 rounded-xl hover:bg-gray-200 transition-all"
            >
              다음
            </button>
          </>
        )}

        {/* STEP 2: 1차 평가 */}
        {step === 2 && (
          <>
            <h2 className="text-2xl font-bold mb-2">당신은 어떻게 생각하시나요?</h2>
            <p className="text-xs text-gray-400 mb-8">각 인물의 책임 정도를 선택해 주세요 (0~10점)</p>

            <div className="w-full bg-[#161618] border border-[#26262a] rounded-2xl p-6 mb-6 flex flex-col gap-6 text-left">
              <div>
                <div className="flex justify-between text-sm font-semibold mb-2">
                  <span>{caseItem.personA.name} ({caseItem.personA.role}) 책임</span>
                  <span className="text-[#818cf8]">{scoreA}점</span>
                </div>
                <input
                  type="range" min="0" max="10" value={scoreA}
                  onChange={(e) => setScoreA(Number(e.target.value))}
                  className="w-full accent-white bg-gray-700 h-1.5 rounded-lg appearance-none cursor-pointer"
                />
              </div>
              <div>
                <div className="flex justify-between text-sm font-semibold mb-2">
                  <span>{caseItem.personB.name} ({caseItem.personB.role}) 책임</span>
                  <span className="text-[#818cf8]">{scoreB}점</span>
                </div>
                <input
                  type="range" min="0" max="10" value={scoreB}
                  onChange={(e) => setScoreB(Number(e.target.value))}
                  className="w-full accent-white bg-gray-700 h-1.5 rounded-lg appearance-none cursor-pointer"
                />
              </div>
            </div>

            <button
              onClick={() => setStep(3)}
              className="w-full bg-white text-black font-semibold py-4 rounded-xl hover:bg-gray-200 transition-all"
            >
              다음
            </button>
          </>
        )}

        {/* STEP 3: Person A 스토리 */}
        {step === 3 && (
          <>
            <h2 className="text-xl font-bold mb-6 text-[#f59e0b] text-left w-full">
              {caseItem.personA.name} ({caseItem.personA.role})의 경험:
            </h2>
            <div className="w-full bg-[#161618] border border-[#26262a] rounded-2xl p-6 mb-6 leading-relaxed text-gray-200 text-left font-medium">
              {caseItem.storyA}
            </div>
            <button
              onClick={() => setStep(4)}
              className="w-full bg-white text-black font-semibold py-4 rounded-xl hover:bg-gray-200 transition-all"
            >
              다음
            </button>
          </>
        )}

        {/* STEP 4: A 본 후 재평가 */}
        {step === 4 && (
          <>
            <h2 className="text-2xl font-bold mb-2">당신은 어떻게 생각하시나요?</h2>
            <p className="text-xs text-gray-400 mb-8">{caseItem.personA.name}의 경험을 읽고 난 후의 생각입니다.</p>

            <div className="w-full bg-[#161618] border border-[#26262a] rounded-2xl p-6 mb-6 flex flex-col gap-6 text-left">
              <div>
                <div className="flex justify-between text-sm font-semibold mb-2">
                  <span>{caseItem.personA.name} ({caseItem.personA.role}) 책임</span>
                  <span className="text-[#818cf8]">{scoreA}점</span>
                </div>
                <input
                  type="range" min="0" max="10" value={scoreA}
                  onChange={(e) => setScoreA(Number(e.target.value))}
                  className="w-full accent-white bg-gray-700 h-1.5 rounded-lg appearance-none cursor-pointer"
                />
              </div>
              <div>
                <div className="flex justify-between text-sm font-semibold mb-2">
                  <span>{caseItem.personB.name} ({caseItem.personB.role}) 책임</span>
                  <span className="text-[#818cf8]">{scoreB}점</span>
                </div>
                <input
                  type="range" min="0" max="10" value={scoreB}
                  onChange={(e) => setScoreB(Number(e.target.value))}
                  className="w-full accent-white bg-gray-700 h-1.5 rounded-lg appearance-none cursor-pointer"
                />
              </div>
            </div>

            <button
              onClick={() => setStep(5)}
              className="w-full bg-white text-black font-semibold py-4 rounded-xl hover:bg-gray-200 transition-all"
            >
              다음
            </button>
          </>
        )}

        {/* STEP 5: Person B 스토리 */}
        {step === 5 && (
          <>
            <h2 className="text-xl font-bold mb-6 text-[#10b981] text-left w-full">
              {caseItem.personB.name} ({caseItem.personB.role})의 경험:
            </h2>
            <div className="w-full bg-[#161618] border border-[#26262a] rounded-2xl p-6 mb-6 leading-relaxed text-gray-200 text-left font-medium">
              {caseItem.storyB}
            </div>
            <button
              onClick={() => setStep(6)}
              className="w-full bg-white text-black font-semibold py-4 rounded-xl hover:bg-gray-200 transition-all"
            >
              다음
            </button>
          </>
        )}

        {/* STEP 6: 최종 평가 */}
        {step === 6 && (
          <>
            <h2 className="text-2xl font-bold mb-2">당신은 어떻게 생각하시나요?</h2>
            <p className="text-xs text-gray-400 mb-8">양쪽 모두의 맥락을 알게 된 후의 최종 판단입니다.</p>

            <div className="w-full bg-[#161618] border border-[#26262a] rounded-2xl p-6 mb-6 flex flex-col gap-6 text-left">
              <div>
                <div className="flex justify-between text-sm font-semibold mb-2">
                  <span>{caseItem.personA.name} ({caseItem.personA.role}) 책임</span>
                  <span className="text-[#818cf8]">{scoreA}점</span>
                </div>
                <input
                  type="range" min="0" max="10" value={scoreA}
                  onChange={(e) => setScoreA(Number(e.target.value))}
                  className="w-full accent-white bg-gray-700 h-1.5 rounded-lg appearance-none cursor-pointer"
                />
              </div>
              <div>
                <div className="flex justify-between text-sm font-semibold mb-2">
                  <span>{caseItem.personB.name} ({caseItem.personB.role}) 책임</span>
                  <span className="text-[#818cf8]">{scoreB}점</span>
                </div>
                <input
                  type="range" min="0" max="10" value={scoreB}
                  onChange={(e) => setScoreB(Number(e.target.value))}
                  className="w-full accent-white bg-gray-700 h-1.5 rounded-lg appearance-none cursor-pointer"
                />
              </div>
            </div>

            <button
              onClick={() => router.push(`/cases/${caseItem.id}/result`)}
              className="w-full bg-white text-black font-semibold py-4 rounded-xl hover:bg-gray-200 transition-all"
            >
              제출하고 결과 보기
            </button>
          </>
        )}

      </div>
    </main>
  );
}
