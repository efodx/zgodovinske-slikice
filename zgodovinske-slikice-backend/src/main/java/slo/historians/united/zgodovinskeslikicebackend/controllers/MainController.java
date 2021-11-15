package slo.historians.united.zgodovinskeslikicebackend.controllers;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RestController;
import slo.historians.united.zgodovinskeslikicebackend.services.GameService;

import java.util.List;

@RestController
public class MainController {

    @Autowired
    private GameService gameService;

    @GetMapping("/create")
    public void createGame() {
        gameService.createGame("1");
    }

    @GetMapping("/addPlayers")
    public void addPlayers() {
        gameService.addPlayer("1", "1");
        gameService.addPlayer("1", "2");
        gameService.addPlayer("1", "3");
        gameService.addPlayer("1", "4");
        gameService.addPlayer("1", "5");

        for (int i = 0; i < 11; i++) {
            gameService.addPlayerCard("1", "1");
            gameService.addPlayerCard("1", "2");
            gameService.addPlayerCard("1", "3");
            gameService.addPlayerCard("1", "4");
            gameService.addPlayerCard("1", "5");
        }
    }

    @GetMapping("/start")
    public void startGame() {
        gameService.startGame("1");
    }

    @GetMapping("/play")
    public void playGame() {
        gameService.playerAnswer("1","1","something");
        gameService.playerAnswer("1","2","something");
        gameService.playerAnswer("1","3","something");
        gameService.playerAnswer("1","4","something");
    }
    @GetMapping("/play5")
    public void playGame5() {
        gameService.playerAnswer("1","1","something");
        gameService.playerAnswer("1","2","something");
        gameService.playerAnswer("1","3","something");
        gameService.playerAnswer("1","5","something");
    }

    @GetMapping("/playsLeft")
    public long playsLeft() {
        return gameService.answersLeft("1");
    }

    @GetMapping("/currentAskingPlayer")
    public String currentAskingPlayer() {
        return gameService.currentAskingPlayer("1");
    }
}