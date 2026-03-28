import { useApp } from '../context/AppContext';

export default function NumberDisplay({ base }) {
  const { activeBase, inputValue, cursorPos, formatValue, activateBase } = useApp();

  const isActive = activeBase === base;
  const label = base === 8 ? '8진수' : base === 10 ? '10진수' : '16진수';

  return (
    <div
      className={`number-display${isActive ? ' active' : ''}`}
      onClick={() => activateBase(base)}
    >
      <span className="base-label">{label}</span>
      <span className="base-value">
        {isActive ? (
          <>
            {inputValue.slice(0, cursorPos)}
            <span className="cursor-bar">|</span>
            {inputValue.slice(cursorPos)}
          </>
        ) : (
          formatValue(base) || '0'
        )}
      </span>
    </div>
  );
}
