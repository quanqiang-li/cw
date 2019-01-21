package com.ixinnuo.financial.conf;

import org.springframework.boot.context.properties.ConfigurationProperties;

/**
 * 阿里数据库连接池参数类
 * 
 * @ClassName: DruidProperties
 * @Description: TODO
 */
@ConfigurationProperties(prefix = "druid")
public class DruidProperties {

    /**
     * url
     */
    private String url;

    /**
     * username
     */
    private String username;

    /**
     * password
     */
    private String password;

    /**
     * driverClass
     */
    private String driverClass;

    /**
     * maxActive
     */
    private int maxActive;

    /**
     * minIdle
     */
    private int minIdle;

    /**
     * initialSize
     */
    private int initialSize;

    /**
     * testOnBorrow
     */
    private boolean testOnBorrow;

    public String getUrl() {
        return url;
    }

    public void setUrl(String url) {
        this.url = url;
    }

    public String getUsername() {
        return username;
    }

    public void setUsername(String username) {
        this.username = username;
    }

    public String getPassword() {
        return password;
    }

    public void setPassword(String password) {
        this.password = password;
    }

    public String getDriverClass() {
        return driverClass;
    }

    public void setDriverClass(String driverClass) {
        this.driverClass = driverClass;
    }

    public int getMaxActive() {
        return maxActive;
    }

    public void setMaxActive(int maxActive) {
        this.maxActive = maxActive;
    }

    public int getMinIdle() {
        return minIdle;
    }

    public void setMinIdle(int minIdle) {
        this.minIdle = minIdle;
    }

    public int getInitialSize() {
        return initialSize;
    }

    public void setInitialSize(int initialSize) {
        this.initialSize = initialSize;
    }

    public boolean isTestOnBorrow() {
        return testOnBorrow;
    }

    public void setTestOnBorrow(boolean testOnBorrow) {
        this.testOnBorrow = testOnBorrow;
    }
}