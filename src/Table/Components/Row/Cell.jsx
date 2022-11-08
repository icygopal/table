import React, { memo } from 'react'

const Cell = (props) => {
	const {column,row,key,style,selectedCell}=props
  return (
	<div key={key} className={`ag-header-cell ${selectedCell}`} style={style}><div className="btns">{row[column.key]}</div></div>
  )
}

export default memo(Cell)