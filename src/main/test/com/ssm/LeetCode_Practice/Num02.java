package com.ssm.LeetCode_Practice;

import org.junit.Test;

/**
 * @author
 * @description
 * mysql删除数据为什么表大小不会改变 因为删除数据数据库标记这个数据为可复用 ，比如删除id=5  新增一条id=5的 直接可以复用这个位置
 * 如果是6 就新建一个
 * 如果删除怎么表 那怎么表位置都变成可复用
 * 要达到改变 需要重建表  alter table T engine =InnoDB
 * @date 2019/6/24
 */
public class Num02 {

    @Test
    public void test(){
        ListNode l1 = new ListNode(444);
        ListNode l2 = new ListNode(555);
        ListNode node = addTwoNumbers(l1,l2);
        System.out.println(node.val);
    }
    public ListNode addTwoNumbers(ListNode l1, ListNode l2) {
        ListNode dummyHead = new ListNode(0);
        ListNode p = l1, q = l2, curr = dummyHead;
        int carry = 0;
        while (p != null || q != null) {
            int x = (p != null) ? p.val : 0;
            int y = (q != null) ? q.val : 0;
            int sum = carry + x + y;
            carry = sum / 10;
            curr.next = new ListNode(sum % 10);
            curr = curr.next;
            if (p != null) p = p.next;
            if (q != null) q = q.next;
        }
        if (carry > 0) {
            curr.next = new ListNode(carry);
        }
        return dummyHead.next;
    }
    class ListNode{
        int val;
        ListNode next;
        ListNode pre;

        public ListNode(int val) {
            this.val = val;
        }
    }
}
