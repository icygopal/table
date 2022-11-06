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
	console.log({clientHeight})
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
	console.log(rawRows)
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


// const handleScroll = (event)=>{
// 	if (event.target != event.currentTarget) return
// 	const { scrollTop, scrollLeft } = event.currentTarget;
// 		// console.log(scrollTop)
// 		console.log("Asdfasd","asdf")
// 		flushSync(()=>{
// 			setScrollTop(scrollTop);

// 		})
// 		//   setScrollLeft(abs(scrollLeft));
// }
	  

useEffect(() => {

	const elem = document.querySelector('.table');
    const handleScroll = event => {
			const { scrollTop, scrollLeft } = event.currentTarget;
			flushSync(()=>{
				setScrollTop(scrollTop)
			})
			// setScrollTop(scrollTop);

    //   console.log('window.scrollY',  event.currentTarget.scrollTop);
    };

    elem.addEventListener('scroll', handleScroll,{ passive: true });

    return () => {
		elem.removeEventListener('scroll', handleScroll);
    };
  }, []);

  function scrollIntoView(element) {
	element?.scrollIntoView({ inline: 'nearest', block: 'nearest' });
  }

  
//   useLayoutEffect(() => {
//       rowRef.current.focus({ preventScroll: true });
//       scrollIntoView(rowRef.current);
//   });


	useImperativeHandle(ref, () => ({
		element: tableRef.current,
		// scrollToColumn,
		scrollToRow(rowIdx) {
		  const { current } = tableRef;
		  if (!current) return;
		  current.scrollTo({
			top: getRowTop(rowIdx),
			behavior: 'smooth'
		  });
		},
		// selectCell
	  }));

	  const getViewPortRows=()=>{
		const rowElements= [];
	console.log("sdfgsdfgsdfg",{rowOverscanStartIdx,rowOverscanEndIdx})
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