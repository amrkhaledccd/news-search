package com.amr.news.searchservice.service;

import com.amr.news.searchservice.model.Article;
import com.amr.news.searchservice.util.AppConsts;
import org.elasticsearch.index.query.QueryBuilders;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.data.elasticsearch.core.ElasticsearchTemplate;
import org.springframework.data.elasticsearch.core.query.NativeSearchQueryBuilder;
import org.springframework.data.elasticsearch.core.query.SearchQuery;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;
import java.io.InputStream;
import java.io.InputStreamReader;
import java.io.LineNumberReader;

@Service
public class IndexInitializer {

    @Autowired
    private ElasticsearchTemplate elasticsearchTemplate;

    @Autowired
    private RestTemplate restTemplate;

    @Value("${spring.data.elasticsearch.host}")
    private String host;

    @Scheduled(initialDelay = 30000, fixedDelay=Long.MAX_VALUE)
    public void init() {
       boolean indexExists = elasticsearchTemplate.indexExists(AppConsts.NEWS_INDEX);

       if(!indexExists) {
           createIndex();
       }

      long count = countDocuments();

       if(count < 100) {
           bulkIndex();
       }
    }

    private void createIndex() {
        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);

        HttpEntity<String> entity = new HttpEntity<>(loadFromFile("index_settings.json") ,headers);

        restTemplate.put("http://" + host + ":9200/" + AppConsts.NEWS_INDEX, entity);
    }

    private void bulkIndex() {
        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.parseMediaType("application/x-ndjson"));

        HttpEntity<String> entity = new HttpEntity<>(loadFromFile("news-bulk.json") ,headers);

        restTemplate.put("http://" + host + ":9200/" + AppConsts.NEWS_INDEX + "/_bulk", entity);
    }

    private long countDocuments() {
        SearchQuery searchQuery =
                new NativeSearchQueryBuilder().withQuery(QueryBuilders.matchAllQuery()).build();

        return elasticsearchTemplate.count(searchQuery, Article.class);
    }

    protected String loadFromFile(String fileName) throws IllegalStateException {
        StringBuilder buffer = new StringBuilder();
        try {
            InputStream is = getClass().getClassLoader().getResourceAsStream(fileName);
            LineNumberReader reader = new LineNumberReader(new InputStreamReader(is));
            while (reader.ready()) {
                buffer.append(reader.readLine());
                buffer.append("\n");
            }
        } catch (Exception e) {
            throw new IllegalStateException("couldn't load file " + fileName, e);
        }
        
        return buffer.toString();
    }
}
