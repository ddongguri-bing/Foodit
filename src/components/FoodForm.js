import { useState } from 'react';
import './FoodForm.css';

function FoodForm() {
  const [values, setValues] = useState({
    title: '',
    calorie: 0,
    content: '',
  });

  function sanitize(type, value) {
    // calorie 값이 숫자로 처리되지 않는 문제 해결을 위한 함수
    switch (type) {
      case 'number':
        return Number(value) || 0;

      default:
        return value;
    }
  }

  const handleChange = (e) => {
    const { name, value, type } = e.target;
    setValues((prevValues) => ({
      ...prevValues,
      [name]: sanitize(type, value),
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log(values);
  };

  return (
    <form className="FoodForm" onSubmit={handleSubmit}>
      <input name="title" value={values.title} onChange={handleChange}></input>
      <input
        name="calorie"
        type="number"
        value={values.calorie}
        onChange={handleChange}></input>
      <input
        name="content"
        value={values.content}
        onChange={handleChange}></input>
      <button type="submit">확인</button>
    </form>
  );
}

export default FoodForm;
