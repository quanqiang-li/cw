package com.ixinnuo.financial.conf;

import java.util.Properties;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.context.properties.EnableConfigurationProperties;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import com.google.code.kaptcha.Constants;
import com.google.code.kaptcha.impl.DefaultKaptcha;
import com.google.code.kaptcha.util.Config;

/**
 * 图形验证码配置类
 * @ClassName: KaptchaAutoConfiguration
 * @Description: TODO
 *
 */
@Configuration
@EnableConfigurationProperties(KaptchaProperties.class)
public class KaptchaAutoConfiguration {
    /**
     * kaptchaProperties
     */
    @Autowired
    private KaptchaProperties kaptchaProperties;
    
    /**
     * 
     * @Description: TODO
     * @return 返回验证码图形工厂类
     */
    @Bean(name = "kaptchaProducer")
    public DefaultKaptcha getKaptchaBean() {

        DefaultKaptcha defaultKaptcha = new DefaultKaptcha();
        Properties properties = new Properties();
        properties.setProperty(Constants.KAPTCHA_BORDER,
                kaptchaProperties.getBorder());
        properties.setProperty(Constants.KAPTCHA_BORDER_COLOR,
                kaptchaProperties.getBorderColor());
        properties.setProperty(Constants.KAPTCHA_TEXTPRODUCER_FONT_COLOR,
                kaptchaProperties.getTextProducerFontColor());
        properties.setProperty(Constants.KAPTCHA_TEXTPRODUCER_FONT_SIZE,
                kaptchaProperties.getTextProducerFontSize());
        properties.setProperty(Constants.KAPTCHA_TEXTPRODUCER_FONT_NAMES,
                kaptchaProperties.getTextProducerFontNames());
        properties.setProperty(Constants.KAPTCHA_TEXTPRODUCER_CHAR_LENGTH,
                kaptchaProperties.getTextProducerCharLength());
        properties.setProperty(Constants.KAPTCHA_IMAGE_WIDTH,
                kaptchaProperties.getImageWidth());
        properties.setProperty(Constants.KAPTCHA_IMAGE_HEIGHT,
                kaptchaProperties.getImageHeight());
        properties.setProperty(Constants.KAPTCHA_NOISE_COLOR,
                kaptchaProperties.getNoiseColor());
        /**
         * 去掉干扰线 
         *     properties.setProperty(Constants.KAPTCHA_NOISE_IMPL,
         *         kaptchaProperties.getNoiseImpl());
         */
        
        // 阴影渲染效果
        properties.setProperty(Constants.KAPTCHA_OBSCURIFICATOR_IMPL,
                kaptchaProperties.getObscurificatorImpl());
        properties.setProperty(Constants.KAPTCHA_SESSION_KEY,
                kaptchaProperties.getSessionKey());
        properties.setProperty(Constants.KAPTCHA_SESSION_DATE,
                kaptchaProperties.getSessionDate());
        Config config = new Config(properties);
        defaultKaptcha.setConfig(config);
        return defaultKaptcha;
    }

}
