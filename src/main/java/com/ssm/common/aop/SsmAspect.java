package com.ssm.common.aop;

import com.ssm.controller.base.BaseController;
import org.aspectj.lang.JoinPoint;
import org.aspectj.lang.annotation.AfterReturning;
import org.aspectj.lang.annotation.Aspect;
import org.aspectj.lang.annotation.Before;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Component;

@Component
@Aspect
public class SsmAspect {
    private static  final Logger logger = LoggerFactory.getLogger(BaseController.class);

    @Before(value = "execution(public * com.ssm.controller.*.*(..))" )
    public void beforeShow(JoinPoint jp) {
        String className = jp.getThis().toString();
        String methodName = jp.getSignature().getName();
        logger.info("执行方法：类"+className+"，方法："+methodName);
    }

//    @AfterReturning(value="execution(* com.ssm.service.impl.UserServiceImpl.login(..))",returning = "returnVal")
//    public User AfterReturning(JoinPoint joinPoint,Object returnVal){
//        User user = (User) returnVal;
//        user.setAccount(DigestUtils.md5DigestAsHex(user.getAccount().getBytes()));
//        return user;
//    }
}
