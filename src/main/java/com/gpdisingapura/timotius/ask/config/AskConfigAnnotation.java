package com.gpdisingapura.timotius.ask.config;

import com.mongodb.MongoClient;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.beans.factory.config.PropertyPlaceholderConfigurer;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.core.io.ClassPathResource;
import org.springframework.data.mongodb.MongoDbFactory;
import org.springframework.data.mongodb.core.MongoTemplate;
import org.springframework.data.mongodb.core.SimpleMongoDbFactory;

import java.util.Properties;

/**
 * Created by Marthen Luther on 6/20/16.
 */

@Configuration
public class AskConfigAnnotation {

    @Bean
    public static PropertyPlaceholderConfigurer properties(){
        PropertyPlaceholderConfigurer ppc = new PropertyPlaceholderConfigurer();
        ClassPathResource[] resources = new ClassPathResource[ ]
                { new ClassPathResource( "application.properties" ) };
        ppc.setLocations( resources );
        ppc.setIgnoreUnresolvablePlaceholders( true );
        return ppc;
    }

    @Value( "${MONGO_DB_NAME}" ) private String dbName;
    @Value( "${MONGO_HOST}" ) private String dbHost;
    @Value( "${MONGO_PORT}" ) private int dbPort;

    @Bean
	public MongoDbFactory mongoDbFactory() throws Exception {
        MongoClient mongoClient= new MongoClient(dbHost, dbPort);
		return new SimpleMongoDbFactory(mongoClient, dbName);
	}

    @Bean
	public MongoTemplate mongoTemplate() throws Exception {
		MongoTemplate mongoTemplate = new MongoTemplate(mongoDbFactory());
		return mongoTemplate;
		
	}

}