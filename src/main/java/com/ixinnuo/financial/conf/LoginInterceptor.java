package com.ixinnuo.financial.conf;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.servlet.http.HttpSession;

import org.apache.commons.lang.StringUtils;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Component;
import org.springframework.web.servlet.HandlerInterceptor;
import org.springframework.web.servlet.ModelAndView;

import com.alibaba.fastjson.JSON;
import com.ixinnuo.financial.enumpackage.CommonEnum;
import com.ixinnuo.financial.framework.Code;
import com.ixinnuo.financial.framework.ReturnData;
import com.ixinnuo.financial.util.CommonTools;

/**
 * 登录拦截器
 * 
 * @author liqq
 *
 */
@Component
public class LoginInterceptor implements HandlerInterceptor {

	private final Logger logger = LoggerFactory.getLogger(this.getClass());
	

	/**
	 * 判断是否登录
	 */
	@Override
	public boolean preHandle(HttpServletRequest request, HttpServletResponse response, Object arg2) throws Exception {
		response.setCharacterEncoding("utf-8");
		String url = "" + (request.getRequestURL() == null ? "/" : request.getRequestURL()) + (request.getQueryString() == null ? "" : "?" + request.getQueryString());
		String referer = request.getHeader("referer");
		String clientIp = CommonTools.getIp(request);

		logger.info("\n\n\n\n\n\n#####进入拦截器###########");
		logger.info("[url]" + url);
		logger.info("[clientIp]" + clientIp);
		logger.info("[referer]" + referer);
		HttpSession session = request.getSession();
		// 这里的userToken是登陆时放入session的,对应的用户信息放入redis
		String userToken = (String) session.getAttribute(CommonEnum.LOGIN_SESSION_KEY.getString());
		// 如果没有登录,提示给调用者
		if (StringUtils.isBlank(userToken)) {
			ReturnData rd = new ReturnData(Code.NOT_LOGIN_ERROR);
			response.getWriter().write(JSON.toJSONString(rd));
			return false;
		}
		// 已登录正常放行
		return true;
	}

	@Override
	public void postHandle(HttpServletRequest arg0, HttpServletResponse arg1, Object arg2, ModelAndView arg3) throws Exception {
		// TODO Auto-generated method stub
	}

	@Override
	public void afterCompletion(HttpServletRequest arg0, HttpServletResponse arg1, Object arg2, Exception arg3) throws Exception {
		// TODO Auto-generated method stub
	}

}
