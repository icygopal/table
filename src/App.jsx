import data from './Data'
import Row from './Table/Components/Row'
import { column } from './column'
import { useRef, useState } from 'react'
import DataGridTable from './Table/DataGridTable'
function App() {

	const [Rowdata, setData] = useState(data)
	const [col,setCol] = useState(column)

	const handleColumnsReorder = (sourceKey, targetKey) => {
		const sourceColumnIndex = col.findIndex((c) => c.key === sourceKey);
		const targetColumnIndex = col.findIndex((c) => c.key === targetKey);
	
		if (sourceColumnIndex > -1 && targetColumnIndex > -1 && sourceColumnIndex !== targetColumnIndex) {
		  const reorderedColumns = [...col];
		  reorderedColumns.splice(
			targetColumnIndex,
			0,
			reorderedColumns.splice(sourceColumnIndex, 1)[0]
		  );
		  setCol(reorderedColumns);
		}
	  }
	return (
		<DataGridTable itemheight={40} columns={col} handleColumnsReorder={handleColumnsReorder} rows={Rowdata} onRowsChange={setData} />
	)
}

export default App
