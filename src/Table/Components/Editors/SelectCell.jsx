import React from 'react'
import Select, { components } from "react-select";
import AsyncCreatableSelect  from "react-select/async-creatable";

import { IconAngleArrowDown, IconAngleArrowTop } from '../../Icons';
const newSmallSelectStyle = {
    control: (base, state) => ({
        ...base,
        minHeight: 30,
        border: "none",
        // borderColor: "#BFCCDA",
        backgroundColor: "none",
        borderRadius: "3px",
        boxShadow: "none",
        transition: "background-color .4s ease-out !important",
        "&:hover": {
            borderColor: "#687d96",
            boxShadow: "none",
        },
        "&:focus": {
            // border: "1px solid var(--color-primary-500)",
            paddingTop: "6.5px",
            paddingBottom: "6.5px",
            boxShadow: "none",
            border: "none",
        },
        "&:active": {
            // border: "1px solid var(--color-primary-500)",
            boxShadow: "none",
            border: "none",
        },
    }),
    menu: (base) => ({
        ...base,
        innerHeight: 30,
        zIndex: 8,
    }),
    menuList: (base) => ({
        ...base,
        color: "#172A41",
        "::-webkit-scrollbar": {
            width: "4px",
            height: "0px",
        },
        "::-webkit-scrollbar-track": {
            background: "#f1f1f1"
        },
        "::-webkit-scrollbar-thumb:hover": {
            background: "#555"
        }
    }),
    indicatorsContainer: (provided, state) => ({
        ...provided,
        height: 30,
        color: "#394E66",
    }),
    dropdownIndicator: (provided, state) => ({
        ...provided,
        padding: 5,
        color: "#394E66",
        svg: {
            width: 14,
        },
    }),
    indicatorSeparator: (base) => ({
        ...base,
        margin: "0",
        backgroundColor: "#BFCCDA",
        width:"0"
    }),
};



const DropdownIndicator = (props) => {
    return (
        <components.DropdownIndicator {...props} >
            {props.selectProps.menuIsOpen ? <IconAngleArrowTop  /> : <IconAngleArrowDown  />}
        </components.DropdownIndicator>
    );
};
const SelectCell = (props) => {
    const { column, row, key, style, isCellSelected, selectCell, rowIdx } = props
    return (
        <div
            className={`table-cell  ${isCellSelected ? "table-selected-cell" : ""}`}
            style={style}
        ><AsyncCreatableSelect autoFocus loadOptions={column.loadOptions}  components={{ DropdownIndicator }} options={column.selectOptions} styles={newSmallSelectStyle} onChange={({value})=>onRowChange({...row,[column.key]:value})}/>
        </div>
    )
}

export default SelectCell