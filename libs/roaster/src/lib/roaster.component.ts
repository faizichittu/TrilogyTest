// Roster Component
import { Component, OnInit } from '@angular/core';
import { ArticlesService } from '../../../articles/data-access/src/lib/services/articles.service';
import { CommonModule } from '@angular/common';
import { ChangeDetectorRef } from '@angular/core';


interface AuthorStats {
    username: string;
    totalArticles: number;
    totalLikes: number;
  }
  
  @Component({
    selector: 'roaster',
    templateUrl: './roaster.component.html',
    styleUrls: ['./roaster.component.css'],
    standalone: true,
    imports: [CommonModule],
  })
  
  export class RoasterComponent implements OnInit {
  
    authorsStats: AuthorStats[] = [];
    hello: string = "yellow"
  
    constructor(private articleService: ArticlesService, private cdr: ChangeDetectorRef) { }
  
    ngOnInit(): void {
      console.log("hello");
      this.articleService.getArticles().subscribe((articles: any) => {
        let authorsMap = new Map<string, AuthorStats>();
  
        console.log(articles);
        articles['articles'].map((article:any) => {
          const { username } = article.author;
          const stats = authorsMap.get(username) || {
            username: username,
            totalArticles: 0,
            totalLikes: 0
          };
  
          stats.totalArticles++;
          stats.totalLikes += article.favoritesCount;
  
          authorsMap.set(username, stats);
        });
  
        this.authorsStats = Array.from(authorsMap.values()).sort((a, b) => b.totalLikes - a.totalLikes);
        console.log(this.authorsStats);
        this.cdr.detectChanges();
      });
    }
  
  }
  