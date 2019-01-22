package com.ixinnuo.financial;

import java.util.Arrays;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.ConfigurableApplicationContext;
import org.springframework.stereotype.Controller;
import org.springframework.transaction.annotation.EnableTransactionManagement;
import org.springframework.web.bind.annotation.RequestMapping;

import tk.mybatis.spring.annotation.MapperScan;

/**
 * springboot 官方文档：
 * http://docs.spring.io/spring-boot/docs/current/reference/htmlsingle/
 * @author zhangkm
 *
 */
//springboot在/static, /public, META-INF/resources, /resources等存放静态资源的目录
@Controller
@SpringBootApplication
@MapperScan(basePackages = "com.ixinnuo.financial.dao.mysql")
@EnableTransactionManagement
public class Application {
	private static Logger logger = LoggerFactory.getLogger(Application.class);

    /**
     * 工程程序入口
     * @Description: 工程程序入口
     * @param args 启动参数
     */
    public static void main(String[] args) {
        ConfigurableApplicationContext run = SpringApplication.run(Application.class, args);
        String[] activeProfiles = run.getEnvironment().getActiveProfiles();
        logger.info("系统启动使用的profile为{}",Arrays.deepToString(activeProfiles));
    }

    @RequestMapping("/")
    String home() {
       //return "redirect:/swagger-ui.html";
       return "redirect:/static/html/hello.html";
    }
    
}