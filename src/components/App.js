import { useCallback, useEffect, useState } from 'react';
import FoodList from './FoodList';
import { createFood, deleteFood, getFoods, updateFood } from '../apis';
import FoodForm from './FoodForm';
import useAsync from '../hooks/useAsync';
import { LocaleProvider } from '../contexts/LocaleContext';
import LocaleSelect from './LocaleSelect';
// import useTranslate from '../hooks/useTranslate';

function App() {
  const [order, setOrder] = useState('createdAt'); // 초기 상태
  const [items, setItems] = useState([]);
  const [cursor, setCursor] = useState(); // 커서 기반 페이지네이션
  const [isLoading, loadingError, getFoodsAsync] = useAsync(getFoods);
  const [search, setSearch] = useState('');
  // const t = useTranslate();

  const handleNewestClick = () => setOrder('createdAt');
  const handleCalorieClick = () => setOrder('calorie');

  const handleDelete = async (id) => {
    const result = await deleteFood(id);

    if (!result) return;

    setItems((prevItems) => prevItems.filter((item) => item.id !== id));
  };

  const handleLoad = useCallback(
    async (options) => {
      const result = await getFoodsAsync(options);
      if (!result) return;

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
    },
    [getFoodsAsync]
  );

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
  }, [order, search, handleLoad]);

  const sortedItems = items.sort((a, b) => b[order] - a[order]);

  // 검색 기능
  const handleSearchSubmit = (e) => {
    e.preventDefault();
    setSearch(e.target['search'].value);
  };

  return (
    <LocaleProvider defaultValue={'ko'}>
      <div>
        <LocaleSelect />
        <div>
          <button onClick={handleNewestClick}>최신순</button>
          <button onClick={handleCalorieClick}>칼로리순</button>
        </div>
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
    </LocaleProvider>
  );
}

export default App;
