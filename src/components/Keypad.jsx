import { useApp } from '../context/AppContext';

export default function Keypad() {
  const { activeBase, handleKeypadInput } = useApp();

  const showHex = activeBase === 16;

  const rows = [
    ...(showHex ? [['D', 'E', 'F'], ['A', 'B', 'C']] : []),
    ['7', '8', '9'],
    ['4', '5', '6'],
    ['1', '2', '3'],
    ['DEL', '0', '확인'],
  ];

  return (
    <div className="keypad">
      {rows.map((row, ri) =>
        row.map((key, ki) => (
          <button
            key={`${ri}-${ki}`}
            className={`key-btn${key === '확인' ? ' confirm-btn' : ''}${key === 'DEL' ? ' del-btn' : ''}`}
            onPointerDown={(e) => {
              e.preventDefault();
              handleKeypadInput(key);
            }}
          >
            {key}
          </button>
        ))
      )}
    </div>
  );
}
