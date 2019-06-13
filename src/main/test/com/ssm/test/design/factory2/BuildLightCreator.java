package com.ssm.test.design.factory2;

/**
 * 指定产品的具体工厂。
 */
public class BuildLightCreator implements Creator{
    @Override
    public Light createLight() {
     /*   Map map = new HashMap();
        List list = new ArrayList();
        list.iterator();*/

        return new BuldLight();
    }
}
