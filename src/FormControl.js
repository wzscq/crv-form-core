import React from "react"
import { useMemo } from 'react';
import ControlItem from './ControlItem'
import { useSelector } from "react-redux";

export default function FormControl({formConf,getControl}) {
    const rowkey = useSelector(state=>{
      //这里直接取最顶层的第一个key，作为初始的dataPath
      //对于form表单来说，应该只有一个顶层的key
      return Object.keys(state.formData.updated)[0]
    });

    //这里将rowkey转换为dataPath，同时避免相同的rowKey导致的重复渲染
    const dataPath = useMemo(()=>{
        return [rowkey];
    },[rowkey]);

    const {layout:{type,colCount, rowHeight},controls} = formConf

    const formControls=useMemo(()=>{ 
      return controls?.map((item,index)=><ControlItem getControl={getControl} key={item.key??index} controlConf={item} dataPath={dataPath} />)
    },[dataPath,controls])

    return (
      <div style={{display:type,gridTemplateColumns: "repeat("+colCount+", auto)",gridAutoRows:"minmax("+rowHeight+"px, auto)"}}>
        {formControls}
      </div>
    )
}