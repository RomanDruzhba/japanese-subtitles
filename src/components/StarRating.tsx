import React from 'react';

type Props = {
  value: number;
  onChange: (value: number) => void;
};

const StarRating: React.FC<Props> = ({ value, onChange }) => {
  const stars = [1, 2, 3, 4, 5];

  return (
    <div style={{ fontSize: '1.5rem' }}>
      {stars.map((star) => (
        <span
          key={star}
          onClick={() => onChange(star)}
          style={{
            cursor: 'pointer',
            color: star <= value ? '#f5a623' : '#ccc',
            marginRight: '5px'
          }}
        >
          ★
        </span>
      ))}
    </div>
  );
};

export default StarRating;
