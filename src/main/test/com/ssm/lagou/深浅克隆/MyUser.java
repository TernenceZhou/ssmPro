package com.ssm.lagou.深浅克隆;

public class MyUser implements Cloneable{


    private String name;
    private int age;
    private Address address;

    public MyUser(String name, int age, Address address) {
        this.name = name;
        this.age = age;
        this.address = address;
    }

    @Override
    public MyUser clone() throws CloneNotSupportedException {
        MyUser user = (MyUser) super.clone();
        Address address = (Address) this.address.clone();
        user.setAddress(address);
        return user;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public int getAge() {
        return age;
    }

    public void setAge(int age) {
        this.age = age;
    }

    public Address getAddress() {
        return address;
    }

    public void setAddress(Address address) {
        this.address = address;
    }


}
