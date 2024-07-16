function FoodListItem({ item }) {
  // const { imgUrl, title, calorie, content } = item;

  return (
    <div>
      <img src={item.imgUrl} alt={item.title} />
      <div>{item.title}</div>
      <div>{item.calorie}</div>
      <div>{item.content}</div>
    </div>
  );
}

function FoodList({ items }) {
  return (
    <ul className="FoodList">
      {items.map((item) => (
        <li>
          <FoodListItem item={item} />
        </li>
      ))}
    </ul>
  );
}

export default FoodList;
