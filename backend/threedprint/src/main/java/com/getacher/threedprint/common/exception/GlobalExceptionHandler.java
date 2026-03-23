package com.getacher.threedprint.common.exception;

import com.getacher.threedprint.common.response.ApiResponse;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

@RestControllerAdvice
public class GlobalExceptionHandler {

@ExceptionHandler(AppException.class)
    public ResponseEntity<ApiResponse<?>> handleAppException(AppException e) {
return  ResponseEntity.status(e.getStatus())
        .body(
                ApiResponse.builder()
                        .success(false)
                        .message(e.getMessage())
                        .build()
        );
}
@ExceptionHandler(MethodArgumentNotValidException.class)
    public ResponseEntity<ApiResponse<?>> handleValidationException(MethodArgumentNotValidException e) {
    String msg = e.getBindingResult().getFieldErrors().get(0).getDefaultMessage();
    return  ResponseEntity.badRequest()
            .body(
                    ApiResponse.builder()
                            .success(false)
                            .message(msg)
                            .build()
            );
}
@ExceptionHandler(Exception.class)
    public ResponseEntity<ApiResponse<?>> handleGenericException(Exception e) {
    e.printStackTrace();
    return  ResponseEntity.internalServerError()
            .body(
                    ApiResponse.builder()
                            .success(false)
                            .message("Some Thing Went Wrong!")
                            .build()
            );
}
}
