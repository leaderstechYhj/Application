import { createContext, useContext, useState, useMemo, useCallback } from 'react';

const AppContext = createContext(null);

function switchesToDecimal(values, msb) {
  if (msb) {
    return values.reduce((acc, bit, i) => acc + bit * Math.pow(2, values.length - 1 - i), 0);
  }
  return values.reduce((acc, bit, i) => acc + bit * Math.pow(2, i), 0);
}

function decimalToSwitches(decimal, count, msb) {
  const values = Array(count).fill(0);
  const maxVal = Math.pow(2, count) - 1;
  const n = Math.min(Math.max(0, Math.floor(decimal)), maxVal);
  for (let i = 0; i < count; i++) {
    if (msb) {
      values[count - 1 - i] = (n >> i) & 1;
    } else {
      values[i] = (n >> i) & 1;
    }
  }
  return values;
}

export function AppProvider({ children }) {
  const [switchCount, setSwitchCount] = useState(8);
  const [switchValues, setSwitchValues] = useState(Array(8).fill(0));
  const [isMSB, setIsMSB] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(true);
  const [onDirection, setOnDirection] = useState('top');
  const [selectedBases, setSelectedBases] = useState([10, 16]);
  const [activeBase, setActiveBase] = useState(null);
  const [inputValue, setInputValue] = useState('');
  const [cursorPos, setCursorPos] = useState(0);

  const decimalValue = useMemo(
    () => switchesToDecimal(switchValues, isMSB),
    [switchValues, isMSB]
  );

  const formatValue = useCallback((base) => {
    if (base === 8) return decimalValue.toString(8).toUpperCase();
    if (base === 10) return decimalValue.toString(10);
    if (base === 16) return decimalValue.toString(16).toUpperCase();
    return '0';
  }, [decimalValue]);

  const toggleSwitch = useCallback((index) => {
    const next = [...switchValues];
    next[index] ^= 1;
    setSwitchValues(next);
    if (activeBase !== null) {
      const newDecimal = switchesToDecimal(next, isMSB);
      const str = activeBase === 8 ? newDecimal.toString(8).toUpperCase()
                : activeBase === 10 ? newDecimal.toString(10)
                : newDecimal.toString(16).toUpperCase();
      setInputValue(str);
      setCursorPos(str.length);
    }
  }, [switchValues, isMSB, activeBase]);

  const toggleMSB = useCallback(() => {
    setIsMSB(prev => !prev);
    setSwitchValues(prev => [...prev].reverse());
  }, []);

  const toggleDarkMode = useCallback(() => {
    setIsDarkMode(prev => !prev);
  }, []);

  const updateSwitchCount = useCallback((newCount) => {
    const count = Math.max(1, Math.min(32, newCount));
    setSwitchCount(count);
    setSwitchValues(Array(count).fill(0));
    setActiveBase(null);
    setInputValue('');
  }, []);

  const toggleBase = useCallback((base) => {
    setSelectedBases(prev => {
      if (prev.includes(base)) {
        if (prev.length === 1) return prev;
        const next = prev.filter(b => b !== base);
        if (activeBase === base) {
          setActiveBase(next[0]);
          const d = switchesToDecimal(switchValues, isMSB);
          const str = next[0] === 8 ? d.toString(8).toUpperCase()
                    : next[0] === 10 ? d.toString(10)
                    : d.toString(16).toUpperCase();
          setInputValue(str);
          setCursorPos(str.length);
        }
        return next;
      }
      return [...prev, base].sort((a, b) => a - b);
    });
  }, [activeBase, switchValues, isMSB]);

  const activateBase = useCallback((base) => {
    if (activeBase === base) return;
    setActiveBase(base);
    const str = base === 8 ? decimalValue.toString(8).toUpperCase()
              : base === 10 ? decimalValue.toString(10)
              : decimalValue.toString(16).toUpperCase();
    setInputValue(str);
    setCursorPos(str.length);
  }, [activeBase, decimalValue]);

  const deactivateBase = useCallback(() => {
    setActiveBase(null);
    setInputValue('');
  }, []);

  const handleKeypadInput = useCallback((key) => {
    if (activeBase === null) return;

    if (key === '확인') {
      deactivateBase();
      return;
    }

    if (key === 'DEL') {
      if (cursorPos > 0) {
        const next = inputValue.slice(0, cursorPos - 1) + inputValue.slice(cursorPos);
        const decimal = next === '' ? 0 : parseInt(next, activeBase);
        if (!isNaN(decimal)) {
          setInputValue(next);
          setCursorPos(p => p - 1);
          setSwitchValues(decimalToSwitches(decimal, switchCount, isMSB));
        }
      }
      return;
    }

    const next = inputValue.slice(0, cursorPos) + key + inputValue.slice(cursorPos);
    const decimal = parseInt(next, activeBase);
    const maxVal = Math.pow(2, switchCount) - 1;
    if (!isNaN(decimal) && decimal <= maxVal) {
      setInputValue(next);
      setCursorPos(p => p + 1);
      setSwitchValues(decimalToSwitches(decimal, switchCount, isMSB));
    }
  }, [activeBase, cursorPos, inputValue, switchCount, isMSB, deactivateBase]);

  return (
    <AppContext.Provider value={{
      switchCount, switchValues, isMSB, isDarkMode, onDirection,
      selectedBases, activeBase, inputValue, cursorPos,
      decimalValue, formatValue,
      setOnDirection, setCursorPos,
      toggleSwitch, toggleMSB, toggleDarkMode,
      updateSwitchCount, toggleBase, activateBase, deactivateBase, handleKeypadInput,
    }}>
      {children}
    </AppContext.Provider>
  );
}

export const useApp = () => useContext(AppContext);
