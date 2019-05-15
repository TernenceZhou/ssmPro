package com.ssm.test.design.factory2;

public class TubeLight implements Light{
    @Override
    public void turnOn() {
        System.out.println("TubeLight On");
    }

    @Override
    public void turnOff() {
        System.out.println("TubeLight Off");
    }
}
