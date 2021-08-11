package com.ssm.msb.juc;/**
 * @author
 */

import java.io.IOException;
import java.io.UnsupportedEncodingException;
import java.net.URLDecoder;
import java.net.URLEncoder;
import java.util.concurrent.CountDownLatch;

import com.alibaba.fastjson.JSON;
import com.alibaba.fastjson.JSONObject;
import com.fasterxml.jackson.databind.ObjectMapper;

/**
 *@author
 *@description
 *@date 2021/7/5
 */
public class CountDownLatch_001 {


    static CountDownLatch latch = new CountDownLatch(2);

    public static void main(String[] args) throws IOException, InterruptedException {

        latch.countDown();
        System.out.println(latch.getCount());
        latch.countDown();
        System.out.println(latch.getCount());
        latch.await();

        System.out.println("latch end");



    }
}
