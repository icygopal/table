import React, { memo } from 'react'
import { useRovingCellRef } from '../../../Hooks/useRovingCellRef';
import SelectCell from './SelectCell';

const IconAngleArrowDown = ({ className }) => (
	<svg
	  className={`cicon ${className}`}
	  width="20"
	  height="20"
	  viewBox="0 0 20 20"
	  fill="none"
	  xmlns="http://www.w3.org/2000/svg"
	>
	  <path
		fillRule="evenodd"
		clipRule="evenodd"
		d="M9.39899 12.8938L5.99988 9.49468L7.20165 8.29291L9.99988 11.0911L12.7981 8.29291L13.9999 9.49468L10.6008 12.8938C10.2689 13.2257 9.73085 13.2257 9.39899 12.8938Z"
		fill="currentColor"
	  />
	</svg>
  );

const RenderCell = (props) => {
	const { column, row, key, style, isCellSelected, selectCell, rowIdx } = props
	const selectCellWrapper =(openEditor)=> {
		selectCell(rowIdx, column.idx, column.cellType,openEditor);
	  }
	
	
	const handleClick=() =>{
		selectCellWrapper(true)
		// onRowClick?.(row, column);
	}

	const handleDoubleClick=()=> {
		selectCellWrapper(true);
		// onRowDoubleClick?.(row, column);
	  }
	const { ref, tabIndex, onFocus } = useRovingCellRef(isCellSelected);

	if(column.cellType ==="SELECT"){
		return (<SelectCell key={column.key}
			column={column}
			row={row}
			rowIdx={rowIdx} 
			style={style}
			isCellSelected={isCellSelected}
			selectCell={selectCell}/>)
	}
	
	return (
		<div
			key={key}
			ref={ref}
			tabIndex={tabIndex}
			className={`table-cell  ${isCellSelected ? "table-selected-cell" : ""} ${column.editable? "editable":""}`}
			onClick={handleClick}
			style={style}
			onDoubleClick={handleDoubleClick}
		// onFocus={onFocus}
		>
			<div className="table-column-info d-flex align-items-center justify-content-between">
				{row[column.key]}
				{column.cellType ==="SELECT" &&  <span> <IconAngleArrowDown className="w-20px" />
					</span>}</div></div>
	)
}

export default memo(RenderCell)