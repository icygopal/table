import React, {useState } from 'react'
import { useRef } from 'react';
import { useEffect } from 'react';
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
	mode: 'SELECT',
	isEditEnable:false
};

const DataGridTable = ({
	itemheight,
	columns: rawColumns,
	rows: rawRows,
	onRowsChange,
	handleColumnsReorder
}) => {
	const [tableRef, tableWidth, tableHeight, isWidthInitialized] = useTableDimensions();
	const [scrollLeft, setScrollLeft] = useState(0);
	const [columnWidths, setColumnWidths] = useState(() => new Map());
	const [selectedCell, setSelectedCell] = useState(
		initialPosition
	);

	const headerRef = useRef(null)
	
	const [totalVisibleRow,setTotalVisibleRow] =useState(30);
	const [startRowIdx, setStart] = useState(0)
	const [endRowIdx, setEnd] = useState(totalVisibleRow)
	const [show, setShow] = useState(false)
	const minColIdx = 0;
	const maxColIdx = rawColumns.length - 1;
	const minRowIdx = -1;
	const maxRowIdx = rawRows.length - 1;

	const selectedCellIsWithinSelectionBounds = isCellWithinSelectionBounds(selectedCell);
	const selectViewportCellLatest = useLatestFunc(
		(rowId, colId, mode,isEditEnable) => {
			setSelectedCell({ rowIdx: rowId, idx: colId, mode,isEditEnable:isEditEnable });
		}
	);

	const getRowTop = (rowIdx) => rowIdx * itemheight
	const findRowIdx = (offset) => Math.floor(offset / itemheight)

	useEffect(()=>{
		setTotalVisibleRow(tableHeight/30)
	},[tableHeight])

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
	const TotalColumnWidth = columns.reduce((a, b) => a + b.width, 0)
	const containerStyle = { height: rawRows.length * itemheight, width: TotalColumnWidth }


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



	const handleColumnResizeLatest = useLatestFunc(handleColumnResize);

	function handleColumnResize(column, width) {
		if (columnWidths.get(column.key) === width) return;

		const newColumnWidths = new Map(columnWidths);
		newColumnWidths.set(column.key, width);
		setColumnWidths(newColumnWidths);

	}
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
		if (!(event.target)) return;
		const isCellEvent = event.target.closest('.table-cell') !== null;
		if (!isCellEvent) return;

		const { key, keyCode } = event;
		const { rowIdx,isEditEnable } = selectedCell;

		if (isRowIdxWithinViewportBounds(rowIdx)) {
			if (
				selectedCell.idx === -1
			) {
				event.preventDefault(); // Prevents scrolling
				return;
			}
		}
		
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
		event.preventDefault();
		const ctrlKey = isCtrlKeyHeldDown(event);
		const nextPosition = getNextPosition(key, ctrlKey, shiftKey);
		if (isSamePosition(selectedCell, nextPosition)) return;
		setSelectedCell(nextPosition);
		scrollIntoView(tableRef.current?.querySelector('[tabindex="0"]'));
	}

	function getNextPosition(key, ctrlKey, shiftKey) {
		const { idx, rowIdx } = selectedCell;
		const isRowSelected = selectedCellIsWithinSelectionBounds && idx === -1;

		switch (key) {
			case 'ArrowUp':
				return { idx, rowIdx: rowIdx == 0 ? 0 : rowIdx-1  };
			case 'ArrowDown':
				return { idx, rowIdx: rawRows.length - 1 !== rowIdx ? rowIdx + 1 : idx };
			case "ArrowLeft":
				return { idx: idx == 0 ? 0 : idx - 1, rowIdx };
			case "ArrowRight":
				return { idx: columns.length - 1 !== idx ? idx + 1 : idx, rowIdx };
			case 'Tab':
				return { idx: columns.length - 1 !== idx ? idx + (shiftKey ? -1 : 1) : idx, rowIdx };
			case 'Home':
				if (isRowSelected) return { idx, rowIdx: 0 };
				return { idx: 0, rowIdx: ctrlKey ? minRowIdx : rowIdx };
			case 'End':
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
	const handleScroll = (e) => {
		const { scrollTop, scrollLeft } = tableRef.current
		setScrollLeft(scrollLeft)
		headerRef.current.scrollLeft=scrollLeft  ;
		let currentIndx = Math.trunc(scrollTop / itemheight)
		currentIndx = (currentIndx - totalVisibleRow) >= rawRows.length ? currentIndx - totalVisibleRow : currentIndx;
		if (currentIndx !== startRowIdx) {
			setStart(currentIndx-10)
			const endIndex = ((currentIndx + totalVisibleRow) >= rawRows.length ? rawRows.length - 1 : currentIndx) + totalVisibleRow
			setEnd(endIndex+10)
		}
		// console.log(startRowIdx,endRowIdx)
	}


	const updateRow = (rowIdx, row)=> {
		if (typeof onRowsChange !== 'function') return;
		if (row === rawRows[rowIdx]) return;
		const updatedRows = [...rawRows];
		updatedRows[rowIdx] = row;
		onRowsChange(updatedRows);
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
				selectCell: selectViewportCellLatest,
				onRowChange:updateRow
			})
			);
		}
	}
	return (
		<>
			<div
				
				className="viewPort"
				style={{ height: "calc(100vh - 80px)" }}
				// onScroll={handleScroll}
				onKeyDown={handleKeyDown}
				aria-colcount={columns.length}
				aria-rowcount={rawRows.length}
			>
				<div className="AQ123" ref={headerRef}>
				<Header
					columns={viewportColumns}
					TotalColumnWidth={TotalColumnWidth}
					width="30"
					onColumnResize={handleColumnResizeLatest}
					handleColumnsReorder={handleColumnsReorder}
				/>	
				</div>			
				{show && <div style={{ height: 40 }} className="table-add-newrow shadow-md " >gopal</div>}
				<div className='abc' ref={tableRef}  onScroll={handleScroll}>
					<div className="table-main-content" style={containerStyle} >
					{result}
				</div>
				</div>
			</div>
			<button onClick={() => setShow(!show)}>add</button>
		</>
	)
}

export default DataGridTable


