package com.ixinnuo.financial.framework;

import java.util.HashMap;
import java.util.Map;

/**
 * controller向前端页面返回的数据结构
 * 
 * @ClassName: ReturnData
 * @Description: TODO
 */
public class ReturnData {

    /**
     * 错误代码
     */
    protected int errorCode;

    /**
     * 错误信息
     */
    protected String errorString;

    /**
     * 业务数据对象
     */
    protected Map<String, Object> dataBody;
    
    
    /**
     * 给json序列化时使用
     */
    public ReturnData() {
    }

    /**
     * 创建一个新的实例 ReturnData.
     * 
     * @param errorInfo
     *            错误代码
     */
    public ReturnData(int code, String msg) {
        this.dataBody = new HashMap<String, Object>();
        this.errorCode = code;
        this.errorString = msg;
        // TODO: 这里需要从常亮中得到错误代码所对应的的错误信息，错误代码不存在，错误信息返回“未知错误”
    }
    
    /**
     * 创建一个新的实例 ReturnData.
     * 
     * @param errorInfo
     *            错误代码
     */
    public ReturnData(Code errorInfo) {
    	this.dataBody = new HashMap<String, Object>();
    	this.errorCode = errorInfo.getCode();
    	this.errorString = errorInfo.getMsg();
    	// TODO: 这里需要从常亮中得到错误代码所对应的的错误信息，错误代码不存在，错误信息返回“未知错误”
    }

    public int getErrorCode() {
        return errorCode;
    }

    public void setErrorCode(int errorCode) {
        this.errorCode = errorCode;
    }

    public String getErrorString() {
        return errorString;
    }

    public void setErrorString(String errorString) {
        this.errorString = errorString;
    }

    public Map<String, Object> getDataBody() {
        return dataBody;
    }

    public void setDataBody(Map<String, Object> dataBody) {
        this.dataBody = dataBody;
    }

}
