export default async function handler(req, res) {
  const response = await fetch(
    "https://googleads.g.doubleclick.net/pagead/viewthroughconversion/..."
  );
  const data = await response.json();

  // CORS 헤더 추가
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET,OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  // 데이터 반환
  res.status(200).json(data);
}
