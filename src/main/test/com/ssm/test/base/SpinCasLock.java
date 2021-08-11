package com.ssm.test.base;

import lombok.extern.slf4j.Slf4j;

import java.util.Objects;
import java.util.UUID;
import java.util.concurrent.ConcurrentHashMap;

/**
 * @description: todo
 * @author: huangzhiyou
 * @create: 2021-06-18 09:18
 */
@Slf4j
public class SpinCasLock {
    private final ConcurrentHashMap<String, String> lockContainer = new ConcurrentHashMap<>(256);

    private SpinCasLock() {
    }

    /*单例化*/
    private static class SpinCasLockHolder {
        public static SpinCasLock spinCasLock = new SpinCasLock();
    }

    public static SpinCasLock getInstance() {
        return SpinCasLockHolder.spinCasLock;
    }

    public boolean lock(String key, String value, boolean must) {

        do {
            if (Objects.isNull(lockContainer.putIfAbsent(key, value))) {
                log.info("[{}]锁上锁成功", key);
                return true;
            }
        } while (must);

        log.info("[{}]锁上锁失败", key);
        return false;
    }

    public boolean lock(String key, String value) {

        return lock(key, value, true);
    }

    public void unlock(String key, String value) {
        String lockValue = lockContainer.get(key);
        if (Objects.isNull(lockValue) || lockValue.equals(value)) {
            lockContainer.remove(key);
            log.info("[{}]锁已经解锁成功", key);
        }
    }

    public static void main(String[] args) {
        SpinCasLock lock = SpinCasLock.getInstance();

        for (int i = 0; i < 10; i++) {
            String uuid = UUID.randomUUID().toString().replace("-", "");
            for (int j = 0; j < 10; j++) {
               new Thread(()->{
                   String lockKey = "test:lock:" + uuid;
                   try {
                       lock.lock(lockKey, uuid,false);
                   } catch (Exception e) {
                       throw e;
                   } finally {
                       lock.unlock(lockKey, uuid);
                   }
               }).start();
            }
        }
    }
}
