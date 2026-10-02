// Vercel Serverless Function: POST /api/submit-sheet
export default async function handler(req: any, res: any) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  try {
    const { webhookUrl, payload } = req.body || {};
    const targetUrl = webhookUrl || process.env.GOOGLE_SHEET_WEBHOOK_URL;

    if (!targetUrl) {
      return res.status(200).json({
        success: false,
        message: '구글 스프레드시트 웹 앱 URL이 설정되지 않았습니다.',
        localOnly: true,
      });
    }

    const response = await fetch(targetUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'text/plain;charset=utf-8' },
      body: JSON.stringify(payload),
      redirect: 'follow',
    });

    const resultText = await response.text();
    let resultData;
    try {
      resultData = JSON.parse(resultText);
    } catch {
      resultData = { raw: resultText };
    }

    return res.status(200).json({
      success: true,
      message: '구글 스프레드시트에 성공적으로 저장되었습니다.',
      sheetResult: resultData,
    });
  } catch (error: any) {
    return res.status(500).json({
      success: false,
      message: '구글 시트 전송 중 오류가 발생했습니다: ' + error.message,
    });
  }
}
