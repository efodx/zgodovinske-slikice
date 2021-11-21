package slo.historians.united.zgodovinskeslikicebackend.services;

import org.apache.commons.lang3.RandomStringUtils;
import org.springframework.stereotype.Service;
import slo.historians.united.zgodovinskeslikicebackend.game.Game;

import javax.annotation.Resource;
import java.util.*;
import java.util.stream.Collectors;

@Service
public class GameService {
    private final Map<String, Game> ongoingGames = new HashMap<>();
    private final Set<String> ids = new HashSet<>();

    public String addPlayer(String gameId, String playerName) {
        String generatedString = generateRandomString();
        ongoingGames.get(gameId).addPlayer(generatedString, playerName);
        return generatedString;
    }

    public void addPlayerCard(String gameId, String playerId) {
        ongoingGames.get(gameId).playerAddCard(playerId);
    }

    public void createGame(String id) {
        Game newGame = new Game();
        ongoingGames.put(id, newGame);
    }

    public String createGame() {
        String generatedString = generateRandomString();
        createGame(generatedString);
        return generatedString;
    }

    public String generateRandomString() {
        int length = 10;
        String generatedString = RandomStringUtils.random(length, true, false);
        if (ids.contains(generatedString)) {
            return generateRandomString();
        } else {
            ids.add(generatedString);
            return generatedString;
        }
    }

    public void startGame(String id) {
        ongoingGames.get(id).startGame();
    }

    public void playerAnswer(String gameId, String playerId, String playerAnswer) {
        ongoingGames.get(gameId).answer(playerAnswer, playerId);
    }

    public long answersLeft(String gameId) {
        return ongoingGames.get(gameId).answersLeft();
    }


    public String currentAskingPlayer(String gameId) {
        return ongoingGames.get(gameId).getCurrentAskingPlayerId();
    }

    public GameStateDTO getGameState(String gameId){
        Game game = ongoingGames.get(gameId);

        return new GameStateDTO(gameId,
                game.getCurrentAskingPlayerId(),
                game.getCurrentCard(),
                game.getPlayers(),
                game.getGameState(),
                game.getAnswers(),
                game.getOwner(),
                game.getTimeLeft());
    }
}


