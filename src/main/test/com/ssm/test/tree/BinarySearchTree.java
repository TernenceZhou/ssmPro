package com.ssm.test.tree;

import java.util.ArrayList;
import java.util.List;
import java.util.Stack;

/**
 * 二叉树的遍历 先 中 后
 */
public class BinarySearchTree {

    public static void main(String[] args) {
//        List<Integer> integers = preorderTraversalTree(new Node(5));
        List<Integer> integers = postorderTraversal(new Node(5));
        preTraverseBTree(new Node(5));
        for (Integer integer : integers) {
            System.out.println(integer);
        }
    }

    /**
     * 递归先序遍历
     * @param rootTreeNode  根节点
     */
    public static void preTraverseBTree(Node rootTreeNode) {

        if (rootTreeNode != null) {

            //访问根节点
            System.out.println(rootTreeNode.data);

            //访问左节点
            preTraverseBTree(rootTreeNode.left);

            //访问右节点
            preTraverseBTree(rootTreeNode.right);
        }
    }

    /**
     * 非递归先序遍历
     *
     * @param root
     * @return
     */
    public static List<Integer> preorderTraversalTree(Node root) {
        Stack<Node> stack = new Stack<Node>(); //用栈的先进后出来模拟右子树的根节点的存取顺序
        List<Integer> list = new ArrayList<Integer>();
        Node r = root;   //r表示当前的根节点
        while (r != null || !stack.isEmpty()) { //如果当前根节点为空且 栈中不含右子树 则表明已经遍历完了
            if (r == null) {     //此前r=r.left 当左子树为空的时候则当前的根节点设置为栈顶的右子树的根节点
                r = stack.pop();
            }
            if (r.right != null) {
                stack.push(r.right); //如果存在右子树 则将其根节点压栈
            }
            list.add(r.data); //将当前遍历到的结点加入到list结合
            r = r.left;   //将左子树的根节点变成当前的根节点
        }
        return list;
    }

    // ---------------------------------------中序遍历
    /**
     * 递归版本的中序遍历
     */
    List<Integer> list = new ArrayList<>();
    public List<Integer> inorderTraversal1(Node root) {
        inOrder(root);
        return list;
    }
    public void inOrder(Node node) {
        if (node == null) {
            return;
        }
        inOrder(node.left);
        list.add(node.data);
        inOrder(node.right);
    }

    /**
     * 非递归版本 中序遍历
     * @param root
     * @return
     */
    public List<Integer> inorderTraversal(Node root) {
        List<Integer> list = new ArrayList<>();
        Stack<Node> s = new Stack<>();
        Node curr = root;
        while(!(curr == null && s.isEmpty())){ //当前节点为空，并且栈空的时候，结束遍历
            if(curr != null){
                s.push(curr);           //如果当前节点不为空，就入栈
                curr = curr.left;       //先遍历左子树
            }else{
                curr = s.pop();         //如果当前节点为空了，就出栈，curr指向要出栈的那个节点，即要开始返回了
                list.add(curr.data);     //从左子树返回的时候，把节点值放入数组
                curr = curr.right;      //遍历右子树
            }
        }
        return list;
    }
    // --------------------------------------------------后序遍历
    //写法(1)
    /**
     * 递归写法 后序遍历
     */
    public static List<Integer> res = new ArrayList<Integer>();

    public static List<Integer> postorderTraversal(Node root) {//递归写法
        if (root == null)
            return res;
        postorderTraversal(root.left);
        postorderTraversal(root.right);
        res.add(root.data);
        return res;
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
    public List<Integer> postorderTraversal3(Node root) {
        List<Integer> res = new ArrayList<Integer>();
        if(root == null)
            return res;
        Stack<Node> stack = new Stack<Node>();
        stack.push(root);
        while(!stack.isEmpty()){
            Node node = stack.pop();
            if(node.left != null) stack.push(node.left);//和传统先序遍历不一样，先将左结点入栈
            if(node.right != null) stack.push(node.right);//后将右结点入栈
            res.add(0,node.data);                        //逆序添加结点值
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

