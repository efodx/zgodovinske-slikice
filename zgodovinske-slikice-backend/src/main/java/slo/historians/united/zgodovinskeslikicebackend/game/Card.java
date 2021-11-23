package slo.historians.united.zgodovinskeslikicebackend.game;

import lombok.Data;
import org.springframework.core.io.Resource;


@Data
public class Card {
    private String question;
    private String answer;
    private String imageId;
}
