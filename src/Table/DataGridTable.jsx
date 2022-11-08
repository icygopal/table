import React, { useRef, useState } from 'react'
import { isCtrlKeyHeldDown, isSamePosition, scrollIntoView } from './CommonFunctions';
import Header from './Components/Header';
import { defaultRowRenderer } from './Components/Row';
import useCalculatedColumns from './Hooks/useCalculatedColumns';
import { useLatestFunc } from './Hooks/useLatestFunc';
import useTableDimensions from './Hooks/useTableDimensions';
import useViewportColumns from './Hooks/useViewportColumns';


const initialPosition = {
	idx: -1,
	rowIdx: -2,
};

const DataGridTable = ({
	itemheight,
	columns: rawColumns,
	rows: rawRows,
}) => {
	const TotalColumnWidth = rawColumns.reduce((a, b) => a + b.width, 0)
	const [tableRef, tableWidth, tableHeight, isWidthInitialized] = useTableDimensions();
	const [scrollLeft, setScrollLeft] = useState(0);
	const [columnWidths, setColumnWidths] = useState(() => new Map());
	const [selectedCell, setSelectedCell] = useState(
		initialPosition
	);
	const numVisibleItems = 30;
	const [startRowIdx, setStart] = useState(0)
	const [endRowIdx, setEnd] = useState(numVisibleItems)
	const [show, setShow] = useState(false)
	const containerStyle = { height: rawRows.length * itemheight, width: TotalColumnWidth }
	const minColIdx = 0;
	const maxColIdx = rawColumns.length - 1;
	const minRowIdx = -1;
	const maxRowIdx = rawRows.length - 1;

	const selectedCellIsWithinSelectionBounds = isCellWithinSelectionBounds(selectedCell);
	const selectedCellIsWithinViewportBounds = isCellWithinViewportBounds(selectedCell);
	const selectViewportCellLatest = useLatestFunc(
		(rowId, colId) => {
			setSelectedCell({ rowIdx: rowId, idx: colId });
		}
	);

	const getRowTop = (rowIdx) => rowIdx * itemheight
	const findRowIdx = (offset) => Math.floor(offset / itemheight)



	const {
		columns,
		colOverscanStartIdx,
		colOverscanEndIdx,
		templateColumns,
		columnMetrics,
		lastFrozenColumnIndex,
		totalFrozenColumnWidth,
	} = useCalculatedColumns({
		rawColumns,
		columnWidths,
		viewportWidth: tableWidth,
		scrollLeft,
	});


	const { viewportColumns } = useViewportColumns({
		columns,
		rows: rawRows,
		colOverscanStartIdx,
		colOverscanEndIdx,
		lastFrozenColumnIndex,
		startRowIdx,
		endRowIdx,
		columnWidths,
	});



	function isColIdxWithinSelectionBounds(idx) {
		return idx >= minColIdx && idx <= maxColIdx;
	}

	function isRowIdxWithinViewportBounds(rowIdx) {
		return rowIdx >= 0 && rowIdx < rawRows.length;
	}

	function isCellWithinSelectionBounds({ idx, rowIdx }) {
		return rowIdx >= minRowIdx && rowIdx <= maxRowIdx && isColIdxWithinSelectionBounds(idx);
	}

	function isCellWithinViewportBounds({ idx, rowIdx }) {
		return isRowIdxWithinViewportBounds(rowIdx) && isColIdxWithinSelectionBounds(idx);
	}

	function isCellEditable(position) {
		return (
			isCellWithinViewportBounds(position) &&
			isSelectedCellEditable({ columns, rows, selectedPosition: position, isGroupRow })
		);
	}
	const handleKeyDown = (event) => {
		console.log("Asdf")
		if (!(event.target)) return;
		const isCellEvent = event.target.closest('.table-cell') !== null;
		if (!isCellEvent) return;

		const { key, keyCode } = event;
		const { rowIdx } = selectedCell;


		if (isRowIdxWithinViewportBounds(rowIdx)) {
			if (
				selectedCell.idx === -1
			) {
				event.preventDefault(); // Prevents scrolling
				return;
			}
		}
		console.log("Asdfads")
		switch (key) {
			case 'Escape':
				setCopiedCell(null);
				return;
			case 'ArrowUp':
			case 'ArrowDown':
			case 'ArrowLeft':
			case 'ArrowRight':
			case 'Tab':
			case 'Home':
			case 'End':
			case 'PageUp':
			case 'PageDown':
				navigate(event);
				break;
			default:
				// handleCellInput(event);
				break;
		}
	}

	function navigate(event) {
		const { key, shiftKey } = event;

		// Do not allow focus to leave
		event.preventDefault();

		const ctrlKey = isCtrlKeyHeldDown(event);
		const nextPosition = getNextPosition(key, ctrlKey, shiftKey);
		console.log(nextPosition)
		if (isSamePosition(selectedCell, nextPosition)) return;


		setSelectedCell(nextPosition);

		scrollIntoView(tableRef.current?.querySelector('[tabindex="0"]'));
	}

	function getNextPosition(key, ctrlKey, shiftKey) {
		const { idx, rowIdx } = selectedCell;
		const isRowSelected = selectedCellIsWithinSelectionBounds && idx === -1;

		switch (key) {
			case 'ArrowUp':
				return { idx, rowIdx: rowIdx == 0 ? 0 : rowIdx - 1 };
			case 'ArrowDown':
				return { idx, rowIdx: rawRows.length - 1 !== rowIdx ? rowIdx + 1 : idx };
			case "ArrowLeft":
				return { idx: idx == 0 ? 0 : idx - 1, rowIdx };
			case "ArrowRight":
				console.log(columns.length !== idx ? idx + 1 : idx)
				return { idx: columns.length - 1 !== idx ? idx + 1 : idx, rowIdx };
			case 'Tab':
				return { idx: columns.length - 1 !== idx ?idx + (shiftKey ? -1 : 1):idx, rowIdx };
			case 'Home':
				// If row is selected then move focus to the first row
				if (isRowSelected) return { idx, rowIdx: 0 };
				return { idx: 0, rowIdx: ctrlKey ? minRowIdx : rowIdx };
			case 'End':
				// If row is selected then move focus to the last row.
				if (isRowSelected) return { idx, rowIdx: rawRows.length - 1 };
				return { idx: maxColIdx, rowIdx: ctrlKey ? maxRowIdx : rowIdx };
			case 'PageUp': {
				if (selectedCell.rowIdx === minRowIdx) return selectedCell;
				const nextRowY = getRowTop(rowIdx) + itemheight - tableHeight;
				return { idx, rowIdx: nextRowY > 0 ? findRowIdx(nextRowY) : 0 };
			}
			case 'PageDown': {
				if (selectedCell.rowIdx >= rawRows.length) return selectedCell;
				const nextRowY = getRowTop(rowIdx) + tableHeight;
				return { idx, rowIdx: nextRowY < rawRows.length * itemheight ? findRowIdx(nextRowY) : rawRows.length - 1 };
			}
			default:
				return selectedCell;
		}
	}
	const handleScroll = () => {
		const { scrollTop, scrollLeft } = tableRef.current
		setScrollLeft(scrollLeft)
		let currentIndx = Math.trunc(scrollTop / itemheight)
		currentIndx = (currentIndx - numVisibleItems) >= rawRows.length ? currentIndx - numVisibleItems : currentIndx;
		if (currentIndx !== startRowIdx) {
			setStart(currentIndx)
			const endIndex = ((currentIndx + numVisibleItems) >= rawRows.length ? rawRows.length - 1 : currentIndx) + numVisibleItems
			setEnd(endIndex)
		}
	}

	const { idx: selectedIdx, rowIdx: selectedRowIdx } = selectedCell;

	let result = [];
	for (let rowIdx = startRowIdx; rowIdx <= endRowIdx; rowIdx++) {
		const row = rawRows[rowIdx];
		if (row) {
			result.push(defaultRowRenderer(rowIdx, {
				rowIdx,
				row,
				viewportColumns,
				rowClass: "abc",
				top: rowIdx * itemheight,
				height: itemheight,
				selectedCellIdx: selectedRowIdx === rowIdx ? selectedIdx : undefined,
				selectedPosition: selectedCell,
				selectCell: selectViewportCellLatest
			})
			);
		}
	}
	return (
		<>
			<div
				ref={tableRef}
				className="viewPort"
				style={{ height: "calc(100vh - 275px)" }}
				onScroll={handleScroll}
				onKeyDown={handleKeyDown}
				aria-colcount={columns.length}
				aria-rowcount={rawRows.length}
			>
				<Header
					columns={viewportColumns}
				/>
				{show && <div style={{ height: 40 }} className="addContainer" >gopal</div>}

				<div className="itemContainer" style={containerStyle}>

					{result}
				</div>

			</div>
			<button onClick={() => setShow(!show)}>add</button>
		</>
	)
}

export default DataGridTable


