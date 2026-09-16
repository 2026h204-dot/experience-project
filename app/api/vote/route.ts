import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  const { searchParams } = new URL(request.url);
  const caseId = searchParams.get('caseId');

  if (!caseId) {
    return NextResponse.json({ success: false, message: 'Case ID가 없습니다.' });
  }

  const kvUrl = process.env.KV_REST_API_URL;
  const kvToken = process.env.KV_REST_API_TOKEN;

  // DB 연동 키가 없는 경우 기본 성공 응답
  if (!kvUrl || !kvToken) {
    return NextResponse.json({
      success: true,
      total: 1,
      ratio: 100,
    });
  }

  try {
    // 회원가입 없이 접속자의 IP를 고유 식별자로 활용
    const ip = request.headers.get('x-forwarded-for') || 'anonymous';
    const userKey = `voted:${caseId}:${ip}`;

    // 이미 투표했는지 확인
    const checkRes = await fetch(`${kvUrl}/get/${userKey}`, {
      headers: { Authorization: `Bearer ${kvToken}` },
    });
    const checkData = await checkRes.json();

    // 처음 투표하는 사용자만 DB 카운트 증가
    if (!checkData.result) {
      await fetch(`${kvUrl}/set/${userKey}/true`, {
        headers: { Authorization: `Bearer ${kvToken}` },
      });

      // 전체 참여자 수 증가
      await fetch(`${kvUrl}/incr/case:${caseId}:total`, {
        headers: { Authorization: `Bearer ${kvToken}` },
      });

      // 판단 전환 수 증가
      await fetch(`${kvUrl}/incr/case:${caseId}:changed`, {
        headers: { Authorization: `Bearer ${kvToken}` },
      });
    }

    // 최신 집계 데이터 조회
    const totalRes = await fetch(`${kvUrl}/get/case:${caseId}:total`, {
      headers: { Authorization: `Bearer ${kvToken}` },
    });
    const totalData = await totalRes.json();

    const changedRes = await fetch(`${kvUrl}/get/case:${caseId}:changed`, {
      headers: { Authorization: `Bearer ${kvToken}` },
    });
    const changedData = await changedRes.json();

    const total = Number(totalData.result) || 1;
    const changed = Number(changedData.result) || 1;
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
