package com.ixinnuo.financial.util.bigdata;

import java.util.Date;
import java.util.List;

import com.fasterxml.jackson.annotation.JsonFormat;
import com.fasterxml.jackson.annotation.JsonProperty;

/**
 * 企业信息
 * 
 * @author aisino-liqq
 */
public class EnterpriseVo {

    /**
     * 状态码
     */
    public Integer errNum;

    /**
     * 消息
     */
    public String errMsg;

    /**
     * 数据项
     */
    public RetData retData;

    public EnterpriseVo() {
    }

    /**
     * 数据项，根据需要自行扩展
     * 
     * @author aisino-liqq
     */
    public class RetData {
    	
    	/**
    	 * 主要人员信息
    	 */
        public List<Perinfo> PERINFO;
    	
        /**
         * 公司名称
         */
        @JsonProperty("ENTNAME")
        public String entname;

        /**
         * 统一社会信用代码
         */
        @JsonProperty("UNISCID")
        public String uniscid;

        /**
         * 工商注册证号
         */
        @JsonProperty("REGNO")
        public String regno;

        /**
         * 税号
         */
        @JsonProperty("NSRSBH")
        public String nsrsbh;

        /**
         * 行业明细代码
         */
        @JsonProperty("HYMXDM")
        public String hymxdm;

        /**
         * 行业明细名称
         */
        @JsonProperty("HYMXMC")
        public String hymxmc;

        /**
         * 法定代表人姓名
         */
        @JsonProperty("LEREP")
        public String lerep;

        /**
         * 信用等级所属年度
         */
        @JsonProperty("SSND")
        public String ssnd;

        /**
         * 信用等级
         */
        @JsonProperty("XYGL_XYJB_DM")
        public String xyglXyjbDm;

        /**
         * 经营范围
         */
        @JsonProperty("OPSCOPE")
        public String opscope;

        /**
         * 成立日期
         */
        @JsonFormat(shape = JsonFormat.Shape.STRING, pattern = "yyyy-MM-dd")
        @JsonProperty("ESTDATE")
        public Date estdate;
        
        /**
         * 省份
         */
        @JsonProperty("SF")
        public String sf;
        /**
         * 地市
         */
        @JsonProperty("DS")
        public String ds;
        /**
         * 区县
         */
        @JsonProperty("QX")
        public String qx;
        /**
         * 组织机构代码
         */
        @JsonProperty("ZZJGDM")
        public String zzjgdm;
        /**
         * 行业信息来源，如果标识为"wbjk",不准确
         */
        @JsonProperty("SPECIALFLAG")
        public String specialflag;
        /**
         * 纳税等级来源，如果标识为"wbjk",不准确
         */
        @JsonProperty("DATA_SOURCE")
        public String dataSource;

        /**
         * 更新时间
         */
        @JsonFormat(shape = JsonFormat.Shape.STRING, pattern = "yyyy-MM-dd")
        @JsonProperty("UPDATETIME")
        public Date updatetime;
        /**
         *  营业期限起
         */
        @JsonProperty("OPFROM")
        public String opfrom;
        /**
         *  营业期限止
         */
        @JsonProperty("OPTO")
        public String opto;
        /**
         *  生产经营地址（税务）
         */
        @JsonProperty("SCJYDZ")
        public String scjydz;
        
        /**
         * 注册资本
         */
        @JsonProperty("REGCAP")
        public String regcap;
        
        /**
         * 行业名称
         */
        @JsonProperty("IXN_HYZL_MC")
        public String ixnHyzlMc;

        public RetData() {
        }

        //主要人员
        public class Perinfo{
        	public String POSITION;//职位
        	public String NAME;//姓名
        	public Perinfo() {
			}
        }
    }

    @Override
    public String toString() {
        return "EnterpriseVo[errMsg = " + errMsg 
                + ",retData[entname = " + this.retData.entname 
                + ",uniscid = " + this.retData.uniscid
                + ",regno = " + this.retData.regno
                + ",nsrsbh = " + this.retData.nsrsbh
                + ",hymxdm = " + this.retData.hymxdm 
                + ",hymxmc = " + this.retData.hymxmc 
                + ",lerep = " + this.retData.lerep
                + ",ssnd=" + this.retData.ssnd 
                + ",xyglXyjbDm=" + this.retData.xyglXyjbDm 
                + ",opscope=" + this.retData.opscope 
                + ",estdate = " + this.retData.estdate
                + ",updatetime=" + this.retData.updatetime
                +",opfrom="+this.retData.opfrom
                +",opto="+this.retData.opto
                + "]]";
    }
}
