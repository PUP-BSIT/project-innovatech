import { Component, ViewChild, TemplateRef, OnInit, ChangeDetectorRef } from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { CommunityService } from '../../services/community-service.service';
import { LoginAuthentication } from '../../services/login-authentication.service';
import { UserService } from '../../services/user-service.service';

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
  currentPost: any = null;

  constructor(
    public dialog: MatDialog,
    private communityService: CommunityService,
    private loginAuthService: LoginAuthentication,
    private cdr: ChangeDetectorRef,
    private userService: UserService,
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
    this.currentPost = post;
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
    const userId = this.loginAuthService.getUserId();
    if (!userId) {
      console.error('User not logged in');
      return;
    }

    // Fetch user profile data using userService
    this.userService.getUserProfile().subscribe(
      userProfile => {
        const { username, profile_picture } = userProfile;
        
        const commentData = {
          community_recipe_id: post.communityRecipeId,
          user_id: userId,
          text: this.newCommentText.trim(),
          userAvatar: profile_picture, 
          username: username, 
        };

        if (!commentData.community_recipe_id || !commentData.user_id || 
              !commentData.text) {
          console.error('Invalid comment data', commentData);
          return;
        }

        this.communityService.addComment(commentData).subscribe(
          response => {
            console.log('Response from server:', response);
            if (response.success) {
              // Add the new comment to the post's comments array
              post.comments.push({
                userAvatar: commentData.userAvatar,
                username: commentData.username, 
                text: commentData.text,
                time: 'just now',
                liked: false
              });
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
      },
      error => {
        console.error('Error fetching user profile:', error);
        alert('An error occurred while fetching user profile: ' + error.message);
      }
    );
  }
}
