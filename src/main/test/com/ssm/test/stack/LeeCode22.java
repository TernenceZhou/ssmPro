package com.ssm.test.stack;

import java.util.HashMap;
import java.util.Stack;

/**
 * @author
 * @description
 * 给定一个只包括 '('，')'，'{'，'}'，'['，']' 的字符串，判断字符串是否有效。
 * 有效字符串需满足：
 * 左括号必须用相同类型的右括号闭合。
 * 左括号必须以正确的顺序闭合。
 * 注意空字符串可被认为是有效字符串
 * @date 2019/5/15
 */
public class LeeCode22 {

    // Hash table that takes care of the mappings.
    private HashMap<Character, Character> mappings;

    // Initialize hash map with mappings. This simply makes the code easier to read.
    public LeeCode22() {
        this.mappings = new HashMap<Character, Character>();
        this.mappings.put(')', '(');
        this.mappings.put('}', '{');
        this.mappings.put(']', '[');
    }

    public boolean isValid(String s) {
        //初始化栈
        Stack<Character> stack = new Stack<Character>();

        for (int i = 0; i < s.length(); i++) {
            char c = s.charAt(i);

            // If the current character is a closing bracket.
            if (this.mappings.containsKey(c)) {

                // Get the top element of the stack. If the stack is empty, set a dummy value of '#'
                char topElement = stack.empty() ? '#' : stack.pop();

                // If the mapping for this bracket doesn't match the stack's top element, return false.
                if (topElement != this.mappings.get(c)) {
                    return false;
                }
            } else {
                // If it was an opening bracket, push to the stack.
                stack.push(c);
            }
        }

        // If the stack still contains elements, then it is an invalid expression.
        return stack.isEmpty();
    }

    /**
     * 栈字符判断方法2
     * @param s
     * @return
     */
    public boolean isValid2(String s) {
        Stack<Character> stack = new Stack<>();
        char[] chars = s.toCharArray();
        for (char aChar : chars) {
            if (stack.size() == 0) {
                stack.push(aChar);
                //stack.peek() 返回栈顶元素但不移除栈顶数据 （最后一个）
            } else if (isSym(stack.peek(), aChar)) {
                stack.pop();
            } else {
                stack.push(aChar);
            }
        }
        return stack.size() == 0;
    }


    public boolean valid(String str){
        Stack<Character> stack = new Stack<>();
        char[] chars = str.toCharArray();
        for (char aChar : chars) {
            if(stack.size() == 0){
                stack.push(aChar);
            }else if (isSym(stack.peek(),aChar)){
                stack.pop(); //当第二个字符和第一个字符是一对 就要删除栈顶元素
            }else {
                stack.push(aChar);
            }
        }
        return stack.size() == 0;
    }

    private boolean isSym(char c1, char c2) {
        return (c1 == '(' && c2 == ')') || (c1 == '[' && c2 == ']') || (c1 == '{' && c2 == '}');
    }
    public static void main(String[] args) {
        LeeCode22 leeCode22 = new LeeCode22();
        boolean valid = leeCode22.isValid("(()[])");
        boolean valid2= leeCode22.isValid2("[)");
        System.out.println( valid +"    "+valid2);
    }

}
