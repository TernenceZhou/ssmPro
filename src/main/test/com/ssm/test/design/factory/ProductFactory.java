package com.ssm.test.design.factory;

public class ProductFactory {

    public static IProduct create(String productName){
        if("A".equals(productName)){
            return new ProductA();
        }else if("B".equals(productName)){
            return new ProductB();
        }
        return null;
    }

    public static void main(String[] args) {
        IProduct a = ProductFactory.create("A");
        a.method();
        IProduct b = ProductFactory.create("B");
        b.method();
    }
}
