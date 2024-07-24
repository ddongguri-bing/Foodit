import { useState } from 'react';
import './FoodForm.css';

function FoodForm() {
  const [title, setTitle] = useState('');
  const [calorie, setCalorie] = useState(0);
  const [content, setContent] = useState('');

  const handleTitleChange = (e) => {
    setTitle(e.target.value);
  };

  const handleCalorieChange = (e) => {
    const nextCalorie = Number(e.target.value) || 0;
    setCalorie(nextCalorie);
  };

  const handleContentChange = (e) => {
    setContent(e.target.value);
  };

  return (
    <form className="FoodForm">
      <input name="title" value={title} onChange={handleTitleChange}></input>
      <input
        name="calorie"
        type="number"
        value={calorie}
        onChange={handleCalorieChange}></input>
      <input
        name="content"
        value={content}
        onChange={handleContentChange}></input>
    </form>
  );
}

export default FoodForm;
