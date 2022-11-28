import React, { memo } from 'react'


const HeaderCell = (props) => {
	const { style, column, key, onColumnResize, handleColumnsReorder, isOver, setIsOver, isDragging, setIsDragging } = props
	const { key: colKey, resizable } = column
	let entered = false

	const onPointerDown = (event) => {
		if (event.pointerType === 'mouse' && event.buttons !== 1) {
			return;
		}

		const { currentTarget, pointerId } = event;
		const { right, left } = currentTarget.getBoundingClientRect();
		console.log({ A: right, B: event.clientX })
		const offset = right - event.clientX;

		if (offset > 11) {
			// +1px to account for the border size
			return;
		}

		function onPointerMove(event) {
			// prevents text selection in Chrome, which fixes scrolling the grid while dragging, and fixes re-size on an autosized column
			event.preventDefault();
			const { right, left } = currentTarget.getBoundingClientRect();
			console.log(event.clientX, offset, left)
			const width = event.clientX - left;
			console.log({ width })
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
	const handleClick = (e) => {
		console.log("erer")
	}

	const handleDragStart = (e, position) => {
		var elem = document.createElement("div");
		elem.id = "drag-item";
		elem.textNode = "Dragging";
		elem.textContent = position
		elem.style.left = e.screenX
		elem.style.top = e.screenY
		document.body.appendChild(elem);
		e.dataTransfer.setDragImage(elem, 0, 0);
		document.querySelectorAll(".table-cell").forEach((el) => {
			el.classList.add("column-transition");
		});
		setIsDragging(position)
	};


	const handleDragEnter = (e, position) => {
		setIsOver(position)
		if (position === isOver) {
			entered = true
			handleColumnsReorder(isDragging, position);
		}
	};

	const handleOnDrop = (e, position) => {
		handleColumnsReorder(isDragging, position);
		setIsDragging(null)
		setIsOver(null)
		document.querySelectorAll(".table-cell").forEach((el) => {
			el.classList.remove("column-transition");
		});
	}
	const lastPoint = { x: null, y: null }
	const handleDragEvent = (e, position) => {
		console.log(e, position)
		if (position != isDragging && entered) {
			if (e.clientY > lastPoint.y) {
				handleColumnsReorder(isDragging, position);
				entered = false
			}
			if (e.clientY < lastPoint.y) {
				handleColumnsReorder(position, isDragging);
				entered = false
			}
		}
		lastPoint.x = e.clientX
		lastPoint.y = e.clientY
	}


	return (
		<div
			key={key}
			className="table-header-cell"
			style={{
				...style, opacity: isDragging === colKey ? 0.5 : 1,
				...(isOver === colKey && { backgroundColor: '#ececec' })
			}}
			onClick={handleClick}
			onDragOver={(e) => handleDragEvent(e, colKey)}
			onPointerDown={resizable ? onPointerDown : undefined}
		>
			<div className='header-cell-content'
				onDragStart={(e) => handleDragStart(e, colKey)}
				onDragEnter={(e) => handleDragEnter(e, colKey)}
				onDragEnd={(e) => handleOnDrop(e, colKey)}
				draggable
			>
				<span className="table-header-info">{column.name}</span>
			</div>
			<div className='header-cell-resize'></div>
		</div>
	)
}

export default memo(HeaderCell)