import React, { memo } from 'react'
import { clampColumnWidth } from '../../CommonFunctions'

const HeaderCell = (props) => {
	const {style,column,key} = props
  return (
	<div key={key} className="table-header-cell" style={style}><div className="table-header-info">{column.name}</div></div>
  )
}

export default memo(HeaderCell)