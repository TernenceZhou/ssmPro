package com.ssm.jikeLive.即可时间并发编程.lesson16;

import java.util.ArrayList;
import java.util.List;
import java.util.Vector;
import java.util.concurrent.Semaphore;
import java.util.function.Function;

import javax.validation.constraints.NotNull;

/**
 * @author
 * @description
 *
 * @date 2019/10/11
 */
public class SemaphorePool {


    class ObjPool<T, R> {

        final List<T> pool;
        // 用信号量实现限流器
        final Semaphore sem;
        // 构造函数
        ObjPool(int size, T t){
            pool = new Vector<T>(){};
            for(int i=0; i<size; i++){
                pool.add(t);
            }
            sem = new Semaphore(size);
        }
        // 利用对象池的对象，调用 func
        R exec(Function<T,R> func) throws InterruptedException {
            T t = null;
            sem.acquire();
            try {
                t = pool.remove(0);
                return func.apply(t);
            } finally {
                pool.add(t);
                sem.release();
            }
        }
    }

    static class Food {

        public String name;

        private long warmTime;

        public Food(String name, long warmTime) {
            this.name = name;
            this.warmTime = warmTime;
        }

        public String getName() {
            return name;
        }

        public long getWarmTime() {
            return warmTime;
        }
    }
    static class MicrowaveOven {

        public String name;

        public MicrowaveOven(String name) {
            this.name = name;
        }

        public Food warm(Food food) {
            long second = food.getWarmTime() * 1000;
            try {
                Thread.sleep(second);
            } catch (InterruptedException e) {
                e.printStackTrace();
            }

            System.out.println(String.format("%s warm %s %d seconds food.", name,food.getName() ,food.getWarmTime()));
            return food;
        }

        public String getName() {
            return name;
        }
    }
    static class MicrowaveOvenPool {

        private List<MicrowaveOven> microwaveOvens;

        private Semaphore semaphore;

        public MicrowaveOvenPool(int size,@NotNull List<MicrowaveOven> microwaveOvens) {
            this.microwaveOvens = new Vector<>(microwaveOvens);
            this.semaphore = new Semaphore(size);
        }
        public Food exec(Function<MicrowaveOven, Food> func) {
            MicrowaveOven microwaveOven = null;
            try{
                semaphore.acquire();
                microwaveOven = microwaveOvens.remove(0);
                return func.apply(microwaveOven);
            }catch (InterruptedException e) {
                e.printStackTrace();
            } finally {
                microwaveOvens.add(microwaveOven);
                semaphore.release();
            }
            return null;
        }
    }

    public static void main(String[] args) {
        List<MicrowaveOven> microwaveOvensn = new ArrayList<>();
        MicrowaveOven m1 = new MicrowaveOven("苹果");
        MicrowaveOven m2 = new MicrowaveOven("梨子");
        microwaveOvensn.add(m1);
        microwaveOvensn.add(m2);

        Food food = new Food("苹果",1);
        MicrowaveOvenPool pool = new MicrowaveOvenPool(10,microwaveOvensn);
        pool.exec(t->{
            //System.out.println(t.warm(food));
            return t.warm(food);
        });
    }
}
