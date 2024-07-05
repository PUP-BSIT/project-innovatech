import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../environments/environment';
@Injectable()
export class CommunityService {
  private apiUrl = environment.apiUrl; 

  constructor(private http: HttpClient) {}

  getPosts(userId?: string): Observable<any> {
    const url = userId ? `${this.apiUrl}/get_posts.php?user_id=${userId}` : `${this.apiUrl}/get_posts.php`;
    return this.http.get(url);
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

  likePost(payload: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/like_post.php`, payload);
  }

  getUserPosts(userId: number, page: number, pageSize: number): Observable<any> {
    return this.http.get<any[]>(`${this.apiUrl}/get_user_posts.php?user_id=${userId}&page=${page}&pageSize=${pageSize}`);
  }
}

