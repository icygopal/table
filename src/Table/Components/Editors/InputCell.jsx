import React from 'react'

const InputCell = (props) => {
	const { column, row, key, style, isCellSelected, selectCell, rowIdx } = props
	return (
		<div
			className={`table-cell  ${isCellSelected ? "table-selected-cell" : ""}`}
			style={style}
		><input autoFocus />
		</div>
	)
}

export default InputCell