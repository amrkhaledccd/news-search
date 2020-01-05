package com.amr.news.searchservice.endpoint;

import com.amr.news.searchservice.model.Article;
import com.amr.news.searchservice.service.ArticleService;
import com.amr.news.searchservice.util.AppConsts;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.Arrays;
import java.util.List;

@RestController
@CrossOrigin("*")
public class SearchEndpoint {

    @Autowired
    private ArticleService articleService;

    @GetMapping("/_search")
    public ResponseEntity<?> search(@RequestParam(value = "q") String query,
                                    @RequestParam(value = "f", defaultValue = AppConsts.DEFAULT_FILTER) String filter,
                                    @RequestParam(value = "page", defaultValue = AppConsts.DEFAULT_PAGE_NUMBER) int page,
                                    @RequestParam(value = "size", defaultValue = AppConsts.DEFAULT_PAGE_SIZE) int size) {

        Iterable<Article> articles = articleService.search(query, page, size, filter);
        return  ResponseEntity.ok(articles);
    }

    @GetMapping("/_autocomplete")
    public ResponseEntity<?> autocomplete(@RequestParam(value = "prefix") String prefix,
                                          @RequestParam(value = "f", defaultValue = AppConsts.DEFAULT_FILTER) String filter) {

        List<String> suggestions = articleService.autocomplete(prefix, filter);
        return  ResponseEntity.ok(suggestions);
    }
}
