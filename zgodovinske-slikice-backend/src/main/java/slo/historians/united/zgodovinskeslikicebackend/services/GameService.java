package slo.historians.united.zgodovinskeslikicebackend.services;

import org.apache.commons.io.IOUtils;
import org.apache.commons.lang3.RandomStringUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.io.Resource;
import org.springframework.stereotype.Service;
import org.springframework.util.StringUtils;
import org.springframework.web.context.support.ServletContextResource;
import org.springframework.web.multipart.MultipartFile;
import slo.historians.united.zgodovinskeslikicebackend.controllers.CardDTO;
import slo.historians.united.zgodovinskeslikicebackend.game.Card;
import slo.historians.united.zgodovinskeslikicebackend.game.Game;
import slo.historians.united.zgodovinskeslikicebackend.utilities.FileUploadUtil;

import javax.servlet.ServletContext;
import java.io.IOException;
import java.nio.file.Path;
import java.util.*;
@Service
public class GameService {
    private final Map<String, Game> ongoingGames = new HashMap<>();
    private final Set<String> ids = new HashSet<>();

    @Autowired
    ServletContext servletContext;

    public String addPlayer(String gameId, String playerName) {
        String generatedString = generateRandomString();
        ongoingGames.get(gameId).addPlayer(generatedString, playerName);
        return generatedString;
    }

    public void addPlayerCard(String gameId, String playerId, MultipartFile image, String question, String answer) throws IOException {
        String fileName = StringUtils.cleanPath(image.getOriginalFilename());
        String uploadDir = "user-photos/";
        Path path = FileUploadUtil.saveFile(uploadDir, fileName, image);

        Card card  = new Card();
        card.setAnswer(question);
        card.setQuestion(answer);
        card.setImageId(fileName);
        ongoingGames.get(gameId).playerAddCard(playerId, card);
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


