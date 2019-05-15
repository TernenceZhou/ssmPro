package com.ssm.test.design.factory2;

public class Test {
    public static void main(String[] args) {
        Creator creator = new BuildLightCreator();
        Light light = creator.createLight();
        light.turnOff();
        light.turnOn();

        creator = new TubeLightCreator();
        Light creatorLight = creator.createLight();
        creatorLight.turnOn();
        creatorLight.turnOff();

    }
}
