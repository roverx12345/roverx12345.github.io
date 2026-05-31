---
layout: default
title: Publications
permalink: /publications/
---

<section class="page-title">
  <p class="eyebrow">Research</p>
  <h1>Publications</h1>
  <p>Maintain this list in <code>_data/publications.yml</code>.</p>
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
