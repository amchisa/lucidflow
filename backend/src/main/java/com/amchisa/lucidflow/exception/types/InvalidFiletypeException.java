package com.amchisa.lucidflow.exception.types;

import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.ResponseStatus;

@ResponseStatus(HttpStatus.UNSUPPORTED_MEDIA_TYPE)
public class InvalidFiletypeException extends RuntimeException {
    public InvalidFiletypeException(String message) {
        super(message);
    }
}
