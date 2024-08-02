import { useState } from 'react';
import FileInput from './FileInput';
import useAsync from '../hooks/useAsync';
import useTranslate from '../hooks/useTranslate';

import './FoodForm.css';

const INITIAL_VALUES = {
  title: '',
  calorie: 0,
  content: '',
  imgFile: null,
};

function sanitize(type, value) {
  switch (type) {
    case 'number':
      return Number(value) || 0;

    default:
      return value;
  }
}

function FoodForm({
  initialValues = INITIAL_VALUES,
  initialPreview,
  onSubmitSuccess,
  onSubmit,
  onCancel,
}) {
  const [values, setValues] = useState(initialValues);
  const [isSubmitting, submittingError, onSubmitAsync] = useAsync(onSubmit);
  const t = useTranslate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append('title', values.title);
    formData.append('calorie', values.calorie);
    formData.append('content', values.content);
    formData.append('imgFile', values.imgFile);

    const result = await onSubmitAsync(formData);
    if (!result) return;

    const { food } = result;
    onSubmitSuccess(food);
    setValues(INITIAL_VALUES);
  };

  const handleChange = (name, value) => {
    setValues((prevValues) => ({
      ...prevValues,
      [name]: value,
    }));
  };

  const handleInputChange = (e) => {
    const { name, value, type } = e.target;
    handleChange(name, sanitize(type, value));
  };

  return (
    <form className="FoodForm" onSubmit={handleSubmit}>
      <FileInput
        className="FoodForm-preview"
        name="imgFile"
        value={values.imgFile}
        initialPreview={initialPreview}
        onChange={handleChange}
      />
      <div className="FoodForm-rows">
        <div className="FoodForm-title-calorie">
          <input
            className="FoodForm-title"
            name="title"
            value={values.title}
            // placeholder={t('title placeholder')}
            onChange={handleInputChange}
          />
          <input
            className="FoodForm-calorie"
            type="number"
            name="calorie"
            value={values.calorie}
            // placeholder={t('calorie placeholder')}
            onChange={handleInputChange}
          />
          {onCancel && (
            <button
              className="FoodForm-cancel-button"
              type="button"
              onClick={onCancel}>
              {t('cancle button')}
            </button>
          )}
          <button
            className="FoodForm-submit-button"
            type="submit"
            disabled={isSubmitting}>
            {t('confirm button')}
          </button>
        </div>
        <textarea
          className="FoodForm-content"
          name="content"
          value={values.content}
          placeholder="내용을 작성해 주세요."
          onChange={handleInputChange}
        />
        {submittingError && <p>{submittingError.message}</p>}
      </div>
    </form>
  );
}

export default FoodForm;
