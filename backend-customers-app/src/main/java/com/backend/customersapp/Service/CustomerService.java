package com.backend.customersapp.Service;

import com.backend.customersapp.Repository.ICustomerRepository;
import com.backend.customersapp.Entity.Customer;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.util.List;

@Service
public class CustomerService{

    private final ICustomerRepository customerDao;

    @Autowired
    public CustomerService(ICustomerRepository customerDao){
        this.customerDao = customerDao;
    }

    //It's just readOnly because just want to get that registers.
    @Transactional(readOnly = true)
    public List<Customer> findAll() {
        return (List<Customer>) customerDao.findAll();
    }

    //Get all by pages.
    @Transactional(readOnly = true)
    public Page<Customer> findAll(Pageable pageable){
        return customerDao.findAll(pageable);
    }

    @Transactional(readOnly = true)
    public Customer findById(Long id){
        //If customer is found, it's going to be returned, otherwise method will return null.
        return customerDao.findById(id).orElse(null);
    }

    @Transactional
    public Customer save(Customer customer){
        return customerDao.save(customer);
    }

    @Transactional
    public void delete(Long id){
        customerDao.deleteById(id);
    }
}
