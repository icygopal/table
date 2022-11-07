import React, { forwardRef, memo } from 'react'
import Cell from './Cell';

const Row = (props) => {
	const {
	  rowIdx,
	  row,
	  viewportColumns,
	  rowClass,
	  top,
	  height
	} = props

	
	const cells = [];

	for (let index = 0; index < viewportColumns.length; index++) {
	  const column = viewportColumns[index];
	  const { idx } = column;
	  console.log({left: column.left})
	  const style = { width: column.width, left: column.left }
		cells.push(
		  <Cell
			key={column.key}
			column={column}
			row={row}
			style={style}
		  />
		);
	}

	return (
		<>
			<div
				role="row"
				className="item"
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
