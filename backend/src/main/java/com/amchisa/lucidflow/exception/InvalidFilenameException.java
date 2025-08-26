package com.amchisa.lucidflow.exception;

public class InvalidFilenameException extends RuntimeException {
    public InvalidFilenameException(String message) {
        super(message);
    }

    public InvalidFilenameException(String message, Throwable cause) {
        super(message, cause);
    }
}
