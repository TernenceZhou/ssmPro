package com.ssm.test.base.exception;

import jdk.nashorn.internal.runtime.arrays.ArrayIndex;
import org.junit.Test;

import java.io.FileNotFoundException;
import java.io.IOException;

/**
 * @author
 * @description
 * @date 2019/8/1
 */
public class ExceptionDesc {

    @Test
    public void test(){
        Throwable throwable;
           Exception exception;
              RuntimeException runtimeException;
                 IndexOutOfBoundsException indexOutOfBoundsException;
                     ArrayIndexOutOfBoundsException arrayIndexOutOfBoundsException;
                 IllegalArgumentException illegalArgumentException;
                     NumberFormatException numberFormatException;
                 ArithmeticException arithmeticException;//算数
              IOException ioException;
                 FileNotFoundException fileNotFoundException;
           Error error;
              StackOverflowError stackOverflowError;
              OutOfMemoryError outOfMemoryError;

    }
}
