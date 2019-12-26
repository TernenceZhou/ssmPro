package com.ssm.test.base.log;


import org.apache.log4j.Level;
import org.apache.log4j.Logger;

/**
 * @author
 * @description
 * 验证我们的日志在什么级别下回打印
 * @date 2019/12/11
 */
public class LogClass {

    private static Logger log = Logger.getLogger(LogClass.class);

    public static void main(String[] args) {
        log.setLevel(Level.WARN);

        log.trace("Trace Message!");
        log.debug("Debug Message!");
        log.info("Info Message!");
        log.warn("Warn Message!");
        log.error("Error Message!");
        log.fatal("Fatal Message!");
    }
}
