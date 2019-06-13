package com.ssm.test.tree;

import java.util.ArrayList;
import java.util.List;
import java.util.PriorityQueue;
import java.util.Stack;

/**
 * 二叉树的遍历 先 中 后序遍历
 * 非递归版本
 */
public class BinarySearchTree2 {

    public static void main(String[] args) {
        List<Integer> aa = new ArrayList<>();
        aa.add(0,1);
        aa.add(0,2);
        aa.add(0,3);
        for (Integer integer : aa) {
            System.out.println("aa "+ integer);
        }


//        List<Integer> integers = preorderTraversalTree(new Node(5));
        Node n = new Node(100);
        n.right = new Node(120);
        n.left = new Node(5);
        //xianxu2(n);
       // middile(n);
        List<Integer> integers =  houxu(n);
        //List<Integer> integers = middleorderTraversal(n);
        for (Integer integer : integers) {
            System.out.println("middleorderTraversal "+ integer);
        }
    }

    public void xianxu(Node node){
        if(node != null){
            System.out.println(node.data);
            xianxu(node.left);
            xianxu(node.right);

        }
    }

    public static void xianxu2(Node node) {
        Stack<Node> stack = new Stack<>();
        Node p = node;
        while (p != null || !stack.isEmpty()){
            while (p != null){
                stack.push(p);
                p = p.left;
            }
            if(!stack.isEmpty()){
                p = stack.pop();
                System.out.println("data:"+p.data);
                p = p.right;
            }
        }
    }
        // 非递归先序遍历
    public static void preorderTraversal(Node root) {
        // 用来暂存节点的栈
        Stack<Node> treeNodeStack = new Stack<Node>();
        // 新建一个游标节点为根节点
        Node node = root;
        // 当遍历到最后一个节点的时候，无论它的左右子树都为空，并且栈也为空
        // 所以，只要不同时满足这两点，都需要进入循环
        while (node != null || !treeNodeStack.isEmpty()) {
            // 若当前考查节点非空，则输出该节点的值
            // 由考查顺序得知，需要一直往左走
            while (node != null) {
                System.out.print(node.data + " ");
                // 为了之后能找到该节点的右子树，暂存该节点
                treeNodeStack.push(node);
                node = node.left;
            }
            // 一直到左子树为空，则开始考虑右子树
            // 如果栈已空，就不需要再考虑
            // 弹出栈顶元素，将游标等于该节点的右子树
            if (!treeNodeStack.isEmpty()) {
                node = treeNodeStack.pop();
                node = node.right;
            }
        }
    }


    // ---------------------------------------中序遍历
    /**
     * 非递归版本 中序遍历
     * @param root
     * @return
     */
    // 非递归中序遍历
    public static List<Integer> middleorderTraversal(Node root) {
        List<Integer> list = new ArrayList<>();

        Stack<Node> treeNodeStack = new Stack<Node>();
        Node node = root;
        while (node != null || !treeNodeStack.isEmpty()) {
            while (node != null) {
                treeNodeStack.push(node);
                node = node.left;
            }
            if (!treeNodeStack.isEmpty()) {
                node = treeNodeStack.pop();
//                list.add(node.data);
                System.out.print(node.data + " ");
                node = node.right;
            }
        }
        return list;
    }



    public static void first(Node root){
        PriorityQueue priorityQueue = new PriorityQueue();
        priorityQueue.add(1);

        Stack<Node> stack = new Stack<>();
        Node p = root;
        while (p != null || !stack.isEmpty()){
            while (p != null){
                stack.push(p);
                p = p.left;
            }
            if(!stack.isEmpty()){
                p = stack.pop();
                p = p.right;
            }
        }
    }

















        public static void middile(Node root){
        Stack<Node> stack = new Stack<>();
        Node cur = root;
        while (!(root == null && stack.isEmpty())){
            while (cur != null){
                stack.push(cur);
                cur = cur.left;
            }
            if(!stack.isEmpty()){
                cur = stack.pop();
                System.out.println("middile "+cur.data);
                cur = cur.right;
            }
        }
    }

    // --------------------------------------------------后序遍历



    public void houxubianli(Node node){
        Stack<Node> stack = new Stack<>();
        Node p = node;
        while (p != null){
            System.out.println(p.data);
            stack.push(p);
            p = p.left;
        }
        if(!stack.isEmpty()){
             p = stack.pop();
             p = p.right;

        }
    }






    /**
     * //非递归写法 后序遍历
     * @param root
     * @return
     */
    //写法(2)
    public List<Integer> postorderTraversal2(Node root) {
        List<Integer> res = new ArrayList<Integer>();
        if(root == null)
            return res;
        Stack<Node> stack = new Stack<Node>();
        Node pre = null;
        stack.push(root);
        while(!stack.isEmpty()){
            Node curr = stack.peek();
            if((curr.left == null && curr.right == null) ||
                    (pre != null && (pre == curr.left || pre == curr.right))){
                //如果当前结点左右子节点为空或上一个访问的结点为当前结点的子节点时，当前结点出栈
                res.add(curr.data);
                pre = curr;
                stack.pop();
            }else{
                if(curr.right != null) stack.push(curr.right); //先将右结点压栈
                if(curr.left != null) stack.push(curr.left);   //再将左结点入栈
            }
        }
        return res;
    }

    /**
     * 针对先序遍历的反转 后序遍历
     * @param root
     * @return
     */
    //方法(3)
    public static List<Integer> postorderTraversal3(Node root) {
        List<Integer> res = new ArrayList<Integer>();
        if(root == null)
            return res;
        Stack<Node> stack = new Stack<Node>();
        stack.push(root);
        while(!stack.isEmpty()){
            Node node = stack.pop();
            if(node.left != null) stack.push(node.left);//和传统先序遍历不一样，先将左结点入栈
            if(node.right != null) stack.push(node.right);//后将右结点入栈
//            System.out.println(node.data);
             res.add(0,node.data);                        //逆序添加结点值
        }
        return res;
    }

    public static List<Integer> houxu(Node root){
        Stack<Node> stack = new Stack<>();
        stack.push(root);
        List<Integer> res = new ArrayList<>();
        while (!stack.isEmpty()){
            Node node = stack.pop();
            if(node.left != null){stack.push(node.left);}
            if(node.right != null){stack.push(node.right);}
            res.add(0,node.data);
        }
        return res;
    }

    public static class Node {
        public int data;
        private Node left;
        private Node right;

        public Node(int data) {
            this.data = data;
        }
    }

}

