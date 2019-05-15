package com.ssm.test.design.factory2;

import java.sql.Driver;
import java.sql.DriverManager;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

/**
 * 指定产品的具体工厂。
 */
public class BuildLightCreator implements Creator{
    @Override
    public Light createLight() {
        Map map = new HashMap();
        List list = new ArrayList();
        list.iterator();

        return new BuldLight();
    }
}
