import React, { memo } from 'react'

const Cell = (props) => {
	const {column,row,key,style}=props
  return (
	<div key={key} className="ag-header-cell" style={style}>{row[column.key]}</div>
  )
}

export default memo(Cell)