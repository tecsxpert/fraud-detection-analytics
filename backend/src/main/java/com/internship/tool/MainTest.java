package com.internship.tool;

import com.internship.tool.service.AiServiceClient;
import java.util.Scanner;

import com.google.gson.JsonObject;
import com.google.gson.JsonParser;

public class MainTest {
    public static void main(String[] args) {

        AiServiceClient client = new AiServiceClient();
        Scanner sc = new Scanner(System.in);

        System.out.print("Enter amount: ");
        int amount = sc.nextInt();
        sc.nextLine(); // consume newline

        System.out.print("Enter location: ");
        String location = sc.nextLine();

        System.out.print("Enter text: ");
        String text = sc.nextLine();

        String result = client.sendToAI(amount, location, text);

        // ✅ Safety check
        if (result == null) {
            System.out.println("Error: No response from AI service");
            return;
        }

        // ✅ Parse JSON
        JsonObject json = JsonParser.parseString(result).getAsJsonObject();

        String status = json.get("status").getAsString();
        String reason = json.get("reason").getAsString();
        int riskScore = json.get("risk_score").getAsInt();

        // ✅ Clean output
        System.out.println("\nResponse from AI:");
        System.out.println("Status: " + status);
        System.out.println("Reason: " + reason);
        System.out.println("Risk Score: " + riskScore + "/100");

        // 🔥 Call report API
        String reportResponse = client.getReport();

        if (reportResponse != null) {
            JsonObject reportJson = JsonParser.parseString(reportResponse).getAsJsonObject();

            int total = reportJson.get("total_transactions").getAsInt();
            int suspicious = reportJson.get("suspicious_transactions").getAsInt();

            System.out.println("\n--- Report Summary ---");
            System.out.println("Total Transactions: " + total);
            System.out.println("Suspicious Transactions: " + suspicious);
        } else {
            System.out.println("Error fetching report");
        }

        sc.close();
    }
}