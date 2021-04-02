package com.ssm.guiguTest.JVM;

import java.util.stream.IntStream;

/**
 * Escape.
 *
 * @author
 */
public class EscapeAnalysis {

    public static void main(String[] args) {
        alloc();
    }

    private static void alloc() {
        Point point = new Point(1, 2);
        System.out.println("point.x=" + point.x + "; point.y=" + point.y);
        //循环多次
        //IntStream.rangeClosed(1, 1000).forEach(x -> System.out.println(x));
        IntStream.rangeClosed(1, 1000).parallel().forEach(i -> System.out.println(i));
    }

    static class Point {
        private int x;
        private int y;

        public Point(int x, int y) {
            this.x = x;
            this.y = y;
        }

        public int getX() {
            return x;
        }

        public void setX(int x) {
            this.x = x;
        }

        public int getY() {
            return y;
        }

        public void setY(int y) {
            this.y = y;
        }
    }
}
