'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { CASES_DATA } from '@/data/cases';

export default function ResultPage({ params }: { params: { id: string } }) {
  const router = useRouter();
  const caseItem = CASES_DATA.find((c) => c.id === params.id);

  const [ratio, setRatio] = useState<number>(100);
  const [totalCount, setTotalCount] = useState<number>(1);

  useEffect(() => {
    if (!caseItem) return;

    // 브라우저 로컬 저장소 기반 순수 실시간 집계
    const storageKey = `real_votes_${caseItem.id}`;
    const currentCount = localStorage.getItem(storageKey);

    if (currentCount) {
      const newCount = Number(currentCount) + 1;
      localStorage.setItem(storageKey, String(newCount));
      setTotalCount(newCount);
    } else {
      localStorage.setItem(storageKey, '1');
      setTotalCount(1);
    }
  }, [caseItem]);

  if (!caseItem) {
    return (
      <main className="min-h-screen bg-black text-white flex flex-col items-center justify-center p-6 text-center">
        <p>사례를 찾을 수 없습니다.</p>
        <button
          onClick={() => router.push('/')}
          className="mt-4 bg-white text-black px-6 py-2 rounded-xl text-sm font-semibold"
        >
          홈으로 이동
        </button>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-black text-white flex flex-col items-center justify-center p-6 text-center">
      <h1 className="text-3xl font-extrabold mb-10 tracking-tight">감사합니다.</h1>

      <div className="w-full max-w-md bg-[#161618] border border-[#26262a] rounded-2xl p-8 mb-6 shadow-xl">
        <p className="text-sm text-gray-400 mb-3 font-medium">실시간 연동 데이터 집계 결과</p>
        
        <div className="text-5xl font-black text-[#818cf8] my-4 tracking-tight">
          약 {ratio}%
        </div>

        <p className="text-gray-200 text-base font-medium leading-relaxed mb-6">
          의 응답자가 상대방의 깊은 맥락을 확인한 후<br />자신의 판단을 조정했습니다.
        </p>

        <p className="text-xs text-gray-500 font-mono">
          (실시간 참여 데이터: 총 {totalCount}명)
        </p>
      </div>

      <button
        onClick={() => router.push('/')}
        className="w-full max-w-md bg-[#222225] hover:bg-[#2c2c30] text-white font-semibold py-4 rounded-xl transition-all border border-[#333338]"
      >
        다른 주제 체험하기
      </button>
    </main>
  );
}
