package com.ssm.jikeLive.设计模式.lesson41;

import java.util.concurrent.atomic.AtomicLong;

/**
 * 单例模式的要点：
 * 构造函数是否是私有，保证了不同构造方式实例化.
 * 是否保证了线程安全
 * 是否是延迟加载 （非延迟加载可能会
 * 是否支持性能好 （是否加锁）
 *
 */
public class SingelDemo {

    public static void main(String[] args) throws InterruptedException {
        System.out.println("hello GC");
        SingleEnumInstance instance = SingleEnumInstance.INSTANCE;
        //Thread.sleep(Integer.MAX_VALUE);
        //-Xms10m -Xmx10m -XX:+PrintGCDetails
        byte by[] = new byte[50*1024*1024];

    }

    /**
     * 饿汉式的实现方式比较简单。
     * 在类加载的时候，instance 静态实例就已经创建并初始化好了，所以，instance 实例的创建过程是线程安全的。
     * 不过，这样的实现方式不支持延迟加载（在真正用到 IdGenerator 的时候，再创建实例），从名字中我们也可以看出这一点
     */
    private static final SingelDemo instance = new SingelDemo();

    private SingelDemo() {
    }

    public static SingelDemo getInstance() {
        return instance;
    }

}

/**
 * 懒汉式.
 * 缺点在于：
 * 在获取实例时 synchronized 加了一把大锁 并发度很低 相当于串行
 * 注意：
 * synchronized 是对象级别的锁
 * static synchronized 是属于类级别锁
 * <p>
 * https://www.cnblogs.com/shipengzhi/articles/2223100.html
 */
class SingelDemoLanhan {
    //饿汉式 记载的时候就创建好
    private static SingelDemoLanhan instance = null;

    private SingelDemoLanhan() {
    }

    //类级别锁 并发度低
    public static synchronized SingelDemoLanhan getInstance() {
        if (instance != null) {
            instance = new SingelDemoLanhan();
        }
        return instance;
    }
}

/**
 * 双重检测 支持延迟加载
 * 支持高并发情况
 */
class SingleDoubleCheck {
    private Object object = new Object();
    private static SingleDoubleCheck instance = null;

    private SingleDoubleCheck() {
    }

    public static SingleDoubleCheck getInstance() {
        if (instance == null) {
            synchronized (SingleDoubleCheck.class) //这里是类级别的锁
            {
                if (instance == null) {
                    instance = new SingleDoubleCheck();
                }
            }
        }
        return instance;
    }

}

/**
 * 通过内部静态类实现单例.
 * SingleStatic创建时候并
 */
class SingleStatic {

    private static class SingleHandler {
        private static final SingleStatic instance = new SingleStatic();
    }

    public static SingleStatic getInstance() {
        return SingleHandler.instance;
    }

}

/**
 * 枚举实现单例.
 */
enum SingleEnumInstance {
    INSTANCE;
    private AtomicLong id = new AtomicLong(0);

    public long getId() {
        return id.incrementAndGet();
    }
}
