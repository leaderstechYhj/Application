import { useApp } from '../context/AppContext';

const ROWS = [
  ['D', 'E', 'F'],
  ['A', 'B', 'C'],
  ['7', '8', '9'],
  ['4', '5', '6'],
  ['1', '2', '3'],
  ['DEL', '0', '확인'],
];

const HEX_KEYS = new Set(['A', 'B', 'C', 'D', 'E', 'F']);

export default function Keypad() {
  const { selectedBases, handleKeypadInput } = useApp();

  const hex16Active = selectedBases.includes(16);

  return (
    <div className="keypad">
      {ROWS.map((row, ri) =>
        row.map((key, ki) => {
          const isHexKey = HEX_KEYS.has(key);
          const disabled = isHexKey && !hex16Active;

          return (
            <button
              key={`${ri}-${ki}`}
              className={`key-btn${key === '확인' ? ' confirm-btn' : ''}${key === 'DEL' ? ' del-btn' : ''}${disabled ? ' hex-disabled' : ''}`}
              onPointerDown={(e) => {
                if (disabled) return;
                e.preventDefault();
                handleKeypadInput(key);
              }}
            >
              {key}
            </button>
          );
        })
      )}
    </div>
  );
}
