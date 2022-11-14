import React from 'react'

const DateTimeCell = (props) => {
    const { column, row, key, style, isCellSelected, selectCell, rowIdx } = props
    return (
        <div
            className={`table-cell  ${isCellSelected ? "table-selected-cell" : ""}`}
            style={style}
        >
            <Select autoFocus options={[{ value: 1, label: 'Yes' }, { value: 1, label: 'Yes' }]} styles={newSmallSelectStyle} />
        </div>
    )
}

export default DateTimeCell