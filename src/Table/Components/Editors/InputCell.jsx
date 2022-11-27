import React, { useState } from 'react'
import Select, { components } from "react-select";

const InputCell = (props) => {
	const { column, row, key, style, isCellSelected, selectCell, rowIdx, onRowChange } = props
	const [val, setVal] = useState(row[column.key])
	const handleOnChange = (e) => {
		const { value } = e.target
		setVal(value)

	}

	const handleKeyDown = (event) => {
		if (event.key === ' ' || event.key === 'Enter' || event.key === 'Tab') {
			const updatedrow = { ...row, [column.key]: val }
			onRowChange(rowIdx, updatedrow)
		}
	}

	const handleOnBlur = () => {
		const updatedrow = { ...row, [column.key]: val }
		onRowChange(rowIdx, updatedrow)
	}
	return (
		<div
			className={`table-cell  ${isCellSelected ? "editor-container" : ""} `}
			style={style}
			onKeyDown={handleKeyDown}
		>
			<input value={val} onBlur={() => handleOnBlur()} autoFocus className='bg-transparent form-control' onChange={handleOnChange}></input>
		</div>
	)
}

export default InputCell