package com.ssm.xiangxueClass.spring.class01.cap1;

import com.ssm.xiangxueClass.spring.class01.cap1.config.MainConfig;
import org.springframework.context.ApplicationContext;
import org.springframework.context.annotation.AnnotationConfigApplicationContext;

public class MainTest2 { 
	public static void main(String args[]){
		//把beans.xml的类加载到容器
		//ApplicationContext app = new ClassPathXmlApplicationContext("beans.xml");

		ApplicationContext app = new AnnotationConfigApplicationContext(MainConfig.class);

		//从容器中获取bean
		//Person person = (Person) app.getBean("person01");

		//System.out.println(person);

		String[] namesForBean = app.getBeanNamesForType(Person.class);
		for(String name:namesForBean){
			System.out.println(name);
		}
		
		
	}
}
