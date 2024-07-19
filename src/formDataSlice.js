import { createSlice } from '@reduxjs/toolkit';
import {
    CC_COLUMNS,
    SAVE_TYPE
} from './constant';

//全局唯一索引用于新建数据行的key值
var gRowIdx=0;
// Define the initial state using that type
const initialState = {
    //数据是否已经加载，这里对于form组件来说应该不负责数据的加载，仅用于标识加载数据的状态，后续可能考虑移除？
    loaded:false,
    //原始数据
    origin:{},
    //对数据所做的更新
    update:{},
    //数据的最终状态
    updated:{},
    //校验出错的数据
    errorField:{}
}

//对原始数据中的每个行做转换，将数组转换为以ID为key的map，方便后续访问
const convertListToMap=(row,controls,index)=>{
    for (let controlIdx in controls){
        let {controls:subControls,field /*,modelID,fieldType,associationModelID*/}=controls[controlIdx];
        if(subControls&&field&&row[field]&&row[field].list){
            const list=row[field].list;
            row[field]={
                ...row[field],
                list:{}};
            for(let i=0;i<list.length;++i){
                row[field].list[list[i][CC_COLUMNS.CC_ID]]=convertListToMap({...list[i]},subControls,i);
            }
        }
    }
    //增加一个行号字段，用于标识行的原始顺序
    row[CC_COLUMNS.CC_SN]=index;
    return row;
}

/**
 * 当修改某个行的数据时，需要确认修改的的数据是在哪个层级上
 * 数据层级组织结构是以行号开始，一个行号跟一个字段，接下来再一个行号，跟一个字段名，
 * 层级结构放在一个数组中，类似[rowKey,field,list,rowKey,field,list,rowKey,field,list] 
 * dataPath示例：
 * 单表的情况下：[0,name]     //表示第0行的name字段
 * 如果有关联表：[0,student,list,1,name]  //表示主表第0行的student字段下，子表第1行的name字段
 * 这个函数是根据dataPath从最顶层开始向下查找到对应的数据层级
 */
const getUpdateNodes=(state,dataPath)=>{
    let updateNode=state.update;
    let updatedNode=state.updated;
    
    for(let i=0;i<dataPath.length;++i){
        const key=dataPath[i];
        //如果节点不存在，则添加节点，这种情就是增加行，或者表单中第一次录入一个原来没有的字段的数据
        if(!updateNode[key]){
            if(i%3===0){
                //按照路径的规律，能够被3整除的应该是一个rowNo节点，这时需要向修改缓存中加入一个新的数据行
                //对于子列表中的数据，update中仅保留了存在修改的字段，没有修改行的数据是不会存在的
                //这里因为要修改已经存在的行的数据，所以需要从原始数据中取出行的ID和版本号
                //这里考虑ID字段可能是个引用字段，所以要判断一下ID字段的值是不是一个对象，如果是对象，取对象的value值
                const idObj=updatedNode[key][CC_COLUMNS.CC_ID];
                const idVal=idObj.value?idObj.value:idObj;
                updateNode[key]={
                    [CC_COLUMNS.CC_SAVE_TYPE]:SAVE_TYPE.UPDATE,
                    [CC_COLUMNS.CC_ID]:idVal, //updatedNode[key][CC_COLUMNS.CC_ID],
                    [CC_COLUMNS.CC_VERSION]:updatedNode[key][CC_COLUMNS.CC_VERSION]
                };
            } else {
                //当前节点是一个field，或list节点时，向修改缓存中放入一个空字段对象
                updateNode[key]={};
            }

            //下面这个逻辑的作用需要验证一下
            /*if(i===0){
                state.update=updateNode;
            }*/
        }

        if(!updatedNode[key]){
            if(i%3===0){
                //按照逻辑来说，updatedNode[key]如果不存在，那么不可能走到这里的逻辑，后续考虑去掉？
                //当前节点是一个rowKey，向已修改数据中放入一个新的数据修改行
                //这里考虑ID字段可能是个引用字段，所以要判断一下ID字段的值是不是一个对象，如果是对象，取对象的value值
                /*const idObj=updatedNode[key][CC_COLUMNS.CC_ID];
                const idVal=idObj.value?idObj.value:idObj;
                updatedNode[key]={
                    [CC_COLUMNS.CC_SAVE_TYPE]:SAVE_TYPE.UPDATE,
                    [CC_COLUMNS.CC_ID]:idVal, //updatedNode[key][CC_COLUMNS.CC_ID],
                    [CC_COLUMNS.CC_VERSION]:updatedNode[key][CC_COLUMNS.CC_VERSION]
                };*/
            } else {
                //当前节点是一个field，或list节点时，向已修改数据中放入一个空字段对象
                updatedNode[key]={};
            }

            /*if(i===0){
                state.update=updatedNode;
            }*/
        }

        updateNode=updateNode[key];
        updatedNode=updatedNode[key];
    }
    return {updateNode,updatedNode};
}

