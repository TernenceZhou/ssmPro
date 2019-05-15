package com.ssm.test.design.factory2;

/**
 * 指定产品的具体工厂。
 */
public class TubeLightCreator implements Creator{
    @Override
    public Light createLight() {
        return new TubeLight();
    }
}
