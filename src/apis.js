// 여기에 코드를 작성하세요
export async function getFoods(order = 'createAt') {
  const query = `order=${order}`;
  const response = await fetch(`https://learn.codeit.kr/7492/foods?${query}`);
  const body = await response.json();
  return body;
}
