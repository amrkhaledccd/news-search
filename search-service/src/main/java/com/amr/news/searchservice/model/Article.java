package com.amr.news.searchservice.model;

import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.ToString;
import org.springframework.data.annotation.Id;
import org.springframework.data.elasticsearch.annotations.Document;

import java.util.Date;

@Data
@NoArgsConstructor
@ToString
@Document(indexName = "news", type = "_doc")
public class Article {

  @Id
  private String id;
  private Source source;
  private String author;
  private String title;
  private String description;
  private String url;
  private String urlToImage;
  private Date publishedAt;
  private String category;
  private String content;
}
