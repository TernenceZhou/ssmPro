package com.ssm.test.HashCode_and_equals;

import java.security.Key;
import java.util.HashMap;

/**
 * @author
 * @description
 * 我们目的是使用map自定义对象做为key时 需要重写才能达到我们预期的目的
 * 测试重写equals和hashcode
 * 文章链接： https://mp.weixin.qq.com/s/PGWEBIyQsUaImmKFNa__Bw
 * @date 2019/7/3
 */
public class WithoutHashCode {
    static class Key {
        private Integer id;

        public Key(int id) {
            this.id = id;
        }

        public Integer getId() {
            return id;
        }

        @Override
        public int hashCode() {
            return id.hashCode();
        }

        @Override
        public boolean equals(Object obj) {
            if (obj == null && !(obj instanceof Key)) {
                return false;
            } else {
                return this.getId().equals(((Key) obj).getId());
            }

        }
    }
    public static void main(String[] args) {
        HashMap<Key,String> map = new HashMap();

        Key k1 = new Key(1);
        Key k2 = new Key(1);

//        System.out.println(k1 == k2);
//        System.out.println(k1.equals(k2));
//        System.out.println(3 <<2);
        System.out.println(-16>>>3);

        System.out.println(2>>31);


        int num = 0xFFFFFFE;
        System.out.println(num);



        map.put(k1,"put the k1 to map!");
        //在不重写equals时候我们并不能通过id相同去获取到map中的 k1,因为 hashmap自己计算hashcode值，因为不重写默认使用Object的hash值，但是object的hash值返回对象在内存的地址值
        //重写hashcode不代表对象相等 还要重写equals方法
        System.out.println(map.get(k2));
    }
}
