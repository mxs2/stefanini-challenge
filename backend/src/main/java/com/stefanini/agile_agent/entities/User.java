package com.stefanini.agile_agent.entities;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@NoArgsConstructor
@Getter
@Entity
@Table(name = "tb_users")
public class User {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Setter
    @Column(nullable = false)
    private String username;

    @Column(nullable = false)
    private String password;

    @Setter
    @Column(nullable = false, unique = true)

    private String email;

    public User(String username, String encodedPassword, String email) {
        this.username = username;
        this.password = encodedPassword;
        this.email = email;
    }
}
