package com.ssm.lagou.AOP;

/**
 * @author
 * @description
 * @date 2020/12/17
 */
public class Person {

    public Person findPerson() {
        Person person = new Person(1, "JDK");
        System.out.println("findPerson 被执行");
        return person;
    }

    public Person() {
    }

    public Person(Integer id, String name) {
        this.id = id;
        this.name = name;
    }

    private Integer id;
    private String name;

    public Integer getId() {
        return id;
    }

    public void setId(Integer id) {
        this.id = id;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }
}
