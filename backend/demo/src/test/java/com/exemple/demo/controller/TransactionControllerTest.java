package com.example.demo.controller;

import com.example.demo.model.Transaction;
import com.example.demo.service.TransactionService;
import org.junit.jupiter.api.Test;

import java.lang.reflect.Field;
import java.util.List;

import static org.junit.jupiter.api.Assertions.assertNotNull;
import static org.mockito.Mockito.*;

public class TransactionControllerTest {

    @Test
    void testAllMethods() throws Exception {

        // mock service
        TransactionService service = mock(TransactionService.class);

        Transaction t = new Transaction();

        // define behavior
        when(service.saveTransaction(t)).thenReturn(t);
        when(service.getAllTransactions()).thenReturn(List.of(t));
        when(service.getTransactionById(1L)).thenReturn(t);
        when(service.updateTransaction(1L, t)).thenReturn(t);

        // create controller
        TransactionController controller = new TransactionController();

        // inject mock using reflection
        Field field = TransactionController.class.getDeclaredField("transactionService");
        field.setAccessible(true);
        field.set(controller, service);

        // call methods
        assertNotNull(controller.createTransaction(t));
        assertNotNull(controller.getAllTransactions());
        assertNotNull(controller.getTransactionById(1L));
        assertNotNull(controller.updateTransaction(1L, t));

        // verify calls
        verify(service, times(1)).saveTransaction(t);
    }
}