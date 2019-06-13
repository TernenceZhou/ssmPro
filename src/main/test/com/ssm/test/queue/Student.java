package com.ssm.test.queue;

import java.util.Comparator;

/**
 * @author
 * @description
 * @date 2019/6/6
 */
public class Student implements Comparable {
    private int score;
    private String name;

    public Student(int score, String name) {
        this.score = score;
        this.name = name;
    }

    public int getScore() {
        return score;
    }

    public void setScore(int score) {
        this.score = score;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    @Override
    public String toString() {
        return "Student{" +
                "score=" + score +
                ", name='" + name + '\'' +
                '}';
    }

    @Override
    public int compareTo(Object o) {
        Student s = (Student)o;
        if(s.getScore() > this.score){
            return 1;
        }else if(s.getScore() == this.score){
            return 0;
        }
        return -1;
    }
}
