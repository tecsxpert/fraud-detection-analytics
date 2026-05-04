package com.internship.tool.service;

import java.io.OutputStream;
import java.net.HttpURLConnection;
import java.net.URL;
import java.util.Scanner;

public class AiServiceClient {

    // 🔹 Analyze API
    public String sendToAI(int amount, String location, String text) {
        try {
            URL url = new URL("http://127.0.0.1:5000/analyze");

            HttpURLConnection con = (HttpURLConnection) url.openConnection();

            con.setRequestMethod("POST");
            con.setRequestProperty("Content-Type", "application/json");
            con.setDoOutput(true);

            String jsonInput = "{ \"amount\": " + amount +
                    ", \"location\": \"" + location +
                    "\", \"text\": \"" + text + "\" }";

            OutputStream os = con.getOutputStream();
            os.write(jsonInput.getBytes());
            os.flush();
            os.close();

            Scanner sc = new Scanner(con.getInputStream());
            StringBuilder result = new StringBuilder();

            while (sc.hasNext()) {
                result.append(sc.nextLine());
            }

            sc.close();
            return result.toString();

        } catch (Exception e) {
            e.printStackTrace();
            return null;
        }
    }

    // 🔹 Report API (FIXED: inside class)
    public String getReport() {
        try {
            URL url = new URL("http://127.0.0.1:5000/generate-report");

            HttpURLConnection con = (HttpURLConnection) url.openConnection();
            con.setRequestMethod("GET");

            Scanner sc = new Scanner(con.getInputStream());
            StringBuilder result = new StringBuilder();

            while (sc.hasNext()) {
                result.append(sc.nextLine());
            }

            sc.close();
            return result.toString();

        } catch (Exception e) {
            e.printStackTrace();
            return null;
        }
    }
}