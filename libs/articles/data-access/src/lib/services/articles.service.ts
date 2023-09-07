import { Injectable } from '@angular/core';
import { Observable, forkJoin, of } from 'rxjs';
import { ApiService } from '@realworld/core/http-client';
import { HomeService } from '../../../../../../libs/home/src/lib/home.service';
import { Article, ArticleResponse, MultipleCommentsResponse, SingleCommentResponse } from '@realworld/core/api-types';
import { ArticleListConfig } from '../+state/article-list/article-list.reducer';
import { HttpParams } from '@angular/common/http';
import { switchMap } from 'rxjs/operators';

@Injectable({ providedIn: 'root' })
export class ArticlesService {
  constructor(
    private apiService: ApiService,
    private homeService: HomeService  // Inject the HomeService
  ) {}

  getArticle(slug: string): Observable<ArticleResponse> {
    return this.apiService.get<ArticleResponse>('/articles/' + slug);
  }

  getArticles(): Observable<ArticleResponse> {
    return this.apiService.get<ArticleResponse>('/articles');
  }

  getComments(slug: string): Observable<MultipleCommentsResponse> {
    return this.apiService.get<MultipleCommentsResponse>(`/articles/${slug}/comments`);
  }

  deleteArticle(slug: string): Observable<void> {
    return this.apiService.delete<void>('/articles/' + slug);
  }

  deleteComment(commentId: number, slug: string): Observable<void> {
    return this.apiService.delete<void>(`/articles/${slug}/comments/${commentId}`);
  }

  addComment(slug: string, payload = ''): Observable<SingleCommentResponse> {
    return this.apiService.post<SingleCommentResponse, { comment: { body: string } }>(`/articles/${slug}/comments`, {
      comment: { body: payload },
    });
  }

  query(config: ArticleListConfig): Observable<{ articles: Article[]; articlesCount: number }> {
    return this.apiService.get(
      '/articles' + (config.type === 'FEED' ? '/feed' : ''),
      this.toHttpParams(config.filters),
    );
  }

  publishArticle(article: Article): Observable<ArticleResponse> {
    return this.homeService.getTags().pipe(
      switchMap(existingTagsResponse => {
        const existingTags = existingTagsResponse.tags;
        // Filter out the tags from article.tagList that are already present
        let newTags = article.tagList.filter(tag => !existingTags.includes(tag));

        newTags = newTags.map(tag => tag.trim());
        // If there are new tags, set them
        if (newTags.length > 0) {
          const setTagsObservables = newTags.map(tagName => this.homeService.setTags(tagName));
          return forkJoin(setTagsObservables);
        }
        // If no new tags, return an empty observable, to still be compliant with the pipe chain
        return of(null);
      }),
      switchMap(() => {
        if (article.slug) {
          return this.apiService.put<ArticleResponse, ArticleResponse>('/articles/' + article.slug, { article: article });
        }
        return this.apiService.post<ArticleResponse, ArticleResponse>('/articles/', { article: article });
      })
    );
  }
  

  // TODO: remove any
  private toHttpParams(params: any) {
    return Object.getOwnPropertyNames(params).reduce((p, key) => p.set(key, params[key]), new HttpParams());
  }
}
