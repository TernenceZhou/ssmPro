package com.ssm.guiguTest.mycache;

import lombok.Getter;
import lombok.Setter;

/**
 * 缓存实体类.
 */

@Getter
@Setter
public class Mycache {

    private Object key;

    private Object value;

    //过期时间
    private long expireTime;

    //写入时间
    private long writeTime;


}