const getMaxSN=(updatedNode)=>{
    const maxSN=-1;
    Object.keys(updatedNode).forEach(key => {
        if(updatedNode[key][CC_COLUMNS.CC_SN]&&updatedNode[key][CC_COLUMNS.CC_SN]>maxSN){
            maxSN=updatedNode[key][CC_COLUMNS.CC_SN];
        }
    });
    return maxSN++;
}

export const formDataSlice = createSlice({
    name: 'formData',
    initialState,
    reducers: {
        setData:(state,action) => {
            const {data:{list},controls}=action.payload;
            if(list.length>0){
                //把数组形式的列表转换成以ID为key值的map
                //对于每一层级字段中的的list都要做转换
                for(let i=0;i<list.length;++i){
                    state.origin[list[i]['id']]=convertListToMap({...(list[i])},controls,i);
                    state.updated[list[i]['id']]=convertListToMap({...(list[i])},controls,i);
                }   
            }
            state.loaded=true;
        },
        modiData:(state,action) => {
            const {dataPath,field,update,updated}=action.payload;
            const {updateNode,updatedNode}=getUpdateNodes(state,dataPath);
            updateNode[field]=update;
            updatedNode[field]=updated;
        },
        createRow:(state,action)=>{
            const {dataPath,initData}=action.payload;
            for(let i=0;i<1;i++){
                const rowKey='__c__'+gRowIdx++;
                if(dataPath.length>0){
                    const {updateNode,updatedNode}=getUpdateNodes(state,dataPath);
                    //这里需要考虑新加入的数据行的顺序问题，这里的逻辑是新加入的数据行放在最后
                    const maxSN=getMaxSN(updatedNode);
                    
                    updateNode[rowKey]={[CC_COLUMNS.CC_SAVE_TYPE]:SAVE_TYPE.CREATE,...initData};
                    updatedNode[rowKey]={[CC_COLUMNS.CC_SAVE_TYPE]:SAVE_TYPE.CREATE,[CC_COLUMNS.CC_SN]:maxSN,...initData};
                } else {
                    const maxSN=getMaxSN(state.updated);
                    state.update[rowKey]={[CC_COLUMNS.CC_SAVE_TYPE]:SAVE_TYPE.CREATE,...initData};
                    state.updated[rowKey]={[CC_COLUMNS.CC_SAVE_TYPE]:SAVE_TYPE.CREATE,[CC_COLUMNS.CC_SN]:maxSN,...initData};
                }
            }
        },
        deleteRow:(state,action)=>{
            const {dataPath,rowKey}=action.payload;
            const {updateNode,updatedNode}=getUpdateNodes(state,dataPath);

            if(updatedNode[rowKey][CC_COLUMNS.CC_SAVE_TYPE]===SAVE_TYPE.CREATE){
                delete updateNode[rowKey];    
            } else {
                //这里考虑ID字段可能是个引用字段，所以要判断一下ID字段的值是不是一个对象，如果是对象，取对象的value值
                const idObj=updatedNode[rowKey][CC_COLUMNS.CC_ID];
                const idVal=idObj.value?idObj.value:idObj;
                updateNode[rowKey]={
                    [CC_COLUMNS.CC_SAVE_TYPE]:SAVE_TYPE.DELETE,
                    [CC_COLUMNS.CC_ID]:idVal
                };
            }
            delete updatedNode[rowKey];
        },
        setErrorField:(state,action) => {
            state.errorField=action.payload;
        },
        removeErrorField:(state,action) => {
            delete state.errorField[action.payload];
        },
        refreshData:(state,action) => {
            state.loaded=false;
        },
        reset:(state,action)=>{
            state.loaded=false;
            state.origin={};
            state.update={[defaultRowKey]:{}};
            state.updated={[defaultRowKey]:{}};
            state.errorField={};
        }
    }
});

// Action creators are generated for each case reducer function
export const { 
    setData,
    modiData,
    createRow,
    deleteRow,
    setErrorField,
    removeErrorField,
    refreshData,
    reset
} = formDataSlice.actions

export default formDataSlice.reducer