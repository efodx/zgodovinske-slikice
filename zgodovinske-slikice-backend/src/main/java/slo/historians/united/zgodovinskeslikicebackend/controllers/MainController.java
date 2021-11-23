package slo.historians.united.zgodovinskeslikicebackend.controllers;


import org.apache.commons.io.IOUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.MediaType;
import org.springframework.util.StringUtils;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import slo.historians.united.zgodovinskeslikicebackend.services.GameService;
import slo.historians.united.zgodovinskeslikicebackend.services.GameStateDTO;
import slo.historians.united.zgodovinskeslikicebackend.utilities.FileUploadUtil;

import java.io.IOException;
import java.io.InputStream;
import java.nio.file.Path;
import java.util.Arrays;
import java.util.List;

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

    @PostMapping("/game/{gameId}/addCards")
    public void addCards(@PathVariable(value = "gameId") String gameId, @RequestParam String playerId,
                         @RequestParam List<String> questions, @RequestPart List<MultipartFile> files,
                         @RequestParam List<String> answers) throws IOException {
        for (int i = 0; i < questions.size(); i++) {
            gameService.addPlayerCard(gameId, playerId, files.get(i), questions.get(i), answers.get(i));
        }
    }

    @GetMapping(value = "/images/{name}",
            produces = MediaType.APPLICATION_OCTET_STREAM_VALUE)
    public @ResponseBody
    byte[] getImage(@PathVariable String name) throws IOException {
        String uploadDir = "user-photos/";
        return FileUploadUtil.readFile(uploadDir, name);
    }
}