package com.ssm.test.base;

/**
 * @author
 * @description
 * @date 2019/9/6
 */
public class EqualTest {
    public static void main(String[] args) {
        String a = "1";
        String b = "1";
        System.out.println(a==b);
        System.out.println("a.equals(b):"+a.equals(b)+"    "+a.hashCode() +"-----"+b.hashCode());
        Integer i = new Integer(1);
        Integer ii = new Integer(1);
        System.out.println(i == ii);
        System.out.println(i.equals(ii)+""+i.hashCode()+"----"+ii.hashCode());
        System.out.println();
        Person p1 = new Person(10,"张三");
        Person p2 = new Person(10,"张三");
        System.out.println(p1.hashCode() == p2.hashCode());
        System.out.println(p1.equals(p2));
        System.out.println(p1 == p2);

    }
    static class Person{
        int age;
        String name;
        public Person(int age, String name) {
            super();
            this.age = age;
            this.name = name;
        }
        public int getAge() {
            return age;
        }
        public void setAge(int age) {
            this.age = age;
        }
        public String getName() {
            return name;
        }
        public void setName(String name) {
            this.name = name;
        }

        @Override
        public boolean equals(Object obj) {
            if (this == obj)
                return true;
            if (obj == null)
                return false;
            if (getClass() != obj.getClass())
                return false;
            Person other = (Person) obj;
            if (age != other.age)
                return false;
            if (name == null) {
                if (other.name != null)
                    return false;
            } else if (!name.equals(other.name))
                return false;
            return true;
        }
    }


}
