# strapi-client-sdk-experiment

Pequeño experimento para intentar simular un ORM con el SDK de Strapi

Uso:

```Javascript
import Article from '@models/article'

const allArticles = await Article.all();

const singleArticle = await Article.findOne('article-document-id');

const conditionalArticles = await Article.where('slug','=','my-fist-post');

const multiConditionalArticles = await Article.where('slug','=','my-fist-post').or().where('slug', '!=', 'test-article').where('title','=','New Article');

const rawQuery = await Article.rawQuery({
  filters: {
    chef: {
      restaurants: {
        stars: {
          $eq: 5,
        },
      },
    },
  },
})

const newArticle = await Article.create({ title: 'New Article', content: '...' }); // -> no implementado

const updatedArticle = await articles.update('article-document-id', { title: 'Updated Title' }); // -> no implementado

```
