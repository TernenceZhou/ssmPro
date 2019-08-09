06 | 用“等待-通知”机制优化循环等待

https://time.geekbang.org/column/article/85241


ques:
    sleep()和wati()的区别？
    共同：都可以让出cpu时间，线程等待再次调度
    不同：
          1、sleep不释放锁资源，其他线程仍然不能访问共享数据。而wait可以。
          2、sleep属于Thread()类的，wait 是object类下的
          3、wait只能在同步方法和同步块中使用，而sleep任何地方都可以
          # 3、sleep需要捕获异常，而wait 不会(都抛出InterruptedException ，wait也需要捕获异常)
          4、sleep 必须传递参数时间值
         wait之后调用线程进入互斥所等待队列，直到notify唤醒。notify()会从互斥锁等待队列中任意放一个线程进入锁标志池，它们随时准备争夺锁的拥有权
         如果代用notifyAll之后。互斥锁等待的所有的线程都进入到锁标志等待池，等待申请锁资源