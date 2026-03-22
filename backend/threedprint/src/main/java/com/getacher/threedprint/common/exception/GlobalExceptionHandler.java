package com.getacher.threedprint.common.exception;

import com.getacher.threedprint.common.response.ApiRespones;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

@RestControllerAdvice
public class GlobalExceptionHandler {

@ExceptionHandler(AppException.class)
    public ResponseEntity<ApiRespones<?>> handleAppException(AppException e) {
return  ResponseEntity.status(e.getStatus())
        .body(
                ApiRespones.builder()
                        .success(false)
                        .message(e.getMessage())
                        .build()
        );
}
@ExceptionHandler(MethodArgumentNotValidException.class)
    public ResponseEntity<ApiRespones<?>> handleValidationException(MethodArgumentNotValidException e) {
    String msg = e.getBindingResult().getFieldErrors().get(0).getDefaultMessage();
    return  ResponseEntity.badRequest()
            .body(
                    ApiRespones.builder()
                            .success(false)
                            .message(msg)
                            .build()
            );
}
@ExceptionHandler(Exception.class)
    public ResponseEntity<ApiRespones<?>> handleGenericException(Exception e) {
    e.printStackTrace();
    return  ResponseEntity.internalServerError()
            .body(
                    ApiRespones.builder()
                            .success(false)
                            .message("Some Thing Went Wrong!")
                            .build()
            );
}
}
