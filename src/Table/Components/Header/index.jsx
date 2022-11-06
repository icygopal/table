import React, { memo } from 'react'
import HeaderCell from './HeaderCell';

const Header = (props) => {
	const { columns} = props
	const cells = [];
	for (let index = 0; index < columns.length; index++) {
		const column = columns[index];
		const style = { width: column.width, left: column.left }
		cells.push(
		<HeaderCell
		  key={column.key}
		  column={column}
		  style={style}
		/>
	  );
	}

  return (
	<div   
	role="Header"
	aria-rowindex={1} 
	className='header-container'
	>
		<div className='ag-header-row'>
			{cells}
		</div>
	</div>
  )
}

export default memo(Header)