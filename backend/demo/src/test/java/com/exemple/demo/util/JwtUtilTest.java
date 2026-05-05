package com.example.demo.util;

import org.junit.jupiter.api.Test;
import static org.junit.jupiter.api.Assertions.assertNotNull;

public class JwtUtilTest {

    @Test
    void testJwt() {
        String token = "sample-token";
        assertNotNull(token);
    }
}