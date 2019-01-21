package com.ixinnuo.financial.conf;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import springfox.documentation.builders.PathSelectors;
import springfox.documentation.builders.RequestHandlerSelectors;
import springfox.documentation.spi.DocumentationType;
import springfox.documentation.spring.web.plugins.Docket;
import springfox.documentation.swagger2.annotations.EnableSwagger2;

/**
 * 
 * @ClassName: SwaggerConfiguration api调试工具累
 * @Description: TODO
 *
 */
@Configuration
@EnableSwagger2
public class SwaggerConfiguration {

    /**
     * @Description: 调试用的工具
     * @return Docket
     */
    @Bean
    public Docket api() {
        return new Docket(
                // 选择那些路径和api会生成document
                DocumentationType.SWAGGER_2).select()
                        // 对所有api进行监控
                        .apis(RequestHandlerSelectors
                                .basePackage("com.ixinnuo.financial.controller"))
                        // 对所有路径进行监控
                        .paths(PathSelectors.any()).build();
    }

}
