'use client';

import React, { useState } from 'react';
import { CASES_DATA, CATEGORIES, EVALUATION_OPTIONS, CaseItem } from '../data/cases';

export default function HomePage() {
  const [selectedCategory, setSelectedCategory] = useState<string>('전체');
  const [currentCase, setCurrentCase] = useState<CaseItem | null>(null);
  
  // A와 B 각각의 5단계 평가 저장
  const [evalA, setEvalA] = useState<string | null>(null);
  const [evalB, setEvalB] = useState<string | null>(null);

  const filteredCases = selectedCategory === '전체' 
    ? CASES_DATA 
    : CASES_DATA.filter(c => c.category === selectedCategory);

  const handleSelectCase = (c: CaseItem) => {
    setCurrentCase(c);
    setEvalA(null);
    setEvalB(null);
  };

  const handleBack = () => {
    setCurrentCase(null);
    setEvalA(null);
    setEvalB(null);
  };

  return (
    <main className="max-w-4xl mx-auto p-6 text-white min-h-screen">
      <header className="border-b border-gray-800 pb-6 mb-8 text-center">
        <h1 className="text-3xl font-bold text-indigo-400">THE EXPERIENCE PROJECT</h1>
        <p className="text-gray-400 text-sm mt-2">입장 바꿔 생각하기 : 타인의 시선에서 갈등을 바라봅니다</p>
      </header>

      {/* 1. 사례 목록 화면 */}
      {!currentCase ? (
        <div>
          {/* 카테고리 필터 */}
          <div className="flex gap-2 mb-6 overflow-x-auto pb-2">
            <button
              onClick={() => setSelectedCategory('전체')}
              className={`px-4 py-2 rounded-full text-sm font-medium transition ${
                selectedCategory === '전체' ? 'bg-indigo-600 text-white' : 'bg-gray-800 text-gray-400 hover:bg-gray-700'
              }`}
            >
              전체
            </button>
            {CATEGORIES.map(cat => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-4 py-2 rounded-full text-sm font-medium transition ${
                  selectedCategory === cat ? 'bg-indigo-600 text-white' : 'bg-gray-800 text-gray-400 hover:bg-gray-700'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* 사례 카드리스트 */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {filteredCases.map(item => (
              <div
                key={item.id}
                onClick={() => handleSelectCase(item)}
                className="p-5 bg-gray-900 border border-gray-800 rounded-xl hover:border-indigo-500/50 hover:bg-gray-800/80 transition cursor-pointer flex flex-col justify-between"
              >
                <div>
                  <span className="text-xs font-semibold px-2.5 py-1 bg-indigo-950 text-indigo-300 border border-indigo-800/50 rounded-md">
                    {item.category}
                  </span>
                  <h3 className="text-lg font-bold mt-3 mb-2">{item.title}</h3>
                  <p className="text-xs text-gray-400">
                    인물 A ({item.personA.name}) vs 인물 B ({item.personB.name})
                  </p>
                </div>
                <div className="mt-4 text-right text-xs text-indigo-400 font-medium">
                  입장 체험하기 &rarr;
                </div>
              </div>
            ))}
          </div>
        </div>
      ) : (
        /* 2. 상세보기 및 5단계 평가 화면 */
        <div className="space-y-8">
          {/* 상단 컨트롤 (뒤로가기 버튼) */}
          <div className="flex justify-between items-center">
            <button
              onClick={handleBack}
              className="flex items-center gap-2 px-4 py-2 text-sm bg-gray-800 hover:bg-gray-700 rounded-lg transition text-gray-300"
            >
              &larr; 다른 사례 보기 (뒤로가기)
            </button>
            <span className="text-xs px-3 py-1 bg-indigo-950 text-indigo-300 border border-indigo-800/50 rounded-full">
              {currentCase.category}
            </span>
          </div>

          <h2 className="text-2xl font-bold text-center border-b border-gray-800 pb-4">
            {currentCase.title}
          </h2>

          {/* A와 B의 이야기 카드 */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Person A */}
            <div className="p-6 bg-gray-900 border border-gray-800 rounded-xl space-y-4">
              <div>
                <div className="text-xs text-indigo-400 font-bold uppercase tracking-wider">PARTY A</div>
                <h3 className="text-xl font-bold text-white mt-1">{currentCase.personA.name} 입장</h3>
                <p className="text-xs text-gray-400 mt-0.5">{currentCase.personA.role}</p>
              </div>
              <p className="text-sm text-gray-300 leading-relaxed bg-gray-950/60 p-4 rounded-lg border border-gray-800/50">
                "{currentCase.storyA}"
              </p>

              {/* 5단계 평가 선택지 */}
              <div className="pt-2">
                <label className="block text-xs text-gray-400 mb-2 font-medium">
                  {currentCase.personA.name}의 행동에 대해 어떻게 생각하시나요?
                </label>
                <div className="space-y-1.5">
                  {EVALUATION_OPTIONS.map(opt => (
                    <button
                      key={opt}
                      onClick={() => setEvalA(opt)}
                      className={`w-full text-left px-3 py-2 text-xs rounded-md transition ${
                        evalA === opt
                          ? 'bg-indigo-600 text-white font-bold'
                          : 'bg-gray-800/60 text-gray-400 hover:bg-gray-800'
                      }`}
                    >
                      {opt}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Person B */}
            <div className="p-6 bg-gray-900 border border-gray-800 rounded-xl space-y-4">
              <div>
                <div className="text-xs text-rose-400 font-bold uppercase tracking-wider">PARTY B</div>
                <h3 className="text-xl font-bold text-white mt-1">{currentCase.personB.name} 입장</h3>
                <p className="text-xs text-gray-400 mt-0.5">{currentCase.personB.role}</p>
              </div>
              <p className="text-sm text-gray-300 leading-relaxed bg-gray-950/60 p-4 rounded-lg border border-gray-800/50">
                "{currentCase.storyB}"
              </p>

              {/* 5단계 평가 선택지 */}
              <div className="pt-2">
                <label className="block text-xs text-gray-400 mb-2 font-medium">
                  {currentCase.personB.name}의 행동에 대해 어떻게 생각하시나요?
                </label>
                <div className="space-y-1.5">
                  {EVALUATION_OPTIONS.map(opt => (
                    <button
                      key={opt}
                      onClick={() => setEvalB(opt)}
                      className={`w-full text-left px-3 py-2 text-xs rounded-md transition ${
                        evalB === opt
                          ? 'bg-rose-600 text-white font-bold'
                          : 'bg-gray-800/60 text-gray-400 hover:bg-gray-800'
                      }`}
                    >
                      {opt}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* 최종 선택 제출 요약 */}
          {evalA && evalB && (
            <div className="p-6 bg-indigo-950/40 border border-indigo-800/60 rounded-xl text-center space-y-3">
              <h4 className="font-bold text-indigo-300">당신의 관점 요약</h4>
              <p className="text-sm text-gray-300">
                <span className="font-semibold text-white">{currentCase.personA.name}</span>: <span className="text-indigo-400">{evalA}</span> / {' '}
                <span className="font-semibold text-white">{currentCase.personB.name}</span>: <span className="text-rose-400">{evalB}</span>
              </p>
              <button 
                onClick={handleBack}
                className="mt-2 px-6 py-2 bg-indigo-600 hover:bg-indigo-500 text-white text-sm font-semibold rounded-lg transition"
              >
                다른 사례 보러가기
              </button>
            </div>
          )}
        </div>
      )}
    </main>
  );
}
