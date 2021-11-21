package slo.historians.united.zgodovinskeslikicebackend.services;

import lombok.AllArgsConstructor;
import lombok.Data;
import slo.historians.united.zgodovinskeslikicebackend.game.Card;
import slo.historians.united.zgodovinskeslikicebackend.game.Player;

import java.util.List;
import java.util.Map;

@Data
@AllArgsConstructor
public class GameStateDTO {
    private String gameId;
    private String userAskingId;
    private Card currentCard;
    private List<Player> players;
    private String gameState;
    private  Map<String, String> answers;
    private String ownerId;
    private long timeLeft;
}
