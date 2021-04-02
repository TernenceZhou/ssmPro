package com.ssm.guiguTest;

import java.util.concurrent.locks.Lock;
import java.util.concurrent.locks.ReadWriteLock;
import java.util.concurrent.locks.ReentrantReadWriteLock;

/**
 * 可重入的读写锁.
 */
@SuppressWarnings("AlibabaLockShouldWithTryFinally")
public class ReentrantReadWriteLockTest {

    ReadWriteLock readWriteLock = new ReentrantReadWriteLock();
    private final Lock writeLock = readWriteLock.writeLock();
    public final Lock readLock = readWriteLock.readLock();

    public static void main(String[] args) {

    }

    private void getDate() {
        writeLock.lock();
        try {

        } catch (Exception e) {

        } finally {
            writeLock.unlock();
        }

    }
}
