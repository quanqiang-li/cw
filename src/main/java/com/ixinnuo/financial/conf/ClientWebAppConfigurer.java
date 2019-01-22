package com.ixinnuo.financial.conf;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Configuration;
import org.springframework.format.FormatterRegistry;
import org.springframework.web.servlet.config.annotation.InterceptorRegistry;
import org.springframework.web.servlet.config.annotation.ResourceHandlerRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

/**
 * web相关配置
 * 
 * @author liqq
 *
 */
@Configuration
public class ClientWebAppConfigurer implements WebMvcConfigurer {

	@Autowired
	LoginInterceptor loginInterceptor;

	/**
	 * 注册资源,放行
	 */
	@Override
	public void addResourceHandlers(ResourceHandlerRegistry registry) {
		// swagger静态资源及对应的访问路径
		registry.addResourceHandler("swagger-ui.html").addResourceLocations("classpath:/META-INF/resources/");
		//jar包内的静态资源
		registry.addResourceHandler("/webjars/**").addResourceLocations("classpath:/META-INF/resources/webjars/");
		// 项目的静态资源及对应的访问路径,不再是默认的/**
		registry.addResourceHandler("/static/**").addResourceLocations("classpath:/static/");
		WebMvcConfigurer.super.addResourceHandlers(registry);
	}

	/**
	 * 注册登录拦截器,放行登录和注册两个接口
	 */
	@Override
	public void addInterceptors(InterceptorRegistry registry) {
		registry.addInterceptor(loginInterceptor).addPathPatterns("/**").excludePathPatterns("/", // 首页
				"/error", // 错误页
				"/swagger-resources/**", "/swagger-ui.html/**", // swagger
				"/kaptcha/**", // 图形验证码
				"/sms/**", // 短信验证码
				"/user/login", // 登录
				"/user/register", // 注册
				"/importData/*", // 注册
				"/user/retrievePassword", // 找回密码
				"/dictionary/getDictionaryInfoByCondition", //字典表数据
				"/static/**","/webjars/**");//静态资源
		WebMvcConfigurer.super.addInterceptors(registry);
	}

	/**
	 * 添加日期类型转换器
	 */
	@Override
	public void addFormatters(FormatterRegistry registry) {
		registry.addConverter(new StringToDateConverter());
		WebMvcConfigurer.super.addFormatters(registry);
	}

}
