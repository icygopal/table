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