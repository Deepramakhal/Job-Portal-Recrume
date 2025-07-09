package recru.me.backend.util;

import org.springframework.stereotype.Component;
import org.springframework.web.multipart.MultipartFile;

import java.io.File;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.StandardCopyOption;
import java.util.UUID;

@Component
public class FileStorageUtil {

    private final String UPLOAD_DIR = System.getProperty("user.dir") + "/uploads/"; // Change as needed

    public FileStorageUtil() {
        createUploadDir();
    }

    public String storeFile(MultipartFile file) {
        try {
            createUploadDir();
            String fileName = randomFileNameGenerator(10) + "_" + file.getOriginalFilename();
            Path targetPath = Path.of(UPLOAD_DIR + fileName);
            Files.copy(file.getInputStream(), targetPath, StandardCopyOption.REPLACE_EXISTING);

            return (String) targetPath.toString();
        } catch (IOException e) {
            throw new RuntimeException("Failed to store file", e);
        }
    }

    public static String randomFileNameGenerator(int length) {
        return UUID.randomUUID().toString().substring(0, length);
    }

    private void createUploadDir() {
        File uploadDir = new File(UPLOAD_DIR);
        if (!uploadDir.exists()) {
            uploadDir.mkdirs();
        }
    }
}
