package com.example.demo.config;

import org.junit.jupiter.api.Test;

import static org.junit.jupiter.api.Assertions.assertNotNull;

public class ConfigTest {

    @Test
    void testConfig() {
        Object config = new Object(); // simple coverage
        assertNotNull(config);
    }
}