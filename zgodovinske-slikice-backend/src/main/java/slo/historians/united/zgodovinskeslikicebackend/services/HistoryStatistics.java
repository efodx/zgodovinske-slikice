package slo.historians.united.zgodovinskeslikicebackend.services;

import lombok.Data;
import slo.historians.united.zgodovinskeslikicebackend.game.HistoryEntry;

import java.util.Comparator;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Data
public class HistoryStatistics {
    private String bestQuestioner;
    private String bestAnswerer;

    public HistoryStatistics(List<HistoryEntry> history) {
        Map<String, Integer> correctAnswers = new HashMap<>();
        Map<String, Integer> goodQuestions = new HashMap<>();
        int numberOfPLayers = history.stream().map(historyEntry -> historyEntry.getAnswers().size()).max(Comparator.comparingInt(a -> a)).get();
        for (HistoryEntry entry : history) {
            entry.getAcceptedAnswers().forEach(id -> correctAnswers.put(id, correctAnswers.getOrDefault(id, 0) + 1));
            if (entry.getAcceptedAnswers().size() < numberOfPLayers && entry.getAcceptedAnswers().size() > 0) {
                goodQuestions.put(entry.getPlayerAsking(), goodQuestions.getOrDefault(entry.getPlayerAsking(), 0) + 1);
            }
        }
        bestQuestioner = goodQuestions.entrySet().stream().max((entry1,entry2) -> entry1.getValue()-entry2.getValue()).get().getKey();
        bestAnswerer = correctAnswers.entrySet().stream().max((entry1,entry2) -> entry1.getValue()-entry2.getValue()).get().getKey();
    }
}
