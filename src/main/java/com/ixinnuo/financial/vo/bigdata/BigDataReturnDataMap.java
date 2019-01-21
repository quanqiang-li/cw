package com.ixinnuo.financial.vo.bigdata;

import java.util.Date;
import java.util.Map;

public class BigDataReturnDataMap {
	
	/**
     * 错误代码
     */
    protected int errorNum;

    /**
     * 错误信息
     */
    protected String errorMsg;
    
    /**
     * 时间戳
     */
    protected Date timeStamps;

    /**
     * 业务数据对象
     */
    protected Map<String, Object> retData;

	public int getErrorNum() {
		return errorNum;
	}

	public void setErrorNum(int errorNum) {
		this.errorNum = errorNum;
	}

	public String getErrorMsg() {
		return errorMsg;
	}

	public void setErrorMsg(String errorMsg) {
		this.errorMsg = errorMsg;
	}

	public Map<String, Object> getRetData() {
		return retData;
	}

	public void setRetData(Map<String, Object> retData) {
		this.retData = retData;
	}

	public Date getTimeStamps() {
		return timeStamps;
	}

	public void setTimeStamps(Date timeStamps) {
		this.timeStamps = timeStamps;
	}
    
	
    

}
