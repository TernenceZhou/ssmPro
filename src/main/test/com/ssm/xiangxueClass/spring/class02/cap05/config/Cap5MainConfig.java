package com.ssm.xiangxueClass.spring.class02.cap05.config;

import com.ssm.xiangxueClass.spring.class01.cap1.Person;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Conditional;
import org.springframework.context.annotation.Configuration;
@Configuration
public class Cap5MainConfig {
	@Bean("person")
	public Person person(){
		System.out.println("给容器中添加person.......");
		return new Person("person",20);
	}

	@Conditional(WinCondition.class) //默认方式
	@Bean("lison")
	public Person lison(){
		System.out.println("给容器中添加lison.......");
		return new Person("Lison",58);
	}
	@Conditional(LinCondition.class)
	@Bean("james")//bean在容器中的ID为james, IOC容器MAP,  map.put("id",value)
	public Person james(){
		System.out.println("给容器中添加james.......");
		return new Person("james",20);
	}
	
}
