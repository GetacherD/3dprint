package com.getacher.threedprint.content.service;

import com.getacher.threedprint.content.entity.AppContent;
import com.getacher.threedprint.content.repository.AppContentRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class AppContentService {

    private final AppContentRepository repo;

    public String getValue(String key) {
        return repo.findByKey(key)
                .map(AppContent::getValue)
                .orElse("");
    }

    public void update(String key, String value) {
        AppContent content = repo.findByKey(key)
                .orElse(AppContent.builder().key(key).build());

        content.setValue(value);
        repo.save(content);
    }
}