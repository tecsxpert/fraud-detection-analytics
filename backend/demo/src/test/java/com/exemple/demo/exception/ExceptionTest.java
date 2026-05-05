package com.example.demo.exception;

import org.junit.jupiter.api.Test;

import static org.junit.jupiter.api.Assertions.assertNotNull;

public class ExceptionTest {

    @Test
    void testException() {
        ResourceNotFoundException ex =
                new ResourceNotFoundException("Not Found");

        assertNotNull(ex);
    }
}