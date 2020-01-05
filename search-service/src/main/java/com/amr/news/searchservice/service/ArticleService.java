package com.amr.news.searchservice.service;

import com.amr.news.searchservice.model.Article;
import com.amr.news.searchservice.util.AppConsts;
import com.amr.news.searchservice.util.CategoryEnum;
import lombok.extern.slf4j.Slf4j;
import org.elasticsearch.action.search.SearchResponse;
import org.elasticsearch.common.xcontent.ToXContent;
import org.elasticsearch.common.xcontent.XContent;
import org.elasticsearch.common.xcontent.XContentBuilder;
import org.elasticsearch.index.query.BoolQueryBuilder;
import org.elasticsearch.index.query.MultiMatchQueryBuilder;
import org.elasticsearch.search.suggest.SuggestBuilder;
import org.elasticsearch.search.suggest.SuggestBuilders;
import org.elasticsearch.search.suggest.completion.CompletionSuggestionBuilder;
import org.elasticsearch.search.suggest.completion.context.CategoryQueryContext;
import org.elasticsearch.search.suggest.completion.context.ContextBuilder;
import org.elasticsearch.search.suggest.completion.context.ContextMapping;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.elasticsearch.core.ElasticsearchTemplate;
import org.springframework.data.elasticsearch.core.query.NativeSearchQueryBuilder;
import org.springframework.data.elasticsearch.core.query.SearchQuery;
import org.springframework.stereotype.Service;
import org.springframework.util.StringUtils;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.stream.Collectors;

import static org.elasticsearch.index.query.QueryBuilders.*;

@Service
@Slf4j
public class ArticleService {

    @Autowired
    private ElasticsearchTemplate elasticsearchTemplate;

    public Page<Article> search(String query, int page, int size, String filter) {
        Pageable pageable = PageRequest.of(page, size);
        MultiMatchQueryBuilder multiMatchQueryBuilder =
                multiMatchQuery(query, "content", "title", "description");

       BoolQueryBuilder boolQuery = boolQuery().must(multiMatchQueryBuilder);

        if(filter != null &&
                !filter.isEmpty() &&
                !CategoryEnum.ALL.name().equalsIgnoreCase(filter)) {
            
           boolQuery.filter(termQuery("category.keyword", filter));
        }

        SearchQuery searchQuery = new NativeSearchQueryBuilder()
                .withQuery(boolQuery)
                .withPageable(pageable)
                .build();

       return elasticsearchTemplate.queryForPage(searchQuery, Article.class);
    }

    public List<String> autocomplete(String prefix, String filter) {

        LinkedHashMap<String, List<? extends ToXContent>> queryContexts = new LinkedHashMap<>();
        List<ToXContent> contexts = new ArrayList<>();

        if(StringUtils.isEmpty(filter) || CategoryEnum.ALL.name().equalsIgnoreCase(filter)) {
            Arrays.stream(CategoryEnum.values())
                    .map(category -> category.name().toLowerCase())
                    .forEach(category ->
                            contexts.add(new CategoryQueryContext.Builder().setCategory(category).build()));
        } else {
            contexts.add(new CategoryQueryContext.Builder().setCategory(filter).build());
        }

        queryContexts.put("category", contexts);

        CompletionSuggestionBuilder suggestBuilder = SuggestBuilders
                .completionSuggestion(AppConsts.COMPLETION_FIELD)
                .prefix(prefix)
                .size(AppConsts.AUTOCOMPLETE_SIZE)
                .skipDuplicates(true)
                .contexts(queryContexts)
                .analyzer("standard");

        SearchResponse response = elasticsearchTemplate.suggest(
                new SuggestBuilder().addSuggestion(AppConsts.AUTOCOMPLETE_NAME, suggestBuilder),
                AppConsts.NEWS_INDEX);

        return response
                .getSuggest()
                .getSuggestion(AppConsts.AUTOCOMPLETE_NAME)
                .getEntries().stream()
                .flatMap(entry -> entry.getOptions().stream())
                .map(option -> option.getText().toString())
                .collect(Collectors.toList());
    }
}
