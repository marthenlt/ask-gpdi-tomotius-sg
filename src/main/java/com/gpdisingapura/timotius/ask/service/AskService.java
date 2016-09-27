package com.gpdisingapura.timotius.ask.service;

import com.gpdisingapura.timotius.ask.model.Question;
import com.gpdisingapura.timotius.ask.model.QuestionDoesNotExistException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Sort;
import org.springframework.data.mongodb.core.MongoOperations;
import org.springframework.data.mongodb.core.query.Criteria;
import org.springframework.data.mongodb.core.query.Query;
import org.springframework.data.mongodb.core.query.Update;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.Date;
import java.util.List;
import java.util.Map;

/**
 * Created by Marthen on 6/20/16.
 */

@Service
public class AskService {

    @Autowired
    MongoOperations mongoOperation;

    public void postQuestionAnonymously(String category, String q) {
        Question question = new Question(category, q);
        mongoOperation.save(question);
    }

    public void postQuestion(String postedBy, String category, String q) {
        Question question = new Question(category, q, postedBy);
        mongoOperation.save(question);
    }

    public Question findById(String questionId) throws QuestionDoesNotExistException {
        // query to search question by Id
        Question question = mongoOperation.findById(questionId, Question.class);
        return question;
    }

    public List<Question> showInPagination(Integer pageNo, Integer itemPerPage) throws QuestionDoesNotExistException {
        Query searchUserQuery = new Query(Criteria.where("isAnswered").is(false))
                .skip((pageNo) * itemPerPage)
                .limit(itemPerPage)
                .with(new Sort(Sort.Direction.DESC, "postedAt"));
        List<Question> questions = mongoOperation.find(searchUserQuery, Question.class);
        return questions;
    }

    public Long noOfRecordFoundForIsAnsweredIsFalse() throws QuestionDoesNotExistException {
        Query searchUserQueryIsAnswered = new Query(Criteria.where("isAnswered").is(false));
        return mongoOperation.count(searchUserQueryIsAnswered, Question.class);

    }

    public List<Question> findByPostedBy(String name) throws QuestionDoesNotExistException {
        List<Question> questions = new ArrayList<Question>();
        // query to search question by name
        Query searchUserQuery = new Query(Criteria.where("postedBy").is(name));
        questions = mongoOperation.find(searchUserQuery, Question.class);
        return questions;
    }

    public List<Question> findAll() throws QuestionDoesNotExistException {
//        List<Question> questions = new ArrayList<Question>();
//        questions = mongoOperation.findAll(Question.class);
        Query searchUserQuery = new Query(Criteria.where("isAnswered").is(false))
                .with(new Sort(Sort.Direction.DESC, "postedAt"));
        List<Question> questions = mongoOperation.find(searchUserQuery, Question.class);
        return questions;
    }

    public void modifyById(String questionId)
            throws QuestionDoesNotExistException {
        mongoOperation.updateFirst(
                new Query(Criteria.where("id").is(questionId)),
                Update.update("isAnswered", true),
                Question.class);
    }

    public void deleteQuestion(String questionId) {
        Question question = mongoOperation.findById(questionId, Question.class);
        mongoOperation.remove(question);
    }

    public void deleteAll() {
        mongoOperation.dropCollection(Question.class);
    }


}
