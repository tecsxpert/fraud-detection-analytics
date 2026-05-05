package com.example.demo.service;

import com.example.demo.model.FileEntity;
import org.springframework.core.io.ByteArrayResource;
import org.springframework.core.io.Resource;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

@Service
public class FileService {

    public FileEntity uploadFile(MultipartFile file) {
        return new FileEntity(); // dummy object
    }

    public Resource getFile(Long id) {
        return new ByteArrayResource(new byte[0]); // empty file
    }
}