'use client';

import { useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { CASES_DATA } from '@/data/cases';

export default function CaseDetailPage() {
  const params = useParams();
  const router = useRouter();
  const caseItem = CASES_DATA.find((c) => c.id === params.id);

  // 단계 State: 1 = 요약 보고 첫인상 판단, 2 = A의 진짜 경험 듣기, 3 = B의 진짜 경험 듣기, 4 = 경험 청취 결과
  const [step, setStep] = useState<1 | 2 | 3 | 4>(1);

  // A에게 더 공감/비중을 두는 정도 (%)
  const [scoreStep1, setScoreStep1] = useState<number>(50); // 첫인상 판단
  const [scoreStep2, setScoreStep2] = useState<number>(50); // A 경험 들은 후
  const [scoreStep3, setScoreStep3] = useState<number>(50); // B 경험까지 들은 후 (최종)

  if (!caseItem) {
    return (
      <div className="container" style={{ textAlign: 'center', paddingTop: '80px' }}>
        <h2>사건을 찾을 수 없습니다.</h2>
        <button onClick={() => router.push('/')} style={{ marginTop: '20px', padding: '10px 20px' }}>
          목록으로 돌아가기
        </button>
      </div>
    );
  }

  const handleNextToStep2 = () => setStep(2);
  const handleNextToStep3 = () => setStep(3);
  const handleFinish = () => setStep(4);

  return (
    <div className="container" style={{ maxWidth: '680px', margin: '0 auto', padding: '40px 20px' }}>
      {/* 카테고리 & 타이틀 */}
      <div style={{ textAlign: 'center', marginBottom: '30px' }}>
        <span style={{ background: '#eef2ff', color: '#4f46e5', padding: '4px 12px', borderRadius: '16px', fontSize: '14px', fontWeight: 'bold' }}>
          {caseItem.category}
        </span>
        <h1 style={{ fontSize: '26px', marginTop: '12px', color: '#111827' }}>{caseItem.title}</h1>
      </div>

      {/* STEP 1: 요약글만 보고 첫인상 판단 */}
      {step === 1 && (
        <div style={{ background: '#ffffff', border: '1px solid #e5e7eb', borderRadius: '16px', padding: '28px', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.05)' }}>
          <div style={{ background: '#f9fafb', padding: '16px', borderRadius: '12px', marginBottom: '24px' }}>
            <h3 style={{ fontSize: '15px', color: '#6b7280', marginBottom: '8px' }}>📌 단면적인 상황 요약</h3>
            <p style={{ fontSize: '16px', color: '#374151', lineHeight: '1.6' }}>{caseItem.summary}</p>
          </div>

          <div style={{ textAlign: 'center', margin: '32px 0' }}>
            <h3 style={{ fontSize: '18px', color: '#111827', marginBottom: '8px' }}>
              💬 단면만 보고 든 내 첫 느낌은?
            </h3>
            <p style={{ fontSize: '14px', color: '#6b7280', marginBottom: '16px' }}>
              누구의 입장에 더 무게가 쏠리나요?
            </p>
            
            <div style={{ display: 'flex', justifyContent: 'space-between', fontWeight: 'bold', marginBottom: '12px', fontSize: '15px' }}>
              <span style={{ color: '#4f46e5' }}>{caseItem.personA.name} 지지: {scoreStep1}%</span>
              <span style={{ color: '#ec4899' }}>{caseItem.personB.name} 지지: {100 - scoreStep1}%</span>
            </div>

            <input
              type="range"
              min="0"
              max="100"
              value={scoreStep1}
              onChange={(e) => {
                const val = Number(e.target.value);
                setScoreStep1(val);
                setScoreStep2(val);
                setScoreStep3(val);
              }}
              style={{ width: '100%', height: '8px', cursor: 'pointer', accentColor: '#4f46e5' }}
            />
          </div>

          <button
            onClick={handleNextToStep2}
            style={{ width: '100%', padding: '14px', background: '#4f46e5', color: '#fff', border: 'none', borderRadius: '10px', fontSize: '16px', fontWeight: 'bold', cursor: 'pointer' }}
          >
            A({caseItem.personA.name})가 직접 겪은 진짜 경험 듣기 →
          </button>
        </div>
      )}

      {/* STEP 2: A의 직접적인 경험 듣기 */}
      {step === 2 && (
        <div style={{ background: '#ffffff', border: '1px solid #e5e7eb', borderRadius: '16px', padding: '28px', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.05)' }}>
          <div style={{ borderLeft: '4px solid #4f46e5', paddingLeft: '16px', marginBottom: '24px' }}>
            <h3 style={{ fontSize: '18px', color: '#4f46e5', fontWeight: 'bold' }}>
              👂 {caseItem.personA.name} ({caseItem.personA.role})가 직접 밝힌 속사정
            </h3>
            <p style={{ fontSize: '16px', color: '#374151', marginTop: '12px', lineHeight: '1.7', whiteSpace: 'pre-line' }}>
              "{caseItem.storyA}"
            </p>
          </div>

          <div style={{ background: '#f9fafb', padding: '20px', borderRadius: '12px', margin: '28px 0' }}>
            <h4 style={{ fontSize: '16px', color: '#111827', marginBottom: '8px', textAlign: 'center' }}>
              🔄 {caseItem.personA.name}의 경험을 들으니 생각이 바뀌시나요?
            </h4>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontWeight: 'bold', marginBottom: '8px' }}>
              <span style={{ color: '#4f46e5' }}>{caseItem.personA.name} 비중: {scoreStep2}%</span>
              <span style={{ color: '#ec4899' }}>{caseItem.personB.name} 비중: {100 - scoreStep2}%</span>
            </div>
            <input
              type="range"
              min="0"
              max="100"
              value={scoreStep2}
              onChange={(e) => {
                const val = Number(e.target.value);
                setScoreStep2(val);
                setScoreStep3(val);
              }}
              style={{ width: '100%', height: '8px', cursor: 'pointer', accentColor: '#4f46e5' }}
            />
            <p style={{ fontSize: '13px', color: '#6b7280', textAlign: 'center', marginTop: '8px' }}>
              (첫인상 판단: {caseItem.personA.name} {scoreStep1}%)
            </p>
          </div>

          <button
            onClick={handleNextToStep3}
            style={{ width: '100%', padding: '14px', background: '#4f46e5', color: '#fff', border: 'none', borderRadius: '10px', fontSize: '16px', fontWeight: 'bold', cursor: 'pointer' }}
          >
            이제 B({caseItem.personB.name})의 진짜 경험도 들어보기 →
          </button>
        </div>
      )}

      {/* STEP 3: B의 직접적인 경험 듣기 */}
      {step === 3 && (
        <div style={{ background: '#ffffff', border: '1px solid #e5e7eb', borderRadius: '16px', padding: '28px', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.05)' }}>
          <div style={{ borderLeft: '4px solid #ec4899', paddingLeft: '16px', marginBottom: '24px' }}>
            <h3 style={{ fontSize: '18px', color: '#ec4899', fontWeight: 'bold' }}>
              👂 {caseItem.personB.name} ({caseItem.personB.role})가 직접 밝힌 속사정
            </h3>
            <p style={{ fontSize: '16px', color: '#374151', marginTop: '12px', lineHeight: '1.7', whiteSpace: 'pre-line' }}>
              "{caseItem.storyB}"
            </p>
          </div>

          <div style={{ background: '#f9fafb', padding: '20px', borderRadius: '12px', margin: '28px 0' }}>
            <h4 style={{ fontSize: '16px', color: '#111827', marginBottom: '8px', textAlign: 'center' }}>
              💡 양쪽의 경험담을 모두 들은 지금, 최종 마음의 비중은?
            </h4>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontWeight: 'bold', marginBottom: '8px' }}>
              <span style={{ color: '#4f46e5' }}>{caseItem.personA.name} 지지: {scoreStep3}%</span>
              <span style={{ color: '#ec4899' }}>{caseItem.personB.name} 지지: {100 - scoreStep3}%</span>
            </div>
            <input
              type="range"
              min="0"
              max="100"
              value={scoreStep3}
              onChange={(e) => setScoreStep3(Number(e.target.value))}
              style={{ width: '100%', height: '8px', cursor: 'pointer', accentColor: '#4f46e5' }}
            />
          </div>

          <button
            onClick={handleFinish}
            style={{ width: '100%', padding: '14px', background: '#10b981', color: '#fff', border: 'none', borderRadius: '10px', fontSize: '16px', fontWeight: 'bold', cursor: 'pointer' }}
          >
            내 생각 변화 결과 확인하기 💡
          </button>
        </div>
      )}

      {/* STEP 4: 생각 변화 및 경험 청취의 중요성 결과 리포트 */}
      {step === 4 && (
        <div style={{ background: '#ffffff', border: '1px solid #e5e7eb', borderRadius: '16px', padding: '28px', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.05)' }}>
          <h2 style={{ fontSize: '22px', textAlign: 'center', marginBottom: '24px', color: '#111827' }}>
            📊 경험 청취 후 내 생각의 변화
          </h2>

          {/* 비중 변화 단계별 카드 */}
          <div style={{ background: '#f3f4f6', padding: '20px', borderRadius: '12px', marginBottom: '24px' }}>
            <h4 style={{ fontSize: '14px', color: '#4b5563', marginBottom: '16px', textAlign: 'center' }}>
              [{caseItem.personA.name}]에 대한 지지율 변화 흐름
            </h4>
            
            <div style={{ display: 'flex', justifyContent: 'space-around', textAlign: 'center' }}>
              <div>
                <div style={{ fontSize: '12px', color: '#6b7280' }}>1. 겉보기 요약만 볼 때</div>
                <div style={{ fontSize: '20px', fontWeight: 'bold', color: '#4f46e5', marginTop: '4px' }}>{scoreStep1}%</div>
              </div>
              <div style={{ fontSize: '20px', color: '#9ca3af', alignSelf: 'center' }}>→</div>
              <div>
                <div style={{ fontSize: '12px', color: '#6b7280' }}>2. A 경험 청취 후</div>
                <div style={{ fontSize: '20px', fontWeight: 'bold', color: '#4f46e5', marginTop: '4px' }}>{scoreStep2}%</div>
              </div>
              <div style={{ fontSize: '20px', color: '#9ca3af', alignSelf: 'center' }}>→</div>
              <div>
                <div style={{ fontSize: '12px', color: '#6b7280' }}>3. B 경험까지 들은 후</div>
                <div style={{ fontSize: '22px', fontWeight: 'extrabold', color: '#10b981', marginTop: '4px' }}>{scoreStep3}%</div>
              </div>
            </div>
          </div>

          {/* 경험 파악의 중요성 메시지 */}
          <div style={{ padding: '20px', background: '#eef2ff', borderRadius: '12px', marginBottom: '28px' }}>
            <h3 style={{ fontSize: '16px', color: '#3730a3', fontWeight: 'bold', marginBottom: '8px' }}>
              ✨ 진짜 경험을 들었을 때 생기는 변화
            </h3>
            <p style={{ fontSize: '15px', color: '#1e1b4b', lineHeight: '1.6' }}>
              {Math.abs(scoreStep3 - scoreStep1) >= 20 ? (
                <>
                  단순 요약만 봤을 때와 각자가 겪은 속사정을 직접 들었을 때의 마음이 <strong>{Math.abs(scoreStep3 - scoreStep1)}%p</strong>나 달라졌습니다! 겉으로 보이는 한두 줄보다 <strong>당사자가 직접 겪은 맥락과 경험을 파악하는 것이 얼마나 중요한지</strong>를 잘 보여주는 결과입니다.
                </>
              ) : Math.abs(scoreStep3 - scoreStep1) > 0 ? (
                <>
                  상대방의 디테일한 경험을 들으며 내 시선이 <strong>{Math.abs(scoreStep3 - scoreStep1)}%p</strong>만큼 이동했습니다. 타인의 경험을 경청함으로써 상황을 더 입체적으로 이해할 수 있게 되었습니다.
                </>
              ) : (
                <>
                  양쪽의 디테일한 경험담을 모두 들은 후에도 **처음 내렸던 생각({scoreStep1}%)이 일정하게 유지**되었습니다. 단면적인 요약 속에서도 사건의 핵심을 관통해 보는 통찰력을 가지고 계시는군요!
                </>
              )}
            </p>
          </div>

          <button
            onClick={() => router.push('/')}
            style={{ width: '100%', padding: '14px', background: '#374151', color: '#fff', border: 'none', borderRadius: '10px', fontSize: '16px', fontWeight: 'bold', cursor: 'pointer' }}
          >
            다른 상황 경험하러 가기
          </button>
        </div>
      )}
    </div>
  );
}
