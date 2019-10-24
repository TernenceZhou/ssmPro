package com.ssm.xiangxueClass.spring.class04.cap09.bean;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.ComponentScan;
import org.springframework.stereotype.Component;

/**
 * @author
 * @description
 * @date 2019/10/23
 */

@Component
public class Sun {

    private Moon moon;

    //autowired可以用在任何方法上
    // 当spring创建对象时候 调用方法 完成赋值
    //方法里的参数会从 自定义类型的值会从IOC容器获取 方法中的moon从容器中取
    @Autowired
    public void setMoon(Moon moon) {
        this.moon = moon;
    }

    public Moon getMoon() {
        return moon;
    }



    @Override
    public String toString() {
        return "Sun{" +
                "moon=" + moon +
                '}';
    }
}
