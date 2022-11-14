import React, { memo } from 'react'

const HeaderCell = (props) => {
	const { style, column, key ,onColumnResize } = props


	function onPointerDown(event) {
		if (event.pointerType === 'mouse' && event.buttons !== 1) {
			return;
		}

		const { currentTarget, pointerId } = event;
		const { right, left } = currentTarget.getBoundingClientRect();
		const offset = right - event.clientX;

		if (offset > 11) {
			// +1px to account for the border size
			return;
		}

		function onPointerMove(event) {
			// prevents text selection in Chrome, which fixes scrolling the grid while dragging, and fixes re-size on an autosized column
			event.preventDefault();
			const { right, left } = currentTarget.getBoundingClientRect();
			const width = event.clientX + offset - left;

			console.log(width)
			  if (width > 0) {
				onColumnResize(column, width);
			  }
		}

		function onLostPointerCapture() {
			currentTarget.removeEventListener('pointermove', onPointerMove);
			currentTarget.removeEventListener('lostpointercapture', onLostPointerCapture);
		}

		currentTarget.setPointerCapture(pointerId);
		currentTarget.addEventListener('pointermove', onPointerMove);
		currentTarget.addEventListener('lostpointercapture', onLostPointerCapture);
	}
	return (
		<div
			key={key}
			className="table-header-cell"
			style={style}
			onPointerDown={column.resizable ? onPointerDown : undefined}
		><div className="table-header-info">{column.name}</div></div>
	)
}

export default memo(HeaderCell)