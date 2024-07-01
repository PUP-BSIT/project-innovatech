import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../environments/environment';
@Injectable({
  providedIn: 'root'
})
export class CommunityService {
  private apiUrl = environment.apiUrl; 

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

  getUserProfile(userId: string): Observable<any> {
    return this.http.get(`${this.apiUrl}/get_user_profile.php?user_id=${userId}`);
  }
}
