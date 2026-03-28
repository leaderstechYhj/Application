import { useApp } from '../context/AppContext';

function ToggleSwitch({ on, onToggle }) {
  return (
    <div className={`toggle-switch${on ? ' on' : ' off'}`} onClick={onToggle}>
      <div className="toggle-thumb" />
    </div>
  );
}

export default function SettingsPage() {
  const {
    isMSB, isDarkMode, onDirection, selectedBases, switchCount,
    toggleMSB, toggleDarkMode, setOnDirection, toggleBase, updateSwitchCount,
  } = useApp();

  return (
    <div className="settings-page">
      <div className="settings-content">

        {/* 섹션 1: 설정 */}
        <div className="settings-section">
          <div className="section-title">설정</div>
          <div className="group-inner">
            <div className="toggle-group">
              <div className="toggle-row">
                <span className="toggle-label">{isMSB ? 'MSB ↔ LSB' : 'LSB ↔ MSB'}</span>
                <ToggleSwitch on={isMSB} onToggle={toggleMSB} />
              </div>
              <div className="divider" />
              <div className="toggle-row">
                <span className="toggle-label">{isDarkMode ? '다크모드' : '라이트모드'}</span>
                <ToggleSwitch on={isDarkMode} onToggle={toggleDarkMode} />
              </div>
            </div>
          </div>
        </div>

        {/* 섹션 2: 진수 표시 */}
        <div className="settings-section">
          <div className="section-title">진수 표시</div>
          <div className="group-inner">
            <div className="btn-group">
              {[8, 10, 16].map(base => (
                <button
                  key={base}
                  className={`base-btn${selectedBases.includes(base) ? ' selected' : ''}`}
                  onClick={() => toggleBase(base)}
                >
                  {base === 8 ? '8진수' : base === 10 ? '10진수' : '16진수'}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* 섹션 3: ON 방향 */}
        <div className="settings-section">
          <div className="section-title">ON 방향</div>
          <div className="group-inner">
            <div className="btn-group">
              <button
                className={`base-btn${onDirection === 'top' ? ' selected' : ''}`}
                onClick={() => setOnDirection('top')}
              >
                ▲ 위 = ON
              </button>
              <button
                className={`base-btn${onDirection === 'bottom' ? ' selected' : ''}`}
                onClick={() => setOnDirection('bottom')}
              >
                ▼ 아래 = ON
              </button>
            </div>
          </div>
        </div>

        {/* 섹션 4: 딥스위치 개수 */}
        <div className="settings-section">
          <div className="section-title">딥스위치 개수</div>
          <div className="group-inner">
            <div className="count-group">
              <span className="count-label">개수</span>
              <button className="count-btn" onClick={() => updateSwitchCount(switchCount - 1)}>−</button>
              <span className="count-value">{switchCount}</span>
              <button className="count-btn" onClick={() => updateSwitchCount(switchCount + 1)}>+</button>
            </div>
          </div>
        </div>

      </div>
      <div className="settings-spacer" />
    </div>
  );
}
