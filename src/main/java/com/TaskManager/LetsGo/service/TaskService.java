package com.TaskManager.LetsGo.service;

import com.TaskManager.LetsGo.DTO.Requests.TaskRequest;
import com.TaskManager.LetsGo.DTO.Responses.TaskResponse;
import com.TaskManager.LetsGo.exception.TaskNotFoundException;
import com.TaskManager.LetsGo.model.Task;
import com.TaskManager.LetsGo.model.User;
import com.TaskManager.LetsGo.repository.TaskRepository;
import com.TaskManager.LetsGo.repository.UserRepository;
import org.springframework.beans.BeanUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Service
public class TaskService {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private TaskRepository taskRepository;



    public TaskResponse createTask(TaskRequest taskRequest) {
        //We Take Out Current User Email From the SecurityContextHolder
        String name = SecurityContextHolder.getContext().getAuthentication().getName();
        //with Name Take Out user From Repository
        User byEmail = userRepository.findByEmail(name);
        if (byEmail == null) {
            throw new UsernameNotFoundException("Username not found");
        }
        Task task = new Task();
        task.setUser(byEmail);
        task.setDescription(taskRequest.getDescription());
        task.setStatus(taskRequest.getStatus());
        task.setCreatedAt(LocalDateTime.now());
        task.setDueDate(taskRequest.getDueDate());

        Task save = taskRepository.save(task);

        TaskResponse taskResponse = new TaskResponse();
        taskResponse.setId(save.getId());
        taskResponse.setCreatedAt(save.getCreatedAt());
        taskResponse.setDescription(save.getDescription());
        taskResponse.setPriority(save.getPriority());
        taskResponse.setStatus(save.getStatus());
        taskResponse.setDueDate(save.getDueDate());
        return taskResponse;
    }

    public List<TaskResponse> findAllTasks() {
        String name = SecurityContextHolder.getContext().getAuthentication().getName();
        User byEmail = userRepository.findByEmail(name);
        if (byEmail == null) {
            throw new UsernameNotFoundException("Username not found");
        }
        List<TaskResponse> taskResponseList = new ArrayList<>();
        List<Task> tasks = taskRepository.findByUser(byEmail);
        for (Task task : tasks) {
            TaskResponse taskResponse = new TaskResponse();
            BeanUtils.copyProperties(task, taskResponse);
            taskResponseList.add(taskResponse);
        }
        return taskResponseList;
    }

    public TaskResponse updateTask(TaskRequest taskRequest,Long id) {
        Task updatedTask = taskRepository.findById(id).orElseThrow(() -> new TaskNotFoundException("Task not found"));
        updatedTask.setDescription(taskRequest.getDescription());
        updatedTask.setDueDate(taskRequest.getDueDate());
        updatedTask.setStatus(taskRequest.getStatus());
        updatedTask.setPriority(taskRequest.getPriority());

        Task save = taskRepository.save(updatedTask);
        return TaskResponse.builder()
                .id(save.getId())
                .description(updatedTask.getDescription())
                .priority(updatedTask.getPriority())
                .dueDate(updatedTask.getDueDate())
                .status(updatedTask.getStatus())
                .createdAt(updatedTask.getCreatedAt())
                .build();
    }

    public void deleteTask(Long id) {
        taskRepository.deleteById(id);
    }
}
