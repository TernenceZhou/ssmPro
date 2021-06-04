package com.ssm.xiangxueClass.spring.class02.cap06.config;

import org.springframework.context.annotation.ImportSelector;
import org.springframework.core.type.AnnotationMetadata;

/**
 * @author
 * @description
 * 自定义实现ImportSelector
 * 是个接口返回导入的组件 全类名的数组
 * @date 2019/10/22
 */
public class MyImportSelector implements ImportSelector {
    @Override
    public String[] selectImports(AnnotationMetadata annotationMetadata) {
        return new String[]{"com.ssm.xiangxueClass.spring.class02.cap06.bean.Fish",
                "com.ssm.xiangxueClass.spring.class02.cap06.bean.Monkey"};
    }
}
