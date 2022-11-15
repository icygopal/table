import React from 'react'

const DateTimeCell = (props) => {
    const { column, row, key, style, isCellSelected, selectCell, rowIdx } = props
    return (
        <div
            className={`table-cell  ${isCellSelected ? "table-selected-cell" : ""}`}
            
            style={style}
        >
            <div className='dis'>-</div>
        </div>
    )
}

export default DateTimeCell