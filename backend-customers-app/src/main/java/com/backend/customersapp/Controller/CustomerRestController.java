package com.backend.customersapp.Controller;

import com.backend.customersapp.Entity.Customer;
import com.backend.customersapp.Service.CustomerService;
import com.backend.customersapp.Service.UploadService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.io.Resource;
import org.springframework.core.io.UrlResource;
import org.springframework.dao.DataAccessException;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.BindingResult;
import org.springframework.validation.FieldError;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import javax.validation.Valid;
import java.io.File;
import java.io.IOException;
import java.net.MalformedURLException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.*;
import java.util.stream.Collectors;

//This define what domains have access to server and do different https actions.
@CrossOrigin(origins = {"http://localhost:4200"})
@RestController
@RequestMapping("/api")
public class CustomerRestController {

    private final CustomerService customerService;
    private final UploadService uploadService;

    @Autowired
    public CustomerRestController(CustomerService customerService, UploadService uploadService){
        this.customerService = customerService;
        this.uploadService = uploadService;
    }

    @GetMapping("/customers")
    public List<Customer> showCustomers(){
        return customerService.findAll();
    }

    @GetMapping("/customers/page/{page}")
    public Page<Customer> showCustomers(@PathVariable int page){
        //Here it's assigned page's number and how many register will be obtained.
        return customerService.findAll(PageRequest.of(page, 6));
    }

    @GetMapping("/customers/{id}")
    public ResponseEntity<?> show(@PathVariable Long id){

        Customer customer;
        Map<String, Object> response = new HashMap<>();

        try{
            customer = customerService.findById(id);

            if(customer == null){
                response.put("message", "Customer id:" + id + " does not exist into database!");
                return new ResponseEntity<>(response, HttpStatus.NOT_FOUND);
            }

        }catch (DataAccessException e){
            response.put("message", "There was a problem querying database!");
            response.put("error", e.getMostSpecificCause().getMessage());
            return new ResponseEntity<>(response, HttpStatus.INTERNAL_SERVER_ERROR);
        }
        return new ResponseEntity<>(customer, HttpStatus.OK);
    }

    //RequestBody it's used to deserialize json that comes with the request into an appropriate java object.
    @PostMapping("/customers")//Use @Valid to validate rules set up in entity class, and binding result has all the possible errors.
    public ResponseEntity<?> create(@Valid @RequestBody Customer customer, BindingResult result){

        Customer returnedCustomer;
        Map<String, Object> response = new HashMap<>();

        //If there are any errors coming from request, gather and return them in responseEntity.
        if(result.hasErrors()){
            //Map fieldErrors to transform every fieldError in string, it's similar to javaScript.
            List<String> errors = result.getFieldErrors().stream().map(
                    error -> "Field " + error.getField() + " " + error.getDefaultMessage()
            ).collect(Collectors.toList());

            response.put("jsonErrors", errors);
            return new ResponseEntity<>(response, HttpStatus.BAD_REQUEST);
        }

        try{
            returnedCustomer = customerService.save(customer);
        }catch (DataAccessException e){
            response.put("message", "There was a problem querying database!");
            response.put("error", e.getMostSpecificCause().getMessage());
            return new ResponseEntity<>(response, HttpStatus.INTERNAL_SERVER_ERROR);
        }

        response.put("message", "Customer has been created successfully!");
        response.put("customer", returnedCustomer);
        return new ResponseEntity<>(response, HttpStatus.CREATED);
    }

    @DeleteMapping("/customers/{id}")
    public ResponseEntity<?> delete(@PathVariable Long id){

        Map<String, Object> response = new HashMap<>();
        Customer returnedCustomer = null;

        try{
            //Before deleting customer, also delete a photo if it has one.
            returnedCustomer = customerService.findById(id);
            String previousPhotoName = returnedCustomer.getPhoto();
            //Delete customer's image before deleting it, to not save something that will not be used again.
            uploadService.deleteFile(previousPhotoName);

            customerService.delete(id);
        }catch (DataAccessException e){
            response.put("message", "There was a problem querying database!");
            response.put("error", e.getMostSpecificCause().getMessage());
            return new ResponseEntity<>(response, HttpStatus.INTERNAL_SERVER_ERROR);
        }
        response.put("message", "Customer deleted successfully!");
        return new ResponseEntity<>(response, HttpStatus.NO_CONTENT);
    }

    @PutMapping("/customers/{id}")
    public ResponseEntity<?> update(@Valid @RequestBody Customer customer, BindingResult result, @PathVariable Long id){

        Customer returnedCustomer = null;
        Map<String, Object> response = new HashMap<>();

        if(result.hasErrors()){

            List<String> errors = result.getFieldErrors().stream().map(
                    fieldError -> "Field " + fieldError.getField() + " " + fieldError.getDefaultMessage()
            ).collect(Collectors.toList());

            response.put("jsonErrors", errors);
            return new ResponseEntity<>(response, HttpStatus.BAD_REQUEST);
        }

        try{
            returnedCustomer = customerService.findById(id);

            if(returnedCustomer == null){
                response.put("message","Customer id: " + id + " does not exist into database!");
                return new ResponseEntity<>(response, HttpStatus.NOT_FOUND);
            }

            returnedCustomer.setName(customer.getName());
            returnedCustomer.setLastName(customer.getLastName());
            returnedCustomer.setEmail(customer.getEmail());
            returnedCustomer.setCreated(customer.getCreated());

            customerService.save(returnedCustomer);

        }catch (DataAccessException e){
            response.put("message", "There was a problem querying database!");
            response.put("error", e.getMostSpecificCause().getMessage());
            return new ResponseEntity<>(response, HttpStatus.INTERNAL_SERVER_ERROR);
        }

        response.put("message", "Customer id: " + id + " has been updated successfully!");
        response.put("customer", returnedCustomer);
        return new ResponseEntity<>(response, HttpStatus.CREATED);
    }

    @RequestMapping("/customers/upload")
    public ResponseEntity<?> uploadImage(@RequestParam("file") MultipartFile file, @RequestParam("id") Long id){

        Map<String, Object> response = new HashMap<>();
        Customer returnedCustomer;

        returnedCustomer = customerService.findById(id);

        if(!file.isEmpty()) {
            String fileName = null;
            try{
                fileName = uploadService.copyFile(file);
            } catch (IOException e) {
                response.put("message", "Error uploading photo:(");
                response.put("error", e.getCause().getMessage());
                return new ResponseEntity<>(response, HttpStatus.INTERNAL_SERVER_ERROR);
            }

            //This block validates if customer has uploaded a photo previously, then just save the current one and delete the old one.
            String previousPhotoName = returnedCustomer.getPhoto();

            uploadService.deleteFile(previousPhotoName);

            //If everything goes well, save filename in customer's photo field.
            returnedCustomer.setPhoto(fileName);
            //And save customer with their photo.
            customerService.save(returnedCustomer);

            //Set up response.
            response.put("message", "You've save customer's photo: " + fileName);
            response.put("customer", returnedCustomer);
        }
        return new ResponseEntity<>(response, HttpStatus.CREATED);
    }

    @GetMapping("/uploads/img/{imageName:.+}")
    public ResponseEntity<Resource> showPhoto(@PathVariable String imageName){

        Resource resource = null;

        try {
            resource = uploadService.load(imageName);
        } catch (MalformedURLException e) {
            e.printStackTrace();
        }

        HttpHeaders headers = new HttpHeaders();
        headers.add(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=\"" + resource.getFilename() + "\"");

        return new ResponseEntity<>(resource, headers, HttpStatus.OK);
    }
}