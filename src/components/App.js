import { useCallback, useEffect, useState } from 'react';
import FoodList from './FoodList';
import { createFood, deleteFood, getFoods, updateFood } from '../apis';
import FoodForm from './FoodForm';
import useAsync from '../hooks/useAsync';
import { LocaleProvider } from '../contexts/LocaleContext';
import LocaleSelect from './LocaleSelect';
// import useTranslate from '../hooks/useTranslate';

import logoImg from '../assets/logo.png';
import searchImg from '../assets/ic-search.png';
import logoTextImg from '../assets/logo-text.png';
import backgroundImg from '../assets/background.png';
import './App.css';

function AppSortButton({ selected, children, onClick }) {
  return (
    <button
      disabled={selected}
      className={`AppSortButton ${selected ? 'selected' : ''}`}
      onClick={onClick}>
      {children}
    </button>
  );
}

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
      <div
        className="App"
        style={{ backgroundImage: `url("${backgroundImg}")` }}>
        <div className="App-nav">
          <img src={logoImg} alt="Foodit" />
        </div>
        <div className="App-container">
          <div className="App-FoodForm">
            <FoodForm
              onSubmit={createFood}
              onSubmitSuccess={handleCreateSuccess}
            />
          </div>
          <div className="App-filter">
            <form className="App-search" onSubmit={handleSearchSubmit}>
              <input className="App-search-input" name="search" />
              <button className="App-search-button" type="submit">
                <img src={searchImg} alt="검색" />
              </button>
            </form>
            <div className="App-orders">
              <AppSortButton
                selected={order === 'createdAt'}
                onClick={handleNewestClick}>
                {/* {t('newest')} */} 최신순
              </AppSortButton>
              <AppSortButton
                selected={order === 'calorie'}
                onClick={handleCalorieClick}>
                {/* {t('sort by calorie')} */} 칼로리순
              </AppSortButton>
            </div>
          </div>
          <FoodList
            className="App-FoodList"
            items={sortedItems}
            onUpdate={updateFood}
            onUpdateSuccess={handleUpdateSuccess}
            onDelete={handleDelete}
          />
          {cursor && (
            <button
              className="App-load-more-button"
              disabled={isLoading}
              onClick={handleLoadMore}>
              {/* {t('load more')} */} 더 보기
            </button>
          )}
          {loadingError && <p>{loadingError.message}</p>}
        </div>
        <div className="App-footer">
          <div className="App-footer-container">
            <img src={logoTextImg} alt="Foodit" />
            <LocaleSelect />
            <div className="App-footer-menu">
              {/* {t('terms of service')} | {t('privacy policy')} */} Terms of
              Service | Privacy Policy
            </div>
          </div>
        </div>
      </div>
    </LocaleProvider>
  );
}

export default App;
