import Table from './Table'
import data from './Data'
import Row from './Table/Components/Row'
import { column } from './column'
import { useRef } from 'react'
function App() {
	const gridref = useRef(null)
	// const row = []
	// data.forEach(el => {
	// 	row.push(
	// 		<Row item={el} />
	// 	)
	// })
	return (
		<div
		>
			<Table ref={gridref} columns={column} rows={data}/>
		</div>

	)
}

export default App
