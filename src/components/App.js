import { useEffect, useState } from 'react';
import FoodList from './FoodList';
import { createFood, deleteFood, getFoods, updateFood } from '../apis';
import FoodForm from './FoodForm';

function App() {
  const [order, setOrder] = useState('createdAt'); // 초기 상태
  const [items, setItems] = useState([]);
  const [cursor, setCursor] = useState(); // 커서 기반 페이지네이션
  const [isLoading, setIsLoading] = useState(false);
  const [loadingError, setLoadingError] = useState(null);
  const [search, setSearch] = useState('');

  const handleNewestClick = () => setOrder('createdAt');
  const handleCalorieClick = () => setOrder('calorie');

  const handleDelete = async (id) => {
    const result = await deleteFood(id);

    if (!result) return;

    setItems((prevItems) => prevItems.filter((item) => item.id !== id));
  };

  const handleLoad = async (options) => {
    let result;
    try {
      setIsLoading(true);
      setLoadingError(null);
      result = await getFoods(options);
    } catch (error) {
      setLoadingError(error);
      return;
    } finally {
      setIsLoading(false);
    }
    const {
      foods,
      paging: { nextCursor },
    } = result;
    if (!options.cursor) {
      setItems(foods);
    } else {
      setItems((prevItems) => [...prevItems, ...foods]);
    }
    setCursor(nextCursor);
  };

  const handleLoadMore = () => {
    handleLoad({ order, cursor, search });
  };

  const handleCreateSuccess = (food) => {
    setItems((prevItems) => [food, ...prevItems]);
  };

  const handleUpdateSuccess = (review) => {
    setItems((prevItems) => {
      const splitIdx = prevItems.findIndex((item) => item.id === review.id);
      return [
        ...prevItems.slice(0, splitIdx),
        review,
        ...prevItems.slice(splitIdx + 1),
      ];
    });
  };

  useEffect(() => {
    handleLoad({ order, search });
  }, [order, search]);

  const sortedItems = items.sort((a, b) => b[order] - a[order]);

  // 검색 기능
  const handleSearchSubmit = (e) => {
    e.preventDefault();
    setSearch(e.target['search'].value);
  };

  return (
    <div>
      <button onClick={handleNewestClick}>최신순</button>
      <button onClick={handleCalorieClick}>칼로리순</button>
      <form onSubmit={handleSearchSubmit}>
        <input name="search" />
        <button type="submit">검색</button>
      </form>
      <FoodForm onSubmit={createFood} onSubmitSuccess={handleCreateSuccess} />
      <FoodList
        items={sortedItems}
        onDelete={handleDelete}
        onUpdate={updateFood}
        onUpdateSuccess={handleUpdateSuccess}
      />
      {cursor && (
        <button disabled={isLoading} onClick={handleLoadMore}>
          더보기
        </button>
      )}
      {loadingError?.message && <p>{loadingError}</p>}
    </div>
  );
}

export default App;
