package com.ssm.controller.base;

import com.ssm.common.util.IpUtil;
import com.ssm.model.result.ResponseResult;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.MessageSource;
import org.springframework.context.i18n.LocaleContextHolder;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.context.request.RequestContextHolder;
import org.springframework.web.context.request.ServletRequestAttributes;

import javax.servlet.http.HttpServletRequest;

/**
 * 控制器基类
 */
public class BaseController {

    private static  final  Logger logger = LoggerFactory.getLogger(BaseController.class);
    @Autowired
    private MessageSource messageSource;


    @ExceptionHandler(Exception.class)
    public ResponseResult getError(Exception e){
        logger.error("Exception:",e);
        return new ResponseResult(ResponseResult.FAILD,messageSource.getMessage(ResponseResult.FAILD,null,
                LocaleContextHolder.getLocale()));
    }

    /**
     * 统一返回正常结果
     * @param obj
     * @return
     */
    public ResponseResult getResult(Object obj){
        return new ResponseResult(ResponseResult.SUCCESS,messageSource.getMessage(ResponseResult.SUCCESS,null,
                LocaleContextHolder.getLocale()),obj);
    }
    /***
     *
     * 功能描述: 统一获取Request<br>
     * 〈功能详细描述〉
     *
     * @return
     * @see [相关类/方法](可选)
     * @since [产品/模块版本](可选)
     */
    protected HttpServletRequest getRequest(){
        HttpServletRequest request = ((ServletRequestAttributes) RequestContextHolder.getRequestAttributes()).getRequest();
        return request;
    }
    /**
     * 获取用户IP
     */
    protected String getUserIpAddr(){
        return IpUtil.getUserIpAddr(getRequest());
    }
}
