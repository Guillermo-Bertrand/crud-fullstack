package com.backend.customersapp.Repository;

import com.backend.customersapp.Entity.Customer;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ICustomerRepository extends JpaRepository<Customer, Long> {
}
