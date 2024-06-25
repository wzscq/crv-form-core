import e,{useMemo as t,useEffect as o}from"react";import{createSlice as a}from"@reduxjs/toolkit";import{useSelector as r,useDispatch as d}from"react-redux";const l={CREATE:"create",EDIT:"edit",DETAIL:"detail",UPDATE:"update"},n="_save_type",i="version",u="id",s="create",c="update",p="delete";var f=0;const m=(e,t)=>{for(let o in t){let{controls:a,field:r}=t[o];if(a&&r&&e[r]&&e[r].list){const t=e[r].list;e[r]={...e[r],list:{}};for(let o=0;o<t.length;++o)e[r].list[t[o][u]]=m({...t[o]},a)}}return e},g=(e,t)=>{let o=e.update,a=e.updated;for(let e=0;e<t.length;++e){const r=t[e];if(!o[r])if(e%3==0){const e=a[r][u],t=e.value?e.value:e;o[r]={[n]:c,[u]:t,[i]:a[r][i]}}else o[r]={};a[r]||e%3==0||(a[r]={}),o=o[r],a=a[r]}return{updateNode:o,updatedNode:a}},E=a({name:"formData",initialState:{loaded:!1,origin:{},update:{},updated:{},errorField:{}},reducers:{setData:(e,t)=>{const{data:{list:o},controls:a}=t.payload;if(o.length>0)for(let t=0;t<o.length;++t)e.origin[o[t].id]=m({...o[t]},a),e.updated[o[t].id]=m({...o[t]},a);e.loaded=!0},modiData:(e,t)=>{const{dataPath:o,field:a,update:r,updated:d}=t.payload,{updateNode:l,updatedNode:n}=g(e,o);l[a]=r,n[a]=d},createRow:(e,t)=>{const{dataPath:o,initData:a}=t.payload;for(let t=0;t<1;t++){const t="__c__"+f++;if(o.length>0){const{updateNode:r,updatedNode:d}=g(e,o);r[t]={[n]:s,...a},d[t]={[n]:s,...a}}else e.update[t]={[n]:s,...a},e.updated[t]={[n]:s,...a}}},deleteRow:(e,t)=>{const{dataPath:o,rowKey:a}=t.payload,{updateNode:r,updatedNode:d}=g(e,o);if(d[a][n]===s)delete r[a];else{const e=d[a][u],t=e.value?e.value:e;r[a]={[n]:p,[u]:t}}delete d[a]},setErrorField:(e,t)=>{e.errorField=t.payload},removeErrorField:(e,t)=>{delete e.errorField[t.payload]},refreshData:(e,t)=>{e.loaded=!1}}}),{setData:y,modiData:C,createRow:D,deleteRow:h,setErrorField:F,removeErrorField:v,refreshData:w}=E.actions;var R=E.reducer;function N({controlConf:t,dataPath:o,getControl:a}){const{row:r,col:d,rowSpan:l,colSpan:n}=t,i={gridColumnStart:d,gridColumnEnd:d+n,gridRowStart:r,gridRowEnd:r+l,zIndex:10,backgroundColor:"#FFFFFF",padding:5};return e.createElement("div",{style:i},a(t,o))}function P({formConf:o,getControl:a}){const d=r((e=>Object.keys(e.formData.updated)[0])),l=t((()=>[d]),[d]),{layout:{type:n,colCount:i,rowHeight:u},controls:s}=o,c=t((()=>s?.map(((t,o)=>e.createElement(N,{getControl:a,key:t.key??o,controlConf:t,dataPath:l})))),[l,s]);return e.createElement("div",{style:{display:n,gridTemplateColumns:"repeat("+i+", auto)",gridAutoRows:"minmax("+u+"px, auto)"}},c)}function T({formConf:t,formType:a,initData:r,getControl:n}){const i=d();return o((()=>{a!==l.CREATE&&a!==l.UPDATE||i(D({dataPath:[],initData:r}))})),e.createElement(P,{formConf:t,getControl:n})}export{l as FORM_TYPE,T as Form,D as createRow,R as formDataReducer,C as modiData,v as removeErrorField};
