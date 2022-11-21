import React, { memo, useState } from 'react'
import { IconAngleArrowDown } from '../../Icons';
import { useDrag, useDrop } from 'react-dnd';
import { useEffect } from 'react';
import { useMemo } from 'react';
import { useRef } from 'react';

const HeaderCell = (props) => {
	const { style, column, key, onColumnResize,handleColumnsReorder,isOver,setIsOver,isDragging,setIsDragging } = props
	const {key:colKey,resizable} = column

	const onPointerDown = (event) => {
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
	const handleClick = (e)=>{
		console.log("erer")
	}

	const handleDragStart = (e, position) => {
		console.log()
		var elem = document.createElement("div");
		elem.id = "drag-item";
		elem.textNode = "Dragging";
		elem.textContent =position
		elem.style.left=e.screenX
		elem.style.top=e.screenY
		document.body.appendChild(elem);
		e.dataTransfer.setDragImage(elem, 0, 0);
		setIsDragging(position)
	  };
	 
	  const handleDragEnter = (e, position) => {
		setIsOver(position)
		if(position===isOver)return
		handleColumnsReorder(isDragging,position);
	  };
	 
	  const handleOnDrop = (e,position) => {
		handleColumnsReorder(isDragging,position);
		setIsDragging(null) 
		setIsOver(null) 
		// var item = document.getElementById("drag-item");
		// if (item.parentNode) {
		// 	item.parentNode.removeChild(item);
		// }
	  }


	return (
		<div

			key={key}
			className="table-header-cell"
			style={{...style, opacity: isDragging===colKey ? 0.5 : 1,
				...(isOver===colKey && {backgroundColor: '#ececec'})
				}}
			onPointerDown={resizable ? onPointerDown : undefined}
			onClick={handleClick}
			onDragStart={(e) => handleDragStart(e,colKey)}
			onDragEnter ={(e) => handleDragEnter(e,colKey)}
			onDragEnd={(e) => handleOnDrop(e,colKey)}
		draggable
		>
			<div className='d-flex align-content-center '>
				<span className="table-header-info">{column.name}</span>
				{/* <span className='d-flex align-content-center'><IconAngleArrowDown  /></span> */}
			</div>
		</div>
	)
}

export default memo(HeaderCell)