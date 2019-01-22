package com.ixinnuo.financial.model;

import java.math.BigDecimal;
import javax.persistence.*;

@Table(name = "cw_working")
public class Working {
    @Id
    private Integer id;

    /**
     * 年月
     */
    @Column(name = "year_month")
    private String yearMonth;

    /**
     * 部门名称
     */
    @Column(name = "department_name")
    private String departmentName;

    @Column(name = "employee_name")
    private String employeeName;

    @Column(name = "project_name")
    private String projectName;

    /**
     * 工时
     */
    @Column(name = "working_hours")
    private BigDecimal workingHours;

    /**
     * 工时占比
     */
    @Column(name = "working_rate")
    private BigDecimal workingRate;

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
     * 获取年月
     *
     * @return year_month - 年月
     */
    public String getYearMonth() {
        return yearMonth;
    }

    /**
     * 设置年月
     *
     * @param yearMonth 年月
     */
    public void setYearMonth(String yearMonth) {
        this.yearMonth = yearMonth == null ? null : yearMonth.trim();
    }

    /**
     * 获取部门名称
     *
     * @return department_name - 部门名称
     */
    public String getDepartmentName() {
        return departmentName;
    }

    /**
     * 设置部门名称
     *
     * @param departmentName 部门名称
     */
    public void setDepartmentName(String departmentName) {
        this.departmentName = departmentName == null ? null : departmentName.trim();
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
     * @return project_name
     */
    public String getProjectName() {
        return projectName;
    }

    /**
     * @param projectName
     */
    public void setProjectName(String projectName) {
        this.projectName = projectName == null ? null : projectName.trim();
    }

    /**
     * 获取工时
     *
     * @return working_hours - 工时
     */
    public BigDecimal getWorkingHours() {
        return workingHours;
    }

    /**
     * 设置工时
     *
     * @param workingHours 工时
     */
    public void setWorkingHours(BigDecimal workingHours) {
        this.workingHours = workingHours;
    }

    /**
     * 获取工时占比
     *
     * @return working_rate - 工时占比
     */
    public BigDecimal getWorkingRate() {
        return workingRate;
    }

    /**
     * 设置工时占比
     *
     * @param workingRate 工时占比
     */
    public void setWorkingRate(BigDecimal workingRate) {
        this.workingRate = workingRate;
    }
    
    public Working clone() {
    	Working working = new Working();
    	working.yearMonth = this.yearMonth;
    	working.employeeName = this.employeeName;
    	working.departmentName = this.departmentName;
    	working.projectName = this.projectName;
    	working.workingRate = this.workingRate;
    	working.workingHours = this.workingHours;
    	return working;
    }
}