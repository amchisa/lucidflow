package com.amchisa.lucidflow.exception.types;

import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.ResponseStatus;

@ResponseStatus(HttpStatus.BAD_REQUEST)
public class InvalidFileOperationException extends RuntimeException {
    public InvalidFileOperationException(String message) {
        super(message);
    }
}