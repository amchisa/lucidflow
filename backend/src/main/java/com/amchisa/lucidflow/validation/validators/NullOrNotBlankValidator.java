package com.amchisa.lucidflow.validation.validators;

import com.amchisa.lucidflow.validation.constraints.NullOrNotBlank;
import jakarta.validation.ConstraintValidator;
import jakarta.validation.ConstraintValidatorContext;

public class NullOrNotBlankValidator implements ConstraintValidator<NullOrNotBlank, String> {
    @Override
    public boolean isValid(String value, ConstraintValidatorContext validatorContext) {
        return value == null || !value.isBlank();
    }
}
