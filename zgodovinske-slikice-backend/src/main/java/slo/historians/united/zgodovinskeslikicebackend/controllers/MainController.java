package slo.historians.united.zgodovinskeslikicebackend.controllers;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RestController;
import slo.historians.united.zgodovinskeslikicebackend.services.GameService;

import java.util.List;

@RestController
public class MainController {

    @Autowired
    private GameService gameService;

    @GetMapping("/")
    public List<String> index() {
        return gameService.getGameList();
    }

    @GetMapping("/{gameName}")
    public List<String> addStf(@PathVariable(value = "gameName") String adding) {
         gameService.addGame(adding);
         return index();
    }


}