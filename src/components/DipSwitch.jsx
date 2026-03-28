import { useApp } from '../context/AppContext';

export default function DipSwitch({ index }) {
  const { switchValues, onDirection, toggleSwitch } = useApp();
  const value = switchValues[index];

  // onDirection='top': top cell = 1 (ON), bottom cell = 0 (OFF)
  // onDirection='bottom': top cell = 0 (OFF), bottom cell = 1 (ON)
  const topLabel = onDirection === 'top' ? '1' : '0';
  const bottomLabel = onDirection === 'top' ? '0' : '1';

  const topActive = topLabel === value.toString();
  const bottomActive = bottomLabel === value.toString();

  return (
    <div className="dip-switch" onClick={() => toggleSwitch(index)}>
      <div className={`switch-cell ${topActive ? 'active' : 'inactive'}`}>
        {topLabel}
      </div>
      <div className={`switch-cell ${bottomActive ? 'active' : 'inactive'}`}>
        {bottomLabel}
      </div>
    </div>
  );
}
