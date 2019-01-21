package com.ixinnuo.financial.util.bigdata;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonInclude;
import com.fasterxml.jackson.annotation.JsonInclude.Include;

/**
 * 注册企业
 * 
 * @author aisino
 */
@JsonInclude(Include.NON_NULL) 
public class RegistVo {

    /**
     * 0天,直接触发
     */
    @JsonIgnore
    public static final String FRE_ZERO = "0";
   
    /**
     * 1级
     */
    @JsonIgnore
    public static final String PRI_ONE = "1";

    /**
     * 2级
     */
    @JsonIgnore
    public static final String PRI_TWO = "2";

    /**
     * 3级
     */
    @JsonIgnore
    public static final String PRI_THREE = "3";

    /**
     * 4级
     */
    @JsonIgnore
    public static final String PRI_FOUR = "4";

    /**
     * 5级
     */
    @JsonIgnore
    public static final String PRI_FIVE = "5";

    /**
     * 名称
     */
    public String mc;

    /**
     * 税号
     */
    public String sh;

    /**
     * 爱信诺编码
     */
    public String bm;

    /**
     * 频率 ，单位天，0则直接触发，或者非0正数
     */
    public String fre;

    /**
     * 优先级，1-n,1最高
     */
    public String pri;

}
