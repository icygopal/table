import React, { useMemo } from 'react'

const useViewportColumns = ({
	columns,
	rows,
	colOverscanStartIdx,
	colOverscanEndIdx,
	lastFrozenColumnIndex,
	rowOverscanStartIdx,
	rowOverscanEndIdx,
	columnWidths,
}) => {
	const startIdx = useMemo(() => {
		if (colOverscanStartIdx === 0) return 0;

		let startIdx = colOverscanStartIdx;
		return startIdx;
	}, [
		rowOverscanStartIdx,
		rowOverscanEndIdx,
		rows,
		colOverscanStartIdx,
		lastFrozenColumnIndex,
	]);

	const getSumofWidth = (index) => columns.slice(0, index).reduce((a, b) => a + b.width, 0);

	const { viewportColumns } = useMemo(() => {
		const viewportColumns = [];
		for (let colIdx = 0; colIdx <= colOverscanEndIdx; colIdx++) {
			const column = columns[colIdx];
			if (colIdx < startIdx && !column.frozen) continue;
			const col = { ...column, left: getSumofWidth(colIdx) }
			viewportColumns.push(col);
		}

		return { viewportColumns };
	}, [startIdx, colOverscanEndIdx, columns, columnWidths]);

	return {
		viewportColumns,
	};
}

export default useViewportColumns