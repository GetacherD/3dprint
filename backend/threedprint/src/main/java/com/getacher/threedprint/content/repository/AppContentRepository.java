package com.getacher.threedprint.content.repository;

import com.getacher.threedprint.content.entity.AppContent;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface AppContentRepository extends JpaRepository<AppContent, Long> {
    Optional<AppContent> findByKey(String key);
}