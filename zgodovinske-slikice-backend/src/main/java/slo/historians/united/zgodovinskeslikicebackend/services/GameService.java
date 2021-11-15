package slo.historians.united.zgodovinskeslikicebackend.services;

import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;

@Service
public class GameService {
    private List<String> gameList = new ArrayList<>();

    public List<String> getGameList() {
        return gameList;
    }

    public void addGame(String name) {
        gameList.add(name);
    }
}


