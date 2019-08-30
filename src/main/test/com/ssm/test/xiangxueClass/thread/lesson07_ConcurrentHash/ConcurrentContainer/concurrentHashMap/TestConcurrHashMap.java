package com.ssm.test.xiangxueClass.thread.lesson07_ConcurrentHash.ConcurrentContainer.concurrentHashMap;

import org.junit.Test;

import java.util.HashMap;
import java.util.concurrent.ConcurrentHashMap;

/**
 * @author
 * @description
 * @date 2019/8/29
 */
public class TestConcurrHashMap {
    /**
     * put操作key 是旧值:
     * Hashmap 、ConcurrentHashMap中如果多次k相同put时候，
     * 会返回上一次的value，然后链表上追加新值
     *
     * put操作key 是新值:
     * 会直接定位到存储地址后 ，元素加入到tables 然后 查看是否需要扩容
     * 然后把key作为新链表的头结点 存入value新值
     *
     * segement:hash 再hash后的再散列值， 取再散列值得高位后取模
     *
     */
    @Test
    public void con(){
        ConcurrentHashMap concurrentHashMap = new ConcurrentHashMap(5);
        HashMap hashMap = new HashMap();
        System.out.println(
                concurrentHashMap.put("1",2)
                        +" ---- "+
                        concurrentHashMap.put("1",3)
                        +" ---- "+
                        concurrentHashMap.get("1")
        );
        System.out.println(
                hashMap.put("1",2)
                        +" ---- "+
                        hashMap.put("1",3)
                        +" ---- "+
                        hashMap.get("1")
        );
//        concurrentHashMap.put("1",2);
//        concurrentHashMap.put("1",2);


    }
}
