package com.ssm.test.queue;

/**
 * @author
 * @description
 * @date 2019/6/6
 */
public class Student2 {
    private int score;
    private String name;

    public Student2(int score, String name) {
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


}
