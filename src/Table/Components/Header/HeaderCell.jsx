import React, { memo } from 'react'
import { clampColumnWidth } from '../../CommonFunctions'

const HeaderCell = (props) => {
	const {style,column,key} = props
  return (
	<div key={key} className="ag-header-cell" style={style}>{column.name}</div>
  )
}

export default memo(HeaderCell)