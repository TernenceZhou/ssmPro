package com.ssm.test.design.factory2;

public class BuldLight implements Light{
    @Override
    public void turnOn() {
        System.out.println("BuldLight On");
    }

    @Override
    public void turnOff() {
        System.out.println("BuldLight Off");
    }
}
