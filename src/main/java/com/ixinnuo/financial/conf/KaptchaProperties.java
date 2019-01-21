package com.ixinnuo.financial.conf;

import org.springframework.boot.context.properties.ConfigurationProperties;

/**
 * 图形验证码参数类
 * 
 * @ClassName: KaptchaProperties
 * @Description: TODO
 */
@ConfigurationProperties(prefix = "kaptcha")
public class KaptchaProperties {

    /**
     * border
     */
    private String border;

    /**
     * borderColor
     */
    private String borderColor;

    /**
     * textProducerFontColor
     */
    private String textProducerFontColor;

    /**
     * textProducerFontSize
     */
    private String textProducerFontSize;

    /**
     * textProducerFontNames
     */
    private String textProducerFontNames;

    /**
     * textProducerCharLength
     */
    private String textProducerCharLength;

    /**
     * imageWidth
     */
    private String imageWidth;

    /**
     * imageHeight
     */
    private String imageHeight;

    /**
     * noiseColor
     */
    private String noiseColor;

    /**
     * noiseImpl
     */
    private String noiseImpl;

    /**
     * obscurificatorImpl
     */
    private String obscurificatorImpl;

    /**
     * sessionKey
     */
    private String sessionKey;

    /**
     * sessionDate
     */
    private String sessionDate;

    public String getBorder() {
        return border;
    }

    public void setBorder(String border) {
        this.border = border;
    }

    public String getBorderColor() {
        return borderColor;
    }

    public void setBorderColor(String borderColor) {
        this.borderColor = borderColor;
    }

    public String getTextProducerFontColor() {
        return textProducerFontColor;
    }

    public void setTextProducerFontColor(String textProducerFontColor) {
        this.textProducerFontColor = textProducerFontColor;
    }

    public String getTextProducerFontSize() {
        return textProducerFontSize;
    }

    public void setTextProducerFontSize(String textProducerFontSize) {
        this.textProducerFontSize = textProducerFontSize;
    }

    public String getTextProducerFontNames() {
        return textProducerFontNames;
    }

    public void setTextProducerFontNames(String textProducerFontNames) {
        this.textProducerFontNames = textProducerFontNames;
    }

    public String getTextProducerCharLength() {
        return textProducerCharLength;
    }

    public void setTextProducerCharLength(String textProducerCharLength) {
        this.textProducerCharLength = textProducerCharLength;
    }

    public String getImageWidth() {
        return imageWidth;
    }

    public void setImageWidth(String imageWidth) {
        this.imageWidth = imageWidth;
    }

    public String getImageHeight() {
        return imageHeight;
    }

    public void setImageHeight(String imageHeight) {
        this.imageHeight = imageHeight;
    }

    public String getNoiseColor() {
        return noiseColor;
    }

    public void setNoiseColor(String noiseColor) {
        this.noiseColor = noiseColor;
    }

    public String getNoiseImpl() {
        return noiseImpl;
    }

    public void setNoiseImpl(String noiseImpl) {
        this.noiseImpl = noiseImpl;
    }

    public String getObscurificatorImpl() {
        return obscurificatorImpl;
    }

    public void setObscurificatorImpl(String obscurificatorImpl) {
        this.obscurificatorImpl = obscurificatorImpl;
    }

    public String getSessionKey() {
        return sessionKey;
    }

    public void setSessionKey(String sessionKey) {
        this.sessionKey = sessionKey;
    }

    public String getSessionDate() {
        return sessionDate;
    }

    public void setSessionDate(String sessionDate) {
        this.sessionDate = sessionDate;
    }

}
