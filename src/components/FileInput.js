import { useEffect, useRef, useState } from 'react';
import resetWhiteImg from '../assets/ic-reset-white.png';
import placeholderImg from '../assets/preview-placeholder.png';
import './FileInput.css';

function FileInput({ className = '', name, value, initialPreview, onChange }) {
  const [preview, setPreview] = useState(initialPreview);

  const inputRef = useRef();

  const handleChange = (e) => {
    const nextValue = e.target.files[0];
    onChange(name, nextValue);
  };

  const handleClearClick = () => {
    const inputNode = inputRef.current;
    if (!inputNode) return;

    inputNode.value = '';
    onChange(name, null);
  };

  useEffect(() => {
    if (!value) return;

    const nextPreview = URL.createObjectURL(value);
    setPreview(nextPreview);

    return () => {
      setPreview(initialPreview);
      URL.revokeObjectURL(nextPreview);
    };
  }, [value, initialPreview]); // value 값이 바뀔 때마다 preview 값을 바꿀 수 있음

  return (
    <div className={`FileInput ${className}`}>
      <img
        className={`FileInput-preview ${preview ? 'selected' : ''}`}
        src={preview || placeholderImg}
        alt="이미지 미리보기"
      />
      <input
        className="FileInput-hidden-overlay"
        type="file"
        accept="image/png, image/jpeg"
        onChange={handleChange}
        ref={inputRef}
      />
      {value && (
        <button
          className="FileInput-clear-button"
          type="button"
          onClick={handleClearClick}>
          <img src={resetWhiteImg} alt="지우기" />
        </button>
      )}
    </div>
  );
}

export default FileInput;
