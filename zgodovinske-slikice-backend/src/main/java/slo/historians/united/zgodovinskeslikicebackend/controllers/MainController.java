package slo.historians.united.zgodovinskeslikicebackend.controllers;


import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.util.StringUtils;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import slo.historians.united.zgodovinskeslikicebackend.services.GameService;
import slo.historians.united.zgodovinskeslikicebackend.services.GameStateDTO;
import slo.historians.united.zgodovinskeslikicebackend.utilities.FileUploadUtil;

import java.io.IOException;

@RestController
public class MainController {

    @Autowired
    private GameService gameService;

    @GetMapping("/game/create")
    public String createGame() {
        return gameService.createGame();
    }

    @GetMapping("/game/{gameId}")
    public GameStateDTO showGame(@PathVariable(value = "gameId") String gameId) {
        return gameService.getGameState(gameId);
    }

    @PostMapping("/game/{gameId}/join")
    public String joinGame(@PathVariable(value = "gameId") String gameId, @RequestParam String playerName) {
        return gameService.addPlayer(gameId, playerName);
    }

    @GetMapping("/game/{gameId}/start")
    public void startGame(@PathVariable(value = "gameId") String gameId) {
        gameService.startGame(gameId);
    }

    @PostMapping("/game/{gameId}/answer")
    public void answer(@PathVariable(value = "gameId") String gameId, @RequestParam String playerId, @RequestParam String answer) {
        gameService.playerAnswer(gameId, playerId, answer);
    }

//    @PostMapping("/game/{gameId}/addCard")
//    public void addCard(@PathVariable(value = "gameId") String gameId, @RequestParam String playerId, @RequestParam String answer) {
//        gameService.addPlayerCard(gameId, playerId);
//    }

    @PostMapping("/game/{gameId}/addCard")
    public void addCardWithPicture(@PathVariable(value = "gameId") String gameId, @RequestParam String playerId, @RequestParam String answer, @RequestParam("image") MultipartFile multipartFile) throws IOException {
        String fileName = StringUtils.cleanPath(multipartFile.getOriginalFilename());

        String uploadDir = "user-photos/";
        FileUploadUtil.saveFile(uploadDir, fileName, multipartFile);
        gameService.addPlayerCard(gameId, playerId);
    }

}