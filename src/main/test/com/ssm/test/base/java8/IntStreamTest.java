package com.ssm.test.base.java8;/**
 * @author
 */

import java.util.stream.IntStream;

import org.junit.Test;

/**
 * @author
 * @description
 * @date 2021/6/4
 */
public class IntStreamTest {

    @Test
    public void rangeClose() {
        IntStream.rangeClosed(10, 200).forEach(x -> {
            System.out.println(x);
        });
        int sum = IntStream.generate(() -> 1).limit(1).sum();

    }
}
