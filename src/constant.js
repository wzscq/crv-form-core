//用于不同表单类型的常量定义
export const FORM_TYPE={
    CREATE:'create',//"FORM_TYPE_CREATE",
    EDIT:'edit',//'FORM_TYPE_EDIT',
    DETAIL:'detail',//'FORM_TYPE_DETAIL',
    UPDATE:'update',//'FORM_TYPE_UPDATE'
}

//系统默认字段，这些字段有特殊用户，用户字段不能和这些字段重复
export const CC_COLUMNS={
	CC_SAVE_TYPE:"_save_type",
	CC_CREATE_TIME:"create_time",
	CC_CREATE_USER:"create_user",
	CC_UPDATE_TIME:"update_time",
	CC_UPDATE_USER:"update_user",
	CC_VERSION:"version",
	CC_ID:"id",
	CC_SN:"_ROW_SN"
}

//保存数据的类型
export const SAVE_TYPE={
	CREATE:"create",
	UPDATE:"update",
	DELETE:"delete"
}

//字段类型
export const FIELD_TYPE={
	MANY2MANY:'many2many',//"MANY_TO_MANY",
	MANY2ONE:'many2one',//"MANY_TO_ONE",
	ONE2MANY:'one2many',//"ONE_TO_MANY",
	FILE:'file',//"FILE",
}

//字段级联类型
export const CASCADE_TYPE={
	MANY2MANY:'many2many',//"MANY_TO_MANY",
	MANY2ONE:'many2one',//"MANY_TO_ONE",
}