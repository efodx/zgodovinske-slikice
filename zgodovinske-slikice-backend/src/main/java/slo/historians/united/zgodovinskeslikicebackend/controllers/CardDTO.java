package slo.historians.united.zgodovinskeslikicebackend.controllers;

import lombok.Data;
import org.springframework.web.multipart.MultipartFile;

@Data
public class CardDTO {
    private String answer;
    private String question;
    private MultipartFile image;
}
