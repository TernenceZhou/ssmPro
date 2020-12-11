package com.ssm.guiguTest.mycache;

import java.util.concurrent.ConcurrentHashMap;
import java.util.concurrent.ConcurrentMap;

import lombok.Getter;
import lombok.Setter;

/**
 * 全局缓存类.
 */
@Getter
@Setter
public class GlobalCache {

    //全局缓存操作对象
    public static ConcurrentMap<String, Mycache> concurrentMap = new ConcurrentHashMap<>();


}
