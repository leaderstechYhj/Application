import { useApp } from '../context/AppContext';
import DipSwitch from '../components/DipSwitch';
import NumberDisplay from '../components/NumberDisplay';
import Keypad from '../components/Keypad';

export default function HomePage() {
  const { switchCount, selectedBases, isMSB } = useApp();

  return (
    <div className="home-page">
      <div className="top-section">
        <div className="dip-switch-area">
          <div className="switch-columns">
            {Array.from({ length: switchCount }, (_, i) => (
              <div key={i} className="switch-col">
                <DipSwitch index={i} />
                <span className="switch-number">
                  {isMSB ? switchCount - i : i + 1}
                </span>
              </div>
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
