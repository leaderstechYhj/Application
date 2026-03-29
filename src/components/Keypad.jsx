import { useApp } from '../context/AppContext';

const ROWS = [
  ['D', 'E', 'F'],
  ['A', 'B', 'C'],
  ['7', '8', '9'],
  ['4', '5', '6'],
  ['1', '2', '3'],
  ['RESET', '0', 'DEL'],
];

const HEX_KEYS = new Set(['A', 'B', 'C', 'D', 'E', 'F']);

export default function Keypad() {
  const { activeBase, handleKeypadInput } = useApp();

  const hex16Active = activeBase === 16;

  return (
    <div className="keypad">
      {ROWS.map((row, ri) =>
        row.map((key, ki) => {
          const isHexKey = HEX_KEYS.has(key);
          const disabled = isHexKey && !hex16Active;

          return (
            <button
              key={`${ri}-${ki}`}
              className={`key-btn${key === 'DEL' ? ' confirm-btn' : ''}${key === 'RESET' ? ' del-btn' : ''}${disabled ? ' hex-disabled' : ''}`}
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
