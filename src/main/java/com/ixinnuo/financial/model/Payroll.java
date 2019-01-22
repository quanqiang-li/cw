package com.ixinnuo.financial.model;

import java.math.BigDecimal;
import javax.persistence.*;

@Table(name = "cw_payroll")
public class Payroll {
    @Id
    private Integer id;

    @Column(name = "year_month")
    private String yearMonth;

    @Column(name = "employee_name")
    private String employeeName;

    /**
     * 计提工资
     */
    @Column(name = "accrued_pay")
    private BigDecimal accruedPay;

    /**
     * 养老保险
     */
    private BigDecimal pension;

    /**
     * 工伤
     */
    private BigDecimal injury;

    /**
     * 失业
     */
    @Column(name = "lose_job")
    private BigDecimal loseJob;

    /**
     * 生育
     */
    private BigDecimal birth;

    private BigDecimal medical;

    /**
     * 公积金
     */
    @Column(name = "public_fund")
    private BigDecimal publicFund;

    /**
     * 折旧
     */
    private BigDecimal depreciation;

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
     * @return year_month
     */
    public String getYearMonth() {
        return yearMonth;
    }

    /**
     * @param yearMonth
     */
    public void setYearMonth(String yearMonth) {
        this.yearMonth = yearMonth == null ? null : yearMonth.trim();
    }

    /**
     * @return employee_name
     */
    public String getEmployeeName() {
        return employeeName;
    }

    /**
     * @param employeeName
     */
    public void setEmployeeName(String employeeName) {
        this.employeeName = employeeName == null ? null : employeeName.trim();
    }

    /**
     * 获取计提工资
     *
     * @return accrued_pay - 计提工资
     */
    public BigDecimal getAccruedPay() {
        return accruedPay;
    }

    /**
     * 设置计提工资
     *
     * @param accruedPay 计提工资
     */
    public void setAccruedPay(BigDecimal accruedPay) {
        this.accruedPay = accruedPay;
    }

    /**
     * 获取养老保险
     *
     * @return pension - 养老保险
     */
    public BigDecimal getPension() {
        return pension;
    }

    /**
     * 设置养老保险
     *
     * @param pension 养老保险
     */
    public void setPension(BigDecimal pension) {
        this.pension = pension;
    }

    /**
     * 获取工伤
     *
     * @return injury - 工伤
     */
    public BigDecimal getInjury() {
        return injury;
    }

    /**
     * 设置工伤
     *
     * @param injury 工伤
     */
    public void setInjury(BigDecimal injury) {
        this.injury = injury;
    }

    /**
     * 获取失业
     *
     * @return lose_job - 失业
     */
    public BigDecimal getLoseJob() {
        return loseJob;
    }

    /**
     * 设置失业
     *
     * @param loseJob 失业
     */
    public void setLoseJob(BigDecimal loseJob) {
        this.loseJob = loseJob;
    }

    /**
     * 获取生育
     *
     * @return birth - 生育
     */
    public BigDecimal getBirth() {
        return birth;
    }

    /**
     * 设置生育
     *
     * @param birth 生育
     */
    public void setBirth(BigDecimal birth) {
        this.birth = birth;
    }

    /**
     * @return medical
     */
    public BigDecimal getMedical() {
        return medical;
    }

    /**
     * @param medical
     */
    public void setMedical(BigDecimal medical) {
        this.medical = medical;
    }

    /**
     * 获取公积金
     *
     * @return public_fund - 公积金
     */
    public BigDecimal getPublicFund() {
        return publicFund;
    }

    /**
     * 设置公积金
     *
     * @param publicFund 公积金
     */
    public void setPublicFund(BigDecimal publicFund) {
        this.publicFund = publicFund;
    }

    /**
     * 获取折旧
     *
     * @return depreciation - 折旧
     */
    public BigDecimal getDepreciation() {
        return depreciation;
    }

    /**
     * 设置折旧
     *
     * @param depreciation 折旧
     */
    public void setDepreciation(BigDecimal depreciation) {
        this.depreciation = depreciation;
    }
}