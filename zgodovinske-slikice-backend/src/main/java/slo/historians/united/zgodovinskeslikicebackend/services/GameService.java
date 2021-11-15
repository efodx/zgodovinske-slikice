package slo.historians.united.zgodovinskeslikicebackend.services;

import org.springframework.stereotype.Service;
import slo.historians.united.zgodovinskeslikicebackend.game.Game;

import javax.annotation.Resource;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
public class GameService {
    private Map<String, Game> ongoingGames = new HashMap<>();

    public void addPlayer(String gameId, String playerId){
        ongoingGames.get(gameId).addPlayer(playerId);
    }

    public void addPlayerCard(String gameId, String playerId){
        ongoingGames.get(gameId).playerAddCard(playerId);
    }

    public void createGame(String id) {
        Game newGame = new Game();
        ongoingGames.put(id, newGame);
    }

    public void startGame(String id) {
        ongoingGames.get(id).startGame();
    }

    public void playerAnswer(String gameId, String playerId, String playerAnswer) {
        ongoingGames.get(gameId).answer(playerAnswer, playerId);
    }

    public long answersLeft(String gameId){
        return ongoingGames.get(gameId).answersLeft();
    }


    public String currentAskingPlayer(String gameId) {
        return ongoingGames.get(gameId).getCurrentAskingPlayerId();
    }
}


