import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  const { searchParams } = new URL(request.url);
  const caseId = searchParams.get('caseId');

  if (!caseId) {
    return NextResponse.json({ success: false, message: 'Case ID가 없습니다.' });
  }

  // Vercel KV 연결 주소 및 토큰 정보
  const kvUrl = process.env.KV_REST_API_URL;
  const kvToken = process.env.KV_REST_API_TOKEN;

  // DB 미연동 시 기본 응답 처리
  if (!kvUrl || !kvToken) {
    return NextResponse.json({
      success: true,
      total: 1,
      ratio: 100,
    });
  }

  try {
    // 1. 해당 케이스의 총 참여자 수 1 증가 (INCR)
    const countRes = await fetch(`${kvUrl}/incr/case:${caseId}:total`, {
      headers: { Authorization: `Bearer ${kvToken}` },
    });
    const countData = await countRes.json();
    const total = countData.result;

    // 2. 생각이 바뀐 사람 수 1 증가 (INCR)
    const changedRes = await fetch(`${kvUrl}/incr/case:${caseId}:changed`, {
      headers: { Authorization: `Bearer ${kvToken}` },
    });
    const changedData = await changedRes.json();
    const changed = changedData.result;

    // 백분율 계산
    const ratio = Math.round((changed / total) * 100);

    return NextResponse.json({
      success: true,
      total,
      ratio,
    });
  } catch (error) {
    return NextResponse.json({ success: false, error: 'DB 카운트 실패' });
  }
}
