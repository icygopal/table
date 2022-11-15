import React, { forwardRef, memo } from 'react'
import InputCell from '../Editors/InputCell';
import SelectCell from '../Editors/SelectCell';
import RenderCell from './CellTypes/Cell';

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
		selectedPosition,
		onRowChange
	} = props

	const cells = [];

	for (let index = 0; index < viewportColumns.length; index++) {
		const { rowIdx: rowId, idx: cellId, mode } = selectedPosition
		const column = viewportColumns[index];
		const { idx } = column;
		const style = { width: column.width, left: column.left }
		const isCellSelected = (rowIdx === rowId && cellId === idx);
		if (isCellSelected && mode === "SELECT") {
			cells.push(
				<SelectCell
					key={column.key}
					column={column}
					row={row}
					rowIdx={rowIdx}
					style={style}
					isCellSelected={isCellSelected}
					selectCell={selectCell}
					onRowChange={onRowChange}
				/>
			)
		} else if (isCellSelected && mode === "INPUT") {
			cells.push(<InputCell
				key={column.key}
				column={column}
				row={row}
				rowIdx={rowIdx}
				style={style}
				isCellSelected={isCellSelected}
				selectCell={selectCell}
				onRowChange={onRowChange}
			/>)
		} else {
			cells.push(
				<RenderCell
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
	}

	return (
		<div
			role="row"
			className="table-row-cell"
			aria-rowindex={rowIdx}
			style={{ height: height, top: top,  transition:"top 2s linear"  }}
		>{cells}
		</div>
	)
}

const RowComponent = memo(forwardRef(Row));

export default RowComponent;

export function defaultRowRenderer(key, props) {
	return <RowComponent key={key} {...props} />;
}
