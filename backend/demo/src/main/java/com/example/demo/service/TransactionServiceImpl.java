package com.example.demo.service;

import com.example.demo.model.Transaction;
import com.example.demo.repository.TransactionRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.cache.annotation.CacheEvict;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class TransactionServiceImpl implements TransactionService {

    private final TransactionRepository transactionRepository;
    private final EmailService emailService;

    @Autowired
    public TransactionServiceImpl(TransactionRepository transactionRepository,
                                  EmailService emailService) {
        this.transactionRepository = transactionRepository;
        this.emailService = emailService;
    }

    @Override
    @Cacheable("transactions")
    public List<Transaction> getAllTransactions() {
        return transactionRepository.findAll();
    }

    @Override
    @CacheEvict(value = "transactions", allEntries = true)
    public Transaction saveTransaction(Transaction transaction) {

        boolean isFraud = transaction.getAmount() > 10000;
        transaction.setFlagged(isFraud);

        String subject = isFraud ? "Fraud Alert 🚨" : "Transaction Created";
        String message = isFraud
                ? "Suspicious transaction detected: " + transaction.getAmount()
                : "Transaction amount: " + transaction.getAmount();

        sendEmailSafe("abhishekrabhishekr567@gmail.com", subject, message);

        return transactionRepository.save(transaction);
    }

    @Override
    @CacheEvict(value = "transactions", allEntries = true)
    public void deleteTransaction(Long id) {
        transactionRepository.deleteById(id);
    }

    @Override
    public Transaction processTransaction(Transaction transaction) {
        return saveTransaction(transaction);
    }

    private void sendEmailSafe(String to, String subject, String body) {
        try {
            System.out.println("📧 Sending email to: " + to);

            emailService.sendEmail(to, subject, body);

            System.out.println("✅ Email sent successfully");

        } catch (Exception e) {
            System.out.println("❌ Email failed:");
            e.printStackTrace();
        }
    }
}