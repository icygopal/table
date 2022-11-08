import React, { forwardRef, memo } from 'react'
import Cell from './Cell';

const Row = (props) => {
	const {
	  rowIdx,
	  row,
	  viewportColumns,
	  rowClass,
	  top,
	  height,
	  selectedCellIdx,
	  selectCell,
	  selectedPosition
	} = props

	
	const cells = [];


	
	for (let index = 0; index < viewportColumns.length; index++) {
		const isCellSelected = selectedCellIdx === index;
	  const column = viewportColumns[index];
	  const { idx } = column;
	  const style = { width: column.width, left: column.left }
		cells.push(
		  <Cell
			key={column.key}
			column={column}
			row={row}
			rowIdx={rowIdx} 
			style={style}
			isCellSelected={isCellSelected}
			selectCell={selectCell}
		  />
		);
	}
	const isGroupRowFocused = selectedPosition.idx === -1 && selectedPosition.rowIdx !== -2;

	return (
		<>
			<div
				role="row"
				className="item"
				aria-rowindex={rowIdx}
				style={{height:height,top:top}}
			>{cells}
			</div>
		</>
	)
}

const RowComponent = memo(forwardRef(Row));

export default RowComponent;

export function defaultRowRenderer(key, props) {
	return <RowComponent key={key} {...props} />;
}
