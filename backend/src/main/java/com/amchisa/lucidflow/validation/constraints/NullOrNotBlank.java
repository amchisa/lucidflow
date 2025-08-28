package com.amchisa.lucidflow.validation.constraints;

import com.amchisa.lucidflow.validation.validators.NullOrNotBlankValidator;
import jakarta.validation.Constraint;
import jakarta.validation.Payload;

import java.lang.annotation.ElementType;
import java.lang.annotation.Retention;
import java.lang.annotation.RetentionPolicy;
import java.lang.annotation.Target;

@Target(ElementType.FIELD)
@Retention(RetentionPolicy.RUNTIME)
@Constraint(validatedBy = NullOrNotBlankValidator.class)
public @interface NullOrNotBlank {
    String message() default "Field cannot be blank if present";
    Class<?>[] groups() default {};
    Class<? extends Payload>[] payload() default {};
}
