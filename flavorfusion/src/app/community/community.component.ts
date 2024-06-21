import { Component, ViewChild, TemplateRef, OnInit } from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { CommunityService } from '../../services/community-service';

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
  newCommentText: string = '';

  posts: any[] = [];

  constructor(
    public dialog: MatDialog,
    private communityService: CommunityService
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
      console.log('Selected file:', this.newPostImage); 
    }
  }

  addPost(): void {
    if (this.newPostText.trim()) {
      const formData = new FormData();
      formData.append('user_id', '3'); 
      formData.append('recipe_id', '25'); 
      formData.append('caption', this.newPostText);
      if (this.newPostImage) {
        formData.append('image', this.newPostImage, this.newPostImage.name); 
      } else {
        formData.append('image', ''); 
      }

      formData.forEach((value, key) => {
        console.log(key + ': ' + value);
      });

      //TO DO -> Make this dynamically reflect which user is logged in.
      this.communityService.addPost(formData).subscribe(
        response => {
          console.log('Response from server:', response);//will delete later on
          if (response.success) {
            const newPost = {
              userId: 3,
              recipeId: 25,
              username: 'current_user',
              time: 'Just now',
              userAvatar: 'assets/images/default-avatar.png',
              image: this.newPostImage ? 
                URL.createObjectURL(this.newPostImage) : '', 
              description: '',
              likes: 0,
              liked: false,
              comments: [],
              caption: this.newPostText
            };
            this.posts.unshift(newPost);
            this.newPostText = '';
            this.newPostImage = null;
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
}
