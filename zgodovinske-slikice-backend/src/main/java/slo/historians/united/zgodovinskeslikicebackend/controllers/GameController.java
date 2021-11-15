package slo.historians.united.zgodovinskeslikicebackend.controllers;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController("game/")
public class GameController {


        @GetMapping("ayy")
        public String index() {
            return "Greetings from Spring Boot!";
        }

    }

