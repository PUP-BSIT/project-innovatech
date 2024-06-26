import { Component, ViewChild, TemplateRef, OnInit } from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { CommunityService } from '../../services/community-service.service';
import { LoginAuthentication } from '../../services/login-authentication.service';

@Component({
  selector: 'app-community',
  templateUrl: './community.component.html',
  styleUrls: ['./community.component.css']
})
export class CommunityComponent implements OnInit {
  @ViewChild('postDetailTemplate') postDetailTemplate: TemplateRef<any>;
  dialogRef: MatDialogRef<any>;
  newPostText: string = '';
  newPostImage: File | null = null;
  newPostImageSrc: string | null = null;
  newCommentText: string = '';
  posts: any[] = [];

  constructor(
    public dialog: MatDialog,
    private communityService: CommunityService,
    private loginAuthService: LoginAuthentication
  ) {}

  ngOnInit(): void {
    this.loadPosts();
  }

  loadPosts(): void {
    this.communityService.getPosts().subscribe(
      (response: any) => {
        if (response.success) {
          this.posts = response.posts;
        } else {
          console.error('Error fetching posts:', response.message);
        }
      },
      error => {
        console.error('HTTP error:', error);
      }
    );
  }
  

  openPostDetail(post: any, template: TemplateRef<any>): void {
    this.dialogRef = this.dialog.open(template, {
      data: { post },
      width: '600px',
      panelClass: 'custom-dialog-container'
    });
  }

  closeDialog(): void {
    if (this.dialogRef) {
      this.dialogRef.close();
    }
  }

  likePost(post: any, event: Event): void {
    event.stopPropagation();
    post.liked = !post.liked;
    post.likes += post.liked ? 1 : -1;
  }

  commentOnPost(post: any, event: Event): void {
    event.stopPropagation();
    this.openPostDetail(post, this.postDetailTemplate);
  }

  toggleLike(comment: any): void {
    comment.liked = !comment.liked;
  }

  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files[0]) {
      this.newPostImage = input.files[0];
      const reader = new FileReader();
      reader.onload = () => {
        this.newPostImageSrc = reader.result as string;
      };
      reader.readAsDataURL(this.newPostImage);
    }
  }

  addPost(): void {
    const userId = this.loginAuthService.getUserId();
    if (!userId) {
      console.error('User not logged in');
      return;
    }

    if (this.newPostText.trim()) {
      const formData = new FormData();
      formData.append('user_id', userId);
      formData.append('caption', this.newPostText);
      if (this.newPostImage) {
        formData.append('image', this.newPostImage, this.newPostImage.name);
      }

      this.communityService.addPost(formData).subscribe(
        response => {
          console.log('Response from server:', response);
          if (response.success) {
            this.loadPosts();
            this.newPostText = '';
            this.newPostImage = null;
            this.newPostImageSrc = null;
          } else {
            console.error('Error adding post:', response.message);
          }
        },
        error => {
          console.error('HTTP error:', error);
          alert('An error occurred while adding the post: ' + error.message);
        }
      );
    }
  }

  addComment(post: any): void {
    const commentData = {
      post_id: post.id,
      user_id: this.loginAuthService.getUserId(),
      text: this.newCommentText
    };

    this.communityService.addComment(commentData).subscribe(
      response => {
        console.log('Response from server:', response);
        if (response.success) {
          this.newCommentText = '';
          this.loadPosts();
        } else {
          console.error('Error adding comment:', response.message);
        }
      },
      error => {
        console.error('HTTP error:', error);
        alert('An error occurred while adding the comment: ' + error.message);
      }
    );
  }
}
