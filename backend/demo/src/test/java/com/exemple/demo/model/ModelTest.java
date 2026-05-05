package com.example.demo.model;

import org.junit.jupiter.api.Test;

import static org.junit.jupiter.api.Assertions.assertNotNull;

public class ModelTest {

    @Test
    void testTransaction() {
        Transaction t = new Transaction();
        assertNotNull(t);

        // call toString (works for any class)
        assertNotNull(t.toString());
    }

    @Test
    void testFileEntity() {
        FileEntity f = new FileEntity();
        assertNotNull(f);

        assertNotNull(f.toString());
    }
}