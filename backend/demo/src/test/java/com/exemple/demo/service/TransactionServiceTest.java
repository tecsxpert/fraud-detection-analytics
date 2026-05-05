package com.example.demo.service;

import com.example.demo.model.Transaction;
import org.junit.jupiter.api.Test;

import java.util.List;

import static org.junit.jupiter.api.Assertions.*;

public class TransactionServiceTest {

    @Test
    void testServiceMethods() {

        TransactionService service = new TransactionService();

        Transaction t = new Transaction();

        assertNotNull(service.saveTransaction(t));
        assertNotNull(service.getAllTransactions());
        assertNotNull(service.getTransactionById(1L));
        assertNotNull(service.updateTransaction(1L, t));
    }
}