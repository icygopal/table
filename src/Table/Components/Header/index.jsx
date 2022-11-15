import React, { memo } from 'react'
import HeaderCell from './HeaderCell';

const Header = (props) => {
	const { columns,height,onColumnResize,TotalColumnWidth} = props
	const cells = [];
	for (let index = 0; index < columns.length; index++) {
		const column = columns[index];
		const style = { width: column.width, left: column.left }
		cells.push(
		<HeaderCell
		  key={column.key}
		  column={column}
		  style={style}
		  onColumnResize={onColumnResize}
		/>
	  );
	}

  return (
	<div   
	role="Header"
	aria-rowindex={1} 
	className='table-header-container'
	style={{height:height, width:TotalColumnWidth}}
	>
		{cells}
	</div>
  )
}

export default memo(Header)