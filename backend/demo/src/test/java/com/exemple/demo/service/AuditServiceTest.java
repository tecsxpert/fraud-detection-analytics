package com.example.demo.service;

import org.junit.jupiter.api.Test;
import static org.junit.jupiter.api.Assertions.assertDoesNotThrow;

public class AuditServiceTest {

    @Test
    void testSaveAudit() {
        AuditService service = new AuditService();
        assertDoesNotThrow(() -> service.saveAudit("TEST"));
    }
}