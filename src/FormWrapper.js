import React from "react"
import { useEffect } from "react"
import { createRow } from "./formDataSlice"
import FormControl from "./FormControl"
import { FORM_TYPE } from "./constant"
import { useDispatch } from "react-redux"

export default function FormWrapper({formConf,formType,initData,getControl}){
    const dispatch=useDispatch()

    useEffect(()=>{
        if(formType===FORM_TYPE.CREATE||formType===FORM_TYPE.UPDATE){
            dispatch(createRow({dataPath:[],initData}))
        }
    });
    
    return (
        <FormControl formConf={formConf} getControl={getControl}/>
    )
}