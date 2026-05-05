package com.example.demo.service;

import com.example.demo.model.Transaction;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;

@Service
public class TransactionService {

    public Transaction saveTransaction(Transaction transaction) {
        return transaction;
    }

    public List<Transaction> getAllTransactions() {
        return new ArrayList<>();
    }

    public Transaction getTransactionById(Long id) {
        return new Transaction();
    }

    public Transaction updateTransaction(Long id, Transaction transaction) {
        return transaction;
    }

    public void deleteTransaction(Long id) {
    }
}