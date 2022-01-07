package slo.historians.united.zgodovinskeslikicebackend.game;

import lombok.AllArgsConstructor;
import lombok.Data;

import java.util.List;
import java.util.Map;

@Data
@AllArgsConstructor
public class HistoryEntry {
    private String playerAsking;
    private Map<String, String> answers;
    private List<String> acceptedAnswers;
    private Card cardPlayed;
}
