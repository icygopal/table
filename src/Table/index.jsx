import React, { useState, useRef, useImperativeHandle, forwardRef, useEffect } from 'react'
import Header from './Components/Header';
import { flushSync } from 'react-dom';
import ReactDOM from 'react-dom'

import { defaultRowRenderer } from './Components/Row';
import useCalculatedColumns from './Hooks/useCalculatedColumns';
import useTableDimensions from './Hooks/useTableDimensions';
import useViewportColumns from './Hooks/useViewportColumns';
import useViewportRows from './Hooks/UseViewportRows';
import { useCallback } from 'react';
const initialPosition = {
	idx: -1,
	rowIdx: -2,
	mode: 'SELECT'
};
const Table = (props,ref) => {
	const {
		columns: rawColumns,
		rows: rawRows,
		rowKeyGetter,
		rowClass,
		addRow,
		rowHeight: rawRowHeight,
		headerRowHeight: rawHeaderRowHeight,
		summaryRowHeight: rawSummaryRowHeight,
	} = props
	const rowHeight = rawRowHeight ?? 35;
	const headerRowHeight = rawHeaderRowHeight ?? (typeof rowHeight === 'number' ? rowHeight : 35);
	const summaryRowHeight = rawSummaryRowHeight ?? (typeof rowHeight === 'number' ? rowHeight : 35);
	const tatalHeight = 1000*35
	const rowRenderer = defaultRowRenderer
	// const noRowsFallback = renderers?.noRowsFallback ?? defaultComponents?.noRowsFallback;
	const [scrollTop, setScrollTop] = useState(0);
	const [scrollLeft, setScrollLeft] = useState(0);
	const [columnWidths, setColumnWidths] = useState(() => new Map());

	const [selectedPosition, setSelectedPosition] = useState(initialPosition);

	const prevSelectedPosition = useRef(selectedPosition);
	const lastSelectedRowIdx = useRef(-1);
	const rowRef = useRef(null);


	const [tableRef, tableWidth, tableHeight, isWidthInitialized] = useTableDimensions();
	const headerRowsCount = 1;
	const clientHeight = tableHeight - headerRowHeight
	const leftKey = 'ArrowLeft';
	const rightKey = 'ArrowRight';
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
	const {
		rowOverscanStartIdx,
		rowOverscanEndIdx,
		getRowTop,
		totalRowHeight
	} = useViewportRows({
		rawRows,
		rowHeight,
		clientHeight,
		scrollTop,
	});

	const { viewportColumns } = useViewportColumns({
		columns,
		rows:rawRows,
		colOverscanStartIdx,
		colOverscanEndIdx,
		lastFrozenColumnIndex,
		rowOverscanStartIdx,
		rowOverscanEndIdx,
		columnWidths,
	});


	const minColIdx = 0;
	const maxColIdx = columns.length - 1;
	const minRowIdx = -1;
	const maxRowIdx = rawRows.length - 1;
	  const selectedCellIsWithinSelectionBounds = isCellWithinSelectionBounds(selectedPosition);
	  const selectedCellIsWithinViewportBounds = isCellWithinViewportBounds(selectedPosition);


	  function isColIdxWithinSelectionBounds(idx) {
		return idx >= minColIdx && idx <= maxColIdx;
	  }
	
	  function isRowIdxWithinViewportBounds(rowIdx) {
		return rowIdx >= 0 && rowIdx < rows.length;
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


	  function selectCell(position, enableEditor) {
		if (!isCellWithinSelectionBounds(position)) return;
		commitEditorChanges();
	
		if (enableEditor && isCellEditable(position)) {
		  const row = rows[position.rowIdx]
		  setSelectedPosition({ ...position, mode: 'EDIT', row, originalRow: row });
		} else if (isSamePosition(selectedPosition, position)) {
		  // Avoid re-renders if the selected cell state is the same
		  scrollIntoView(gridRef.current?.querySelector('[tabindex="0"]'));
		} else {
		  setSelectedPosition({ ...position, mode: 'SELECT' });
		}
	  }

  function scrollIntoView(element) {
	element?.scrollIntoView({ inline: 'nearest', block: 'nearest' });
  }

	  const getViewPortRows=()=>{
		const rowElements= [];
		const startRowIdx =rowOverscanStartIdx
    	const endRowIdx =rowOverscanEndIdx
	
		for (let viewportRowIdx = startRowIdx; viewportRowIdx <= endRowIdx; viewportRowIdx++) {
		  const rowIdx =  viewportRowIdx;
	
		  let rowColumns = viewportColumns;
		 
	
		  const row = rawRows[rowIdx];
		 
		  let key;
		  let isRowSelected = false;
		  if (typeof rowKeyGetter === 'function') {
			key = rowKeyGetter(row);
			isRowSelected = selectedRows?.has(key) ?? false;
		  } else {
			key =  rowIdx;
		  }
	
		  rowElements.push(
			rowRenderer(key, {
			  'aria-rowindex':
				headerRowsCount  +  rowIdx + 1,
			  rowIdx,
			  row,
			  viewportColumns: rowColumns,
			  rowClass,
			  height:35
			})
		  );
		}
	
		return rowElements;
	  }
	  return (
		<div 
		role='table' 
		className='table' 
		ref={tableRef}
	
		// onScroll={handleScroll}
		>
			<Header
			columns={viewportColumns}
			/>
			<div 	style={{height:tatalHeight, overflowX: "scroll" }}>
			{getViewPortRows()}
			</div>
			
		</div>
	)
}

export default forwardRef(Table)