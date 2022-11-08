import React, { useMemo } from 'react'

const useViewportRows = ({
	rawRows,
	rowHeight,
	clientHeight,
	scrollTop,
}) => {
	const { totalRowHeight, getRowTop, findRowIdx } = useMemo(() => {
		return {
			totalRowHeight: rowHeight * rawRows.length,
			getRowTop: (rowIdx) => rowIdx * rowHeight,
			findRowIdx: (offset) => Math.floor(offset / rowHeight)
		};
	},[])
		const overscanThreshold = 4;
		const rowVisibleStartIdx = findRowIdx(scrollTop);
		const rowVisibleEndIdx = findRowIdx(scrollTop + clientHeight);
		const rowOverscanStartIdx =  rowVisibleStartIdx;
		const rowOverscanEndIdx = rowVisibleEndIdx
	//   const overscanThreshold = 4;
	//   const rowVisibleStartIdx = findRowIdx(scrollTop);
	//   const rowVisibleEndIdx = findRowIdx(scrollTop + clientHeight);
	//   rowOverscanStartIdx = Math.max(0, rowVisibleStartIdx - overscanThreshold);
	//   rowOverscanEndIdx = Math.min(rawRows.length - 1, rowVisibleEndIdx + overscanThreshold);

	return {
		rowOverscanStartIdx,
		rowOverscanEndIdx,
		getRowTop,
		findRowIdx,
		totalRowHeight
	  };
	}

export default useViewportRows