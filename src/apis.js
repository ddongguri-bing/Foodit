// 여기에 코드를 작성하세요
export async function getFoods() {
  const response = await fetch('https://learn.codeit.kr/7492/foods');
  const body = await response.json();
  return body;
}
