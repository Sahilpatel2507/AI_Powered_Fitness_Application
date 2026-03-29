package com.fitness.activityservice.service;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.web.reactive.function.client.WebClient;
import org.springframework.web.reactive.function.client.WebClientResponseException;

@Service
@RequiredArgsConstructor
public class UserValidationService {
    private final WebClient userServiceWebClient;

    public boolean validateUser(String userId) {
        try {
            String response = userServiceWebClient.get()
                    .uri("/api/users/{id}", userId)
                    .retrieve()
                    .bodyToMono(String.class)
                    .block();

            return response != null;

        } catch (Exception e) {
            System.out.println("UserService call failed: " + e.getMessage());
            return false;
        }
    }
}
