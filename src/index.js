import React from "react"
import Form from "./FormWrapper"
import { FORM_TYPE } from "./constant"
import { 
    setData,
    modiData,
    createRow,
    deleteRow,
    setErrorField,
    removeErrorField,
    refreshData,
    reset
} from "./formDataSlice"
import formDataReducer from "./formDataSlice"

export {
    Form,
    FORM_TYPE,
    setData,
    modiData,
    createRow,
    deleteRow,
    setErrorField,
    removeErrorField,
    refreshData,
    reset,
    formDataReducer
};