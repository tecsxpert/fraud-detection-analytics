package com.internship.tool;

import com.internship.tool.service.AiServiceClient;

public class MainTest {

    public static void main(String[] args) {

        AiServiceClient client = new AiServiceClient();

        String result = client.sendToAI("hello");

        System.out.println(result);
    }
}