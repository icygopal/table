import React from 'react'
import Select,{ components } from "react-select";

const InputCell = (props) => {
	const { column, row, key, style, isCellSelected, selectCell, rowIdx } = props
	return (
		<div
			className={`table-cell  ${isCellSelected ? "table-selected-cell" : ""} `}
			style={style}
		><input autoFocus className='bg-transparent form-control'></input>
		</div>
	)
}

export default InputCell