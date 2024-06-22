import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class CommunityService {
  private apiUrl = 'http://localhost/controller'; 

  constructor(private http: HttpClient) {}

  getPosts(): Observable<any> {
    return this.http.get(`${this.apiUrl}/get_posts.php`);
  }

  addPost(postData: FormData): Observable<any> {
    return this.http.post(`${this.apiUrl}/community.php`, postData); 
  }

  addComment(commentData: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/add_comment.php`, commentData); 
  }
}

