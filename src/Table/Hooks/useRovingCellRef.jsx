import { useCallback, useState } from 'react';
import { scrollIntoView } from '../CommonFunctions';

export function useRovingCellRef(isSelected) {
  const [isChildFocused, setIsChildFocused] = useState(false);

  if (isChildFocused && !isSelected) {
    setIsChildFocused(false);
  }

  const ref = useCallback((cell) => {
    if (cell === null) return;
    scrollIntoView(cell);
    if (cell.contains(document.activeElement)) return;
    cell.focus({ preventScroll: true });
  }, []);

  function onFocus(event) {
    if (event.target !== event.currentTarget) {
      setIsChildFocused(true);
    }
  }

  const isFocused = isSelected && !isChildFocused;

  return {
    ref: isSelected ? ref : undefined,
    tabIndex: isFocused ? 0 : -1,
    onFocus: isSelected ? onFocus : undefined
  };
}
