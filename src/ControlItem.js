import React from "react"
export default function ControlItem({controlConf,dataPath,getControl}) {
    const {row,col,rowSpan,colSpan}=controlConf;
    const wrapperStyle={
        gridColumnStart:col,
        gridColumnEnd:col+colSpan,
        gridRowStart:row,
        gridRowEnd:row+rowSpan,
        zIndex:10,
        //backgroundColor:"#FFFFFF",
        padding:5}

    return (
      <div style={wrapperStyle}>
        {getControl(controlConf,dataPath)}
      </div>
    )
}