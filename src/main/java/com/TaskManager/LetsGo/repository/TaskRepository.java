package com.TaskManager.LetsGo.repository;

import com.TaskManager.LetsGo.model.Task;
import com.TaskManager.LetsGo.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface TaskRepository extends JpaRepository<Task, Long> {
    List<Task> findByUser(User user);
    //Rest i can get from JPARepository like save,findbyId deleteByID FindALl
}
