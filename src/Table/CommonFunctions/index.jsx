 export function clampColumnWidth(
	width,
	{ minWidth, maxWidth }
  ) {
	width = Math.max(width, minWidth);

	if (typeof maxWidth === 'number' && maxWidth >= minWidth) {
	  return Math.min(width, maxWidth);
	}
  
	return width;
  }
  

  export const SELECT_COLUMN_KEY = 'select-row';

  export function isCtrlKeyHeldDown(e) {
	return (e.ctrlKey || e.metaKey) && e.key !== 'Control';
  }
  

  
export function stopPropagation(event) {
	event.stopPropagation();
  }
  
  export function scrollIntoView(element) {
	element?.scrollIntoView({ inline: 'nearest', block: 'nearest' });
  }
  

  export function isSamePosition(p1, p2) {
	return p1.idx === p2.idx && p1.rowIdx === p2.rowIdx;
  }
  