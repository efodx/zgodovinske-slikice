package slo.historians.united.zgodovinskeslikicebackend.controllers;


import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.MediaType;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import slo.historians.united.zgodovinskeslikicebackend.game.HistoryEntry;
import slo.historians.united.zgodovinskeslikicebackend.services.GameService;
import slo.historians.united.zgodovinskeslikicebackend.services.GameStateDTO;
import slo.historians.united.zgodovinskeslikicebackend.utilities.ImagesUtil;

import java.io.IOException;
import java.nio.file.NoSuchFileException;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@RestController
public class MainController {

    @Autowired
    private GameService gameService;

    @GetMapping("/game/create")
    public String createGame() {
        return gameService.createGame();
    }

    @GetMapping("/game/{gameId}")
    public GameStateDTO showGame(@PathVariable(value = "gameId") String gameId, @RequestParam Optional<String> playerId) {
        playerId.ifPresent(p->gameService.stillActive(gameId,p));
        return gameService.getGameState(gameId);
    }

    @GetMapping("/game/{gameId}/history")
    public List<HistoryEntry> gameHistory(@PathVariable(value = "gameId") String gameId) {
        return gameService.getHistory(gameId);
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

    @PostMapping("/game/{gameId}/addCards")
    public void addCards(@PathVariable(value = "gameId") String gameId, @RequestParam String playerId,
                         @RequestParam List<String> questions, @RequestPart List<MultipartFile> files,
                         @RequestParam List<String> answers) throws IOException {
        gameService.addPlayerCards(gameId, playerId, files, questions, answers);
    }

    @PostMapping("/game/{gameId}/acceptAnswers")
    public void acceptAnswer(@PathVariable(value = "gameId") String gameId, @RequestParam List<String> playerIds) throws IOException {
        gameService.acceptAnswers(gameId, playerIds);
    }

    @GetMapping(value = "/images/{name}",
            produces = MediaType.APPLICATION_OCTET_STREAM_VALUE)
    public @ResponseBody
    byte[] getImage(@PathVariable String name) throws IOException {
        try {
            String uploadDir = "user-photos/";
            return ImagesUtil.readFile(uploadDir, name);
        } catch (NoSuchFileException e){
            String uploadDir = "app-photos/";
            return ImagesUtil.readFile(uploadDir, name);
        }
    }


    @GetMapping(value = "/images")
    public List<String> getImages() {
        String uploadDir = "app-photos/";
        List<String> fileNames = ImagesUtil.readFileNames(uploadDir);
        return fileNames;
    }
}