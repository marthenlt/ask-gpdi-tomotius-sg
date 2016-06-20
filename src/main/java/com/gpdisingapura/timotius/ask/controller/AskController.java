package com.gpdisingapura.timotius.ask.controller;

import com.gpdisingapura.timotius.ask.model.Question;
import com.gpdisingapura.timotius.ask.model.QuestionDoesNotExistException;
import com.gpdisingapura.timotius.ask.service.AskService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;

/**
 * Created by Marthen on 6/20/16.
 */

@RestController
@RequestMapping("/ask")
public class AskController {

    @Autowired
    AskService askService;

    //default question post..
    @RequestMapping(method = RequestMethod.POST, value = "/post")
    ResponseEntity<Void> postQuestionAnonymously(@RequestParam("question") String q) {
        askService.postQuestionAnonymously(q);
        HttpHeaders headers = new HttpHeaders();
        return new ResponseEntity<Void>(headers, HttpStatus.CREATED);
    }

    @RequestMapping(method = RequestMethod.POST, value = "/postBy")
    ResponseEntity<Void> postQuestion(@RequestParam("postedBy") String postedBy, @RequestParam("question") String q) {
        askService.postQuestion(postedBy, q);
        HttpHeaders headers = new HttpHeaders();
        return new ResponseEntity<Void>(headers, HttpStatus.CREATED);
    }

    @RequestMapping(method = RequestMethod.GET, value = "/show/{questionId}", produces = {MediaType.APPLICATION_JSON_VALUE})
    ResponseEntity<Question> findById(@PathVariable String questionId) throws QuestionDoesNotExistException {
        Question question = askService.findById(questionId);
        return new ResponseEntity<Question>(question, HttpStatus.OK);
    }

    @RequestMapping(method = RequestMethod.GET, value = "/show/postedBy/{name}", produces = {MediaType.APPLICATION_JSON_VALUE})
    ResponseEntity<List<Question>> findByPostedBy(@PathVariable String name) throws QuestionDoesNotExistException {
        List<Question> questions = askService.findByPostedBy(name);
        return new ResponseEntity<List<Question>>(questions, HttpStatus.OK);
    }

    @RequestMapping(method = RequestMethod.GET, value = "/showall", produces = {MediaType.APPLICATION_JSON_VALUE})
    ResponseEntity<List<Question>> findAll() throws QuestionDoesNotExistException {
        List<Question> questions = askService.findAll();
        return new ResponseEntity<List<Question>>(questions, HttpStatus.OK);
    }

    @RequestMapping(method = RequestMethod.PUT, value = "/update/{questionId}", consumes = MediaType.APPLICATION_JSON_VALUE, produces = {
            MediaType.APPLICATION_JSON_VALUE})
    ResponseEntity<Void> modifyById(@PathVariable String questionId, @RequestBody Map<String, String> body)
            throws QuestionDoesNotExistException {
        askService.modifyById(questionId);
        return new ResponseEntity<Void>(HttpStatus.OK);
    }

    @RequestMapping(method = RequestMethod.DELETE, value = "/delete/{questionId}")
    ResponseEntity<Void> deleteQuestion(@PathVariable String questionId) throws QuestionDoesNotExistException {
        askService.deleteQuestion(questionId);
        return new ResponseEntity<Void>(HttpStatus.OK);
    }


}
