import React from "react"
import Form from "./FormWrapper"
import { FORM_TYPE } from "./constant"
import { modiData,createRow,removeErrorField } from "./formDataSlice"
import formDataReducer from "./formDataSlice"

export {
    Form,
    FORM_TYPE,
    modiData,
    createRow,
    removeErrorField,
    formDataReducer
};