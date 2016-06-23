//package com.gpdisingapura.timotius.ask;
//
//import com.gpdisingapura.timotius.ask.config.AskConfigAnnotation;
//import com.gpdisingapura.timotius.ask.model.Question;
//import org.springframework.boot.autoconfigure.SpringBootApplication;
//import org.springframework.context.ApplicationContext;
//import org.springframework.context.annotation.AnnotationConfigApplicationContext;
//import org.springframework.data.mongodb.core.MongoOperations;
//import org.springframework.data.mongodb.core.query.Criteria;
//import org.springframework.data.mongodb.core.query.Query;
//import org.springframework.data.mongodb.core.query.Update;
//
//import java.util.Date;
//import java.util.List;
//
////@SpringBootApplication
//public class DemoApplication {
//
//
//    //Local testing..
//    public static void main(String[] args) {
//
//        // For XML
////        ApplicationContext ctx = new GenericXmlApplicationContext("SpringConfig.xml");
//
//        // For Annotation
//        ApplicationContext ctx = new AnnotationConfigApplicationContext(AskConfigAnnotation.class);
//        MongoOperations mongoOperation = (MongoOperations) ctx.getBean("mongoTemplate");
//
//        Question question = new Question("pertanyaan 1", new Date(), "marthen");
//        Question question2 = new Question("pertanyaan 2", new Date(), "rut");
//
//        // save
//        mongoOperation.save(question);
//        mongoOperation.save(question2);
//
//
//        System.out.println("question 1: " + question);
//        System.out.println("question 2: " + question2);
//
//        // query to search user
//        Query searchUserQuery = new Query(Criteria.where("postedBy").is("marthen"));
//
//        // find the saved user again.
//        Question savedQuestion = mongoOperation.findOne(searchUserQuery, Question.class);
//        System.out.println("find - savedQuestion: " + savedQuestion);
//
//        // update password
//        mongoOperation.updateFirst(searchUserQuery, Update.update("question", "question 1 - modified"),
//                Question.class);
//
//        // find the updated user object
////        User updatedUser = mongoOperation.findOne(
////                new Query(Criteria.where("username").is("mkyong")), User.class);
////
////        System.out.println("3. updatedUser : " + updatedUser);
////
////        //delete
////        mongoOperation.remove(searchUserQuery, User.class);
//
//        // List, it should be empty now.
//        List<Question> listUser = mongoOperation.findAll(Question.class);
//        System.out.println("Number of questions = " + listUser.size());
//
////    }
//	}
//
//}
