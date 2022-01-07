package slo.historians.united.zgodovinskeslikicebackend.utilities;

import java.io.*;
import java.nio.file.*;
import java.util.ArrayList;
import java.util.List;

import org.springframework.web.multipart.MultipartFile;

public class ImagesUtil {

    public static Path saveFile(String uploadDir, String fileName,
                                MultipartFile multipartFile) throws IOException {
        Path uploadPath = Paths.get(uploadDir);

        if (!Files.exists(uploadPath)) {
            Files.createDirectories(uploadPath);
        }

        try (InputStream inputStream = multipartFile.getInputStream()) {
            Path filePath = uploadPath.resolve(fileName);
            Files.copy(inputStream, filePath, StandardCopyOption.REPLACE_EXISTING);
            return filePath;
        } catch (IOException ioe) {
            throw new IOException("Could not save image file: " + fileName, ioe);
        }
    }

    public static byte[] readFile(String uploadDir, String fileName) throws IOException {
        Path uploadPath = Paths.get(uploadDir);
        Path filePath = uploadPath.resolve(fileName);
        return Files.readAllBytes(filePath);
    }



    public static List<String> readFileNames(String uploadDir) {
        Path uploadPath = Paths.get(uploadDir);
        File folder = uploadPath.toFile();
        File[] files = folder.listFiles();
        List<String> fileNames = new ArrayList<>();
        for (File file : files){
            fileNames.add(file.getName());
        }
        return fileNames;
    }

}