package com.amchisa.lucidflow.util;

import com.amchisa.lucidflow.exception.types.InvalidFilenameException;

public class FileUtils {
    private FileUtils() {} // Prevent instantiation

    /**
     * Normalizes a filename to ensure it is safe and consistent across different file systems.
     * This method removes or replaces characters that are not letters, numbers, hyphens, underscores, or periods.
     *
     * @param filename The original filename to be normalized.
     * @return A normalized filename.
     * @throws InvalidFilenameException if the filename is null, blank, or becomes blank after normalization.
     */
    public static String normalizeFilename(String filename) {
        if (filename == null || filename.isBlank()) {
            throw new InvalidFilenameException("Filename cannot be null or blank.");
        }

        // Replace any character that is not a letter, number, period, underscore, or hyphen with an underscore
        String normalizedFilename = filename.replaceAll("[^a-zA-Z0-9.\\-_]", "_");

        if (normalizedFilename.isBlank()) {
            throw new InvalidFilenameException("Filename cannot be blank after normalization.");
        }

        return normalizedFilename;
    }
}
