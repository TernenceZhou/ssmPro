package com.ssm.jikeLive.即可时间并发编程.lesson18;

import sun.misc.BASE64Decoder;

import java.io.BufferedInputStream;
import java.io.BufferedOutputStream;
import java.io.ByteArrayInputStream;
import java.io.File;
import java.io.FileOutputStream;
import java.io.IOException;
import java.util.concurrent.locks.StampedLock;
import java.util.regex.Pattern;

/**
 * @author
 * @description
 * 比semaphore读写锁 性能更好的读多写少锁
 * 支持悲观读 乐观读 写锁
 * @date 2019/10/25
 */
public class StampedLockDemo {


    private final StampedLock stampedLock = new StampedLock();


    public void beiguan(){
        //乐观读锁
        long optimisticRead = stampedLock.tryOptimisticRead();
        try {
            // false表示已经写锁发生过更改
            if(!stampedLock.validate(optimisticRead)) {
               //升级为悲观锁
                optimisticRead = stampedLock.readLock();
            }
        }finally {
            stampedLock.unlockRead(optimisticRead);
        }
    }

    public void read() {
        //stampLock读取/获取 读锁
        long readLock = stampedLock.tryReadLock();
        try {

        } finally {
            stampedLock.unlockRead(readLock);
        }


        //stampLock读取/获取 写锁
        long writeLock = stampedLock.writeLock();
        try {

        } finally {
            stampedLock.unlockWrite(writeLock);
        }
    }
}
