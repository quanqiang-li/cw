package com.ixinnuo.financial.conf;

import org.springframework.boot.ApplicationArguments;
import org.springframework.boot.ApplicationRunner;
import org.springframework.stereotype.Component;
/**
 * 在项目启动之后要初始化的内容
 * @author liqq
 *
 */
@Component
public class ApplicationRunnerInit implements ApplicationRunner{

	
	@Override
	public void run(ApplicationArguments args) throws Exception {
		//加载省市区到redis
		
	}
}
