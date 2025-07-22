package com.amchisa.lucidflow;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.data.web.config.EnableSpringDataWebSupport;

import static org.springframework.data.web.config.EnableSpringDataWebSupport.PageSerializationMode.VIA_DTO;

@SpringBootApplication
public class LucidFlowApplication {
	public static void main(String[] args) {
		SpringApplication.run(LucidFlowApplication.class, args);
	}
}
