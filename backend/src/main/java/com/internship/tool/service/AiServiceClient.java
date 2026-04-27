package com.internship.tool.service;

import java.io.OutputStream;
import java.net.HttpURLConnection;
import java.net.URL;
import java.util.Scanner;

public class AiServiceClient {

    public String sendToAI(String text) {
        try {
            URL url = new URL("http://127.0.0.1:5000/test");

            HttpURLConnection con =
                (HttpURLConnection) url.openConnection();

            con.setRequestMethod("POST");
            con.setRequestProperty("Content-Type", "application/json");
            con.setDoOutput(true);

            String jsonInput = "{\"text\":\"" + text + "\"}";

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
}