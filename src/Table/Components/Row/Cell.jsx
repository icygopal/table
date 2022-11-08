import React, { memo } from 'react'
import { useRovingCellRef } from '../../Hooks/useRovingCellRef';

const Cell = (props) => {
	const { column, row, key, style, isCellSelected,selectCell,rowIdx } = props
	function handleClick() {
		selectCell(rowIdx,column.idx)
		// onRowClick?.(row, column);
	  }
	  const { ref, tabIndex, onFocus } = useRovingCellRef(isCellSelected);

	return (
		<div 
		key={key} 
		tabIndex={tabIndex}
		className={`ag-header-cell table-cell ${isCellSelected ? "selected-cell" : ""}`} 
		onClick={handleClick}
		style={style}
		><div className="btns">{row[column.key]}</div></div>
	)
}

export default memo(Cell)