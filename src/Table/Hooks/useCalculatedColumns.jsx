import React, { useMemo } from 'react'
import { clampColumnWidth, SELECT_COLUMN_KEY } from '../CommonFunctions';

const DEFAULT_COLUMN_WIDTH = 'auto';
const DEFAULT_COLUMN_MIN_WIDTH = 80;

const useCalculatedColumns = ({
	rawColumns,
	columnWidths,
	viewportWidth,
	scrollLeft,
}) => {
	const defaultWidth =  DEFAULT_COLUMN_WIDTH;
	const defaultMinWidth =  DEFAULT_COLUMN_MIN_WIDTH;
	const defaultMaxWidth = undefined;
	const defaultSortable =  false;
	const defaultResizable =  false;
  
	const { columns,  lastFrozenColumnIndex } = useMemo(()=> {
	  let lastFrozenColumnIndex = -1;
  
	  const columns = rawColumns.map((rawColumn,index) => {
		const frozen = rawColumn.frozen || false;
		let width = columnWidths.get(rawColumn.key) ?? rawColumn.width;
		
		const column = {
		  ...rawColumn,
		  idx: index,
		  frozen,
		  isLastFrozenColumn: false,
		  width: width ?? defaultWidth,
		  minWidth: rawColumn.minWidth ?? defaultMinWidth,
		  maxWidth: rawColumn.maxWidth ?? defaultMaxWidth,
		  sortable: rawColumn.sortable ?? defaultSortable,
		  resizable: rawColumn.resizable ?? defaultResizable,
		};
  
	
		if (frozen) {
		  lastFrozenColumnIndex++;
		}
  
		return column;
	  });
  
	  columns.sort(({ key: aKey, frozen: frozenA }, { key: bKey, frozen: frozenB }) => {
		// Sort select column first:
		if (aKey === SELECT_COLUMN_KEY) return -1;
		if (bKey === SELECT_COLUMN_KEY) return 1;
		if (frozenA) {
		  if (frozenB) return 0;
		  return -1;
		}
		if (frozenB) return 1;
  
		return 0;
	  });
  

  
	  if (lastFrozenColumnIndex !== -1) {
		columns[lastFrozenColumnIndex].isLastFrozenColumn = true;
	  }
  
	  return {
		columns,
		lastFrozenColumnIndex,
	  };
	}, [
	  rawColumns,
	  defaultWidth,
	  defaultMinWidth,
	  defaultMaxWidth,
	  defaultResizable,
	  defaultSortable,
	  columnWidths
	]);
  
	const { templateColumns, totalFrozenColumnWidth, columnMetrics } = useMemo(()=> {
	  const columnMetrics = new Map();
	  let left = 0;
	  let totalFrozenColumnWidth = 0;
	  const templateColumns=[];
  
	  for (const column of columns) {
		let width = columnWidths.get(column.key) ?? column.width;
		if (typeof width === 'number') {
		  width = clampColumnWidth(width, column);
		} else {
		  width = column.minWidth;
		}
		templateColumns.push(`${width}px`);
		columnMetrics.set(column, { width, left });
		left += width;
	  }
  
	  if (lastFrozenColumnIndex !== -1) {
		const columnMetric = columnMetrics.get(columns[lastFrozenColumnIndex]);
		totalFrozenColumnWidth = columnMetric.left + columnMetric.width;
	  }
	
	  return { templateColumns, totalFrozenColumnWidth, columnMetrics };
	}, [columnWidths, columns, lastFrozenColumnIndex]);
  
	const [colOverscanStartIdx, colOverscanEndIdx] = useMemo(() => {
	 
	  const viewportLeft = scrollLeft + totalFrozenColumnWidth;
	  
	  const viewportRight = scrollLeft + viewportWidth;
	  const lastColIdx = columns.length - 1;
	  const firstUnfrozenColumnIdx = Math.min(lastFrozenColumnIndex + 1, lastColIdx);
  
	  if (viewportLeft >= viewportRight) {
		return [firstUnfrozenColumnIdx, firstUnfrozenColumnIdx];
	  }
  
	  // get the first visible non-frozen column index
	  let colVisibleStartIdx = firstUnfrozenColumnIdx;
	  console.log({colVisibleStartIdx})
	  while (colVisibleStartIdx < lastColIdx) {
		const { left, width } = columnMetrics.get(columns[colVisibleStartIdx]);
		if (left + width > viewportLeft) {
		  break;
		}
		colVisibleStartIdx++;
	  }
  
	  // get the last visible non-frozen column index
	  let colVisibleEndIdx = colVisibleStartIdx;
	  while (colVisibleEndIdx < lastColIdx) {
		const { left, width } = columnMetrics.get(columns[colVisibleEndIdx]);
		if (left + width >= viewportRight) {
		  break;
		}
		colVisibleEndIdx++;
	  }
  
	  const colOverscanStartIdx = Math.max(firstUnfrozenColumnIdx, colVisibleStartIdx - 1);
	  const colOverscanEndIdx =  Math.min(lastColIdx, colVisibleEndIdx + 1);
  
	  return [colOverscanStartIdx, colOverscanEndIdx];
	}, [
	  columnMetrics,
	  columns,
	  lastFrozenColumnIndex,
	  scrollLeft,
	  totalFrozenColumnWidth,
	  viewportWidth,
	]);
  
	return {
	  columns,
	  colOverscanStartIdx,
	  colOverscanEndIdx,
	  templateColumns,
	  columnMetrics,
	  lastFrozenColumnIndex,
	  totalFrozenColumnWidth,
	};
}
export default useCalculatedColumns