import React, { memo } from 'react'
import { useRovingCellRef } from '../../Hooks/useRovingCellRef';

const Cell = (props) => {
	const { column, row, key, style, isCellSelected, selectCell, rowIdx } = props
	const selectCellWrapper =(openEditor)=> {
		selectCell(rowIdx, column.idx, openEditor);
	  }
	
	
	const handleClick=() =>{
		selectCellWrapper()
		// onRowClick?.(row, column);
	}

	const handleDoubleClick=()=> {
		selectCellWrapper(true);
		// onRowDoubleClick?.(row, column);
	  }
	const { ref, tabIndex, onFocus } = useRovingCellRef(isCellSelected);
	return (
		<div
			key={key}
			ref={ref}
			tabIndex={tabIndex}
			className={`table-cell  ${isCellSelected ? "table-selected-cell" : ""}`}
			onClick={handleClick}
			style={style}
			onDoubleClick={handleDoubleClick}

		// onFocus={onFocus}
		><div className="table-column-info">{row[column.key]}</div></div>
	)
}

export default memo(Cell)