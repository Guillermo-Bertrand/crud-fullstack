package com.backend.customersapp.Entity;

import javax.persistence.*;
import javax.validation.constraints.Email;
import javax.validation.constraints.NotEmpty;
import javax.validation.constraints.Size;
import java.io.Serializable;
import java.util.Date;

@Entity
@Table(name="customer")
public class Customer implements Serializable {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    //Validating fields.
    @NotEmpty(message = "nombre no puede estar vacio")
    @Size(min = 4, max = 12)
    //Setting up properties in tables.
    @Column(name = "name", nullable = false)
    private String name;

    @NotEmpty(message = "apellido no puede estar vacio")
    @Column(name = "last_name", nullable = false)
    private String lastName;

    @NotEmpty(message = "email no puede estar vacio")
    @Email
    @Column(name = "email", unique = true, nullable = false)
    private String email;

    @Column(name = "created", nullable = false)
    @Temporal(TemporalType.DATE)
    private Date created;

    @Column(name = "photo")
    private String photo;

    private static final long serialVersionUID = 1L;

    @PrePersist
    public void setCreatedPrePersist(){
        this.created = new Date();
    }

    public Long getId() {
        return id;
    }

    public String getPhoto() {
        return photo;
    }

    public void setPhoto(String photo) {
        this.photo = photo;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getLastName() {
        return lastName;
    }

    public void setLastName(String lastName) {
        this.lastName = lastName;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public Date getCreated() {
        return created;
    }

    public void setCreated(Date created) {
        this.created = created;
    }
}
