# News Search
A news search engine based on Spring data and Elasticsearch
# Features:
  <ul>
  <li>Search in title, description and content</li>
  <li>Paginate search result</li>
  <li>Filter search results based on category</li>
  <li>Autocomplete</li>
  </ul>
   
  [![Watch the video](https://github.com/amrkhaledccd/news-search/blob/master/video.png)](https://www.youtube.com/watch?v=iGoe1jlMs20)
   
# Run on Docker
<ul>
  <li>Navigate to {project-folder}/search-service</li>
  <li>Run  <code>mvn clean install</code></li>
  li>Navigate to {project-folder}/docker</li>
  <li>Run  <code>docker compose up</code></li>
  <li>Open a browser and type <code>http://localhost:3000</code></li>
</ul>
 <i>It may take some minutes to download all the dependencies depends on internet connection, please be patient.</i>
 
# Run from IDE
<ul>
  li>Navigate to {project-folder}/docker</li>
  <li>Run  <code>docker compose -f elastic_kibana.yaml up</code></li>
  <li>Run search-service from IDE or by typing <code>mvn spring-boot:run</code></li>
<li>Run search-app by typeing <code>npm install</code> for the first time then type <code>npm start</code></li>
  <li>Open a browser and type <code>http://localhost:3000</code></li>
</ul>

# Data
The indexed data is powered by https://rapidapi.com 
