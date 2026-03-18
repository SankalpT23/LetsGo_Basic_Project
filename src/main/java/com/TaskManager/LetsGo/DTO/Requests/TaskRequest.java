package com.TaskManager.LetsGo.DTO.Requests;

import jakarta.validation.constraints.Future;
import jakarta.validation.constraints.NotBlank;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class TaskRequest {
    @NotBlank
    private String title;
    @NotBlank
    private String description;
    private String status;
    private String priority;
    @Future
    private LocalDateTime dueDate;
}
