import { useApp } from '../context/AppContext';
import DipSwitch from '../components/DipSwitch';
import NumberDisplay from '../components/NumberDisplay';
import Keypad from '../components/Keypad';

export default function HomePage() {
  const { switchCount, selectedBases } = useApp();

  return (
    <div className="home-page">
      <div className="top-section">
        <div className="dip-switch-area">
          <div className="switch-row">
            {Array.from({ length: switchCount }, (_, i) => (
              <DipSwitch key={i} index={i} />
            ))}
          </div>
          <div className="switch-number-row">
            {Array.from({ length: switchCount }, (_, i) => (
              <span key={i} className="switch-number">{i + 1}</span>
            ))}
          </div>
        </div>
        <div className="number-display-area">
          {selectedBases.map(base => (
            <NumberDisplay key={base} base={base} />
          ))}
        </div>
      </div>
      <div className="keypad-section">
        <Keypad />
      </div>
    </div>
  );
}
