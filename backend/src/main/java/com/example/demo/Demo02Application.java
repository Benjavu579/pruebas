package com.example.demo;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;

@SpringBootApplication
public class Demo02Application {

	public static void main(String[] args) {
		SpringApplication.run(Demo02Application.class, args);
	}

	@Bean
	public CommandLineRunner startupMessage() {
		return args -> {
			System.out.println("\n==========================================================");
			System.out.println("PROYECTO INICIADO CON EXITO");
			System.out.println("Frontend disponible en: http://localhost:4200");
			System.out.println("Backend disponible en:  http://localhost:8080/api/v1/alumnos/");
			// System.out.println("Base de Datos H2 en: http://localhost:8080/h2-console");
			// System.out.println("JDBC URL: jdbc:h2:mem:inspectoria_angular | User: Test |
			// Pass: 1234");
			System.out.println("==========================================================\n");
		};
	}
}
