import data from './Data'
import Row from './Table/Components/Row'
import { column } from './column'
import { useRef, useState } from 'react'
import DataGridTable from './Table/DataGridTable'
function App() {

	const [Rowdata, setData] = useState(data)
	return (
		<DataGridTable itemheight={30} columns={column} rows={Rowdata} setData={setData} />
	)
}

export default App
