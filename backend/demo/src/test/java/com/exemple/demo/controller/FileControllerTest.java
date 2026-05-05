package com.example.demo.controller;

import com.example.demo.model.FileEntity;
import com.example.demo.service.FileService;
import org.junit.jupiter.api.Test;
import org.springframework.core.io.ByteArrayResource;
import org.springframework.core.io.Resource;

import java.lang.reflect.Field;

import static org.junit.jupiter.api.Assertions.assertNotNull;
import static org.mockito.Mockito.*;

public class FileControllerTest {

    @Test
    void testAllMethods() throws Exception {

        // mock service
        FileService service = mock(FileService.class);

        // correct return types
        FileEntity fileEntity = new FileEntity();
        Resource resource = new ByteArrayResource(new byte[]{1,2,3});

        // fix mocking
        when(service.uploadFile(null)).thenReturn(fileEntity);
        when(service.getFile(1L)).thenReturn(resource);

        // controller
        FileController controller = new FileController();

        // inject mock
        Field field = FileController.class.getDeclaredField("fileService");
        field.setAccessible(true);
        field.set(controller, service);

        // test
        assertNotNull(controller.uploadFile(null));
        assertNotNull(controller.getFile(1L));
    }
}