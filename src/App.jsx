import Table from './Table'
import data from './Data'
import Row from './Table/Components/Row'
import { column } from './column'
import { useRef } from 'react'
import DataGridTable from './Table/DataGridTable'
function App() {
	const gridref = useRef(null)
	// const row = []
	// data.forEach(el => {
	// 	row.push(
	// 		<Row item={el} />
	// 	)
	// })
	return (
		
			<DataGridTable itemheight={30} columns={column} rows={data}/>

	)
}

export default App
