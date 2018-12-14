package com.ssm.test.HashCode_and_equals;

public class Student {
    private int age;
    private String name;

    public Student() {
    }
    public Student(int age, String name) {
        super();
        this.age = age;
        this.name = name;
    }
    public int getAge() {
        return age;
    }
    public String getName() {
        return name;
    }
    public void setAge(int age) {
        this.age = age;
    }
    public void setName(String name) {
        this.name = name;
    }

    @Override
    public boolean equals(Object obj) {
        if(! (obj instanceof Student)){
            return false;
        }
       Student stu =  (Student) obj;
       /* if(!(this.age == stu.age)){
            return false;
        }else {
            return true;
        }*/
        if(this.getName().equals(stu.getName()) && (this.age == stu.age)){
            return true;
        }else {
            return false;
        }

    }

    @Override
    public int hashCode() {
        int result = name.hashCode() + getAge();
        return result;
    }
}
