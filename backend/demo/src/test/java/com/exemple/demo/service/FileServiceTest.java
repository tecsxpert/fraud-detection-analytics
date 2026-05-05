package com.example.demo.service;

import org.junit.jupiter.api.Test;

import static org.junit.jupiter.api.Assertions.*;

public class FileServiceTest {

    @Test
    void testServiceMethods() {

        FileService service = new FileService();

        assertNotNull(service.uploadFile(null));
        assertNotNull(service.getFile(1L));
    }
}