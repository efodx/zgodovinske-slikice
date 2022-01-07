package slo.historians.united.zgodovinskeslikicebackend.game;

import lombok.SneakyThrows;

import java.util.*;
import java.util.concurrent.atomic.AtomicBoolean;
import java.util.stream.Collectors;

public class Game {
    private String gameId;
    private String userAskingId;
    private Card currentCard = new Card();
    private List<Player> players = new ArrayList<>();
    private GameState gameState = GameState.LOBBY;
    private final Map<String, String> answers = new HashMap<>();
    private List<String> inTime = new ArrayList<String>();
    private InnerGameState innerGameState = InnerGameState.NONE;
    private Thread gameThread;
    private String ownerId;
    private List<String> acceptedAnswers = new ArrayList<>();
    private long endTime = 0;
    private boolean shouldTimeOut = false;
    private boolean acceptingAnswers = false;
    private List<HistoryEntry> history = new ArrayList<>();

    public String getInnerGameState() {
        return innerGameState.toString();
    }

    public List<HistoryEntry> getHistory() {
        return history;
    }

    public Card getCurrentCard() {
        return currentCard;
    }

    public Map<String, String> getAnswers() {
        return answers;
    }

    public List<Player> getPlayers() {
        return players;
    }

    public long answersLeft() {
        return players.size() - answers.size() - 1;
    }

    public String getCurrentAskingPlayerId() {
        return userAskingId;
    }

    public void answer(String answer, String playerId) {
        if (!playerId.equals(userAskingId) && innerGameState == InnerGameState.WAITING_FOR_ANSWERS) {
            answers.put(playerId, answer);
            if (getTimeLeft() > 0) {
                inTime.add(playerId);
            }
        }
    }

    private boolean timedOut(long endTime) {
        if (shouldTimeOut) {
            return System.currentTimeMillis() < endTime;
        } else {
            return false;
        }
    }

    public void waitForAnswers() {
        innerGameState = InnerGameState.WAITING_FOR_ANSWERS;
        endTime = System.currentTimeMillis() + Rules.ANSWERS_TIMEOUT;
        while (answers.size() < players.size() - 1 && !timedOut(endTime)) {
            sleepFor(100);
        }
    }

    public void clearPlayerCards(String playerId) {
        players.stream().filter(p -> p.getId().equals(playerId)).findFirst().ifPresent(p -> p.getCards().clear());
    }

    public void playerAddCard(String playerId, Card card) {
        players.stream().filter(p -> p.getId().equals(playerId)).findFirst().ifPresent(p -> p.addCard(card));
    }

    public void addPlayer(String id, String playerName) {
        Player player = new Player(id, playerName);
        if (players.size() < Rules.MAX_NUMBER_OF_PLAYERS && gameState == GameState.LOBBY) {
            players.add(player);
        } else {
            if (!playerName.equals("ucitelj")) {
                throw new IllegalStateException("Game is already full.");
            }
        }
        if (players.size() == 1) {
            ownerId = id;
        }
    }

    public void changeOwner(String newOwnerId) {
        ownerId = newOwnerId;
    }

    public String getOwner() {
        return ownerId;
    }

    public void acceptAnswers(List<String> ids) {
        acceptedAnswers = ids;
        acceptingAnswers = false;
    }

    @SneakyThrows
    private void sleepFor(long ms) {
        Thread.sleep(ms);
    }

    public void startGame() {
        if (gameState != GameState.LOBBY) {
            throw new IllegalStateException("Game has already started.");
        }
        if (players.size() < Rules.MIN_NUMBER_OF_PLAYERS) {
            throw new IllegalStateException("Cannot start with less than required players.");
        }

        gameState = GameState.PLAYING;

        selectFirstPlayer();

        gameThread = new Thread(this::gameLoop);
        gameThread.start();
    }

    private void selectFirstPlayer() {
        Random random = new Random();
        innerGameState = InnerGameState.SELECTING_FIRST_PLAYER;
        sleepFor(2000);
        Player randomPlayer = players.get(random.nextInt(players.size()));

        // Set initial player
        userAskingId = randomPlayer.getId();
        currentCard = randomPlayer.getCards().get(0);
        randomPlayer.getCards().remove(0);
    }

    public String getGameState() {
        return gameState.toString();
    }

    public void stop() {
        gameThread.interrupt();
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
            waitForAnswers();
            waitForAcceptedAnswers();
            checkAnswersAndAwardPoints();
            sleepFor(5000);
            moveToNextPlayer();
        }
    }

    private void waitForAcceptedAnswers() {
        acceptingAnswers = true;
        innerGameState = InnerGameState.ACCEPTING_ANSWERS;
        while (acceptingAnswers) {
            sleepFor(100);
        }
    }

    private void moveToNextPlayer() {
        int currentPlayer = players.stream().map(Player::getId).collect(Collectors.toList()).indexOf(userAskingId);
        int nextPlayer;
        if (currentPlayer == players.size() - 1) {
            nextPlayer = 0;
        } else {
            nextPlayer = currentPlayer + 1;
        }
        userAskingId = players.get(nextPlayer).getId();
        if (players.get(nextPlayer).getCards().size() == 0) {
            gameState = GameState.ENDED;
            return;
        }
        currentCard = players.get(nextPlayer).getCards().get(0);
        players.get(nextPlayer).getCards().remove(0);
    }

    private void checkAnswersAndAwardPoints() {
        innerGameState = InnerGameState.AWARDING_PLAYERS;
        AtomicBoolean allCorrect = new AtomicBoolean(true);
        AtomicBoolean anyCorrect = new AtomicBoolean(false);

        answers.forEach((key, value) -> {
            if (!key.equals(userAskingId)) {
                if (value.equals(currentCard.getAnswer()) || acceptedAnswers.contains(key)) {
                    Player player = players.stream().filter(p -> p.getId().equals(key)).findFirst().orElseThrow();
                    player.addPoints(1);
                    if (inTime.contains(player.getId())) {
                        player.addPoints(1);
                    }
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
        history.add(new HistoryEntry(userAskingId, answers, acceptedAnswers, currentCard));
        if (anyWinners) {
            gameState = GameState.ENDED;
        } else {
            answers.clear();
            acceptedAnswers.clear();
            inTime.clear();
        }

    }

    public long getTimeLeft() {
        if (endTime == 0 || (innerGameState != InnerGameState.WAITING_FOR_ANSWERS)) {
            return 0;
        }
        return Math.max(0, endTime - System.currentTimeMillis());
    }

}

enum GameState {
    LOBBY,
    PLAYING,
    ENDED
}

enum InnerGameState {
    NONE,
    WAITING_FOR_ANSWERS,
    AWARDING_PLAYERS,
    SELECTING_FIRST_PLAYER,
    ACCEPTING_ANSWERS
}