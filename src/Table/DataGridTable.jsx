import React, { useRef, useState } from 'react'
import { useCallback } from 'react';
import { useMemo } from 'react';
import { useEffect } from 'react';
import Header from './Components/Header';
import { defaultRowRenderer } from './Components/Row';
import useCalculatedColumns from './Hooks/useCalculatedColumns';
import useTableDimensions from './Hooks/useTableDimensions';
import useViewportColumns from './Hooks/useViewportColumns';
import Item from './Item';


const data = []
function createData() {
	for (let i = 0; i < 700; i++) {
		data.push({ name: `Row ${i}` });
	}
}
createData();

const DataGridTable = ({ 
	itemheight,
	columns: rawColumns,
	rows: rawRows,
 }) => {
	const [tableRef, tableWidth, tableHeight, isWidthInitialized] = useTableDimensions();
	const [scrollLeft, setScrollLeft] = useState(0);
	const [columnWidths, setColumnWidths] = useState(() => new Map());

	const numVisibleItems = 30;
	const [startRowIdx, setStart] = useState(0)
	const [endRowIdx, setEnd] = useState(numVisibleItems)
	const [show,setShow] = useState(false)
	const containerStyle = { height: data.length * itemheight }


	const {
		columns,
		colOverscanStartIdx,
		colOverscanEndIdx,
		templateColumns,
		columnMetrics,
		lastFrozenColumnIndex,
		totalFrozenColumnWidth,
	} = useCalculatedColumns({
		rawColumns,
		columnWidths,
		viewportWidth: tableWidth,
		scrollLeft,
	});


	const { viewportColumns } = useViewportColumns({
		columns,
		rows:rawRows,
		colOverscanStartIdx,
		colOverscanEndIdx,
		lastFrozenColumnIndex,
		startRowIdx,
		endRowIdx,
		columnWidths,
	});

	console.log({columnMetrics})

	const scollPos=()=>{
        let currentIndx=Math.trunc(tableRef.current.scrollTop/itemheight)
        currentIndx=(currentIndx-numVisibleItems)>=data.length?currentIndx-numVisibleItems:currentIndx;
		console.log(currentIndx)
        if (currentIndx!==startRowIdx){
			setStart(currentIndx-10)
			const endIndex = ((currentIndx+numVisibleItems)>=data.length ? data.length-1:currentIndx)+numVisibleItems
			setEnd(endIndex)
           
        }
       
    }


	
	let result = [];
	for (let i = startRowIdx; i <= endRowIdx; i++) {
		const row = rawRows[i];
		if(row){
			result.push(defaultRowRenderer(i, {
				rowIdx:i,
				row,
				viewportColumns,
				rowClass:"abc",
				top:i * itemheight,
				height:itemheight
			  })
			);
			// result.push(<Item key={i} label={item.name} top={i * itemheight} itemheight={itemheight} />);
		}
	}
	return (
		<>
		<div ref={tableRef} className="viewPort" style={{height:"calc(100vh - 275px)"}} onScroll={scollPos} >
		<Header
			columns={viewportColumns}
			/>
			{show && <div style={{height:40}} className="addContainer" >gopal</div>}
			
			<div className="itemContainer" style={containerStyle}>
			
				{result}
			</div>
			
		</div>
		<button onClick={()=>setShow(!show)}>add</button>
		</>
		)
}

export default DataGridTable


