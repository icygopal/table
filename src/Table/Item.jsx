import React, { memo } from 'react'

const Item = (props) => {

	return (<div className="item" style={{ top: props.top, height: props.itemheight }}>
		{props.label}
	</div>)
}
export default memo(Item)