---
layout: default
title: Publications
permalink: /publications/
---

<section class="page-title">
  <p class="eyebrow" data-i18n-zh="研究" data-i18n-en="Research">研究</p>
  <h1 data-i18n-zh="论文" data-i18n-en="Publications">论文</h1>
  <p data-i18n-zh="这里整理我的论文、项目链接和相关研究产出。" data-i18n-en="A curated list of my publications, project links, and related research outputs.">这里整理我的论文、项目链接和相关研究产出。</p>
</section>

<section class="publication-list">
  {% assign publications = site.data.publications | sort: "year" | reverse %}
  {% for publication in publications %}
    <article class="publication-item">
      <div>
        <h2>{{ publication.title }}</h2>
        <p>{{ publication.authors }}</p>
        <p class="meta">{{ publication.venue }}, {{ publication.year }}</p>
        {% if publication.summary %}
          <p>{{ publication.summary }}</p>
        {% endif %}
      </div>
      {% if publication.links %}
        <div class="link-row">
          {% for link in publication.links %}
            <a href="{{ link[1] }}">{{ link[0] }}</a>
          {% endfor %}
        </div>
      {% endif %}
    </article>
  {% endfor %}
</section>
