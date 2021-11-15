package slo.historians.united.zgodovinskeslikicebackend.game;

import java.sql.Time;
import java.util.*;
import java.util.concurrent.CountDownLatch;
import java.util.concurrent.TimeUnit;
import java.util.concurrent.atomic.AtomicBoolean;
import java.util.stream.Collectors;

public class Game {
    private String gameId;
    private String userAskingId;
    private Card currentCard;
    private List<Player> players = new ArrayList<>();
    private GameState gameState = GameState.LOBBY;
    private final Map<String, String> answers = new HashMap<>();
    private CountDownLatch countDownLatch;
    private Thread gameThread;

    public void joinGame(Player player) {
        if (players.size() < Rules.MAX_NUMBER_OF_PLAYERS && gameState == GameState.LOBBY) {
            players.add(player);
        } else {
            throw new IllegalStateException("Game is already full.");
        }
    }

    public long answersLeft() {
        return players.size() - answers.size() - 1;
    }

    public String getCurrentAskingPlayerId() {
        return userAskingId;
    }

    public void answer(String answer, String playerId) {
        if (!playerId.equals(userAskingId)) {
            answers.put(playerId, answer);
        }
    }

    public void waitForAnswers() {
        long endTime = System.currentTimeMillis() + Rules.ANSWERS_TIMEOUT;
        while (answers.size() < players.size() - 1 && System.currentTimeMillis() < endTime) {
            try {
                Thread.sleep(100);
            } catch (InterruptedException e) {
                e.printStackTrace();
            }
        }
    }

    public void playerAddCard(String id) {
        Card card = new Card();
        card.setAnswer("something");
        card.setQuestion("Anything?");
        players.stream().filter(p -> p.getId().equals(id)).findFirst().ifPresent(p -> p.addCard(card));
    }

    public void addPlayer(String id) {
        Player player = new Player(id, "Player" + id);
        players.add(player);
    }


    public void startGame() {
        if (gameState != GameState.LOBBY) {
            throw new IllegalStateException("Game has already started.");
        }
        if (players.size() < Rules.MIN_NUMBER_OF_PLAYERS) {
            throw new IllegalStateException("Cannot start with less than required players.");
        }
        Random rand = new Random();
        Player randomPlayer = players.get(rand.nextInt(players.size()));

        // Set initial player
        userAskingId = randomPlayer.getId();
        currentCard = randomPlayer.getCards().get(0);
        randomPlayer.getCards().remove(0);


        gameState = GameState.PLAYING;
        countDownLatch = new CountDownLatch(players.size() - 1);

        gameThread = new Thread(this::gameLoop);
        gameThread.start();
    }

    public void leaveGame(String id) {
        players = players.stream().filter(p -> p.getId().equals(id)).collect(Collectors.toList());
    }

    public void addCard(Card card, String playerId) {
        if (gameState == GameState.LOBBY) {
            Player player = players.stream().filter(p -> p.getId().equals(playerId)).findFirst().orElseThrow();
            player.addCard(card);
        } else {
            throw new IllegalStateException("You cannot add cards after the game has started.");
        }
    }

    private void gameLoop() {
        while (gameState == GameState.PLAYING) {
            System.out.println("WAITING FOR ANSWERS.");
            waitForAnswers();
            System.out.println("MOVING FORWARD.");
            checkAnswersAndAwardPoints();
            System.out.println("MOVING TO THE NEXT PLAYER.");
            moveToNextPlayer();
        }
        System.out.println("GAME ENDED DUDE");
    }

    private void moveToNextPlayer() {
        System.out.println("Moved to next player");
        int currentPlayer = players.stream().map(Player::getId).collect(Collectors.toList()).indexOf(userAskingId);
        int nextPlayer;
        if (currentPlayer == players.size() - 1) {
            nextPlayer = 0;
        } else {
            nextPlayer = currentPlayer + 1;
        }
        userAskingId = players.get(nextPlayer).getId();
        currentCard = players.get(nextPlayer).getCards().get(0);
        players.get(nextPlayer).getCards().remove(0);
    }

    private void checkAnswersAndAwardPoints() {
        AtomicBoolean allCorrect = new AtomicBoolean(true);
        AtomicBoolean anyCorrect = new AtomicBoolean(false);

        answers.forEach((key, value) -> {
            if (!key.equals(userAskingId)) {
                if (value.equals(currentCard.getAnswer())) {
                    Player player = players.stream().filter(p -> p.getId().equals(key)).findFirst().orElseThrow();
                    player.addPoints(1);
                    anyCorrect.set(true);
                } else {
                    allCorrect.set(false);
                }
            }
        });
        if (anyCorrect.get() && !allCorrect.get()) {
            players.stream().filter(p -> p.getId().equals(userAskingId)).findFirst().orElseThrow().addPoints(1);
        }
        boolean anyWinners = players.stream().anyMatch(Player::hasWon);
        if (anyWinners) {
            gameState = GameState.ENDED;
        } else {
            answers.clear();
        }

    }


}

enum GameState {
    LOBBY,
    PLAYING,
    ENDED
}