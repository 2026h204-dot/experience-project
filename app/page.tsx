'use client';

import { useState } from 'react';
import Link from 'next/link';
import { CASES_DATA, CATEGORIES } from '@/data/cases';

export default function Home() {
  const [selectedCategory, setSelectedCategory] = useState<string>('전체');

  const filteredCases = selectedCategory === '전체'
    ? CASES_DATA
    : CASES_DATA.filter((c) => c.category === selectedCategory);

  return (
    <div style={{ maxWidth: '800px', margin: '0 auto', padding: '40px 20px' }}>
      <header style={{ textAlign: 'center', marginBottom: '40px' }}>
        <h1 style={{ fontSize: '32px', fontWeight: 'bold', color: '#111827', marginBottom: '8px' }}>
          ⚖️ 마음이 바뀌는 재판소
        </h1>
        <p style={{ color: '#6b7280', fontSize: '16px' }}>
          첫 직관 판단과 A, B의 사정을 모두 들은 후 내 최종 판결은 어떻게 달라질까요?
        </p>
      </header>

      {/* 카테고리 필터 */}
      <div style={{ display: 'flex', gap: '8px', justifyContent: 'center', marginBottom: '32px' }}>
        {['전체', ...CATEGORIES].map((cat) => (
          <button
            key={cat}
            onClick={() => setSelectedCategory(cat)}
            style={{
              padding: '8px 16px',
              borderRadius: '20px',
              border: 'none',
              fontSize: '14px',
              fontWeight: 'bold',
              cursor: 'pointer',
              background: selectedCategory === cat ? '#4f46e5' : '#f3f4f6',
              color: selectedCategory === cat ? '#ffffff' : '#4b5563',
            }}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* 사건 리스트 */}
      <div style={{ display: 'grid', gap: '16px' }}>
        {filteredCases.map((item) => (
          <Link key={item.id} href={`/cases/${item.id}`} style={{ textDecoration: 'none' }}>
            <div
              style={{
                background: '#ffffff',
                border: '1px solid #e5e7eb',
                borderRadius: '12px',
                padding: '20px',
                transition: 'transform 0.2s, box-shadow 0.2s',
                cursor: 'pointer',
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                <span style={{ background: '#eef2ff', color: '#4f46e5', padding: '2px 8px', borderRadius: '6px', fontSize: '12px', fontWeight: 'bold' }}>
                  {item.category}
                </span>
              </div>
              <h3 style={{ fontSize: '18px', fontWeight: 'bold', color: '#111827', marginBottom: '8px' }}>
                {item.title}
              </h3>
              <p style={{ color: '#4b5563', fontSize: '14px', lineHeight: '1.5' }}>
                {item.summary}
              </p>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
