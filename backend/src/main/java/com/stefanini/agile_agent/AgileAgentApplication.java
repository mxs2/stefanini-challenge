package com.stefanini.agile_agent;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.cloud.openfeign.EnableFeignClients;

@SpringBootApplication
@EnableFeignClients
public class AgileAgentApplication {

	public static void main(String[] args) {
		SpringApplication.run(AgileAgentApplication.class, args);
	}

}
