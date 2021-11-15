package slo.historians.united.zgodovinskeslikicebackend.controllers;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class LobbyController {

    @GetMapping("/lobby")
    public String index() {
        return "Greetings from Spring Boot!";
    }

}