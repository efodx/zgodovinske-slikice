package slo.historians.united.zgodovinskeslikicebackend.game;


import lombok.Data;

import java.util.ArrayList;
import java.util.List;

@Data
public class Player {
    private final String playerName;
    private final String id;
    private final List<Card> cards = new ArrayList<>();
    private int points = 0;

    public Player(String id, String name) {
        this.id = id;
        this.playerName = name;
    }

    public void addCard(Card card) {
        if (cards.size() < Rules.NUMBER_OF_CARDS) {
            cards.add(card);
        }
    }

    public String getId() {
        return id;
    }

    public void addPoints(int points) {
        this.points += points;
    }

    public List<Card> getCards(){
        return cards;
    }

    public boolean hasWon(){
        return this.points >= Rules.REQUIRED_POINTS;
    }
}
