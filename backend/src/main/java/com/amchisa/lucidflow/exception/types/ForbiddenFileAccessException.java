package com.amchisa.lucidflow.exception.types;

import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.ResponseStatus;

@ResponseStatus(HttpStatus.FORBIDDEN)
public class ForbiddenFileAccessException extends RuntimeException {
    public ForbiddenFileAccessException(String message) {
        super(message);
    }
}
