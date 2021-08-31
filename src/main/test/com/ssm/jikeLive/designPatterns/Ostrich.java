package com.ssm.jikeLive.designPatterns;

/**
 * 鸵鸟
 */
public class Ostrich implements Tweetable,Eggable{


    Tweetability tweetability = new Tweetability();
    EggAbility eggAbility = new EggAbility();

    @Override
    public void egg() {
        eggAbility.egg();
    }

    @Override
    public void tweet() {
        tweetability.tweet();
    }
}
