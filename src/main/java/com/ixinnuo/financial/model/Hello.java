package com.ixinnuo.financial.model;

import java.math.BigDecimal;
import java.util.Date;
import javax.persistence.*;

@Table(name = "t_test_hello")
public class Hello {
    @Id
    private Integer id;

    private String name;

    @Column(name = "create_time")
    private Date createTime;

    private BigDecimal money;

    @Column(name = "simp_describe")
    private String simpDescribe;

    /**
     * @return id
     */
    public Integer getId() {
        return id;
    }

    /**
     * @param id
     */
    public void setId(Integer id) {
        this.id = id;
    }

    /**
     * @return name
     */
    public String getName() {
        return name;
    }

    /**
     * @param name
     */
    public void setName(String name) {
        this.name = name == null ? null : name.trim();
    }

    /**
     * @return create_time
     */
    public Date getCreateTime() {
        return createTime;
    }

    /**
     * @param createTime
     */
    public void setCreateTime(Date createTime) {
        this.createTime = createTime;
    }

    /**
     * @return money
     */
    public BigDecimal getMoney() {
        return money;
    }

    /**
     * @param money
     */
    public void setMoney(BigDecimal money) {
        this.money = money;
    }

    /**
     * @return simp_describe
     */
    public String getSimpDescribe() {
        return simpDescribe;
    }

    /**
     * @param simpDescribe
     */
    public void setSimpDescribe(String simpDescribe) {
        this.simpDescribe = simpDescribe == null ? null : simpDescribe.trim();
    }
}